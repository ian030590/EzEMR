// Initial assessment items, tick-to-open assessment and training sections, and one score per activity.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { completeAssessment } = require('./lib/assessments.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const evidence = [];
const shortGroups = {
  visual: ['st_npc', 'st_pfv', 'st_gaze', 'st_tolerance', 'st_load'],
  functional: ['st_search', 'st_reading', 'st_coordination'],
  motor: ['st_tug', 'st_10mwt', 'st_bbt', 'st_9hpt', 'st_cop'],
  cognitive: ['st_neglect']
};
const check = name => { evidence.push(name); console.log('PASS: ' + name); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce' });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const choose = locale => page.locator('#languageSelect').selectOption(locale);
  const connect = () => page.evaluate(async () => {
    const disk = await navigator.storage.getDirectory();
    window.testRoot = await disk.getDirectoryHandle('assessment-picks-records', { create: true });
    store = folderStore(testRoot); await finishBoot();
  });
  const checkEnglish = async selector => {
    const found = await page.locator(selector).evaluate(element => {
      const out = [], walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('textarea') && /\p{Script=Han}/u.test(walker.currentNode.nodeValue)) out.push(walker.currentNode.nodeValue.trim());
      for (const node of element.querySelectorAll('[title], [aria-label], [placeholder]')) for (const name of ['title', 'aria-label', 'placeholder']) {
        const value = node.getAttribute(name); if (value && /\p{Script=Han}/u.test(value)) out.push(`${name}: ${value}`);
      }
      return [...new Set(out)];
    });
    assert.deepEqual(found, [], `Untranslated built-in UI in ${selector}`);
  };
  const groupIds = (id, category = 'visual', period = 'long') => page.locator(category === 'visual' && period === 'long'
    ? `#assess-long [data-function="visual"] .pick input[data-planned="${id === 'assessPlanned'}"]`
    : `[aria-labelledby="${id}-${period}-${category}"] input`).evaluateAll(inputs => inputs.map(input => input.id));
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  const discard = async () => { await action('cancel-edit').click(); if (await page.locator('#askYes').count()) await page.locator('#askYes').click(); await page.waitForSelector('#soapForm', { state: 'detached' }); };

  try {
    await page.goto(url); await ready(); await connect();
    await action('new-client').click();
    await page.locator('#cf-name').fill('測試個案（評估勾選）'); await page.locator('#cf-ref').fill('TEST-PICKS');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');

    // Item settings: choose the initial assessment battery.
    await page.locator('#tab-plan').click();
    assert.equal(await page.locator('#initialHeading').evaluate(node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; }), '初次評估項目');
    assert.equal(await page.locator('#initialPicks input').count(), 40);
    assert.equal(await page.locator('#initialPicks input:checked').count(), 0);
    assert.equal(await page.evaluate(() => cur().plan.every(p => p.initial === false)), true);
    for (const id of await page.evaluate(() => cur().plan.map(p => p.id))) {
      await page.locator(`[data-initial="${id}"]`).check();
      await page.waitForFunction(id => !savingItems && cur().plan.find(p => p.id === id).initial === true, id);
    }
    await page.locator('[data-initial="ufov_speed"]').uncheck();
    await page.waitForFunction(() => cur().plan.find(p => p.id === 'ufov_speed').initial === false);
    assert.equal(await page.locator('.toast').innerText(), '已移出初次評估項目。');
    await page.evaluate(() => { window.realSaveClient = store.saveClient; store.saveClient = async () => { throw new Error('模擬寫入失敗'); }; });
    await page.locator('[data-initial="npc"]').click();
    await page.waitForFunction(() => !savingItems && [...document.querySelectorAll('.failure-message pre')].some(node => /模擬寫入失敗/.test(node.textContent)));
    assert.equal(await page.locator('[data-initial="npc"]').isChecked(), true);
    assert.equal(await page.evaluate(() => cur().plan.find(p => p.id === 'npc').initial), true);
    await page.evaluate(() => { store.saveClient = realSaveClient; });
    await page.reload(); await ready(); await connect();
    await page.locator('#tab-plan').click();
    assert.equal(await page.locator('[data-initial="ufov_speed"]').isChecked(), false);
    assert.equal(await page.locator('[data-initial="npc"]').isChecked(), true);
    check('Item settings choose initial assessment items, save at once, survive reload and restore the tick when the write fails');

    // Baseline record: initial items first, every section closed until ticked.
    await action('new-session').click();
    assert.equal(await page.locator('#s-visit').inputValue(), 'baseline');
    assert.equal(await page.locator('#ac-va').locator('..').getAttribute('title'), '初次評估項目');
    assert.equal(await page.locator('#assessPlanned-long-functional').innerText(), '初次評估項目');
    assert.deepEqual(await groupIds('assessPlanned'), ['ac-va', 'ac-near_va', 'ac-refraction', 'ac-vf', 'ac-cs', 'ac-color', 'ac-stereo', 'ac-saccade', 'ac-fixation', 'ac-pursuit', 'ac-vor', 'ac-npc', 'ac-record_review', 'ac-optometry_record']);
    assert.deepEqual(await groupIds('assessPlanned', 'functional'), ['ac-ufov_divided', 'ac-ufov_selective', 'ac-reading_speed', 'ac-search_time', 'ac-coordination_time']);
    assert.deepEqual(await groupIds('assessPlanned', 'daily'), ['ac-copm', 'ac-ot_record', 'ac-self_report', 'ac-ot_assessment', 'ac-daily_task', 'ac-participation']);
    assert.deepEqual(await groupIds('assessPlanned', 'cognitive'), []);
    for (const [category, ids] of Object.entries(shortGroups)) assert.deepEqual(await groupIds('assessPlanned', category, 'short'), ids.map(id => 'ac-' + id));
    assert.deepEqual(await groupIds('assessOther', 'functional'), ['ac-ufov_speed']);
    assert.equal(await page.locator('#assessList .pick input[data-planned="true"]').count(), 39);
    assert.equal(await page.locator('#assessList .as:visible').count(), 0);
    await page.locator('#ac-saccade').check();
    assert.equal(await page.locator('#assessmentResultForm').isVisible(), true);
    await page.locator('#af-saccade-0').fill('68.5'); await page.locator('#af-saccade-1').fill('0');
    await completeAssessment(page);
    await page.locator('#ac-saccade').uncheck();
    assert.equal(await page.locator('#as-saccade').isVisible(), false);
    assert.equal(await page.locator('#af-saccade-0').count(), 0);
    await page.locator('#ac-saccade').check();
    assert.equal(await page.locator('#af-saccade-0').inputValue(), '68.5');
    await completeAssessment(page);
    await page.locator('#ac-ufov_speed').check(); await page.locator('#af-ufov_speed-0').fill('30'); await completeAssessment(page); await page.locator('#ac-ufov_speed').uncheck();
    check('Baseline lists initial items first; selecting opens a modal, completing shows text and deselecting retains results');

    // Training: one score per ticked activity.
    assert.equal(await page.locator('#tx-summary-attn').isVisible(), false);
    await page.locator('#tx-attn-on').check();
    assert.equal(await page.locator('#tx-attn').isVisible(), true);
    assert.equal(await page.locator('#tx-attn-perf').count(), 0);
    assert.equal(await page.locator('#tx-attn-scores label:visible').count(), 0);
    await page.locator('#tx-attn-a1').check(); await page.locator('#tx-attn-a2').check();
    assert.deepEqual(await page.locator('#tx-attn-scores label:visible').evaluateAll(rows => rows.map(row => row.id)), ['tx-attn-r1', 'tx-attn-r2']);
    assert.equal(await page.locator('#tx-attn-s1').getAttribute('aria-label'), '選擇性注意力的表現');
    await page.locator('#tx-attn-s1').fill('92%'); await page.locator('#tx-attn-s2').fill('0');
    await page.locator('#tx-attn-new').fill('Custom attention task'); await action('act-add').click();
    assert.equal(await page.locator('#tx-attn-r5').isVisible(), true);
    await page.locator('#tx-attn-s5').fill('3 errors');
    await page.locator('#tx-attn-a2').uncheck(); await page.locator('#tx-attn-a2').check();
    assert.equal(await page.locator('#tx-attn-s2').inputValue(), '0');
    await page.locator('#tx-attn-diff').fill('11');
    await page.locator('#training-done').click();
    assert.equal(await page.evaluate(() => sessions.length), 0);
    assert.equal(await page.locator('#tx-attn-diff').evaluate(el => el.validity.rangeOverflow), true);
    await page.locator('#tx-attn-diff').fill('6');
    await completeTraining(page); await page.locator('#s-tol').fill('8');
    await page.locator('#tx-periph-on').check(); await page.locator('#training-cancel').click();
    await action('save-session').click(); await page.waitForSelector('.sess');
    const saved = await page.evaluate(async () => {
      const s = (await store.listSessions(curId))[0];
      return { s, note: noteText(cur(), s), restored: readRecordCSV(sessionCSV(cur(), s)), client: clone(cur()) };
    });
    assert.deepEqual(Object.keys(saved.s.assess), ['saccade', 'ufov_speed']);
    assert.equal(saved.s.assess.ufov_speed.done, false, 'Deselection excludes the assessment from the report');
    assert.equal(saved.s.assess.ufov_speed.values.final_threshold_rt_ms, 30, 'Deselection retains entered results');
    assert.equal(saved.s.assess.saccade.done, true);
    assert.deepEqual(saved.s.assess.saccade.values, { accuracy_rate: 68.5, tff_mean_ms: 0 });
    assert.deepEqual(Object.keys(saved.s.training), ['attn']);
    assert.deepEqual(saved.s.training.attn.acts, ['Selective attention', 'Divided attention', 'Custom attention task']);
    assert.deepEqual(saved.s.training.attn.actScores, { 'Selective attention': '92%', 'Divided attention': '0', 'Custom attention task': '3 errors' });
    assert.equal(saved.s.training.attn.diff, 6); assert.equal(saved.s.tolerance, 8);
    assert.deepEqual(saved.restored, { client: saved.client, session: saved.s });
    assert.match(saved.note, /活動：選擇性注意力：92%、分配性注意力：0、Custom attention task：3 errors/);
    assert.doesNotMatch(saved.note, /UFOV/);
    check('Deselected results are retained but excluded from reports; each activity keeps its own score, including 0, through disk, note and CSV; 0 to 10 ratings reject 11');

    await page.locator('#tab-outcomes').click();
    const attnTable = page.locator('#tabBody section.panel', { hasText: '視覺注意力' });
    assert.deepEqual((await attnTable.locator('thead th').allInnerTexts()).slice(0, 4), ['日期', '選擇性注意力', '分配性注意力', 'Custom attention task']);
    assert.deepEqual((await attnTable.locator('tbody td').allInnerTexts()).slice(1, 4), ['92%', '0', '3 errors']);
    check('Progress tracking shows one column per activity with that visit\'s score');

    // Treatment visits include session measures; later assessments use the selected initial items and timing.
    await action('new-session').click();
    assert.equal(await page.locator('#s-visit').inputValue(), 'treatment');
    assert.equal(await page.locator('[id^="assessPlanned-"]').count(), 4);
    for (const [category, ids] of Object.entries(shortGroups)) assert.deepEqual(await groupIds('assessPlanned', category, 'short'), ids.map(id => 'ac-' + id));
    assert.equal(await page.locator('#assess-long [aria-labelledby^="assessPlanned-"] input').count(), 0);
    assert.equal(await page.locator('#ac-copm').count(), 0);
    await page.locator('#s-visit').selectOption('post');
    assert.equal(await page.locator('#ac-va').locator('..').getAttribute('title'), '本次應評估');
    assert.equal(await page.locator('#assessPlanned-long-functional').innerText(), '本次應評估');
    assert.ok((await groupIds('assessPlanned', 'daily')).includes('ac-copm'));
    assert.deepEqual(await groupIds('assessOther', 'functional'), ['ac-ufov_speed']);
    await page.locator('#ac-npc').check(); await completeAssessment(page); await page.locator('#tx-attn-on').check(); await page.locator('#tx-attn-a1').check();
    for (const width of [320, 360, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await noOverflow(), true, `Editor overflows at ${width}px`);
    }
    await page.screenshot({ path: path.join(output, 'picks-editor-light-1280.png'), fullPage: true });
    await page.setViewportSize({ width: 360, height: 900 }); await page.emulateMedia({ colorScheme: 'dark' });
    await page.screenshot({ path: path.join(output, 'picks-editor-dark-360.png'), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 }); await page.emulateMedia({ colorScheme: 'light' });
    check('Treatment visits list short-term session measures as due; post-rehabilitation lists initial items due by timing; no horizontal overflow at 320 to 1280px');

    // English editor and settings, keeping the draft.
    await page.locator('#tx-attn-s1').fill('95%');
    await completeTraining(page);
    await choose('en');
    assert.equal(await page.locator('#ac-va').locator('..').getAttribute('title'), 'Due this visit');
    assert.equal(await page.locator('#assessPlanned-long-functional').innerText(), 'Due this visit');
    assert.equal(await page.locator('#assessOther-long-functional').innerText(), 'Other items');
    await openTraining(page, 'attn');
    assert.equal(await page.locator('#tx-attn-s1').inputValue(), '95%');
    assert.equal(await page.locator('#tx-attn-s1').getAttribute('aria-label'), 'Selective attention performance');
    assert.equal(await page.locator('#tx-attn-s0').getAttribute('placeholder'), 'e.g. 85%, 12 reps, 40 s');
    await completeTraining(page);
    assert.equal(await page.locator('#ac-npc').isChecked(), true);
    await checkEnglish('#soapForm');
    await page.locator('#s-visit').selectOption('baseline');
    assert.equal(await page.locator('#ac-va').locator('..').getAttribute('title'), 'Initial assessment items');
    assert.equal(await page.locator('#assessPlanned-long-functional').innerText(), 'Initial assessment items');
    await checkEnglish('#assessList');
    await discard();
    await page.locator('#tab-plan').click();
    assert.equal(await page.locator('#initialHeading').evaluate(node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; }), 'Initial assessment items');
    await checkEnglish('section[aria-labelledby="initialHeading"]'); await checkEnglish('#planEdit');
    await page.locator('[data-initial="ufov_speed"]').check();
    await page.waitForFunction(() => cur().plan.find(p => p.id === 'ufov_speed').initial === true);
    await page.locator('#tab-outcomes').click(); await checkEnglish('#tabBody');
    await choose('zh-TW');
    check('English initial-item settings, chip groups, activity score labels and progress columns; switching language keeps the draft');

    // Older records: earlier results and the shared performance box stay intact.
    await page.evaluate(async () => {
      const s = { id: 's_legacy_picks', date: '2026-10-01', num: 9, visit: 'treatment', sym: [], subjective: '', objective: '', assessment: '', plan: '',
        assess: { fixation: { done: false, notes: '', values: { accuracy_rate: 61 } } },
        training: { ocular: { on: true, acts: ['Saccadic fixation'], perf: '70% accuracy', program: '', dur: null, level: '', diff: null, notes: '' } } };
      await store.saveSession(curId, s); await loadSessions(); renderMain();
    });
    await page.locator('#tab-sessions').click();
    await page.locator('[data-action="open-session"][data-id="s_legacy_picks"]').click();
    assert.equal(await page.locator('#ac-fixation').isChecked(), false);
    await openTraining(page, 'ocular');
    assert.equal(await page.locator('#tx-ocular-perf').inputValue(), '70% accuracy');
    assert.match(await page.locator('label[for="tx-ocular-perf"]').innerText(), /整體表現/);
    assert.equal(await page.locator('#tx-ocular-acts [data-act="Saccadic fixation"]').count(), 0);
    assert.equal(await page.locator('#tx-ocular-acts [data-act="Saccades"]').isChecked(), false);
    assert.equal(await page.locator('#tx-ocular-acts [data-act="Fixation"]').isChecked(), false);
    await page.locator('#tx-ocular-acts [data-act="Saccades"]').check();
    const separateScore = (await page.locator('#tx-ocular-acts [data-act="Saccades"]').getAttribute('data-score')).replace(/-r(\d+)$/, '-s$1');
    await page.locator('#' + separateScore).fill('80%');
    await completeTraining(page);
    await action('save-session').click(); await page.waitForSelector('.sess');
    const legacy = await page.evaluate(async () => (await store.listSessions(curId)).find(s => s.id === 's_legacy_picks'));
    assert.deepEqual(legacy.assess.fixation.values, { accuracy_rate: 61 });
    assert.equal(legacy.training.ocular.perf, '70% accuracy');
    assert.deepEqual(legacy.training.ocular.acts, ['Saccadic fixation', 'Saccades']);
    assert.deepEqual(legacy.training.ocular.actScores, { Saccades: '80%' });
    check('Older records keep unticked results and their shared performance entry while gaining per-activity scores');

    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'assessment-picks-results.json'), JSON.stringify({ evidence }, null, 2));
  } finally {
    await browser.close(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
