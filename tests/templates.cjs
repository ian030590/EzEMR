const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const evidence = [];
const check = name => { evidence.push(name); console.log('PASS: ' + name); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(path.join(root, 'EzEMR.html'), 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark', reducedMotion: 'reduce', acceptDownloads: true });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const menuAction = async (menu, name) => { await page.locator(`#${menu}MenuButton`).click(); await action(name).click(); };
  const ready = p => p.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  const saveItem = async () => { await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' }); };
  const addField = async (label, type) => {
    await page.locator('[data-item-action="add"]').click();
    const i = await page.locator('.field-editor').count() - 1;
    await page.locator(`#item-field-${i}-label`).fill(label);
    await page.locator(`#item-field-${i}-type`).selectOption(type);
    return i;
  };
  try {
    await page.goto(url); await ready(page);
    assert.equal(await page.locator('#themeToggle').getAttribute('aria-checked'), 'true');
    await menuAction('view', 'toggle-theme');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.reload(); await ready(page);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    assert.match(await page.locator('#themeToggle').innerText(), /深色/);
    await menuAction('view', 'toggle-theme'); await page.reload(); await ready(page);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.emulateMedia({ colorScheme: 'light' });
    assert.equal(await page.locator('#themeToggle').getAttribute('aria-checked'), 'true');
    await menuAction('view', 'toggle-theme');
    check('Theme follows the system initially; explicit choices override it and survive reload before folder connection');

    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory();
      window.testRoot = await disk.getDirectoryHandle('template-records', { create: true });
      store = folderStore(testRoot); await finishBoot();
    });
    await action('new-client').click();
    await page.locator('#cf-name').fill('模板測試個案'); await page.locator('#cf-ref').fill('TEST-TEMPLATES');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
    await action('new-session').click();
    const symptomHeaders = () => page.locator('#symWrap thead th').allTextContents().then(labels => labels.slice(1, 6));
    assert.deepEqual(await symptomHeaders(), ['眼睛疲勞', '視線模糊', '頭暈', '頭痛', '噁心']);
    await page.locator('#languageSelect').selectOption('en');
    assert.deepEqual(await symptomHeaders(), ['Eye fatigue', 'Blurred vision', 'Dizziness', 'Headache', 'Nausea']);
    await page.locator('#languageSelect').selectOption('zh-TW');
    assert.match(await page.locator('#main').innerText(), /電腦眼球運動訓練/);
    await page.locator('#s-subj').fill('尚未儲存的主訴，含中文與 "引號"。');
    await page.locator('#symWrap input.num').first().fill('0');
    await menuAction('view', 'toggle-theme');
    assert.match(await page.locator('#s-subj').inputValue(), /尚未儲存/);
    check('Symptom headings follow the selected language; theme switches retain an unfinished SOAP draft');

    await action('plan-add').click();
    await page.locator('#item-name').fill('自訂工作評估'); await page.locator('#item-domain').fill('工作功能');
    await page.locator('#item-timing').selectOption('session');
    await page.locator('#item-field-0-label').fill('正確率');
    await page.locator('#item-field-0-type').selectOption('number');
    await page.locator('#item-field-0-unit').fill('%');
    await page.locator('#item-field-0-min').fill('80'); await page.locator('#item-field-0-max').fill('20');
    await page.locator('#itemForm [type="submit"]').click();
    assert.match(await page.locator('#item-error').innerText(), /最小值不可大於最大值/);
    assert.equal(await page.evaluate(() => cur().plan.some(p => p.name === '自訂工作評估')), false);
    await page.locator('#item-field-0-min').fill('0'); await page.locator('#item-field-0-max').fill('100');
    await page.locator('#item-field-0-step').fill('0.5');
    await addField('作業內容', 'text'); await addField('觀察詳細', 'textarea');
    await addField('協助程度', 'select'); await page.locator('#item-field-3-options').fill('獨立\n口語提示\n肢體協助');
    await saveItem();
    const assessment = await page.evaluate(() => cur().plan.find(p => p.name === '自訂工作評估'));
    assert.equal(await page.locator('#ac-' + assessment.id).isChecked(), true);
    assert.match(await page.locator('#s-subj').inputValue(), /尚未儲存/);
    assert.equal(await page.locator('#symWrap input.num').first().inputValue(), '0');
    await page.locator(`#af-${assessment.id}-0`).fill('0');
    await page.locator(`#af-${assessment.id}-0`).fill('101');
    await action('save-session').click();
    assert.equal(await page.evaluate(() => sessions.length), 0);
    assert.equal(await page.locator(`#af-${assessment.id}-0`).evaluate(el => el.validity.rangeOverflow), true);
    await page.locator('#ac-' + assessment.id).uncheck();
    assert.equal(await page.locator(`#af-${assessment.id}-0`).isDisabled(), true);
    await page.locator('#ac-' + assessment.id).check();
    assert.equal(await page.locator(`#af-${assessment.id}-0`).inputValue(), '101');
    await page.locator(`#af-${assessment.id}-0`).fill('0');
    await page.locator(`#af-${assessment.id}-1`).fill('閱讀報告，包含 "資料"');
    await page.locator(`#af-${assessment.id}-2`).fill('第一行觀察\n第二行觀察');
    await page.locator(`#af-${assessment.id}-3`).selectOption('口語提示');
    check('Add an assessment from an unfinished note with four field types, units, range validation and preserved draft');

    await action('training-add').click();
    await page.locator('#item-base').selectOption('1');
    assert.equal(await page.locator('#item-name').inputValue(), '周邊覺察');
    assert.match(await page.locator('#item-acts').inputValue(), /周邊燈板/);
    await page.locator('#item-name').fill('自訂周邊訓練'); await page.locator('#item-acts').fill('中央目標辨識\n周邊按鍵反應');
    await addField('次數', 'number'); await page.locator('#item-field-0-min').fill('0');
    await page.locator('#item-field-0-max').fill('99'); await page.locator('#item-field-0-step').fill('1');
    await addField('視覺範圍', 'select'); await page.locator('#item-field-1-options').fill('中央\n周邊');
    await page.evaluate(() => { window.originalSaveClient = store.saveClient; store.saveClient = async () => { throw new Error('模擬磁碟寫入失敗'); }; });
    await page.locator('#itemForm [type="submit"]').click();
    assert.match(await page.locator('#item-error').innerText(), /模擬磁碟寫入失敗/);
    assert.equal(await page.evaluate(() => trainingPlan(cur()).some(t => t.label === '自訂周邊訓練')), false);
    assert.equal(await page.locator('#item-name').inputValue(), '自訂周邊訓練');
    await page.evaluate(() => { store.saveClient = originalSaveClient; }); await saveItem();
    const training = await page.evaluate(() => trainingPlan(cur()).find(t => t.label === '自訂周邊訓練'));
    await page.locator(`#tx-${training.k}-a0`).check();
    await page.locator(`#tx-${training.k}-program`).fill('<設備名稱>');
    await page.locator(`#tx-${training.k}-dur`).fill('0');
    await page.locator(`#tx-${training.k}-diff`).fill('0');
    await page.locator(`#tf-${training.k}-0`).fill('0'); await page.locator(`#tf-${training.k}-1`).selectOption('中央');
    await action('save-session').click(); await page.waitForSelector('.sess');
    const original = await page.evaluate(async () => {
      const session = (await store.listSessions(curId))[0];
      return { client: clone(cur()), session, note: noteText(cur(), session), csv: sessionCSV(cur(), session), restored: readRecordCSV(sessionCSV(cur(), session)) };
    });
    assert.equal(original.session.assess[assessment.id].values[assessment.fields[0].id], 0);
    assert.equal(original.session.training[training.k].values[training.fields[0].id], 0);
    assert.equal(original.session.training[training.k].dur, 0); assert.equal(original.session.training[training.k].diff, 0);
    assert.deepEqual(original.restored, { client: original.client, session: original.session });
    assert.match(original.note, /正確率（%）：0/); assert.match(original.note, /次數：0/); assert.match(original.note, /第一行觀察\n第二行觀察/);
    await fs.writeFile(path.join(output, 'custom-template.csv'), original.csv);
    check('Clone a rehabilitation template; failed saves retain the form; numeric zero, selections and multiline results survive disk and CSV round trips');

    await page.locator('#tab-outcomes').click();
    assert.match(await page.locator('#tabBody').innerText(), /自訂工作評估/);
    assert.match(await page.locator('#tabBody').innerText(), /自訂周邊訓練/);
    await page.locator('#tab-plan').click();
    await page.locator(`[data-action="item-edit"][data-id="${assessment.id}"]`).click();
    await page.locator('#item-name').fill('改名後評估'); await page.locator('#item-field-0-label').fill('新的量測名稱');
    await page.locator('[data-item-action="remove"][data-i="1"]').click(); await saveItem();
    await page.locator(`[data-action="item-edit"][data-id="${training.k}"]`).click();
    await page.locator('#item-name').fill('改名後訓練'); await page.locator('[data-item-action="remove"][data-i="0"]').click(); await saveItem();
    await page.locator(`[data-action="item-toggle"][data-id="${training.k}"]`).click();
    await page.waitForFunction(k => trainingPlan(cur()).find(t => t.k === k).active === false, training.k);
    assert.equal(await page.evaluate(k => trainingPlan(cur()).find(t => t.k === k).active, training.k), false);
    assert.equal(await page.evaluate(() => noteText(cur(), sessions[0])), original.note);
    await page.locator('#tab-outcomes').click();
    assert.match(await page.locator('#tabBody').innerText(), /自訂工作評估/);
    assert.match(await page.locator('#tabBody').innerText(), /作業內容/);
    assert.match(await page.locator('#tabBody').innerText(), /自訂周邊訓練/);
    await page.locator('#tab-sessions').click(); await action('open-session').click();
    assert.equal(await page.locator(`#af-${assessment.id}-1`).inputValue(), '閱讀報告，包含 "資料"');
    assert.equal(await page.locator(`#tf-${training.k}-0`).inputValue(), '0');
    await action('cancel-edit').click(); await action('new-session').click();
    assert.match(await page.locator('#assessList').innerText(), /改名後評估/);
    assert.equal(await page.locator('#tx-' + training.k).count(), 0);
    await action('cancel-edit').click();
    check('Rename, remove fields and disable templates without changing historical notes; new sessions use current settings');

    await page.reload(); await ready(page);
    await page.evaluate(async () => { const disk = await navigator.storage.getDirectory(); testRoot = await disk.getDirectoryHandle('template-records'); store = folderStore(testRoot); await finishBoot(); });
    assert.equal(await page.evaluate(() => noteText(cur(), sessions[0])), original.note);
    await page.locator('#tab-plan').click();
    await page.locator(`[data-action="item-toggle"][data-id="${training.k}"]`).click();
    await page.waitForFunction(k => trainingPlan(cur()).find(t => t.k === k).active === true, training.k);
    assert.equal(await page.evaluate(k => trainingPlan(cur()).find(t => t.k === k).active, training.k), true);
    await page.locator(`[data-action="item-copy"][data-id="${assessment.id}"]`).click(); await saveItem();
    assert.equal(await page.evaluate(() => cur().plan.filter(p => p.name === '改名後評估（副本）').length), 1);
    check('Template settings, disabled state and historical snapshots survive a page reload; duplicates get independent identifiers');

    await page.route('https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js', route => route.fulfill({ path: process.env.XLSX_SCRIPT || path.join(root, '.tmp', 'xlsx.bundle.js'), contentType: 'application/javascript' }));
    await menuAction('export', 'xlsx-client');
    await page.waitForFunction(() => document.querySelector('.toast')?.textContent.includes('.xlsx'));
    const exports = await page.evaluate(async () => {
      const dir = await testRoot.getDirectoryHandle(cur().ref);
      const names = await fileNames(dir), name = names.find(n => n.endsWith('_records_' + today() + '.xlsx'));
      const bytes = await (await (await dir.getFileHandle(name)).getFile()).arrayBuffer();
      const workbook = XLSX.read(bytes, { type: 'array' });
      const table = sheet => XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
      const form = soapFormSheet(cur(), sessions[0]);
      const formRows = XLSX.utils.sheet_to_json(form, { header: 1 });
      return { assessments: table('Assessments'), training: table('Training results'), notes: table('SOAP notes'), formRows };
    });
    assert.ok(exports.assessments.some(row => row.Measure === '正確率（%）' && row.Value === 0));
    assert.ok(exports.training.some(row => row.Measure === '次數' && row.Value === 0));
    assert.ok(exports.notes.some(row => row['O – Objective'].includes('自訂周邊訓練')));
    assert.ok(exports.formRows.some(row => row[0] === '正確率（%）' && row[4] === 0));
    assert.ok(exports.formRows.some(row => row[0] === '次數' && row[1] === 0));
    const backupEvent = page.waitForEvent('download'); await menuAction('export', 'export-all');
    const backupDownload = await backupEvent; const backupPath = path.join(output, 'template-backup.json'); await backupDownload.saveAs(backupPath);
    const backup = await fs.readFile(backupPath);
    check('Excel workbook, SOAP form and JSON backup retain custom results with readable labels and numeric zero after template edits');

    const restoredContext = await browser.newContext({ acceptDownloads: true });
    await restoredContext.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    const restoredPage = await restoredContext.newPage();
    restoredPage.on('pageerror', error => errors.push(error.message));
    await restoredPage.addInitScript(() => { Object.defineProperty(window, 'showDirectoryPicker', { value: undefined }); });
    await restoredPage.goto(url); await ready(restoredPage);
    await restoredPage.locator('#importFile').setInputFiles({ name: 'custom.csv', mimeType: 'text/csv', buffer: Buffer.from(original.csv) });
    await restoredPage.waitForSelector('.client-summary');
    assert.equal(await restoredPage.evaluate(() => noteText(cur(), sessions[0])), original.note);
    await restoredPage.locator('#importFile').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup });
    await restoredPage.waitForFunction(() => cur()?.plan.some(p => p.name === '改名後評估'));
    assert.equal(await restoredPage.evaluate(() => noteText(cur(), sessions[0])), original.note);
    await restoredPage.reload(); await restoredPage.waitForSelector('.client-summary');
    assert.equal(await restoredPage.evaluate(() => noteText(cur(), sessions[0])), original.note);
    await restoredContext.close();
    check('CSV import and JSON restore recover templates and results in a fresh browser store and survive reload');

    const sourceClient = await page.evaluate(() => clone(cur()));
    await menuAction('client', 'new-client'); await page.locator('#cf-name').fill('複用模板個案'); await page.locator('#cf-ref').fill('TEST-REUSE');
    await page.locator('#cf-template-source').selectOption(sourceClient.id); await page.locator('#cForm [type="submit"]').click();
    // The selected ID changes before its records finish loading and the roster renders.
    await page.waitForFunction(() => cur()?.ref === 'TEST-REUSE' && document.querySelector('.client-btn[aria-current="true"]')?.dataset.id === curId);
    const reused = await page.evaluate(() => ({ client: clone(cur()), count: sessions.length }));
    assert.deepEqual(reused.client.plan, sourceClient.plan); assert.deepEqual(reused.client.trainingPlan, sourceClient.trainingPlan); assert.equal(reused.count, 0);
    check('A new client can reuse another client’s assessment and rehabilitation definitions without copying clinical results');

    const legacyBefore = await page.evaluate(async () => {
      // A client created before the OcuTrain items, still carrying the earlier saccade task definition.
      const oldSaccade = { id: 'sacc', domain: 'Saccadic control', name: 'Eye tracker – structured saccade task (computer based)', timing: 'assessment', fields: ['Gaze-shift latency (ms)', 'Accuracy (%)', 'Task errors (n)'] };
      const client = { id: 'legacy-templates', name: '舊版模板測試', ref: 'TEST-LEGACY-TEMPLATES', plan: [...clone(DEFAULT_PLAN), oldSaccade] };
      const session = { id: 'legacy-note', date: '2026-10-30', num: 1, visit: 'assessment', sym: [], assess: { sacc: { done: true, values: { 'Accuracy (%)': '87', 'Task errors (n)': '0' } } }, training: { ocular: { on: true, acts: ['Smooth pursuit tracking'], dur: 5 } } };
      await store.saveClient(client); await store.saveSession(client.id, session);
      await loadClients(); curId = client.id; await loadSessions(); view = 'plan'; renderClients(); renderMain();
      return noteText(cur(), sessions[0]);
    });
    await page.locator('[data-action="item-edit"][data-id="sacc"]').click();
    assert.equal(await page.locator('#item-field-1-label').inputValue(), '正確率（%）');
    await page.locator('#item-name').fill('舊項目已重新命名');
    await page.locator('[data-item-action="remove"][data-i="1"]').click(); await saveItem();
    await page.locator('[data-action="item-toggle"][data-id="ocular"]').click();
    await page.waitForFunction(() => trainingPlan(cur()).find(t => t.k === 'ocular').active === false);
    assert.equal(await page.evaluate(() => noteText(cur(), sessions[0])), legacyBefore);
    await page.evaluate(async () => { store = folderStore(testRoot); await finishBoot(); curId = 'legacy-templates'; await loadSessions(); view = 'plan'; renderMain(); });
    assert.equal(await page.evaluate(() => noteText(cur(), sessions[0])), legacyBefore);
    check('Pre-update records without snapshots retain original labels and results after editing standard templates and reopening disk storage');

    const rejected = await page.evaluate(() => {
      const attempts = [
        c => { c.plan[0].timing = '__proto__'; },
        c => { c.plan[1].fields = [{ id: 'field1', label: '測試', type: 'select', options: [] }]; },
        c => { c.trainingPlan = [{ k: '__proto__', label: '錯誤識別碼', acts: [] }]; }
      ];
      return attempts.map(change => { const c = clone(cur()), s = clone(sessions[0]); change(c); try { readRecordCSV(sessionCSV(c, s)); return false; } catch (_) { return true; } });
    });
    assert.deepEqual(rejected, [true, true, true]);
    check('CSV restore rejects malformed template timing, empty select definitions and unsafe item identifiers');

    for (const theme of ['light', 'dark']) {
      if (await page.locator('html').getAttribute('data-theme') !== theme) await menuAction('view', 'toggle-theme');
      for (const width of [360, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.locator('#tab-plan').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${theme} ${width} settings overflow`);
        await action('training-add').click(); await page.locator('#item-base').selectOption('0');
        await addField('測試可讀性與欄位設定', 'number');
        assert.equal(await page.evaluate(() => { const m = document.querySelector('.modal'); return m.scrollWidth <= m.clientWidth && document.documentElement.scrollWidth <= innerWidth; }), true, `${theme} ${width} dialog overflow`);
        if (width === 360 || width === 1280) {
          await page.evaluate(() => document.querySelectorAll('.toast').forEach(toast => toast.remove()));
          await page.screenshot({ path: path.join(output, `templates-${theme}-${width}.png`) });
        }
        await page.locator('#itemForm [type="submit"]').focus(); await page.keyboard.press('Tab');
        assert.equal(await page.locator('#item-base').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Shift+Tab'); assert.equal(await page.locator('#itemForm [type="submit"]').evaluate(el => el === document.activeElement), true);
        await page.keyboard.press('Escape'); assert.equal(await page.locator('#itemForm').count(), 0);
      }
    }
    check('Light and dark template settings/dialogs fit 360, 768 and 1280 px; Tab focus stays in the dialog and Escape restores the page');

    const blockedContext = await browser.newContext({ colorScheme: 'dark' });
    await blockedContext.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    const blockedPage = await blockedContext.newPage();
    blockedPage.on('pageerror', error => errors.push(error.message));
    await blockedPage.addInitScript(() => { Storage.prototype.getItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
    await blockedPage.goto(url); await ready(blockedPage);
    await blockedPage.locator('#viewMenuButton').click(); await blockedPage.locator('#themeToggle').click();
    assert.equal(await blockedPage.locator('html').getAttribute('data-theme'), 'light');
    assert.match(await blockedPage.locator('.toast').innerText(), /無法記住設定/);
    await blockedContext.close();
    check('Theme switching remains usable when browser storage is blocked, with a Chinese persistence notice');
    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'template-results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
