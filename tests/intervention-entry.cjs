const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/intervention-entry');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const eyeDot = () => page.locator('#tx-ocular-acts [data-act="EyeDot Trainer"]');
      const activityName = '自訂活動 Custom task';
      const names = { adaptation: '自訂調適 <img src=x onerror=window.planInjected=true>', compensation: '自訂代償 Custom compensation' };
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          const disk = await navigator.storage.getDirectory();
          store = folderStore(await disk.getDirectoryHandle('intervention-entry', { create: true })); await finishBoot();
        });
        await action('new-client').click(); await page.locator('#cf-name').fill('Synthetic intervention client'); await page.locator('#cf-ref').fill('TEST-ENTRY');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        await action('new-session').click(); await page.locator('#s-visit').selectOption('treatment');
        await page.locator('#tx-ocular-on').check();
        assert.equal(await page.locator('#eyeDotRecords').isVisible(), false);
        await eyeDot().check(); assert.equal(await page.locator('#eyeDotRecords').isVisible(), true);
        await action('ed-add').click();
        await page.locator('#edWrap [id$="-count"]').fill('0'); await page.locator('#edWrap [id$="-notes"]').fill('Draft EyeDot result');
        await eyeDot().uncheck(); assert.equal(await page.locator('#eyeDotRecords').isVisible(), false);
        await eyeDot().check(); assert.equal(await page.locator('#edWrap [id$="-notes"]').inputValue(), 'Draft EyeDot result');
        await page.locator('#tx-ocular-new').fill(activityName); await page.locator('#tx-ocular-new').press('Enter');
        const activity = page.locator('#tx-ocular-acts input').filter({ visible: true }).last();
        assert.equal(await activity.getAttribute('data-act'), activityName);
        const scoreId = (await activity.getAttribute('data-score')).replace(/-r(\d+)$/, '-s$1');
        await page.locator('#' + scoreId).fill('5 repetitions');
        const customIds = {};
        for (const approach of ['adaptation', 'compensation']) {
          await page.locator('#' + approach + '-new').fill(names[approach]);
          await page.locator(`[data-action="strategy-add"][data-approach="${approach}"]`).click();
          customIds[approach] = await page.evaluate(approach => editing.interventions[approach].custom[0].id, approach);
          assert.equal(await page.locator(`#${approach}Picks [data-strategy="${customIds[approach]}"]`).isChecked(), true);
          await page.locator('#' + approach + '-new').fill(names[approach]); await page.locator('#' + approach + '-new').press('Enter');
          assert.equal(await page.evaluate(approach => editing.interventions[approach].custom.length, approach), 1, 'Repeated names select the existing plan');
          await page.locator('#s-' + approach + '-notes').fill(approach + ' note');
        }
        assert.equal(await page.locator('#adaptationPicks img').count(), 0, 'Custom plan names are rendered as text');
        assert.equal(await page.evaluate(() => !!window.planInjected), false);
        for (const mode of ['telerehab', 'inperson']) {
          await page.locator('#s-mode').selectOption(mode);
          for (const approach of ['adaptation', 'compensation']) assert.equal(await page.locator(`#${approach}Picks [data-strategy="${customIds[approach]}"]`).isChecked(), true);
        }
        for (const [kind, fatigue] of [['pre', '2'], ['end', '4']]) {
          const row = page.locator('#symWrap tr.' + kind);
          for (const input of await row.locator('input.num').all()) await input.fill('0');
          await row.locator('[id$="-ef"]').fill(fatigue);
        }
        assert.match(await page.locator('#sessionSymptomSummary').innerText(), /2 → 4/);
        assert.match(await page.locator('#sessionSymptomSummary').innerText(), /\+2/);
        await page.locator('#s-tol').fill('8');
        await page.locator('#symWrap tr.end [id$="-ef"]').fill('3');
        assert.match(await page.locator('#sessionSymptomSummary').innerText(), /2 → 3/);
        assert.equal(await page.locator('#s-tol').inputValue(), '8', 'Tolerance stays an independent self-rating');
        await action('edit-symptoms').click();
        assert.equal(await page.locator('#symWrap input').first().evaluate(input => input === document.activeElement), true);
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        for (const approach of ['adaptation', 'compensation']) assert.ok((await page.locator('#' + approach + 'Picks').innerText()).includes(names[approach]));
        assert.equal(await page.locator('#edWrap [id$="-notes"]').inputValue(), 'Draft EyeDot result');
        assert.equal(await page.locator('#' + scoreId).inputValue(), '5 repetitions');
        await page.locator('#languageSelect').selectOption(locale);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
          for (const width of [360, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}: no page overflow`);
            await page.locator('#sessionResponse').screenshot({ path: path.join(output, `${locale}-${theme}-${width}-response.png`) });
            await page.locator('#adaptation-new').locator('..').screenshot({ path: path.join(output, `${locale}-${theme}-${width}-plan-entry.png`) });
          }
        }
        await action('save-session').click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(async () => {
          const session = (await store.listSessions(curId))[0];
          return { session, restored: readRecordCSV(sessionCSV(cur(), session)).session, note: noteText(cur(), session), workbook: buildWorkbook([{ c: cur(), ss: [session] }]) };
        });
        assert.deepEqual(saved.restored, saved.session);
        assert.equal(saved.session.tolerance, 8);
        assert.equal(saved.session.sym.find(row => row.kind === 'end').scores.ef, 3);
        assert.equal(saved.session.training.ocular.eyedot[0].count, 0);
        assert.equal(saved.session.training.ocular.eyedot[0].notes, 'Draft EyeDot result');
        assert.ok(saved.session.training.ocular.acts.includes('EyeDot Trainer'));
        assert.equal(saved.session.training.ocular.actScores[activityName], '5 repetitions');
        for (const approach of ['adaptation', 'compensation']) {
          assert.deepEqual(saved.session.interventions[approach].custom, [{ id: customIds[approach], name: names[approach] }]);
          assert.ok(saved.session.interventions[approach].picks.includes(customIds[approach]));
          assert.ok(saved.note.includes(names[approach])); assert.ok(JSON.stringify(saved.workbook).includes(names[approach]));
        }
        const invalid = await page.evaluate(() => {
          const session = clone(sessions[0]);
          session.interventions.adaptation.custom[0].id = '__proto__';
          try { validateRecord(cur(), session); return ''; } catch (error) { return error.message; }
        });
        assert.equal(invalid, locale === 'en' ? 'Invalid custom intervention plan' : '自訂介入方案格式錯誤');
        await action('open-session').click();
        assert.equal(await eyeDot().isChecked(), true);
        assert.equal(await page.locator('#edWrap [id$="-notes"]').inputValue(), 'Draft EyeDot result');
        for (const approach of ['adaptation', 'compensation']) assert.equal(await page.locator(`#${approach}Picks [data-strategy="${customIds[approach]}"]`).isChecked(), true);
        assert.match(await page.locator('#sessionSymptomSummary').innerText(), /2 → 3/);
        assert.equal(await page.locator('#s-tol').inputValue(), '8');
        assert.deepEqual(errors, []);
        console.log(`PASS: ${locale} EyeDot/activity entry, custom plans and safe names, mode/language retention, linked NRS response, independent tolerance, CSV/Excel/note exports and save/reopen`);
      } finally { await context.close(); }
    }
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
