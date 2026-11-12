const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      const errors = [], outbound = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:') && !request.url().startsWith('data:')) outbound.push(request.url()); });
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(() => {
          const c = { id: 'comparison-client', name: 'Synthetic comparison client', ref: 'TEST-COMPARE', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          clients = [c]; curId = c.id; sessions = []; store = localStore();
          editing = blankSession(); view = 'edit'; dirty = false; renderMain();
        });
        const rowIds = await page.evaluate(() => Object.fromEntries(editing.sym.map(row => [row.kind === 'sub' ? row.test : row.kind, row.id])));
        const before = page.locator(`#symWrap [data-row="${rowIds.pre}"]`), after = page.locator(`#symWrap [data-row="${rowIds.end}"]`), subtest = page.locator(`#symWrap [data-row="${rowIds.pursuit}"]`);
        assert.equal(await subtest.count(), 0, 'Unchecked eye tests do not add blank symptom rows');
        await page.locator('#ac-pursuit').check();
        await completeAssessment(page);
        assert.equal(await subtest.count(), 1);
        await subtest.locator('[id$="-ef"]').fill('3');
        await page.locator('#ac-pursuit').uncheck();
        assert.equal(await subtest.locator('[id$="-ef"]').inputValue(), '3', 'Rated historical subtests stay visible');
        for (const input of await before.locator('input.num').all()) await input.fill('2');
        await after.locator('[id$="-ef"]').fill('2');
        const warning = await page.evaluate(() => ui('評分項目不同，未計算合計差異。'));
        assert.ok((await page.locator('#symSummary').innerText()).includes(warning));
        assert.equal(await page.locator('#symSummary .metric-change.good, #symSummary .metric-change.bad').count(), 0);
        assert.match(await page.locator('#symSummary .metric-pre .note').innerText(), /5\/5/);
        assert.match(await page.locator('#symSummary .metric-end .note').innerText(), /1\/5/);
        assert.doesNotMatch(await page.locator('#sessionSymptomSummary').innerText(), /-8/);
        const partial = await page.evaluate(() => {
          const s = { ...collectSession(), id: 'partial-symptoms' }, c = cur(), wb = buildWorkbook([{ c, ss: [s] }]);
          const chart = document.createElement('div'); chartSym = 'total';
          chart.innerHTML = chartSVG([s, { ...s, sym: s.sym.map(r => r.kind === 'pre' ? { ...r, scores: { ef: 2 } } : r) }]);
          return { note: noteText(c, s), rows: XLSX.utils.sheet_to_json(wb.Sheets.Symptoms), soap: XLSX.utils.sheet_to_json(wb.Sheets['SOAP notes'])[0], chartPath: chart.querySelector('path').getAttribute('d'),
            card: sessCard(s), form: XLSX.utils.sheet_to_json(soapFormSheet(c, s), { header: 1 }).flat() };
        });
        assert.ok(partial.note.includes(warning));
        assert.doesNotMatch(partial.note, /-8/);
        assert.equal(partial.rows.at(-1)['Change vs first rating'], '');
        assert.equal(partial.rows.at(-1)['Rated symptoms (of 5)'], 1);
        assert.equal(partial.soap['Change (after session − before session)'], '');
        assert.ok(partial.card.includes(warning));
        assert.ok(partial.form.includes(warning));
        assert.equal((partial.chartPath.match(/M/g) || []).length, 2, 'A total-score chart does not connect different rated symptom sets');
        await after.locator('[id$="-ef"]').fill('1');
        for (const input of await after.locator('input.num').all()) await input.fill('1');
        assert.equal(await page.locator('#symSummary .metric-change dd').innerText(), '-5');
        assert.equal(await page.locator('#symSummary .metric-change.good').count(), 1);

        await page.evaluate(() => {
          const rows = [{ occ: 'Read a bill', perf: 4, sat: 3 }];
          const baseline = { ...blankSession(), id: 'copm-baseline', date: '2026-11-01', visit: 'baseline', sym: [], assess: { copm: { done: true, copm: rows } } };
          sessions = [baseline]; editing = { ...blankSession(), id: 'copm-post', date: '2026-11-11', visit: 'post', assess: { copm: { done: true, copm: [{ occ: 'Read a bill', perf: 6, sat: 5 }] } } };
          view = 'edit'; dirty = false; renderMain();
        });
        await openAssessment(page, 'copm');
        assert.match(await page.locator('#copmSum').innerText(), /\+2/);
        assert.equal(await page.locator('#copmComparison tbody tr').count(), 1);
        await page.locator('#copm-occ-0').fill('A different activity');
        await page.locator('#copm-p-0').fill('9'); await page.locator('#copm-s-0').fill('8');
        const copmWarning = await page.evaluate(() => ui('活動或評分項目不一致，未計算基準差異。'));
        assert.ok((await page.locator('#copmComparison').innerText()).includes(copmWarning));
        assert.ok((await page.locator('#copmComparison').innerText()).includes('Read a bill'));
        assert.ok((await page.locator('#copmComparison').innerText()).includes('A different activity'));
        assert.doesNotMatch(await page.locator('#copmSum').innerText(), /\+5/);
        await completeAssessment(page);
        const changedCopm = await page.evaluate(() => {
          const s = collectSession(), wb = buildWorkbook([{ c: cur(), ss: [...sessions, s] }]);
          return { note: noteText(cur(), s), rows: XLSX.utils.sheet_to_json(wb.Sheets.COPM),
            form: XLSX.utils.sheet_to_json(soapFormSheet(cur(), s), { header: 1 }).flat() };
        });
        assert.ok(changedCopm.note.includes(copmWarning));
        assert.equal(changedCopm.rows.at(-1)['Change in performance vs baseline'], '');
        assert.equal(changedCopm.rows.at(-1)['Comparison note'], copmWarning);
        assert.ok(changedCopm.form.includes(copmWarning));
        await openAssessment(page, 'copm'); await page.locator('#copm-occ-0').fill('Read a bill');
        assert.match(await page.locator('#copmSum').innerText(), /\+5/);
        await page.locator('#copm-p-0').fill('');
        assert.ok((await page.locator('#copmComparison').innerText()).includes(copmWarning));
        assert.equal(await page.locator('#copmSum .delta').count(), 0, 'Missing ratings suppress both baseline differences');
        await completeAssessment(page);

        await page.locator('#ac-st_neglect').check();
        const fillMeasure = async (key, value) => {
          const index = await page.evaluate(key => fieldsFor(assessmentItems(cur(), editing).find(p => p.id === 'st_neglect')).findIndex(f => f.id === key), key);
          await page.locator('#af-st_neglect-' + index).fill(String(value));
        };
        await fillMeasure('pre_left', 6); await fillMeasure('pre_right', 1); await fillMeasure('pre_omissions', 8);
        assert.equal(await page.locator('[data-entry-warning="st_neglect"]').isVisible(), true);
        await fillMeasure('pre_omissions', 7);
        assert.equal(await page.locator('[data-entry-warning="st_neglect"]').isVisible(), false);
        await completeAssessment(page);

        await page.locator('#s-dur').fill('45');
        await page.locator('#s-visit').selectOption('absent');
        await page.locator('#abs-reason').selectOption(await page.evaluate(() => ABSENCE_REASONS[0]));
        await page.locator('#abs-notified').selectOption(await page.evaluate(() => NOTIFIED[0]));
        assert.equal(await page.locator('#abs-notified').evaluate(input => input.validity.customError), true);
        assert.equal(await page.locator('#absenceConsistency').isVisible(), true);
        await page.locator('#abs-notified').selectOption(await page.evaluate(() => NOTIFIED[2]));
        assert.equal(await page.locator('#abs-notified').evaluate(input => input.validity.customError), false);
        const absence = await page.evaluate(() => {
          const s = { ...collectSession(), duration: 45, mode: 'inperson', subjective: 'Unperformed draft', training: { ocular: { on: true, dur: 15, acts: ['Fixation'], actScores: { Fixation: '77%' } } } };
          const before = JSON.stringify(s), note = noteText(cur(), s), form = XLSX.utils.sheet_to_json(soapFormSheet(cur(), s), { header: 1 }).flat(), wb = buildWorkbook([{ c: cur(), ss: [s] }]);
          return { unchanged: before === JSON.stringify(s), note, form, soap: XLSX.utils.sheet_to_json(wb.Sheets['SOAP notes'])[0],
            training: XLSX.utils.sheet_to_json(wb.Sheets.Training), symptoms: XLSX.utils.sheet_to_json(wb.Sheets.Symptoms) };
        });
        assert.equal(absence.unchanged, true);
        assert.doesNotMatch(absence.note, /45|Unperformed draft/);
        assert.equal(absence.form.includes(45), false);
        assert.equal(absence.soap['Length (min)'], ''); assert.equal(absence.soap['Service mode'], '');
        assert.equal(absence.soap['S – Subjective'], '');
        assert.deepEqual(absence.training, [{ 'No records': '' }]); assert.deepEqual(absence.symptoms, [{ 'No records': '' }]);
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: rated-set symptom comparison, COPM activity/rating checks, omission totals and absence report/notification safeguards`);
      } finally { await context.close(); }
    }
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
