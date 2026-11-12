const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const html = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          store = localStore();
          const c = { id: 'crefs', name: 'Synthetic reference client', ref: 'TEST-REFS', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          await store.saveClient(c); clients = [c]; curId = c.id; sessions = []; patientReady = true;
          editing = { ...blankSession(),
            assess: { npc: { done: true, values: { 'NPC break (cm)': '14', 'NPC recovery (cm)': '19' } },
              st_npc: { done: true, values: { pre_break_cm: 14, pre_recovery_cm: 19, post_break_cm: 7, post_recovery_cm: 10, post_context: '10:45, B form' } },
              reading_speed: { done: true, values: { value: 100 } }, st_reading: { done: true, values: { post_speed: 120 } },
              search_time: { done: true, values: { value: 99 } }, st_search: { done: true, values: { post_time_s: 42.5 } },
              coordination_time: { done: true, values: { value: 600 } }, st_coordination: { done: true, values: { pre_rt_ms: 420 } } },
            training: { ocular: { on: true, acts: ['Fixation'], actScores: { Fixation: '55%' },
              runs: [{ id: 'rr1', item: 'fixation', time: '10:30', values: { accuracy_rate: 77 } }, { id: 'rr2', item: 'fixation', values: { accuracy_rate: 88 } }] } } };
          view = 'edit'; renderMain(); setupMeasurementReferences();
        });
        await openAssessment(page, 'npc');
        assert.equal(await page.locator('#af-npc-0').inputValue(), '14', 'Manual results stay unchanged before linking');
        await page.locator('#measure-ref-npc').selectOption('st_npc/post');
        assert.equal(await page.locator('#af-npc-0').inputValue(), '7');
        assert.equal(await page.locator('#af-npc-1').inputValue(), '10');
        assert.equal(await page.locator('#af-npc-0').getAttribute('readonly'), '');
        assert.match(await page.locator('[data-measurement-status="npc"]').innerText(), /10:45, B form/);
        const sourceIndex = await page.evaluate(() => fieldsFor(cur().plan.find(p => p.id === 'st_npc')).findIndex(f => f.id === 'post_break_cm'));
        await openAssessment(page, 'st_npc');
        await page.locator(`#af-st_npc-${sourceIndex}`).fill('8');
        await openAssessment(page, 'npc');
        assert.equal(await page.locator('#af-npc-0').inputValue(), '8');
        await openAssessment(page, 'reading_speed');
        await page.locator('#measure-ref-reading_speed').selectOption('st_reading/post');
        assert.equal(await page.locator('[data-reference-unit="reading_speed"]').count(), 1);
        assert.match(await page.evaluate(() => { try { validateMeasurementReferences(cur(), assessmentDialog.draft); return ''; } catch (error) { return error.message; } }), /words\/min/);
        await page.locator('[data-reference-unit="reading_speed"]').check();
        await completeAssessment(page);
        await page.evaluate(() => validateMeasurementReferences(cur(), collectSession()));
        await openAssessment(page, 'search_time');
        await page.locator('#measure-ref-search_time').selectOption('st_search/post');
        assert.equal(await page.locator('#af-search_time-0').inputValue(), '42.5');
        await openAssessment(page, 'coordination_time');
        await page.locator('#measure-ref-coordination_time').selectOption('st_coordination/pre');
        assert.equal(await page.locator('#af-coordination_time-0').inputValue(), '420');
        await completeAssessment(page);
        assert.deepEqual(await page.evaluate(() => [{ item: 'st_search', phase: 'post' }, { item: 'st_npc', phase: 'unknown' }].map(resultRef => {
          const s = collectSession(); s.assess.npc.resultRef = resultRef;
          try { validateMeasurementReferences(cur(), s); return false; } catch { return true; }
        })), [true, true], 'Cross-measure links and unknown phases are rejected');
        const source = page.locator('[data-activity-ref="Fixation"]');
        await openTraining(page, 'ocular');
        assert.match(await source.innerText(), locale === 'en' ? /Manual entry/ : /自行填寫/);
        await source.selectOption('rr1');
        const scoreInput = page.locator('#tx-ocular-s1');
        assert.equal(await scoreInput.inputValue(), '77%');
        assert.equal(await scoreInput.getAttribute('readonly'), '');
        assert.deepEqual(await page.evaluate(() => ['not-a-number', -1, 101].map(value => {
          const s = clone(trainingDialog.read()); s.training.ocular.runs[0].values.accuracy_rate = value;
          try { validateMeasurementReferences(cur(), s); return false; } catch { return true; }
        })), [true, true, true], 'Linked primary values reject invalid strings and out-of-range percentages');
        await page.locator('[data-run="rr1"] [data-action="run-del"]').click();
        assert.equal(await page.locator('[data-run="rr1"]').count(), 1, 'A referenced run cannot be removed until its activity source is detached');
        await page.locator('[data-open-result-run="rr1"]').click();
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const navigation = await page.evaluate(() => ({ path: document.querySelector('#workflowPath').textContent, active: document.activeElement.id,
          run: document.activeElement.closest('.run')?.dataset.run, top: document.querySelector('[data-run="rr1"] .run-head').getBoundingClientRect().top,
          bottom: document.querySelector('[data-run="rr1"] .run-head').getBoundingClientRect().bottom, bar: document.querySelector('.modal').getBoundingClientRect().top, viewport: innerHeight }));
        assert.equal(navigation.run, 'rr1', 'Source jump keeps focus in the source run after pending focus events');
        assert.ok(navigation.top >= navigation.bar - 1 && navigation.bottom <= navigation.viewport, JSON.stringify(navigation));
        assert.match(navigation.path, locale === 'en' ? /Fixation/ : /凝視/, JSON.stringify(navigation));
        await page.locator('#rn-rr1-0').fill('80.5');
        assert.equal(await scoreInput.inputValue(), '80.5%');
        await source.selectOption('');
        assert.equal(await scoreInput.inputValue(), '80.5%');
        await scoreInput.fill('56%');
        await page.locator('#rn-rr1-0').fill('81');
        assert.equal(await scoreInput.inputValue(), '56%', 'Manual override does not follow source changes');
        await source.selectOption('rr1');
        await page.locator('#tx-ocular-acts [data-act="Fixation"]').uncheck();
        let collected = await page.evaluate(() => trainingDialog.read());
        assert.equal(collected.training.ocular.actScores.Fixation, '81%');
        assert.equal(collected.training.ocular.actScoreRefs.Fixation, 'rr1');
        assert.deepEqual(collected.training.ocular.acts, []);
        await page.locator('#tx-ocular-acts [data-act="Fixation"]').check();
        await completeTraining(page);
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        await openAssessment(page, 'npc');
        assert.equal(await page.locator('#af-npc-0').inputValue(), '8');
        await completeAssessment(page);
        await openTraining(page, 'ocular');
        assert.equal(await page.locator('#tx-ocular-s1').inputValue(), '81%');
        await completeTraining(page);
        collected = await page.evaluate(() => {
          const s = collectSession(); s.id = 'srefs'; validateMeasurementReferences(cur(), s);
          const csv = readRecordCSV(sessionCSV(cur(), s)).session;
          return { s, csv, note: noteText(cur(), s), ref: measurementReferenceText(cur(), s, assessmentItems(cur(), s).find(p => p.id === 'npc')) };
        });
        assert.deepEqual(collected.csv, collected.s, 'Source pointers and materialized values survive CSV roundtrip');
        assert.equal(collected.s.assess.npc.values['NPC break (cm)'], '8');
        assert.equal(collected.s.assess.reading_speed.values.value, 120);
        assert.equal(collected.s.assess.search_time.values.value, 42.5);
        assert.equal(collected.s.assess.coordination_time.values.value, 420);
        assert.equal(collected.s.training.ocular.actScores.Fixation, '81%');
        assert.match(collected.ref, /10:45, B form/);
        assert.match(collected.note, /81%/);
        await page.locator('#ac-st_npc').uncheck();
        assert.match(await page.locator('#as-npc [data-consistency-warning]').innerText(), locale === 'en' ? /無法使用/ : /unavailable/);
        assert.equal(await page.evaluate(() => { try { validateMeasurementReferences(cur(), collectSession()); return false; } catch { return true; } }), true);
        await openAssessment(page, 'npc'); await page.locator('#measure-ref-npc').selectOption(''); await completeAssessment(page);
        await page.evaluate(() => validateMeasurementReferences(cur(), collectSession()));
        assert.deepEqual(errors, []);
        console.log(`PASS: ${locale} explicit same-record measurement/run references, unit confirmation, live updates, manual override, inactive-score retention, CSV and output`);
      } finally { await context.close(); }
    }
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
