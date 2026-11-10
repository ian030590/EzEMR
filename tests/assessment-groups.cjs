const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'assessment-groups');
// The new clinic battery is additive; the earlier ten assessment definitions remain available.
const expected = {
  record_review: ['visual', 'milestone', ['source_date', 'summary']],
  optometry_record: ['visual', 'milestone', ['source_date', 'summary']],
  ot_record: ['visual', 'milestone', ['source_date', 'summary']],
  va: ['visual', 'assessment', ['od', 'os', 'ou', 'notation', 'correction']],
  near_va: ['visual', 'assessment', ['od', 'os', 'ou', 'notation', 'correction', 'distance_cm']],
  refraction: ['visual', 'assessment', ['od', 'os', 'add', 'source']],
  vf: ['visual', 'assessment', ['method', 'od', 'os', 'summary']],
  cs: ['visual', 'assessment', ['ou', 'od', 'os', 'test']],
  color: ['visual', 'assessment', ['ou', 'od', 'os', 'test']],
  stereo: ['visual', 'assessment', ['arcsec', 'test']],
  self_report: ['functional', 'milestone', ['questionnaire', 'score', 'findings']],
  ot_assessment: ['functional', 'assessment', ['method', 'findings']],
  daily_task: ['functional', 'assessment', ['task', 'performance']],
  participation: ['functional', 'assessment', ['needs', 'priority']]
};
const evidence = [];
const check = text => { evidence.push(text); console.log('PASS: ' + text); };
const ordered = (text, terms) => {
  let position = -1;
  for (const term of terms) {
    const next = text.indexOf(term, position + 1);
    assert.ok(next > position, `Missing or misordered ${term}`); position = next;
  }
};

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en', groups = en ? ['Visual function', 'Functional vision'] : ['視覺功能', '功能性視覺'];
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const connect = name => page.evaluate(async name => {
        const disk = await navigator.storage.getDirectory();
        window.groupRoot = await disk.getDirectoryHandle(name, { create: true });
        store = folderStore(groupRoot); await finishBoot();
      }, name);
      const discard = async () => {
        await action('cancel-edit').click();
        if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await page.waitForSelector('#soapForm', { state: 'detached' });
      };
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`); await ready();
        await page.locator('#languageSelect').selectOption(locale); await connect('group-records');
        await action('new-client').click(); await page.locator('#cf-name').fill('Synthetic assessment groups'); await page.locator('#cf-ref').fill('TEST-GROUPS');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        const plan = await page.evaluate(() => { validateItems(cur().plan, 'assessment'); return cur().plan; });
        assert.equal(plan.length, 24);
        assert.ok(plan.every(item => item.initial === false));
        for (const [id, [category, timing, fields]] of Object.entries(expected)) {
          const item = plan.find(p => p.id === id); assert.ok(item, id);
          assert.equal(item.category, category, id); assert.equal(item.timing, timing, id);
          assert.deepEqual(item.fields.map(f => f.id), fields, id); assert.equal(item.initial, false);
        }
        assert.equal(plan.find(p => p.id === 'copm').name, 'COPM');
        await page.locator('#tab-plan').click();
        assert.equal(await page.locator('#initialHeading').innerText(), en ? 'Initial assessment items' : '初次評估項目');
        assert.equal(await page.locator('#initialPicks input').count(), 24);
        assert.equal(await page.locator('#initialPicks input:checked').count(), 0);
        assert.deepEqual(await page.evaluate(async () => (await store.listClients())[0].plan), plan);
        await action('new-session').click();
        assert.equal(await page.locator('#s-visit').inputValue(), 'baseline');
        for (const visit of ['baseline', 'post', 'followup', 'treatment']) {
          await page.locator('#s-visit').selectOption(visit);
          assert.deepEqual(await page.locator('#assessList > section > h3').allTextContents(), groups);
          assert.equal(await page.locator('[id^="assessPlanned-"]').count(), 0, `${visit}: no empty planned headings`);
          assert.equal(await page.locator('#assessList .pick-label').count(), 0);
          assert.equal(await page.locator('#assessList .pick-group:empty').count(), 0);
          assert.equal(await page.locator('#assessList .as:visible').count(), 0);
          assert.equal(await page.locator('#assess-visual #symWrap').count(), 1);
          assert.equal(await page.evaluate(() => !!(document.querySelector('#symWrap').compareDocumentPosition(document.querySelector('#assess-visual .pick')) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
          for (const [i, category] of ['visual', 'functional'].entries()) {
            const ids = plan.filter(p => (category === 'functional') === ['copm', 'func', 'self_report', 'ot_assessment', 'daily_task', 'participation'].includes(p.id)
              && (p.id !== 'copm' || ['baseline', 'post'].includes(visit))).map(p => 'ac-' + p.id);
            assert.deepEqual(await page.locator(`#assess-${category} .pick input`).evaluateAll(nodes => nodes.map(n => n.id)), ids);
            assert.equal(await page.locator(`#assess-${category} .pick input:disabled`).count(), 0);
            assert.equal(await page.locator(`#assess-${category} .pick-group`).getAttribute('aria-label'), groups[i]);
            const id = category === 'visual' ? 'va' : 'daily_task';
            await page.locator('#ac-' + id).focus(); await page.keyboard.press('Space');
            assert.equal(await page.locator('#ac-' + id).isChecked(), true);
            assert.equal(await page.locator('#as-' + id).isVisible(), true);
            await page.keyboard.press('Space');
            assert.equal(await page.locator('#as-' + id).isVisible(), false);
          }
        }
        await page.locator('#s-visit').selectOption('baseline');
        for (const colorScheme of ['light', 'dark']) {
          await page.emulateMedia({ colorScheme });
          for (const width of [320, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}: empty initial battery at ${width}px in ${colorScheme}`);
            await page.screenshot({ path: path.join(output, `${locale}-no-initial-${colorScheme}-${width}.png`), fullPage: true });
          }
        }
        check(`${locale}: all 24 new-client initial choices are false on disk and unticked in settings; all four visit types keep both O groups, NRS first, no empty picks, available items and keyboard tick-to-open; light/dark layouts fit 320/1280px`);
        await discard(); await page.locator('#tab-plan').click();
        for (const item of plan) {
          await page.locator(`[data-initial="${item.id}"]`).check();
          await page.waitForFunction(id => !savingItems && cur().plan.find(p => p.id === id).initial === true, item.id);
        }
        await action('new-session').click();
        assert.deepEqual(await page.locator('#assessList > section > h3').allTextContents(), groups);
        const assessmentSection = page.locator('.soap-sec').nth(1);
        const addAssessment = assessmentSection.locator('[data-action="plan-add"][data-editor="true"]');
        const assessmentNote = assessmentSection.getByText(en
          ? 'Tick the items tested this visit to open their fields. Unticked items are not saved. Change the initial assessment items under Item settings.'
          : '勾選本次施測的項目，展開對應的紀錄欄位；未勾選的項目不會存入紀錄。初次評估項目可在「項目設定」調整。', { exact: true });
        for (const element of [addAssessment, assessmentNote]) {
          assert.equal(await element.count(), 1);
          assert.equal(await element.evaluate(node => !!(node.compareDocumentPosition(document.querySelector('#assess-visual')) & Node.DOCUMENT_POSITION_FOLLOWING)), true, 'Assessment controls precede the visual-function group');
          assert.equal(await element.evaluate(node => !!(document.querySelector('#s-obj').compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)), true, 'Assessment controls follow objective findings');
        }
        const nrsHeading = assessmentSection.getByRole('heading', { name: en ? 'Symptom rating (NRS, 0 to 10)' : '症狀評分（NRS，0 至 10）', level: 4, exact: true });
        const nrsSize = await nrsHeading.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
        for (const category of ['visual', 'functional']) {
          const groupSize = await page.locator(`#assess-${category}-h`).evaluate(node => parseFloat(getComputedStyle(node).fontSize));
          assert.ok(groupSize > nrsSize, 'Assessment group headings are larger than the subordinate NRS heading');
        }
        check(`${locale}: assessment add button and instructions follow objective findings and precede both groups; h3 groups are larger than the h4 NRS heading`);
        assert.equal(await page.locator('#assess-visual #symWrap').count(), 1);
        assert.equal(await page.locator('#assess-functional #symWrap').count(), 0);
        assert.equal(await page.evaluate(() => !!(document.querySelector('#symWrap').compareDocumentPosition(document.querySelector('#assess-visual .pick')) & Node.DOCUMENT_POSITION_FOLLOWING)), true);
        for (const [category, label] of ['visual', 'functional'].map((category, i) => [category, groups[i]])) {
          const ids = await page.evaluate(category => cur().plan.filter(p => assessmentCategory(p) === category).map(p => 'ac-' + p.id), category);
          assert.deepEqual(await page.locator(`#assess-${category} .pick input`).evaluateAll(nodes => nodes.map(n => n.id)), ids);
          assert.equal(await page.locator(`#assessPlanned-${category}`).innerText(), en ? 'Initial assessment items' : '初次評估項目');
          assert.equal(await page.getByRole('region', { name: label, exact: true }).count(), 1);
        }
        const remediation = page.locator('.soap-sec').nth(3).locator('.sec-body > h4 + .sub');
        assert.equal(await remediation.evaluate(node => getComputedStyle(node).borderTopWidth), '0px');
        await page.locator('#s-visit').selectOption('post');
        for (const category of ['visual', 'functional']) assert.equal(await page.locator(`#assessPlanned-${category}`).innerText(), en ? 'Due this visit' : '本次應評估');
        await page.locator('#s-visit').selectOption('followup'); assert.equal(await page.locator('#ac-copm').count(), 0);
        await page.locator('#s-visit').selectOption('treatment'); assert.equal(await page.locator('[id^="assessPlanned-"]').count(), 0);
        assert.equal(await page.locator('#ac-copm').count(), 0);
        await page.locator('#s-visit').selectOption('baseline');
        check(`${locale}: new client has 14 new built-ins, canonical categories/fields/timing and initial picks; O groups keep NRS first and visit rules; remediation content has no top border`);

        await page.locator('#s-date').fill('2026-11-07');
        for (const id of ['va', 'daily_task', 'copm']) await page.locator('#ac-' + id).check();
        await page.locator('#af-va-0').fill('6/12'); await page.locator('#af-va-4').selectOption('Best corrected');
        await page.locator('#af-daily_task-0').fill('Reading fixture');
        const clinicalText = '=1+1 <img src=x onerror=alert(1)> 原文';
        await page.locator('#af-daily_task-1').fill(clinicalText); await page.locator('#an-daily_task').fill('Observation fixture');
        await page.locator('#copm-occ-0').fill('Occupation fixture'); await page.locator('#copm-p-0').fill('4'); await page.locator('#copm-s-0').fill('5');
        await page.locator('#languageSelect').selectOption(en ? 'zh-TW' : 'en');
        assert.equal(await page.locator('#af-va-4').inputValue(), 'Best corrected'); assert.equal(await page.locator('#af-daily_task-1').inputValue(), clinicalText);
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(() => {
          window.pdfLines = []; const original = CanvasRenderingContext2D.prototype.fillText;
          CanvasRenderingContext2D.prototype.fillText = function(text, ...args) { pdfLines.push(text); return original.call(this, text, ...args); };
        });
        await action('save-session').click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(async () => {
          const s = sessions[0], c = cur(), dir = await groupRoot.getDirectoryHandle('TEST-GROUPS'), base = store.sessionBase(curId, s.id);
          const read = async ext => (await dir.getFileHandle(base + ext)).getFile();
          return { c: clone(c), s: clone(s), csv: readRecordCSV(await (await read('.csv')).text()), txt: await (await read('.txt')).text(),
            pdf: Array.from(new Uint8Array(await (await read('.pdf')).arrayBuffer()).slice(0, 8)), lines: pdfLines, note: noteText(c, s) };
        });
        assert.deepEqual(saved.csv, { client: saved.c, session: saved.s }); assert.equal(saved.txt, saved.note);
        assert.deepEqual(saved.s.assess.va.values, { od: '6/12', correction: 'Best corrected' });
        assert.deepEqual(saved.s.assess.daily_task.values, { task: 'Reading fixture', performance: clinicalText });
        assert.deepEqual(saved.s.assessmentPlan.map(p => [p.id, p.category]), [['copm', 'functional'], ['va', 'visual'], ['daily_task', 'functional']]);
        assert.match(Buffer.from(saved.pdf).toString(), /^%PDF-/);
        for (const report of [saved.note, saved.lines.join('\n')]) ordered(report, [en ? 'O: Assessment' : 'O：評估', groups[0], en ? 'Visual acuity' : '視力', groups[1], 'COPM', en ? 'Daily task performance' : '日常作業表現', 'Reading fixture']);
        assert.doesNotMatch(saved.note, /Medical record review|病歷資料/);
        await page.reload(); await ready(); await connect('group-records');
        assert.deepEqual(await page.evaluate(() => sessions[0]), saved.s); assert.deepEqual(await page.evaluate(() => cur()), saved.c);
        await action('open-session').click(); assert.equal(await page.locator('#soapForm img').count(), 0);
        assert.equal(await page.locator('#af-daily_task-1').inputValue(), clinicalText); await discard();
        check(`${locale}: assessment values and category snapshots survive folder save, CSV, reload and language changes; TXT/PDF group only done items and escape clinical text`);

        const workbook = await page.evaluate(() => {
          const wb = buildWorkbook([{ c: cur(), ss: sessions }]);
          const formBook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(formBook, soapFormSheet(cur(), sessions[0]), 'SOAP');
          const read = wb => XLSXReader.read(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          const serial = read(wb), form = read(formBook);
          return { assessments: XLSXReader.utils.sheet_to_json(serial.Sheets.Assessments), plan: XLSXReader.utils.sheet_to_json(serial.Sheets['Data collection plan']),
            headers: ['Assessments', 'Data collection plan'].map(name => XLSXReader.utils.sheet_to_json(serial.Sheets[name], { header: 1 })[0]),
            form: XLSXReader.utils.sheet_to_json(form.Sheets.SOAP, { header: 1 }).flat(),
            formulas: [...Object.values(serial.Sheets), ...Object.values(form.Sheets)].flatMap(ws => Object.values(ws).filter(cell => cell?.f)) };
        });
        assert.deepEqual(workbook.headers[0], ['Client ID', 'Client name', 'Date', 'Session no.', 'Visit', 'Domain', 'Instrument / assessment', 'Measure', 'Value', 'Category']);
        assert.deepEqual(workbook.headers[1], ['Client ID', 'Client name', 'Domain', 'Instrument / assessment', 'Timing', 'Outcomes recorded', 'Enabled', 'Category']);
        assert.deepEqual([...new Set(workbook.assessments.map(r => r.Category))], groups);
        assert.equal(workbook.plan.filter(r => r.Category === groups[0]).length, 18); assert.equal(workbook.plan.filter(r => r.Category === groups[1]).length, 6);
        ordered(workbook.form.join('\n'), [groups[0], en ? 'Visual acuity' : '視力', groups[1], 'COPM', 'Reading fixture']);
        assert.deepEqual(workbook.formulas, []); assert.ok(workbook.form.includes(clinicalText));
        await page.locator('#tab-outcomes').click(); assert.deepEqual(await page.locator('#tabBody > .section-heading h3').allTextContents(), groups);
        const downloadPromise = page.waitForEvent('download'); await page.evaluate(() => exportAll());
        const download = await downloadPromise, backupPath = path.join(output, `${locale}-backup.json`); await download.saveAs(backupPath);
        const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
        assert.deepEqual(backup.clients[0].sessions, [saved.s]);
        const { sessions: backupSessions, ...backupClient } = backup.clients[0]; assert.deepEqual(backupClient, saved.c);
        await connect('group-restored'); await page.locator('#importFile').setInputFiles(backupPath);
        await page.waitForFunction(() => sessions.length === 1 && !savingSession);
        assert.deepEqual(await page.evaluate(() => sessions[0]), saved.s); assert.deepEqual(await page.evaluate(() => cur()), saved.c);
        check(`${locale}: serialized Excel appends translated Category columns without reordering existing columns, SOAP form and outcomes show both groups, and real JSON backup/import preserves exact shapes`);

        await page.locator('#tab-plan').click();
        for (const id of ['va', 'self_report']) {
          await page.locator(`[data-initial="${id}"]`).uncheck();
          await page.waitForFunction(id => !savingItems && cur().plan.find(p => p.id === id).initial === false, id);
        }
        const templateSource = await page.evaluate(() => clone(cur()));
        await action('new-client').click();
        await page.locator('#cf-name').fill('Synthetic copied choices'); await page.locator('#cf-ref').fill('TEST-COPIED-CHOICES');
        await page.locator('#cf-template-source').selectOption(templateSource.id);
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
        assert.notEqual(await page.evaluate(() => curId), templateSource.id);
        assert.deepEqual(await page.evaluate(() => cur().plan), templateSource.plan);
        assert.deepEqual(await page.evaluate(async () => (await store.listClients()).find(c => c.id === curId).plan), templateSource.plan);
        await page.locator('#tab-plan').click();
        assert.equal(await page.locator('#initialPicks input:checked').count(), 22);
        for (const id of ['va', 'self_report']) assert.equal(await page.locator(`[data-initial="${id}"]`).isChecked(), false);
        check(`${locale}: a client created using another client copies all initial choices unchanged, including both exclusions, on screen and disk`);

        await connect('group-no-initial-choice');
        const noChoice = await page.evaluate(async () => {
          const client = { id: 'no_initial_choice', name: 'Synthetic stored template without choices', ref: 'TEST-NO-CHOICE', dob: '', doi: '', dx: '', referral: '', eyeSurgery: null, plan: clone(DEFAULT_PLAN), created: '' };
          await store.saveClient(client);
          return { client, csv: await (await (await groupRoot.getFileHandle('clients.csv')).getFile()).text() };
        });
        await page.reload(); await ready(); await connect('group-no-initial-choice');
        assert.deepEqual(await page.evaluate(() => cur()), noChoice.client);
        assert.ok((await page.evaluate(() => cur().plan)).every(item => !Object.hasOwn(item, 'initial')));
        await page.locator('#tab-plan').click();
        assert.equal(await page.locator('#initialPicks input:checked').count(), 24);
        await action('new-session').click();
        for (const category of ['visual', 'functional']) {
          assert.equal(await page.locator(`#assessPlanned-${category}`).innerText(), en ? 'Initial assessment items' : '初次評估項目');
          assert.deepEqual(await page.locator(`[aria-labelledby="assessPlanned-${category}"] input`).evaluateAll(nodes => nodes.map(n => n.id)),
            await page.locator(`#assess-${category} .pick input`).evaluateAll(nodes => nodes.map(n => n.id)));
        }
        assert.equal(await page.locator('[id^="assessOther-"]').count(), 0);
        await discard();
        assert.equal(await page.evaluate(async () => (await (await groupRoot.getFileHandle('clients.csv')).getFile()).text()), noChoice.csv);
        const defaultRules = await page.evaluate(() => [normalizePlan(null), normalizePlan(['Custom old assessment']), normalizePlan(OLD_DEFAULT_NAMES)]
          .map(plan => plan.every(item => isInitial(item) && !Object.hasOwn(item, 'initial'))));
        assert.deepEqual(defaultRules, [true, true, true]);
        check(`${locale}: stored plans without initial fields stay included and their roster bytes survive loading unchanged; non-array, name-only and old defaults retain inclusion`);

        await connect('group-legacy');
        const legacy = await page.evaluate(async ids => {
          const plan = clone(DEFAULT_PLAN.filter(p => !ids.includes(p.id))); plan.forEach(p => { delete p.category; });
          plan.find(p => p.id === 'npc').initial = false; plan.find(p => p.id === 'func').initial = false;
          plan.push({ id: 'custom_group', name: 'Custom category fixture', timing: 'assessment', fields: ['Result'] }, clone(SOURCE_ASSESSMENTS[0]));
          const client = { id: 'legacy_group', name: 'Synthetic old template', ref: 'TEST-OLD-GROUP', dob: '', doi: '', dx: '', referral: '', eyeSurgery: null, created: '', plan };
          await store.saveClient(client); await finishBoot(); return clone(client);
        }, Object.keys(expected));
        await page.reload(); await ready(); await connect('group-legacy');
        assert.deepEqual(await page.evaluate(() => cur()), legacy);
        await action('new-session').click();
        assert.equal(await page.locator('#assess-functional #ac-copm').count(), 1); assert.equal(await page.locator('#assess-functional #ac-func').count(), 1);
        assert.equal(await page.locator('#assess-visual #ac-custom_group').count(), 1);
        for (const item of legacy.plan.filter(p => !['copm', 'func'].includes(p.id))) assert.equal(await page.locator('#assess-visual #ac-' + item.id).count(), 1);
        for (const [category, id] of [['visual', 'npc'], ['functional', 'func']]) assert.equal(await page.locator(`[aria-labelledby="assessOther-${category}"] #ac-${id}`).count(), 1);
        await page.locator('#languageSelect').selectOption(en ? 'zh-TW' : 'en'); await page.locator('#languageSelect').selectOption(locale);
        assert.deepEqual(await page.evaluate(async () => (await store.listClients())[0]), legacy);
        const validation = await page.evaluate(() => {
          const item = clone(cur().plan[1]);
          return { invalid: ['bad', '', null, 3, {}, []].map(category => { try { validateItems([{ ...item, category }], 'assessment'); return null; } catch (e) { return e.message; } }),
            fallback: ['copm', 'func', 'self_report', 'ot_assessment', 'daily_task', 'participation', 'npc', 'src_va', 'custom'].map(id => assessmentCategory({ id })),
            oldNames: normalizePlan(OLD_DEFAULT_NAMES).map(p => p.id) };
        });
        assert.ok(validation.invalid.every(message => message === (en ? 'Assessment category must be visual function or functional vision.' : '評估分類必須為視覺功能或功能性視覺。')));
        assert.deepEqual(validation.fallback, [...Array(6).fill('functional'), ...Array(3).fill('visual')]);
        assert.equal(validation.oldNames.length, 10); assert.ok(validation.oldNames.every(id => !Object.hasOwn(expected, id)));
        check(`${locale}: old object template loads without rewriting or new items; old name-only default keeps the ten-item battery; fallback categories and both due/other lists hold; invalid categories have translated errors`);

        await action('plan-add').click();
        assert.equal(await page.getByLabel(en ? 'Category' : '分類', { exact: true }).inputValue(), 'visual');
        const seeds = await page.evaluate(() => DEFAULT_PLAN.filter(p => !p.copm).map(p => ({ id: p.id, label: labelText(p.name) })));
        for (const id of Object.keys(expected)) assert.ok((await page.locator('#item-base option').allTextContents()).includes(seeds.find(p => p.id === id).label));
        await page.locator('#item-base').selectOption(String(seeds.findIndex(p => p.id === 'self_report')));
        assert.equal(await page.locator('#item-category').inputValue(), 'functional');
        await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' });
        const added = await page.evaluate(() => cur().plan.at(-1)); assert.equal(added.category, 'functional');
        assert.equal(Object.hasOwn(added, 'initial'), false, 'Items added later from the unchanged standard seeds keep implicit inclusion');
        assert.equal(await page.locator('#assess-functional #ac-' + added.id).isChecked(), true);
        await discard(); await page.locator('#tab-plan').click();
        assert.equal(await page.locator(`[data-initial="${added.id}"]`).isChecked(), true);
        await page.locator('[data-action="item-edit"][data-id="custom_group"]').click();
        await page.locator('#item-category').focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Tab');
        assert.equal(await page.locator('#item-category').inputValue(), 'functional');
        await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' });
        await page.locator('[data-action="item-edit"][data-id="copm"]').click();
        assert.equal(await page.locator('#item-category').inputValue(), 'functional'); assert.equal(await page.locator('#item-category').isDisabled(), true);
        await page.keyboard.press('Escape'); assert.equal(await page.locator('#itemForm').count(), 0);
        await action('new-session').click(); assert.equal(await page.locator('#assess-functional #ac-custom_group').count(), 1);
        assert.equal(await page.locator('#assess-visual #ac-custom_group').count(), 0);
        await discard();
        // No items in one group produces no repeated empty message; an empty battery produces one.
        await page.evaluate(() => { editing = { visit: 'treatment', sym: [], assess: {}, training: {} }; view = 'edit'; cur().plan = []; renderEditor(); });
        assert.equal(await page.locator('#assessList .muted').count(), 1);
        assert.match(await page.locator('#assessList .muted').innerText(), en ? /No assessments/ : /沒有可填寫/);
        await page.evaluate(() => { cur().plan = [clone(DEFAULT_PLAN.find(p => p.id === 'va'))]; renderEditor(); });
        assert.equal(await page.locator('#assess-functional .pick').count(), 0); assert.equal(await page.locator('#assessList .muted').count(), 0);
        check(`${locale}: existing Add assessment dialog offers all new seeds, carries categories and retains the editor draft; keyboard category edit moves custom items; COPM stays functional; empty groups render gracefully`);

        await connect('group-demo'); await action('example').click(); await page.locator('#tab-sessions').click(); await page.waitForSelector('.sess');
        const demo = await page.evaluate(() => ({ plan: cur().plan, baseline: sessions.find(s => s.visit === 'baseline') }));
        const demoInitial = ['copm', 'pursuit', 'fixation', 'saccade', 'npc', 'ufov_divided'];
        assert.deepEqual(demo.plan.filter(item => item.initial === true).map(item => item.id), demoInitial);
        assert.ok(demo.plan.every(item => item.initial === (demo.baseline.assess[item.id]?.done === true)));
        assert.equal(demo.plan.filter(item => item.initial === false).length, 18);
        await page.locator(`[data-action="open-session"][data-id="${demo.baseline.id}"]`).click();
        for (const category of ['visual', 'functional']) {
          assert.equal(await page.locator(`#assessPlanned-${category}`).innerText(), en ? 'Initial assessment items' : '初次評估項目');
          assert.deepEqual(await page.locator(`[aria-labelledby="assessPlanned-${category}"] input`).evaluateAll(nodes => nodes.map(n => n.id)),
            demo.plan.filter(item => demoInitial.includes(item.id) && (category === 'functional') === (item.id === 'copm')).map(item => 'ac-' + item.id));
        }
        await discard(); await page.locator('#tab-plan').click();
        assert.equal(await page.locator('#initialPicks input:checked').count(), 6);
        check(`${locale}: demo initial battery exactly matches its six completed baseline assessments; the other 18 items are explicitly excluded and both baseline initial groups remain visible`);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
