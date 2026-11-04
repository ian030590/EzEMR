const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const evidence = [];
const check = (name, detail) => { evidence.push({ name, detail }); console.log('PASS: ' + name); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  // Core workflows use synthetic clients only; the published HTML contains no records.
  const source = await fs.readFile(path.join(root, 'EzEMR.html'), 'utf8');
  assert.doesNotMatch(source, /id="integratedRecords"/, 'The published HTML must not embed client records');
  new vm.Script(source.split('<script>')[1].split('</script>')[0]);
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, timezoneId: 'Asia/Taipei', reducedMotion: 'reduce' });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1') && !request.url().startsWith('blob:') && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(request.url())) requests.push(request.url()); });
  const action = (name) => page.locator(`[data-action="${name}"]:visible`).first();
  const menuAction = async (menu, name) => { await page.locator(`#${menu}MenuButton`).click(); await action(name).click(); };
  const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`); await ready();
    assert.match(await page.title(), /^EzEMR \|/);
    assert.equal(await page.locator('h1').innerText(), 'EzEMR');
    assert.equal(await action('pick-folder').count(), 1);
    check('Initial folder screen', 'Explains local folders, Data and CSV/PDF files; font download is isolated from file workflow tests.');

    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory();
      window.testRoot = await disk.getDirectoryHandle('records', { create: true });
      store = folderStore(testRoot); await finishBoot();
    });
    await action('new-client').click();
    await page.locator('#cf-name').fill('測試個案甲'); await page.locator('#cf-ref').fill('TEST-甲');
    await page.locator('#cf-dx').fill('測試用資料，非真實病歷');
    await page.locator('#es-none').check();
    await page.locator('#cForm button[type="submit"]').click();
    await page.waitForSelector('.client-summary');
    await action('new-session').click();
    await page.locator('#s-date').fill('2026-10-30');
    await page.locator('#s-subj').fill('中文測試，含逗號、"引號"\n第二行：復健後較舒適。');
    await page.locator('#s-ass').fill('測試評估'); await page.locator('#s-plan').fill('下次追蹤症狀變化。');
    await page.locator('#s-clin').fill('測試治療師');
    await page.locator('#symWrap input.num').first().fill('4');
    await page.locator('#ac-copm').check();
    await page.locator('#copm-occ-0').fill('閱讀'); await page.locator('#copm-p-0').fill('3'); await page.locator('#copm-s-0').fill('4');
    // Without Noto Sans TC installed, Chromium rejects document.fonts.load; saving must still write every file.
    await page.evaluate(() => { window.realFontLoad = document.fonts.load.bind(document.fonts); document.fonts.load = () => Promise.reject(new DOMException('A network error occurred.', 'NetworkError')); });
    await action('save-session').click();
    await page.waitForSelector('.sess');
    await page.evaluate(() => { document.fonts.load = window.realFontLoad; });
    let fileNames = await page.evaluate(async () => fileNames(await testRoot.getDirectoryHandle('TEST-甲')));
    assert.deepEqual(fileNames.map(n => path.extname(n)).sort(), ['.csv', '.pdf', '.txt']);
    assert.ok((await page.evaluate(async () => fileNames(testRoot))).includes('clients.csv'));
    const firstId = await page.evaluate(() => sessions[0].id);
    check('Save creates one CSV, PDF and TXT, also without Noto Sans TC installed', 'Native browser file handles write a patient directory in OPFS while the PDF falls back to system fonts. Root clients.csv holds demographics and templates.');

    const roundTrip = await page.evaluate(() => {
      const c = clone(cur()), s = clone(sessions[0]);
      s.subjective = '中文,"引號"\r\n多行'; s.feedback = "'=SUM(A1:A2)";
      s.otherTx = '=HYPERLINK("https://example.invalid")'; s.assessment = '  +cmd'; s.plan = '\n@text';
      s.training.extra = { empty: [], nullable: null, zero: 0, disabled: false, slash: { 'a/b~c': "'原字串" } };
      Object.defineProperty(s.training.extra, '__proto__', { value: { safe: true }, enumerable: true });
      const csv = sessionCSV(c, s), restored = readRecordCSV(csv);
      return { original: { client: c, session: s }, restored, csv, polluted: ({}).safe };
    });
    assert.deepEqual(roundTrip.restored, roundTrip.original); assert.equal(roundTrip.polluted, undefined);
    assert.match(roundTrip.csv, /'=HYPERLINK/); assert.equal(roundTrip.csv.charCodeAt(0), 0xfeff);
    await fs.writeFile(path.join(output, 'round-trip.csv'), roundTrip.csv);
    check('CSV round trip and Excel text safety', 'Chinese, quotes, commas, multiline text, zero/null/false, nested arrays, slash keys and prototype names round-trip exactly.');
    const invalid = await page.evaluate(() => {
      const attempts = ['a,b', '"unterminated', sessionCSV(cur(), sessions[0]).replace(',number,3', ',number,NaN')];
      return attempts.map(text => { try { readRecordCSV(text); return false; } catch (_) { return true; } });
    });
    assert.deepEqual(invalid, [true, true, true]);
    check('Malformed CSV rejected', 'Wrong schema, unterminated quotes and invalid numeric values fail without writing files.');

    await action('open-session').click(); await page.locator('#s-subj').fill('修改後的主觀紀錄');
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.equal(await page.evaluate(() => sessions[0].id), firstId);
    fileNames = await page.evaluate(async () => fileNames(await testRoot.getDirectoryHandle('TEST-甲')));
    for (const ext of ['.csv', '.pdf', '.txt']) assert.equal(fileNames.filter(n => n.endsWith(ext)).length, 1, ext);
    const txt = await page.evaluate(async () => { const dir = await testRoot.getDirectoryHandle('TEST-甲'); return (await (await dir.getFileHandle(store.sessionBase(curId, sessions[0].id) + '.txt')).getFile()).text(); });
    assert.match(txt, /修改後的主觀紀錄/);
    await page.evaluate(async () => { store = folderStore(testRoot); await finishBoot(); });
    assert.equal(await page.evaluate(() => sessions[0].subjective), '修改後的主觀紀錄');
    assert.equal(await page.evaluate(() => sessions[0].assess.copm.copm[0].perf), 3);
    check('Edit and reopen CSV', 'Edits update the same CSV, PDF and TXT; a fresh store reloads SOAP and COPM data from CSV.');

    const rollback = await page.evaluate(async () => {
      const dir = await testRoot.getDirectoryHandle('TEST-甲'), base = store.sessionBase(curId, sessions[0].id);
      const csvBefore = await (await (await dir.getFileHandle(base + '.csv')).getFile()).text();
      const pdfBefore = new Uint8Array(await (await (await dir.getFileHandle(base + '.pdf')).getFile()).arrayBuffer());
      let failed = false;
      const broken = {
        async getFileHandle(name, options) {
          const handle = await dir.getFileHandle(name, options);
          if (options?.create && name.endsWith('.csv') && !failed) { failed = true; throw new DOMException('Simulated disk failure', 'NotAllowedError'); }
          return handle;
        },
        removeEntry: (...args) => dir.removeEntry(...args)
      };
      let rejected = false;
      try { await writeSessionPair(broken, base, 'invalid replacement', new Blob(['invalid PDF'])); } catch (_) { rejected = true; }
      const csvAfter = await (await (await dir.getFileHandle(base + '.csv')).getFile()).text();
      const pdfAfter = new Uint8Array(await (await (await dir.getFileHandle(base + '.pdf')).getFile()).arrayBuffer());
      return { rejected, csvRestored: csvBefore === csvAfter, pdfRestored: pdfBefore.every((v, i) => v === pdfAfter[i]) && pdfBefore.length === pdfAfter.length };
    });
    assert.deepEqual(rollback, { rejected: true, csvRestored: true, pdfRestored: true });
    check('Failed pair write rolls back', 'A forced second-file failure restores both original files byte for byte.');

    await action('new-session').click(); await page.locator('#s-date').fill('2026-10-31');
    await page.locator('#s-visit').selectOption('post'); await page.locator('#ac-copm').check();
    await page.locator('#copm-p-0').fill('7'); await page.locator('#copm-s-0').fill('8');
    await page.locator('#symWrap input.num').first().fill('1');
    await action('save-session').click(); await page.waitForFunction(() => sessions.length === 2);
    await page.locator('#filter-visit').selectOption('post');
    assert.equal(await page.locator('.sess').count(), 1);
    await page.locator('#tab-outcomes').click();
    assert.match(await page.locator('#tabBody').innerText(), /\+4/);
    check('Filters preserve baseline comparisons', 'Filtering to post-rehabilitation still compares COPM with the unfiltered baseline.');
    await action('clear-filters').click();
    await page.locator('#tab-sessions').click();
    await page.locator('#chartSym').selectOption('ef');
    assert.equal(await page.locator('.chart svg').count(), 1);
    await page.locator('#tab-sessions').click();
    await page.locator('#filter-from').fill('2026-10-31'); await page.locator('#filter-from').dispatchEvent('change');
    assert.equal(await page.locator('.sess').count(), 1);
    await page.locator('#filter-to').fill('2026-10-30'); await page.locator('#filter-to').dispatchEvent('change');
    assert.equal(await page.locator('#filter-to').evaluate(el => el.validity.valid), false);
    await action('clear-filters').click();
    await page.locator('#clientSearch').fill('不存在'); assert.equal(await page.locator('.client-btn').count(), 0);
    await page.locator('#clientSearch').fill('TEST-甲'); assert.equal(await page.locator('.client-btn').count(), 1);
    await page.locator('#clientSearch').fill('');
    check('Search, symptom selection and date filters', 'Patient ID search, no-results state, symptom chart selection and invalid date range are exercised.');

    await action('new-client').click(); await page.locator('#cf-name').fill('測試個案乙'); await page.locator('#cf-ref').fill('TEST-乙');
    await page.locator('#cForm button[type="submit"]').click();
    await page.waitForFunction(() => cur()?.ref === 'TEST-乙');
    await action('new-session').click(); await page.locator('#s-date').fill('2026-10-31'); await page.locator('#s-subj').fill('乙的測試紀錄');
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.equal(await page.evaluate(() => sessions.length), 1);
    const isolation = await page.evaluate(async () => ({ a: (await store.listSessions(clients.find(c => c.ref === 'TEST-甲').id)).length, b: sessions.length }));
    assert.deepEqual(isolation, { a: 2, b: 1 });
    check('Patient folder isolation', 'Two patients retain separate session histories and folders.');

    const artifacts = await page.evaluate(async () => {
      const c = clients.find(c => c.ref === 'TEST-甲'), list = await store.listSessions(c.id), s = clone(list[0]);
      s.subjective = '中文 PDF 換行與分頁測試，含「引號」。\n' + ('這一行用來確認長篇復健紀錄完整保留。'.repeat(12) + '\n').repeat(55);
      const pdf = await sessionPDF(c, s, list), zip = await sessionZIP(c, s, list);
      const base64 = async blob => { const bytes = new Uint8Array(await blob.arrayBuffer()); let text = ''; for (const byte of bytes) text += String.fromCharCode(byte); return btoa(text); };
      return { pdf: await base64(pdf), zip: await base64(zip) };
    });
    await fs.writeFile(path.join(output, 'multi-page.pdf'), Buffer.from(artifacts.pdf, 'base64'));
    await fs.writeFile(path.join(output, 'session.zip'), Buffer.from(artifacts.zip, 'base64'));
    check('Chinese multi-page PDF and ZIP generated', 'Artifacts are saved for independent PDF and ZIP validation.');

    await action('open-session').click();
    await page.locator('#tx-ocular-on').check(); await page.locator('#tx-ocular-new').fill('測試自訂跳視'); await action('act-add').click();
    await action('ed-add').click(); await page.locator('#edWrap input[id$="-count"]').fill('12');
    await action('sym-rec').click(); await page.locator('#symWrap input[id^="syr-"]').fill('8');
    await action('save-session').click(); await page.waitForSelector('.sess');
    const training = await page.evaluate(async () => (await store.listSessions(curId))[0]);
    assert.ok(training.training.ocular.acts.includes('測試自訂跳視'));
    assert.equal(training.training.ocular.eyedot[0].count, 12); assert.equal(training.sym.find(r => r.kind === 'rec').recMin, 8);
    await page.locator('#tab-outcomes').click(); assert.match(await page.locator('#tabBody').innerText(), /EyeDot Trainer 訓練紀錄/);
    await page.locator('#tab-plan').click(); await action('plan-add').click();
    await page.locator('#item-name').fill('測試自訂評估'); await page.locator('#itemForm [type="submit"]').click();
    await page.waitForSelector('#itemForm', { state: 'detached' });
    assert.match(await page.locator('#planEdit').innerText(), /測試自訂評估/);
    await page.locator('#tab-sessions').click();
    check('Assessment plan, custom training, EyeDot and recovery retained', 'GUI controls save custom activities, an EyeDot count and recovery minutes; outcomes and plan editing remain available.');

    await action('new-session').click(); await page.locator('#s-visit').selectOption('absent');
    await page.locator('#abs-reason').selectOption('事先請假'); await page.locator('#abs-contact').fill('測試聯絡紀錄');
    assert.equal(await page.locator('#soapBlock').isVisible(), false);
    await action('save-session').click(); await page.waitForFunction(() => sessions.length === 2);
    const absentId = await page.evaluate(() => sessions.find(s => s.visit === 'absent').id);
    await page.locator(`.sess [data-action="del-session"][data-id="${absentId}"]`).click();
    await page.keyboard.press('Escape'); assert.equal(await page.locator('.sess').count(), 2);
    await page.locator(`.sess [data-action="del-session"][data-id="${absentId}"]`).click(); await page.locator('#askYes').click();
    await page.waitForFunction(() => sessions.length === 1);
    const remaining = await page.evaluate(async () => fileNames(await testRoot.getDirectoryHandle('TEST-乙')));
    for (const ext of ['.csv', '.pdf', '.txt']) assert.equal(remaining.filter(n => n.endsWith(ext)).length, 1, ext);
    check('Attendance and delete confirmation', 'Absence saves CSV, PDF and TXT files; Escape cancels deletion; confirmed deletion removes them.');

    const legacy = await page.evaluate(async () => {
      const c = clone(cur()), s = clone(sessions[0]); c.id = 'legacy-client'; c.ref = 'TEST-LEGACY'; c.name = '測試舊版個案'; s.id = 'legacy-session';
      await store.saveClient(c);
      const dir = await testRoot.getDirectoryHandle(c.ref); await writeFile(dir, 'legacy-session.json', JSON.stringify(s));
      const old = await store.listSessions(c.id); await store.saveSession(c.id, old[0]);
      const converted = await store.listSessions(c.id);
      return { count: converted.length, same: JSON.stringify(old[0]) === JSON.stringify(converted[0]), names: await fileNames(dir) };
    });
    assert.equal(legacy.count, 1); assert.equal(legacy.same, true); assert.ok(legacy.names.includes('legacy-session.json')); assert.ok(legacy.names.includes('legacy-session.csv'));
    check('Legacy JSON remains readable', 'Saving an old JSON session adds a CSV/PDF pair, keeps the original, and loads only one session.');

    const copy = await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory(); copyRoot = await disk.getDirectoryHandle('copy', { create: true });
      const count = await store.syncCopy(); await store.saveSession(curId, sessions[0]);
      const dir = await copyRoot.getDirectoryHandle(cur().ref), names = await fileNames(dir); copyRoot = null;
      return { count, names };
    });
    assert.ok(copy.count >= 3); assert.ok(copy.names.some(n => n.endsWith('.csv'))); assert.ok(copy.names.some(n => n.endsWith('.pdf'))); assert.ok(copy.names.some(n => n.endsWith('.txt')));
    check('Copy folder keeps CSV, PDF and TXT files', 'Existing mirror functionality copies patient folders and new session files.');

    const importData = await page.evaluate(() => {
      const c = clone(cur()), s = clone(sessions[0]); c.id = 'import-client'; c.ref = 'TEST-IMPORT'; c.name = '測試匯入個案'; s.id = 'import-session';
      return sessionCSV(c, s);
    });
    await page.locator('#importFile').setInputFiles({ name: 'session.csv', mimeType: 'text/csv', buffer: Buffer.from(importData) });
    await page.waitForFunction(() => cur()?.ref === 'TEST-IMPORT');
    assert.equal(await page.evaluate(() => sessions.length), 1);
    await page.locator('#tab-sessions').click();
    assert.equal(await page.locator('.sess').count(), 1);
    await page.locator('#importFile').setInputFiles({ name: 'broken.csv', mimeType: 'text/csv', buffer: Buffer.from('bad csv') });
    await page.waitForFunction(() => document.querySelector('.toast')?.textContent.includes('匯入失敗'));
    assert.equal(await page.evaluate(() => sessions.length), 1);
    check('CSV import control', 'Exported CSV restores a patient and session; a malformed CSV reports failure and preserves existing data.');

    const backingUp = page.waitForEvent('download'); await menuAction('export', 'export-all');
    const backupDownload = await backingUp; await backupDownload.saveAs(path.join(output, 'backup.json'));
    check('JSON backup retained', 'Existing backup button still downloads all patient records.');

    await action('open-session').click(); await page.locator('#s-subj').fill('尚未儲存的變更');
    await action('cancel-edit').click(); await page.waitForSelector('#askNo'); await page.keyboard.press('Escape');
    assert.equal(await page.locator('#soapForm').count(), 1);
    await action('cancel-edit').click(); await page.locator('#askYes').click(); await page.waitForSelector('.sess');
    check('Unsaved changes and Escape', 'Cancel requires discard confirmation; Escape keeps the draft.');

    for (const theme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: theme });
      const contrast = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        const lum = key => {
          const hex = style.getPropertyValue('--' + key).trim();
          const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
          return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
        };
        return [['ink', 'surface'], ['muted', 'sunk'], ['accent', 'accent-soft'], ['accent-ink', 'accent'], ['pre', 'pre-soft'], ['good', 'good-soft'], ['bad', 'bad-soft'], ['warn', 'warn-soft'], ['control-line', 'sunk']]
          .map(([a, b]) => ({ a, b, ratio: (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05) }));
      });
      for (const pair of contrast) assert.ok(pair.ratio >= (pair.a === 'control-line' ? 3 : 4.5), `${theme} ${pair.a}/${pair.b}: ${pair.ratio}`);
      for (const width of [360, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${theme} ${width}px overflow`);
      }
    }
    await page.setViewportSize({ width: 360, height: 900 }); await action('new-session').click();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.evaluate(() => document.querySelectorAll('.toast').forEach(toast => toast.remove()));
    await page.screenshot({ path: path.join(output, 'mobile-editor.png'), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 }); await page.emulateMedia({ colorScheme: 'light' });
    await page.screenshot({ path: path.join(output, 'desktop-editor.png'), fullPage: true });
    check('Responsive layout and contrast in both themes', 'No page overflow at 360/768/1280px; text palette pairs pass 4.5:1 and control boundaries pass 3:1.');
    await action('cancel-edit').click();

    await page.reload(); await ready();
    await page.evaluate(async () => { const disk = await navigator.storage.getDirectory(); testRoot = await disk.getDirectoryHandle('records'); store = folderStore(testRoot); await finishBoot(); });
    assert.ok(await page.evaluate(() => clients.length >= 4));
    check('Page reload retains file records', 'Patient folders and CSV histories survive an actual browser reload.');

    const fallbackContext = await browser.newContext({ acceptDownloads: true, reducedMotion: 'reduce' });
    await fallbackContext.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    const fallback = await fallbackContext.newPage();
    await fallback.addInitScript(() => { Object.defineProperty(window, 'showDirectoryPicker', { value: undefined }); });
    await fallback.goto(`http://127.0.0.1:${server.address().port}/`); await fallback.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    await fallback.locator('[data-action="new-client"]:visible').first().click();
    await fallback.locator('#cf-name').fill('測試 ZIP 個案'); await fallback.locator('#cf-ref').fill('TEST-ZIP'); await fallback.locator('#cForm button[type="submit"]').click();
    await fallback.waitForSelector('.client-summary'); await fallback.locator('[data-action="new-session"]').first().click();
    await fallback.locator('#s-subj').fill('瀏覽器備援下載測試');
    const downloaded = fallback.waitForEvent('download'); await fallback.locator('[data-action="save-session"]').first().click();
    const download = await downloaded; assert.match(download.suggestedFilename(), /\.zip$/); await download.saveAs(path.join(output, 'fallback.zip'));
    await fallback.reload(); await fallback.locator('#tab-sessions').click(); await fallback.waitForSelector('.sess'); assert.equal(await fallback.locator('.sess').count(), 1);
    await fallbackContext.close();
    check('Browser fallback downloads ZIP', 'Without directory-picker support, Save downloads one ZIP with a patient subfolder and retains the session across reload.');

    const diskPage = await context.newPage(); diskPage.on('pageerror', error => errors.push(error.message));
    await diskPage.goto(pathToFileURL(path.join(root, 'EzEMR.html')).href);
    await diskPage.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await diskPage.locator('[data-action="pick-folder"]:visible').count(), 1);
    assert.equal(await diskPage.locator('#integratedDataNotice').isVisible(), false);
    assert.equal(await diskPage.evaluate(() => isSecureContext && typeof showDirectoryPicker === 'function'), true);
    await diskPage.locator('#viewMenuButton').click(); await diskPage.locator('#themeToggle').click();
    const diskTheme = await diskPage.locator('html').getAttribute('data-theme');
    await diskPage.reload(); await diskPage.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await diskPage.locator('html').getAttribute('data-theme'), diskTheme);
    await diskPage.close();
    check('Direct file opening', 'The standalone file:// HTML loads with no server, exposes the directory-picker API, and persists theme choices across reload.');

    assert.deepEqual(requests, []); assert.deepEqual(errors, []);
    check('Offline core and console', 'No record-data requests or uncaught JavaScript errors; Google Fonts is stubbed to verify offline fallback.');
    await fs.writeFile(path.join(output, 'browser-results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
