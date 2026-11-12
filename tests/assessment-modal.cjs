const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');
const { assertFieldGrid } = require('./training-modal.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/assessment-modal');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], requests = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          store = localStore();
          const c = { id: 'modal_fixture', name: 'Synthetic modal fixture', ref: 'TEST-MODAL', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          c.plan.push({ id: 'custom_modal', name: '自訂評估 Original', functionCategory: 'daily', timing: 'session', outcomePeriod: 'long', fields: [
            { id: 'number', label: '自訂數值 Original', type: 'number', min: 0, max: 10, step: 1, unit: '次' },
            { id: 'text', label: '自訂文字 Original', type: 'text' },
            { id: 'long', label: '自訂段落 Original', type: 'textarea' },
            { id: 'option', label: '自訂選項 Original', type: 'select', options: ['原值 A', '原值 B'] }
          ] });
          await store.saveClient(c); clients = [c]; curId = c.id; sessions = []; patientReady = true;
          editing = blankSession(); view = 'edit'; dirty = false; renderMain();
        });
        assert.equal(await page.locator('#assessList input:not([type="checkbox"]), #assessList textarea, #assessList select').count(), 0);
        await openAssessment(page, 'npc');
        await page.locator('#an-npc').fill('Discarded draft'); await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => dirty), false, 'Canceling a new selection leaves an unchanged record clean');
        assert.equal(await page.evaluate(() => collectSession().assess.npc), undefined);
        await page.locator('#s-subj').fill('Unrelated clinical note 原文');
        await page.locator('#ac-saccade').focus(); await page.keyboard.press('Space');
        assert.equal(await page.locator('.modal').getAttribute('aria-modal'), 'true');
        assert.equal(await page.locator('.app').evaluate(node => node.inert), true);
        await page.locator('#af-saccade-0').fill('12');
        assert.equal(await page.evaluate(() => collectSession().assess.saccade), undefined, 'Pending selection and input do not enter the committed record before Done');
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#ac-saccade').isChecked(), false);
        assert.equal(await page.locator('#ac-saccade').evaluate(node => node === document.activeElement), true);
        assert.equal(await page.locator('#s-subj').inputValue(), 'Unrelated clinical note 原文');
        await openAssessment(page, 'saccade');
        await page.locator('#af-saccade-0').fill('0'); await page.locator('#af-saccade-1').fill('85');
        await page.locator('#an-saccade').fill('Clinical observation 原文\nSecond line');
        await page.locator('#assessment-done').focus(); await page.keyboard.press('Tab');
        assert.equal(await page.locator('.assessment-dialog [data-help]').first().evaluate(node => node === document.activeElement), true, 'Focus wraps to the first help control within the dialog');
        await completeAssessment(page);
        assert.equal(await page.locator('#as-saccade input, #as-saccade select, #as-saccade textarea').count(), 0);
        assert.match(await page.locator('#as-saccade').innerText(), /0/);
        const first = await page.evaluate(() => clone(collectSession().assess.saccade));
        await openAssessment(page, 'saccade'); await page.locator('#af-saccade-0').fill('99'); await page.locator('#assessment-cancel').click();
        assert.deepEqual(await page.evaluate(() => collectSession().assess.saccade), first);
        await page.evaluate(() => {
          editing = collectSession();
          const retained = { ...clone(cur().plan.find(item => item.id === 'saccade')), id: 'retained_saccade', templateId: 'saccade' };
          editing.assessmentPlan.push(retained); editing.assess.retained_saccade = { done: false, values: { accuracy_rate: 44 } }; renderEditor();
        });
        await openAssessment(page, 'saccade');
        assert.equal(await page.locator('[data-entry="retained_saccade"]').count(), 0, 'Editing a selected result does not select retained results from a matching legacy item');
        await completeAssessment(page);
        assert.deepEqual(await page.evaluate(() => collectSession().assess.retained_saccade), { done: false, values: { accuracy_rate: 44 } });
        await page.locator('#ac-saccade').uncheck();
        assert.equal(await page.locator('#as-saccade').isHidden(), true);
        await openAssessment(page, 'saccade'); assert.equal(await page.locator('#af-saccade-0').inputValue(), '0'); await completeAssessment(page);

        await openAssessment(page, 'custom_modal');
        await page.locator('#af-custom_modal-0').fill('11'); await page.locator('#assessment-done').click();
        assert.equal(await page.locator('#assessment-error').innerText(), locale === 'en' ? 'Check the indicated fields before completing the assessment.' : '請核對標示的欄位後再完成填寫。');
        await page.locator('#af-custom_modal-0').fill('0');
        await page.locator('#af-custom_modal-1').fill('<script>literal result</script>');
        await page.locator('#af-custom_modal-2').fill('第一行 Original\nSecond line');
        await page.locator('#af-custom_modal-3').selectOption('原值 B');
        await completeAssessment(page);
        assert.match(await page.locator('#as-custom_modal').innerText(), /第一行 Original\nSecond line/);
        assert.equal(await page.locator('#as-custom_modal script').count(), 0);
        const custom = await page.evaluate(() => clone(collectSession().assess.custom_modal));
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.deepEqual(await page.evaluate(() => collectSession().assess.custom_modal), custom);
        assert.match(await page.locator('#as-custom_modal').innerText(), /自訂數值 Original（次）/);
        await page.locator('#languageSelect').selectOption(locale);

        await openAssessment(page, 'saccade');
        await page.locator('[data-action="measure-add"][data-id="saccade"]').click();
        await page.locator('#measure-name').fill('Cancelled measure'); await page.locator('#measure-followup').check();
        await page.locator('#measureForm [type="submit"]').click();
        await page.locator('#assessment-cancel').click();
        assert.equal(await page.evaluate(() => cur().plan.find(item => item.id === 'saccade').fields.some(field => field.label === 'Cancelled measure')), false);
        await openAssessment(page, 'saccade');
        await page.locator('[data-action="measure-add"][data-id="saccade"]').click();
        await page.locator('#measure-name').fill('Follow-up original'); await page.locator('#measure-type').selectOption('number'); await page.locator('#measure-followup').check();
        await page.locator('#measureForm [type="submit"]').click();
        await page.locator(':focus').fill('0');
        await page.evaluate(() => { window.realSaveModalClient = store.saveClient; store.saveClient = async () => { throw new Error('Synthetic template write failure'); }; });
        await page.locator('#assessment-done').click();
        assert.match(await page.locator('.failure-message pre').last().textContent(), /Synthetic template write failure/);
        assert.equal(await page.locator('.failure-message pre').last().isVisible(), false);
        assert.deepEqual(await page.evaluate(() => collectSession().assess.saccade), first, 'A failed template write preserves committed results');
        await page.evaluate(() => {
          store.saveClient = (...args) => new Promise((resolve, reject) => {
            window.finishModalTemplateSave = () => realSaveModalClient.apply(store, args).then(resolve, reject);
          });
        });
        await page.locator('#assessment-done').click();
        assert.equal(await page.locator('#assessment-done').innerText(), locale === 'en' ? 'Saving...' : '正在儲存…');
        assert.equal(await page.locator('#assessmentResultForm').evaluate(node => node.inert), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('#assessmentResultForm').isVisible(), true, 'A pending template write keeps the result dialog open');
        await page.evaluate(() => finishModalTemplateSave());
        await page.waitForSelector('#assessmentResultForm', { state: 'detached' });
        await page.evaluate(() => { store.saveClient = realSaveModalClient; });
        assert.equal(await page.evaluate(() => cur().plan.find(item => item.id === 'saccade').fields.at(-1).label), 'Follow-up original');

        for (const theme of ['light', 'dark']) for (const width of [320, 360, 640, 768, 1024, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await openAssessment(page, 'saccade');
          await assertFieldGrid(page, '#assessmentResultForm .grid');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth + 1), true);
          assert.equal(await page.locator('.assessment-entry').evaluateAll(nodes => nodes.every(node => Math.abs(node.getBoundingClientRect().width - node.parentElement.getBoundingClientRect().width) < 1)), true, 'Fields use the dialog width at every breakpoint');
          const controls = await page.locator('.assessment-dialog button:not(.help-trigger)').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
          assert.ok(controls.every(control => control.width >= 44 && control.height >= 44));
          const helpTargets = await page.locator('.assessment-dialog .help-trigger').evaluateAll(nodes => nodes.map(node => {
            const hit = getComputedStyle(node, '::before'); return { width: parseFloat(hit.width), height: parseFloat(hit.height) };
          }));
          assert.ok(helpTargets.length && helpTargets.every(target => target.width >= 44 && target.height >= 44), 'Inline help retains a 44px pointer target without reserving that space in the grid');
          if ([360, 1280].includes(width)) await page.locator('.overlay').screenshot({ path: path.join(output, `${locale}-${theme}-${width}-dialog.png`) });
          await completeAssessment(page);
          if ([360, 1280].includes(width)) await page.locator('#as-saccade').screenshot({ path: path.join(output, `${locale}-${theme}-${width}-summary.png`) });
        }
        await page.locator('[data-action="save-session"]:visible').first().click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(() => ({ session: clone(sessions[0]), csv: readRecordCSV(sessionCSV(cur(), sessions[0])).session, note: noteText(cur(), sessions[0]) }));
        assert.deepEqual(saved.csv, saved.session); assert.match(saved.note, /第一行 Original/);
        await page.locator('[data-action="open-session"]:visible').first().click();
        await openAssessment(page, 'custom_modal'); assert.equal(await page.locator('#af-custom_modal-3').inputValue(), '原值 B'); await completeAssessment(page);
        await page.locator('[data-workflow-clear="as-saccade"]').click(); await page.locator('#askYes').click();
        assert.equal(await page.locator('.pick #ac-retained_saccade').isVisible(), true, 'Clearing the primary result keeps a matching performed result selected');
        assert.equal(await page.locator('#ac-retained_saccade').isChecked(), true);
        assert.equal(await page.evaluate(() => collectSession().assess.retained_saccade.values.accuracy_rate), 44);
        assert.equal(await page.evaluate(() => collectSession().assess.saccade), undefined);
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale}: transactional assessment dialog, cancel/re-edit, plain text, schema types, zero, custom measures, failed write retry, language, keyboard, themes, responsive, offline and CSV/reopen`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
