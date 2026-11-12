const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function openTraining(page, id) {
  if (await page.locator('#trainingResultForm').count()) await completeTraining(page);
  const checkbox = page.locator(`#tx-${id}-on`);
  if (await checkbox.isChecked()) await page.locator(`[data-action="training-edit"][data-id="${id}"]`).click();
  else await checkbox.check();
  await page.waitForSelector('#trainingResultForm');
}
async function completeTraining(page) {
  await page.locator('#training-done').click();
  await page.waitForSelector('#trainingResultForm', { state: 'detached' });
}
async function assertFieldGrid(page, selector) {
  const grids = await page.locator(selector).evaluateAll(nodes => nodes.map(grid => [...grid.querySelectorAll(':scope > .f')].flatMap(field => {
    const input = field.querySelector(':scope > input, :scope > select');
    if (!input || !input.getClientRects().length) return [];
    const label = input.labels[0], style = getComputedStyle(label), rect = input.getBoundingClientRect();
    const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
    let text;
    while ((text = walker.nextNode()) && (!text.textContent.trim() || text.parentElement.closest('input, select, textarea, .help'))) {}
    const range = document.createRange(); range.selectNodeContents(text);
    return [{ id: input.id, row: field.getBoundingClientRect().top, top: rect.top, height: rect.height,
      labelTop: range.getClientRects()[0].top, font: style.fontSize, weight: style.fontWeight, lineHeight: style.lineHeight }];
  })));
  let checked = 0;
  for (const fields of grids.filter(fields => fields.length > 1)) {
    const first = fields[0];
    for (const field of fields) {
      assert.equal(field.font, first.font, `${field.id}: matching label size`);
      assert.equal(field.weight, first.weight, `${field.id}: matching label weight`);
      assert.equal(field.lineHeight, first.lineHeight, `${field.id}: matching label leading`);
      assert.ok(Math.abs(field.height - first.height) < 1, `${field.id}: matching control height (${JSON.stringify(fields)})`);
      for (const peer of fields.filter(peer => Math.abs(peer.row - field.row) < 1)) {
        assert.ok(Math.abs(field.top - peer.top) < 1, `${field.id}: matching control top within its grid row (${JSON.stringify(fields)})`);
        assert.ok(Math.abs(field.labelTop - peer.labelTop) < 1, `${field.id}: matching label baseline within its grid row`);
      }
      checked++;
    }
  }
  assert.ok(checked >= 4, 'Check at least four fields, including numeric and text inputs');
}
module.exports = { openTraining, completeTraining, assertFieldGrid };

async function main() {
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const { appPath } = require('./lib/app.cjs');
  const output = path.resolve(__dirname, '../.tmp/verification/training-modal'); await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('dialog', dialog => dialog.accept());
      await context.route(/^https?:/, route => { outbound.push(route.request().url()); return route.abort(); });
      try {
        await page.goto(pathToFileURL(appPath).href); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          store = localStore();
          const c = { id: 'training_modal', ref: 'TEST-TRAINING', name: 'Synthetic rehabilitation client', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          await store.saveClient(c); clients = [c]; curId = c.id; sessions = []; patientReady = true;
          editing = blankSession(); beginDraftSession(editing); view = 'edit'; dirty = false; renderMain();
        });
        await page.locator('#tx-ocular-on').focus(); await page.keyboard.press('Space');
        assert.equal(await page.locator('.app').evaluate(node => node.inert), true);
        assert.equal(await page.evaluate(() => collectSession().training.ocular?.on), undefined);
        await page.locator('#tx-ocular-notes').fill('Cancelled Original');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#tx-ocular-on').isChecked(), false);
        assert.equal(await page.evaluate(() => dirty), false);
        assert.equal(await page.locator('#tx-ocular-on').evaluate(node => node === document.activeElement), true);
        await openTraining(page, 'ocular');
        await page.locator('#tx-ocular-acts [data-act="Fixation"]').check();
        await page.locator('#tx-ocular-s1').fill('0%');
        await page.locator('#tx-ocular-new').fill('Synthetic custom activity'); await page.locator('#tx-ocular-new').press('Enter');
        await page.locator('#tx-ocular-acts [data-act="EyeDot Trainer"]').check(); await page.locator('[data-action="ed-add"]').click();
        await page.locator('#edWrap [id$="-count"]').fill('0'); await page.locator('#edWrap [id$="-notes"]').fill('EyeDot 原文');
        await page.locator('#tx-ocular-run-item').selectOption('fixation'); await page.locator('[data-action="run-add"]').click();
        const run = await page.locator('.run').getAttribute('data-run');
        await page.locator(`#rn-${run}-0`).fill('81');
        await page.locator('[data-activity-ref="Fixation"]').selectOption(run);
        assert.equal(await page.locator('#tx-ocular-s1').inputValue(), '81%');
        await page.locator(`[data-action="run-del"][data-id="${run}"]`).click(); assert.equal(await page.locator('.run').count(), 1);
        await page.locator(`[data-open-result-run="${run}"]`).click();
        assert.equal(await page.locator(':focus').evaluate(node => node.closest('.run')?.dataset.run), run);
        assert.match(await page.locator('#workflowPath').textContent(), locale === 'en' ? /Intervention and plan/ : /介入與計畫/);
        await page.locator('#tx-ocular-program').fill('Synthetic device'); await page.locator('#tx-ocular-dur').fill('0'); await page.locator('#tx-ocular-diff').fill('0');
        await page.locator('#tx-ocular-notes').fill('Committed 原文\nSecond line');
        assert.equal(await page.evaluate(() => collectSession().training.ocular?.notes), undefined, 'Open dialog stays outside the committed record');
        assert.equal(await page.evaluate(() => { const event = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented; }), true);
        await page.locator('#training-done').focus(); await page.keyboard.press('Tab');
        assert.equal(await page.locator(':focus').evaluate(node => node.closest('#trainingResultForm') != null), true);
        await completeTraining(page);
        assert.equal(await page.locator('#remediation .picked input, #remediation .picked textarea, #remediation .picked select').count(), 0);
        const committed = await page.evaluate(() => clone(collectSession().training));
        const report = await page.evaluate(() => {
          const s = collectSession(), item = trainingItems(cur(), s).find(t => t.k === 'ocular');
          return { lines: trainingDetailLines(item, s.training.ocular), text: noteText(cur(), s) };
        });
        const summary = await page.locator('#tx-summary-ocular .training-results').innerText();
        for (const line of report.lines) { assert.ok(summary.includes(line)); assert.ok(report.text.includes(line)); }
        await openTraining(page, 'ocular'); await page.locator('#tx-ocular-notes').fill('Discard this'); await page.locator('#training-cancel').click();
        assert.deepEqual(await page.evaluate(() => collectSession().training), committed);
        await openTraining(page, 'ocular'); await page.locator('#tx-ocular-notes').fill('Discard with Escape'); await page.keyboard.press('Escape');
        assert.deepEqual(await page.evaluate(() => collectSession().training), committed);
        await page.locator('#tx-ocular-on').uncheck(); assert.equal(await page.locator('#tx-summary-ocular').isVisible(), false);
        assert.equal(await page.evaluate(() => collectSession().training.ocular.notes), committed.ocular.notes);
        assert.doesNotMatch(await page.evaluate(() => noteText(cur(), collectSession())), /Committed 原文/);
        await openTraining(page, 'ocular'); assert.equal(await page.locator('#tx-ocular-notes').inputValue(), committed.ocular.notes); await completeTraining(page);
        await page.locator('[data-workflow-go="activity"]').click(); assert.equal(await page.locator('#trainingResultForm').isVisible(), true); await completeTraining(page);
        for (const theme of ['light', 'dark']) for (const width of [320, 640, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 }); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await openTraining(page, 'ocular');
          await assertFieldGrid(page, '#trainingResultForm .grid');
          assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth + 1), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.locator('#training-done').scrollIntoViewIfNeeded(); assert.equal(await page.locator('#training-done').isVisible(), true);
          if (width !== 640) await page.locator('.overlay').screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          await completeTraining(page);
        }
        await page.setViewportSize({ width: 320, height: 900 });
        await openTraining(page, 'ocular');
        const baseFontSize = await page.locator('html').evaluate(node => parseFloat(getComputedStyle(node).fontSize));
        await page.evaluate(() => document.documentElement.style.fontSize = '200%');
        await page.waitForFunction(size => Math.abs(parseFloat(getComputedStyle(document.documentElement).fontSize) - size) < .1, baseFontSize * 2);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Text enlarged to 200% fits a 320px viewport');
        assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth + 1), true);
        await page.locator('#training-done').scrollIntoViewIfNeeded(); assert.equal(await page.locator('#training-done').isVisible(), true);
        await completeTraining(page); await page.evaluate(() => document.documentElement.style.removeProperty('font-size'));
        await page.setViewportSize({ width: 1280, height: 900 });
        const roundtrip = await page.evaluate(async () => {
          const s = collectSession(); s.id = 'training_saved'; validateRecord(cur(), s);
          await store.saveSession(curId, s); return { session: s, csv: readRecordCSV(sessionCSV(cur(), s)).session };
        });
        assert.deepEqual(roundtrip.csv, roundtrip.session);
        await openTraining(page, 'ocular'); await page.locator('#tx-ocular-notes').fill('Uncommitted data must not survive reload');
        assert.equal(await page.evaluate(() => { keepDraftNow(); return readDraftCopies().find(copy => copy.clientId === curId).session.training.ocular.notes; }), committed.ocular.notes);
        await page.reload();
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await page.locator('#draftResume').click(); await page.waitForSelector('#soapForm');
        await openTraining(page, 'ocular'); assert.equal(await page.locator('#tx-ocular-notes').inputValue(), committed.ocular.notes); await completeTraining(page);
        await page.evaluate(() => { editing = readRecordCSV(sessionCSV(cur(), { ...collectSession(), id: 'training_reopen' })).session; renderEditor(); });
        await openTraining(page, 'ocular'); assert.equal(await page.locator('#tx-ocular-s1').inputValue(), '81%'); await completeTraining(page);
        await page.locator('[data-workflow-clear="tx-summary-ocular"]').click(); await page.locator('#askNo').click();
        assert.equal(await page.evaluate(() => collectSession().training.ocular.notes), committed.ocular.notes);
        await page.locator('[data-workflow-clear="tx-summary-ocular"]').click(); await page.locator('#askYes').click();
        assert.equal(await page.evaluate(() => collectSession().training.ocular), undefined);
        await page.locator('[data-action="cancel-edit"]:visible').first().click(); await page.locator('#askYes').click();
        await page.locator('#importFile').setInputFiles({ name: 'TEST-TRAINING_eye-training-fixation-20261113-100000.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({
          subject_id: 'TEST-TRAINING', session_id: 'synthetic-import-run', module: 'fixation', mode: 'random', end_reason: 'duration_complete', accuracy_rate: 64.5,
          calibration: { viewingDistanceCm: 60 }, settings: { mode: 'random', holdSec: 2 }, completed_targets: 16, actual_duration_ms: 30000, gaze_path: '[]', ended_at: '2026-11-13T02:00:00.000Z'
        })) });
        await page.waitForSelector('#scoreImport'); await page.locator('#score-dest-0').selectOption('training'); await page.locator('#scoreImport').click(); await page.locator('#importReportClose').click();
        const imported = await page.evaluate(() => sessions.find(s => s.sourceRecords?.some(r => r.fields?.subject_id === 'TEST-TRAINING')));
        await page.locator(`[data-action="open-session"][data-id="${imported.id}"]`).click(); await openTraining(page, 'ocular');
        assert.equal(await page.locator('.run input').first().inputValue(), '64.5'); assert.equal(await page.locator('#tx-ocular-s1').inputValue(), '64.5%');
        await completeTraining(page);
        assert.equal(await page.evaluate(() => { const s = collectSession(); return JSON.stringify(readRecordCSV(sessionCSV(cur(), s)).session.training) === JSON.stringify(s.training); }), true);
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: rehabilitation dialog transactions, shared report text, activities/cards/EyeDot, reference guards/jump, workflow, draft recovery, CSV/reopen, keyboard, themes, responsive and offline`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
