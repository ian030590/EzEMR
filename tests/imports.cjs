const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'imports');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(path.join(root, 'EzEMR.html'), 'utf8');
  // The published HTML must not carry any client records.
  assert.doesNotMatch(source, /id="integratedRecords"/, 'The published HTML must not embed client records');
  const server = http.createServer((req, res) => {
    res.writeHead(req.url === '/' ? 200 : 404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.url === '/' ? source : '');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const errors = [], external = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ acceptDownloads: true, timezoneId: 'Asia/Taipei', reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        external.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const english = async selector => {
        if (locale !== 'en') return;
        assert.doesNotMatch((await page.locator(selector).allTextContents()).join('\n'), /\p{Script=Han}/u, `Untranslated import UI: ${selector}`);
      };
      await page.goto(url); await ready();
      await page.locator('#languageSelect').selectOption(locale);
      assert.equal(await page.locator('#clientCount').textContent(), '0');
      assert.equal(await page.locator('#integratedDataNotice').isVisible(), false);
      assert.equal(await page.locator('.storage-connect').isVisible(), true);
      assert.equal(await page.evaluate(() => store), null, 'No storage is chosen until the user picks a folder');
      await english('#main');
      await page.locator('#fileMenuButton').click(); await english('#fileMenu'); await page.keyboard.press('Escape');
      await page.reload(); await ready();
      assert.equal(await page.locator('#languageSelect').inputValue(), locale);
      assert.equal(await page.locator('#clientCount').textContent(), '0');
      assert.equal(await page.evaluate(() => typeof XLSX.read), 'function');

      // Imported test records go into a separate empty folder.
      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.importRoot = await disk.getDirectoryHandle('synthetic-imports', { create: true });
        store = folderStore(importRoot); await finishBoot();
      });
      assert.equal(await page.locator('#integratedDataNotice').isVisible(), false);
      assert.equal(await page.locator('#clientCount').textContent(), '0');
      const workbook = await page.evaluate(() => {
        const wb = XLSX.utils.book_new();
        const add = (index, rows) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), SOURCE_WORKBOOK.sheets[index]);
        add(0, [['復能編號', '姓名', '生日', '收案日期', '職災日期', '眼科診斷', '視覺主訴', '年齡'], ['TEST-IMPORT', 'Import fixture', 45000, 46328, 46328, '原始診斷', 'Original referral', 126]]);
        add(1, [['patient_no', 'name', 'visit_date', 'visit_time', 'va_ou', 'ufov_ps', '治療師'], ['TEST-IMPORT', 'Import fixture', 46328, 1, 1, 0, 'Test clinician']]);
        add(2, [['個案編號', '姓名', '看診日期', '看診次數', 'subject', 'objective', 'assessment', 'plan', '治療師'], ['TEST-IMPORT', 'Import fixture', 46328, 2, '原始病歷 / clinical source', 'Original observations', '', '', 'Test clinician']]);
        return Array.from(new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })));
      });
      const excel = { name: 'source.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(workbook) };
      await page.locator('#importFile').setInputFiles(excel);
      await page.waitForSelector('#importReportClose');
      await english('.modal'); await english('.toast');
      assert.equal(await page.locator('#importReportClose').innerText(), locale === 'en' ? 'Close' : '關閉');
      await page.locator('#importReportClose').click();
      const imported = await page.evaluate(() => ({ dob: cur().dob, dx: cur().dx, roster: cur().sourceRoster[0].fields, sessions: sessions.map(s => ({ date: s.date, num: s.num, subjective: s.subjective })), zero: sessions.find(s => s.num === 1).assess.src_ufov.values.ufov_ps }));
      assert.equal(imported.dob, '2023-03-15');
      assert.equal(imported.dx, '原始診斷'); assert.equal(imported.roster['年齡'], 126);
      assert.equal(imported.zero, 0);
      assert.equal(imported.sessions.length, 2);
      assert(imported.sessions.every(s => s.date === '2026-11-02'));
      assert.equal(imported.sessions.find(s => s.num === 2).subjective, '原始病歷 / clinical source');
      // Source labels follow the interface language on screen but stay canonical inside imported notes.
      const labels = await page.evaluate(() => ({ shown: sourceLabel(cur().sourceRoster[0]), stored: sessions.find(s => s.num === 1).assess.src_ufov.notes }));
      assert.match(labels.shown, locale === 'en' ? / · row 2$/ : / · 第 2 列$/);
      assert.match(labels.stored, / · 第 2 列$/, 'Imported notes keep the canonical source label in either language');
      await english('.client-summary summary');
      await page.locator('#tab-plan').click();
      const sourceName = locale === 'en' ? 'Distance visual acuity (source workbook)' : '遠距離視力（資料表）';
      assert.equal(await page.getByText(sourceName, { exact: true }).count(), 1);
      const snapshot = await page.evaluate(async () => ({ data: JSON.stringify({ client: cur(), sessions }), files: await fileNames(await importRoot.getDirectoryHandle('TEST-IMPORT')) }));
      await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
      assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), snapshot.data);
      assert.deepEqual(await page.evaluate(async () => fileNames(await importRoot.getDirectoryHandle('TEST-IMPORT'))), snapshot.files);
      await page.locator('#languageSelect').selectOption(locale);
      await page.locator('#importFile').setInputFiles([excel, { name: 'extra.csv', mimeType: 'text/csv', buffer: Buffer.from('invalid') }]);
      await page.waitForFunction(() => [...document.querySelectorAll('.toast')].some(t => t.textContent === ui('匯入失敗：') + ui('請分別匯入 Excel、CSV 或 JSON 備份。')));
      await english('.toast');

      const invalid = await page.evaluate(() => {
        const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['unknown']]), 'Other');
        return Array.from(new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })));
      });
      await page.locator('#importFile').setInputFiles({ ...excel, name: 'invalid.xlsx', buffer: Buffer.from(invalid) });
      await page.waitForFunction(() => [...document.querySelectorAll('.toast')].some(t => /workbook must contain|需要包含/.test(t.textContent)));
      await english('.toast');
      assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), snapshot.data);

      const legacy = path.join(output, locale, 'legacy');
      const clientDir = path.join(legacy, 'TEST-LEGACY');
      await fs.mkdir(path.join(clientDir, '_archive'), { recursive: true });
      const c = { id: 'legacy-fixture', name: 'Legacy fixture', ref: 'TEST-LEGACY', dob: '', doi: '', dx: '', referral: '', plan: [], created: '2026-11-02' };
      const s = { id: 'legacy-session', date: '2026-11-02', num: 1, visit: 'treatment', sym: [], assess: {}, training: {}, subjective: '舊版原文 / legacy source', updated: '2026-11-02T02:00:00Z' };
      await fs.writeFile(path.join(clientDir, 'client.json'), JSON.stringify(c));
      await fs.writeFile(path.join(clientDir, 'old.json'), JSON.stringify({ ...s, subjective: 'Older duplicate', updated: '2026-11-01T02:00:00Z' }));
      await fs.writeFile(path.join(clientDir, 'new.json'), JSON.stringify(s));
      await fs.writeFile(path.join(clientDir, '_archive', 'ignore.json'), 'invalid archived JSON');
      await page.locator('#importSOAPFolder').setInputFiles(legacy);
      await page.waitForSelector('#importReportClose'); await english('.modal');
      await page.locator('#importReportClose').click();
      assert.equal(await page.locator('#clientCount').textContent(), '2');
      assert.equal(await page.evaluate(() => sessions.length), 1);
      assert.equal(await page.evaluate(() => sessions[0].subjective), s.subjective);
      assert.equal(await page.evaluate(() => sessions[0].sourceRecords[0].file.endsWith('/new.json')), true);
      const beforeFailure = await page.evaluate(() => JSON.stringify({ clients, sessions }));
      const missing = path.join(output, locale, 'missing-client');
      await fs.mkdir(missing, { recursive: true });
      await fs.writeFile(path.join(missing, 'session.json'), JSON.stringify(s));
      await page.locator('#importSOAPFolder').setInputFiles(missing);
      await page.waitForFunction(() => [...document.querySelectorAll('.toast')].some(t => /missing client.json|缺少同資料夾的 client.json/.test(t.textContent)));
      await english('.toast');
      assert.equal(await page.evaluate(() => JSON.stringify({ clients, sessions })), beforeFailure);
      assert.equal(await page.evaluate(() => savingSession), false);
      await page.locator('#clientMenuButton').click();
      assert.equal(await action('new-client').isEnabled(), true);
      console.log(`PASS: ${locale} empty startup, offline Excel import, original data and filenames, import reports and errors, legacy SOAP deduplication and archive exclusion`);
      await context.close();
    }

    const offline = await browser.newContext();
    await offline.route(/^https?:/, route => { external.push(route.request().url()); return route.abort(); });
    const localPage = await offline.newPage(); localPage.on('pageerror', error => errors.push(error.message));
    await localPage.goto(pathToFileURL(path.join(root, 'EzEMR.html')).href);
    await localPage.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await localPage.locator('#clientCount').textContent(), '0');
    assert.equal(await localPage.locator('.storage-connect').isVisible(), true);
    assert.equal(await localPage.evaluate(() => typeof XLSX.write), 'function');
    await offline.close();
    assert.deepEqual(external, []); assert.deepEqual(errors, []);
    assert.equal(await fs.readFile(path.join(root, 'EzEMR.html'), 'utf8'), source);
    console.log('PASS: Published HTML opens directly offline with no embedded records and a working Excel library; no external requests, browser errors or source-file changes');
  } finally {
    await browser.close(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
