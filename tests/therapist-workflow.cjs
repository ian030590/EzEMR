const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'therapist-workflow');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const dataRoot = path.join(root, 'Data');
  const names = (await fs.readdir(dataRoot, { recursive: true, withFileTypes: true })).filter(entry => entry.isFile()).map(entry => path.join(entry.parentPath, entry.name));
  const hashes = await Promise.all(names.map(async name => createHash('sha256').update(await fs.readFile(name)).digest('hex')));
  const roster = await fs.readFile(path.join(dataRoot, 'clients.csv'), 'utf8');
  const records = await Promise.all(names.filter(name => name.endsWith('.csv') && path.basename(name) !== 'clients.csv').map(async name => ({ folder: path.basename(path.dirname(name)), text: await fs.readFile(name, 'utf8') })));
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route(/^https?:/, route => {
        if (route.request().url() === url) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      try {
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        const counts = await page.evaluate(async data => {
          const rows = readClientsCSV(data.roster);
          window.workflowCases = rows.map(({ client, folder }) => ({ client, sessions: data.records.filter(record => record.folder === folder).map(record => readRecordCSV(record.text).session) }));
          store = localStore(); clients = rows.map(row => row.client);
          for (const c of clients) await store.saveClient(c);
          return workflowCases.map(entry => entry.sessions.length);
        }, { roster, records });
        assert.equal(counts.length, 8); assert.equal(counts.reduce((sum, count) => sum + count, 0), 24);
        for (let caseIndex = 0; caseIndex < 8; caseIndex++) for (let recordIndex = 0; recordIndex < 3; recordIndex++) {
          const identity = await page.evaluate(({ caseIndex, recordIndex }) => {
            const entry = workflowCases[caseIndex];
            curId = entry.client.id; sessions = clone(entry.sessions); editing = clone(sessions[recordIndex]);
            editing.sym = shapeSym(editing.sym, editing.visit); editorWorkflow = null; dirty = false; view = 'edit'; patientReady = true; renderMain(); scrollTo(0, 0);
            return entry.client.ref;
          }, { caseIndex, recordIndex });
          assert.match(await page.locator('.workflow-identity').innerText(), new RegExp(identity));
          await page.locator('[data-workflow-go="reasoning"]').click();
          await page.waitForTimeout(30);
          const fixed = await page.locator('#editorWorkflow').boundingBox();
          const chrome = await page.locator('#applicationBar').boundingBox();
          assert.ok(fixed.y >= chrome.y + chrome.height - 2 && fixed.y < chrome.height + 30, 'Patient identity stays below application toolbar');
          assert.match(await page.locator('#workflowPath').innerText(), /A/);
        }

        await page.evaluate(() => {
          const entry = workflowCases.find(entry => entry.client.ref === 'DEMO-DIPLOPIA');
          curId = entry.client.id; sessions = clone(entry.sessions); editing = clone(entry.sessions.find(s => s.visit === 'baseline'));
          editing.sym = shapeSym(editing.sym, editing.visit); editorWorkflow = null; dirty = false; view = 'edit'; renderMain();
        });
        await page.locator('#s-subj').fill('Workflow source problem');
        await page.locator('#useSubjectiveProblem').click();
        assert.equal(await page.locator('[data-unlink-subjective]').count(), 1);
        await page.locator('#s-subj').fill('Updated workflow source problem');
        assert.equal(await page.locator('[data-clinical="symptom"][readonly]').inputValue(), 'Updated workflow source problem');
        await page.locator('#workflowAssessment').selectOption('st_npc');
        await page.locator('[data-workflow-go="pre"]').click();
        assert.match(await page.locator(':focus').evaluate(node => node.closest('.short-stage').querySelector('legend, summary').textContent), locale === 'en' ? /Pre 1/ : /訓練前 1/);
        await completeAssessment(page);
        await openTraining(page, 'ocular');
        await page.locator('#tx-ocular-acts [data-act="Fixation"]').check();
        const score = page.locator('#tx-ocular-s1');
        await score.fill('79%');
        await completeTraining(page);
        await page.locator('[data-workflow-go="post"]').click();
        assert.match(await page.locator(':focus').evaluate(node => node.closest('.short-stage').querySelector('legend, summary').textContent), locale === 'en' ? /Immediate post/ : /訓練後立即/);
        await completeAssessment(page);
        await page.locator('#workflowBack').click();
        assert.equal(await score.evaluate(node => document.activeElement === node), true);
        assert.equal(await score.inputValue(), '79%');
        await completeTraining(page);

        const beforeCollapse = await page.evaluate(() => JSON.stringify(collectSession().assess.st_npc));
        assert.equal(await page.locator('[data-workflow-collapse="as-st_npc"]').count(), 0);
        await openAssessment(page, 'st_npc'); await page.keyboard.press('Escape');
        assert.equal(await page.locator('#ac-st_npc').isChecked(), true);
        assert.equal(await page.evaluate(() => JSON.stringify(collectSession().assess.st_npc)), beforeCollapse);
        assert.equal(await page.locator('#as-st_npc .as-body').isVisible(), true);

        await openTraining(page, 'ocular'); await page.locator('#tx-ocular-acts [data-act="Fixation"]').uncheck();
        await completeTraining(page);
        await page.evaluate(() => { editing = collectSession(); renderEditor(); });
        await openTraining(page, 'ocular');
        await page.locator('#tx-ocular-acts [data-act="Fixation"]').check();
        assert.equal(await score.inputValue(), '79%', 'Excluded activity retains its result across a full editor rebuild');
        await completeTraining(page);

        await openAssessment(page, 'npc'); await page.locator('[data-measurement-ref="npc"]').selectOption('st_npc/pre'); await completeAssessment(page);
        const sourceBeforeClear = await page.evaluate(() => JSON.stringify(collectSession().assess.st_npc));
        await page.locator('[data-workflow-clear="as-st_npc"]').click();
        assert.equal(await page.locator('#askYes').count(), 0, 'A referenced source cannot be cleared');
        assert.equal(await page.evaluate(() => JSON.stringify(collectSession().assess.st_npc)), sourceBeforeClear);
        await openAssessment(page, 'npc'); await page.locator('[data-measurement-ref="npc"]').selectOption(''); await completeAssessment(page);
        const resultBeforeClear = await page.evaluate(() => JSON.stringify(collectSession().assess.npc));
        await page.locator('[data-workflow-clear="as-npc"]').click();
        await page.locator('#askNo').click();
        assert.equal(await page.evaluate(() => JSON.stringify(collectSession().assess.npc)), resultBeforeClear, 'Cancel clearing retains all values');
        await page.locator('[data-workflow-clear="as-npc"]').click();
        await page.locator('#askYes').click();
        assert.equal(await page.locator('#ac-npc').isChecked(), false);
        assert.equal(await page.evaluate(() => collectSession().assess.npc), undefined, 'Confirmed clearing removes current results');
        assert.equal(await page.evaluate(() => JSON.stringify(collectSession().assess.st_npc)), sourceBeforeClear, 'Other measurements are retained');
        await page.locator('[data-workflow-go="plan"]').click();
        assert.equal(await page.locator('#s-plan').evaluate(node => document.activeElement === node), true, 'Follow-up plan has a direct endpoint without scrolling through training');
        assert.match(await page.locator('#workflowPath').innerText(), /P/);

        for (const theme of ['light', 'dark']) for (const width of [360, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await page.locator('#workflowAssessment').selectOption('st_npc');
          await page.locator('[data-workflow-go="post"]').click();
          const visible = await page.evaluate(() => {
            const active = document.activeElement, label = active.closest('label'), bar = document.querySelector('.modal').getBoundingClientRect();
            const path = document.getElementById('workflowPath');
            return { fits: document.documentElement.scrollWidth <= innerWidth, labelTop: label.getBoundingClientRect().top, inputBottom: active.getBoundingClientRect().bottom, barBottom: bar.top, path: path.textContent, pathFits: path.scrollWidth <= path.clientWidth && path.scrollHeight <= path.clientHeight };
          });
          assert.equal(visible.fits, true, `${locale} ${theme} ${width}: no overflow`);
          assert.ok(visible.labelTop >= visible.barBottom - 2, 'Focused label stays inside the dialog');
          assert.ok(visible.inputBottom <= 1000, 'Focused input remains visible');
          assert.match(visible.path, /NPC/);
          assert.equal(visible.pathFits, true, 'The current item and measurement stage are not visually clipped');
          await page.keyboard.press('Tab');
          assert.equal(await page.locator(':focus').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
          if (width === 1440 || width === 360) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          await completeAssessment(page);
        }
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: all 24 demo records, fixed identity/path, pre/activity/post return, field labels, collapse, source problem and retained scores`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
  assert.deepEqual(await Promise.all(names.map(async name => createHash('sha256').update(await fs.readFile(name)).digest('hex'))), hashes, 'Shipped demo data remains unchanged');
})().catch(error => { console.error(error); process.exitCode = 1; });
