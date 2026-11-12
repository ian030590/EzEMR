const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/assessment-display');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        const plan = await page.evaluate(async () => {
          store = localStore(); await finishBoot();
          const legacy = [
            ['sacc', 'Eye tracker – structured saccade task (computer based)'],
            ['fix', 'Eye tracker – fixation task (computer based)'],
            ['purs', 'Eye tracker – moving-target pursuit task (computer based)'],
            ['periph', 'Structured peripheral-stimulus task with eye tracking (computer based)'],
            ['ufov', 'UFOV']
          ].map(([id, name]) => ({ id, name, category: 'visual', timing: 'milestone', fields: ['Result'] }));
          const plan = [clone(DEFAULT_PLAN.find(p => p.id === 'npc')), ...legacy,
            clone(DEFAULT_PLAN.find(p => p.id === 'va')), ...clone(SOURCE_ASSESSMENTS).map(item => ({ ...item, id: 'import_' + item.id, name: LABELS[item.name], functionCategory: 'visual' })),
            clone(LEGACY_FUNCTIONAL_ITEM),
            { id: 'custom_display', name: 'Custom: assessment (original)', timing: 'assessment', fields: ['Result'] }];
          const trainingPlan = clone(TRAIN); trainingPlan.find(item => item.k === 'ocular').acts = ['Saccadic fixation'];
          await store.saveClient({ id: 'display_fixture', name: 'Synthetic display fixture', ref: 'TEST-DISPLAY', plan, trainingPlan, created: today() });
          await finishBoot(); return clone(plan);
        });
        await action('new-session').click();
        const original = await page.evaluate(() => {
          editing.assess = {
            va: { done: true, values: { od: '6/12' }, notes: 'Current acuity 原文' },
            import_src_va: { done: true, values: { va_ou: '6/9' }, notes: 'Imported acuity 原文' },
            ufov: { done: true, values: { Result: '150 ms' }, notes: 'Original UFOV result' },
            import_src_ufov: { done: true, values: { ufov_ps: '0', ufov_da: '200' }, notes: 'Imported UFOV result' },
            import_src_other: { done: true, values: { other_assessment: 'Historical original result 原文' }, notes: 'Keep historical data' },
            func: { done: true, values: { Result: 'Historical functional result 原文' }, notes: 'Keep original combined assessment' }
          };
          editing.training.ocular = { on: true, acts: ['Saccadic fixation'], actScores: { 'Saccadic fixation': '70%' } };
          renderEditor(); return clone(editing.assess);
        });
        const visual = page.locator('#assess-long [data-function="visual"]');
        assert.deepEqual(await visual.locator('.pick').allTextContents(), locale === 'en'
          ? ['Distance visual acuity', 'Near visual acuity', 'Visual field', 'Contrast sensitivity', 'Color vision', 'Stereopsis', 'Saccade assessment', 'Fixation assessment', 'Pursuit assessment', 'Peripheral field assessment', 'Convergence assessment', 'Custom: assessment (original)']
          : ['遠距離視力', '近距離視力', '視野', '對比敏感度', '色覺', '立體視覺', '跳視評估', '凝視評估', '追視評估', '周邊視野評估', '輻輳評估', 'Custom: assessment (original)']);
        assert.equal(await visual.locator('.pick input[id*="ufov"]').count(), 0);
        assert.equal(await page.locator('#assess-long .pick input[id*="ufov"]').count(), 1);
        assert.equal(await page.locator('#assess-long [data-function="functional"] #ac-ufov').count(), 1);
        assert.equal(await page.locator('#assessList .pick #ac-import_src_va, #assessList .pick #ac-import_src_ufov, #ac-import_src_other, #ac-func').count(), 0);
        assert.equal(await page.locator('#as-import_src_va').isVisible(), true);
        assert.equal(await page.locator('#as-import_src_ufov').isVisible(), true);
        assert.equal(await page.locator('#as-import_src_va-h').innerText(), locale === 'en' ? 'Current measurements' : '本次量測');
        assert.equal(await page.locator('#as-import_src_ufov-h').innerText(), locale === 'en' ? 'Current measurements' : '本次量測');
        assert.deepEqual(await page.evaluate(() => collectSession().assess), original, 'Rendering and collecting merged entries preserves every original result');
        assert.deepEqual(await page.evaluate(() => cur().plan), plan, 'Display changes never rewrite stored template names or fields');
        await openTraining(page, 'ocular');
        assert.doesNotMatch(await page.locator('#tx-ocular-acts').innerText(), /Saccadic fixation|跳視與凝視/);
        for (const name of ['Saccades', 'Fixation']) {
          assert.equal(await page.locator(`#tx-ocular-acts input[data-act="${name}"]`).isChecked(), false, 'A combined legacy result does not mark either separate activity as performed');
        }
        assert.deepEqual(await page.evaluate(() => collectSession().training.ocular.actScores), { 'Saccadic fixation': '70%' });
        await completeTraining(page);
        assert.equal(await page.locator('#assess-short #visualSymptoms').count(), 0);
        assert.equal(await page.locator('.soap-sec').nth(1).locator('#visualSymptoms').count(), 1, 'Symptoms precede the assessment item lists');
        assert.equal(await page.locator('#assess-short .assessment-empty').count(), 0, 'Symptom self-ratings are already a short-term outcome');
        assert.equal(await page.locator('.soap-sec').nth(1).locator('#sessionResponse').count(), 1);
        assert.equal(await page.locator('.soap-sec').nth(3).locator('#sessionResponse, #s-tol').count(), 0);
        assert.equal(await page.locator('.soap-sec').nth(2).locator('p.note, .sec-title .note').count(), 0);
        assert.doesNotMatch(await page.locator('#soapForm').innerText(), /NRS|工作相關功能性視覺作業|Work-related functional vision task/);

        await page.locator('#ac-ufov').uncheck();
        for (const id of ['ufov', 'import_src_ufov']) {
          assert.equal(await page.locator('#as-' + id).isHidden(), true);
          assert.equal(await page.locator('#af-' + id + '-0').count(), 0);
        }
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.equal(await page.evaluate(() => collectSession().assess.import_src_ufov.values.ufov_ps), '0');
        await page.locator('#ac-ufov').check();
        assert.equal(await page.locator('#af-import_src_ufov-0').inputValue(), '0');
        await completeAssessment(page);
        await page.locator('#languageSelect').selectOption(locale);
        for (const id of ['ufov', 'import_src_ufov']) assert.equal(await page.locator('#as-' + id).isVisible(), true);
        assert.deepEqual(await page.evaluate(() => collectSession().assess), original);

        const metrics = { reading_speed: 120, search_time: 42, coordination_time: 350 };
        for (const [id, value] of Object.entries(metrics)) {
          await page.locator('#ac-' + id).check();
          assert.equal(await page.locator(`[data-entry="${id}"] input[type="number"]`).count(), 1);
          assert.equal(await page.locator(`[data-entry="${id}"] > label select`).count(), 0, 'The result itself remains numeric');
          assert.equal(await page.locator(`[data-entry="${id}"] [data-measurement-ref]`).count(), 1, 'Result source is a separate explicit choice');
          await page.locator('#af-' + id + '-0').fill(String(value));
          await completeAssessment(page);
        }
        assert.deepEqual(await page.locator('#assess-long [data-function="functional"] .pick').allTextContents(), locale === 'en'
          ? ['UFOV', 'Reading speed', 'Visual search completion time', 'Eye–hand reaction time']
          : ['UFOV', '閱讀速度', '視覺搜尋完成時間', '手眼反應時間']);
        await page.evaluate(() => {
          editing = collectSession();
          editing.training.ocular = { on: true,
            acts: ['Saccadic fixation', LABELS['Saccadic fixation'], 'Saccades', 'Fixation', 'Gaze stabilisation (VOR ×1)', 'Gaze stabilisation (VOR)'],
            actScores: { 'Saccadic fixation': '70%', [LABELS['Saccadic fixation']]: 0, Saccades: '80%', Fixation: '85%', 'Gaze stabilisation (VOR ×1)': '30 s', 'Gaze stabilisation (VOR)': '20 s' } };
          renderEditor();
        });
        await openTraining(page, 'ocular');
        assert.equal(await page.locator('#tx-ocular-acts .act').filter({ hasText: /VOR/ }).count(), 1);
        assert.doesNotMatch(await page.locator('#tx-ocular-acts').innerText(), /Saccadic fixation|跳視與凝視/);
        for (const name of ['Saccades', 'Fixation']) assert.equal(await page.locator(`#tx-ocular-acts input[data-act="${name}"]`).count(), 1);
        assert.equal(await page.locator('#tx-ocular-acts .act').filter({ hasText: /VOR/ }).innerText(), locale === 'en' ? 'Gaze stabilisation (VOR)' : '凝視穩定（VOR）');
        await completeTraining(page);
        assert.equal(await page.locator('#adaptationPicks [data-strategy="workstation_setup"]').locator('..').innerText(), locale === 'en' ? 'Workstation setup' : '桌椅與螢幕調整');
        await page.locator('#s-tol').fill('8');
        await page.locator('#s-subj').fill('Original clinical note 原文');
        await page.locator('#addRec').click();
        await page.locator('#symWrap tr.rec input[id^="syr-"]').fill('12');
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [360, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            await page.locator('#assess-long').screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          }
        }
        await action('save-session').click();
        await page.waitForSelector('.sess');
        const saved = await page.evaluate(() => ({ session: clone(sessions[0]), restored: readRecordCSV(sessionCSV(cur(), sessions[0])).session, note: noteText(cur(), sessions[0]) }));
        assert.deepEqual(saved.restored, saved.session);
        for (const [id, data] of Object.entries(original)) assert.deepEqual(saved.session.assess[id], data);
        for (const [id, value] of Object.entries(metrics)) assert.deepEqual(saved.session.assess[id].values, { value });
        const combinedName = await page.evaluate(() => LABELS['Saccadic fixation']);
        assert.deepEqual(saved.session.training.ocular.acts, ['Saccadic fixation', combinedName, 'Saccades', 'Fixation', 'Gaze stabilisation (VOR ×1)', 'Gaze stabilisation (VOR)']);
        assert.deepEqual(saved.session.training.ocular.actScores, { 'Saccadic fixation': '70%', [combinedName]: 0, Saccades: '80%', Fixation: '85%', 'Gaze stabilisation (VOR ×1)': '30 s', 'Gaze stabilisation (VOR)': '20 s' });
        assert.equal(saved.session.tolerance, 8);
        assert.ok(saved.note.indexOf(locale === 'en' ? 'Session response' : '本次反應') < saved.note.indexOf(locale === 'en' ? 'A: PEO clinical reasoning' : 'A：PEO 臨床推理'));
        assert.equal(saved.session.sym.find(row => row.kind === 'rec').recMin, 12);
        assert.doesNotMatch(saved.note, /NRS/);
        assert.match(saved.note, /Historical original result 原文/);
        await action('open-session').click();
        await openAssessment(page, 'ufov');
        assert.equal(await page.locator('#af-import_src_ufov-0').inputValue(), '0');
        await openAssessment(page, 'reading_speed');
        assert.equal(await page.locator('#af-reading_speed-0').inputValue(), '120');
        await completeAssessment(page);
        assert.equal(await page.locator('#s-subj').inputValue(), 'Original clinical note 原文');
        assert.equal(await page.locator('#assess-long .pick input[id*="ufov"]').count(), 1);
        await page.locator('#assess-long [data-action="plan-add"]').click();
        const pursuitSeed = await page.evaluate(() => DEFAULT_PLAN.filter(item => !item.copm).findIndex(item => item.id === 'pursuit'));
        await page.locator('#item-base').selectOption(String(pursuitSeed));
        assert.equal(await page.locator('#item-name').inputValue(), locale === 'en' ? 'Pursuit assessment' : '追視評估');
        await page.locator('#itemForm [type="submit"]').click();
        await page.waitForSelector('#itemForm', { state: 'detached' });
        const added = await page.evaluate(() => clone(cur().plan.at(-1)));
        assert.equal(added.name, 'Smooth pursuit (OcuTrain PURSUIT)');
        assert.equal(added.templateId, 'pursuit');
        assert.equal(await page.locator('#assess-long .pick').filter({ hasText: locale === 'en' ? /^Pursuit assessment$/ : /^追視評估$/ }).count(), 1);
        assert.equal(await page.locator('#as-' + added.id).isVisible(), true);
        await completeAssessment(page);
        assert.notEqual(await page.evaluate(() => collectSession().assess.purs?.done), true, 'Adding a matching template does not mark the older empty assessment as performed');
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.equal(await page.locator('#as-' + added.id + '-h').innerText(), locale === 'en' ? '追視評估' : 'Pursuit assessment');
        await action('save-session').click(); await page.waitForSelector('.sess');
        await action('open-session').click();
        assert.equal(await page.locator('#as-' + added.id).isVisible(), true);
        const addedResult = await page.evaluate(id => readRecordCSV(sessionCSV(cur(), sessions[0])).session.assessmentPlan.find(item => item.id === id), added.id);
        assert.equal(addedResult.name, added.name); assert.equal(addedResult.templateId, 'pursuit');
        await action('cancel-edit').click();
        if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await page.waitForSelector('#soapForm', { state: 'detached' });
        await action('new-session').click(); await page.locator('#tx-ocular-on').check();
        assert.doesNotMatch(await page.locator('#tx-ocular-acts').innerText(), /Saccadic fixation|跳視與凝視/);
        assert.deepEqual(await page.evaluate(() => trainingDialog.read().training.ocular.acts), [], 'Historical combined results do not carry into a new visit');
        const activeLocale = await page.locator('#languageSelect').inputValue();
        await page.locator('#tx-ocular-new').fill(activeLocale === 'en' ? 'Saccadic fixation' : combinedName);
        await page.locator('[data-action="act-add"][data-k="ocular"]').click();
        assert.equal(await page.locator('.toast').last().innerText(), activeLocale === 'en'
          ? 'Select saccade training and fixation training separately.' : '請分別勾選跳視訓練與凝視訓練。');
        assert.doesNotMatch(await page.locator('#tx-ocular-acts').innerText(), /Saccadic fixation|跳視與凝視/);
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale}: legacy IDs and translated imported names, ordered assessments, separate scalar outcomes, one VOR control with original scores, concise reasoning, response in O and CSV/save/reopen`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
