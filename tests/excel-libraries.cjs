const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { inflateRawSync } = require('node:zlib');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'excel-libraries');

// Read the ZIP entry independently of either Excel library to verify serialized styles.
function zipText(bytes, name) {
  const zip = Buffer.from(bytes);
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
  assert(end >= 0, 'Export must be a ZIP archive');
  let entry = zip.readUInt32LE(end + 16);
  for (let i = 0; i < zip.readUInt16LE(end + 10); i++) {
    assert.equal(zip.readUInt32LE(entry), 0x02014b50);
    const length = zip.readUInt16LE(entry + 28);
    if (zip.toString('utf8', entry + 46, entry + 46 + length) === name) {
      const local = zip.readUInt32LE(entry + 42);
      const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
      const data = zip.subarray(start, start + zip.readUInt32LE(entry + 20));
      const method = zip.readUInt16LE(entry + 10);
      assert([0, 8].includes(method), 'Unexpected ZIP compression');
      return (method === 8 ? inflateRawSync(data) : data).toString('utf8');
    }
    entry += 46 + length + zip.readUInt16LE(entry + 30) + zip.readUInt16LE(entry + 32);
  }
  assert.fail(`Missing ZIP entry: ${name}`);
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const missingReader = source.replace(/<script id="excelReaderLibrary">[\s\S]*?<\/script>/, '');
  assert.notEqual(missingReader, source, 'The missing-reader probe must remove the embedded reader');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.url === '/missing' ? missingReader : source);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  let browser;
  const errors = [], external = [];
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ reducedMotion: 'reduce', timezoneId: 'Asia/Taipei' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url + '/')) return route.continue();
        external.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      const open = async pathname => {
        await page.goto(url + pathname);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          const disk = await navigator.storage.getDirectory();
          store = folderStore(await disk.getDirectoryHandle(location.pathname === '/missing' ? 'excel-library-missing' : 'excel-library-fixture', { create: true }));
          await finishBoot();
        });
      };
      await open('/');
      const libraries = await page.evaluate(() => ({
        reader: XLSXReader.version, writer: XLSX.version, style: XLSX.style_version, distinct: XLSXReader !== XLSX,
        blocked: ['read', 'readFile', 'readFileSync'].map(key => {
          try { XLSX[key](); return null; } catch (error) { return { isError: error instanceof Error, message: error.message }; }
        })
      }));
      assert.deepEqual([libraries.reader, libraries.writer, libraries.style, libraries.distinct], ['0.20.3', '0.18.5', '1.2.0', true]);
      for (const error of libraries.blocked) assert.deepEqual(error, { isError: true, message: locale === 'en' ? 'Use the embedded updated reader for Excel imports.' : 'Excel 匯入請使用內嵌的新版讀取元件。' });

      const workbook = await page.evaluate(() => {
        const wb = XLSX.utils.book_new();
        const add = (index, rows) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), SOURCE_WORKBOOK.sheets[index]);
        add(0, [['復能編號', '姓名', '生日'], ['TEST-XLSB', 'Excel binary fixture', 45000]]);
        add(1, [['patient_no', 'name', 'visit_date', 'visit_time', 'ufov_ps', '治療師'], ['TEST-XLSB', 'Excel binary fixture', 46328, 1, 0, 'Test clinician']]);
        add(2, [['個案編號', '姓名', '看診日期', '看診次數', 'subject'], ['TEST-XLSB', 'Excel binary fixture', 46328, 2, '原始病歷 / synthetic source']]);
        return Array.from(new Uint8Array(XLSX.write(wb, { bookType: 'xlsb', type: 'array' })));
      });
      await page.locator('#importFile').setInputFiles({ name: 'synthetic.xlsb', mimeType: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12', buffer: Buffer.from(workbook) });
      await page.waitForFunction(() => clients.length === 1 && sessions.length === 2 && !savingSession);
      assert.equal(await page.locator('.toast').last().innerText(), locale === 'en' ? 'Merged 1 clients.' : '已整合 1 位個案。');
      assert.deepEqual(await page.evaluate(() => ({ dob: cur().dob, count: sessions.length, dates: sessions.map(s => s.date), zero: sessions.find(s => s.num === 1).assess.src_ufov.values.ufov_ps, note: sessions.find(s => s.num === 2).subjective })), {
        dob: '2023-03-15', count: 2, dates: ['2026-11-02', '2026-11-02'], zero: 0, note: '原始病歷 / synthetic source'
      });
      console.log(`PASS: ${locale} SheetJS 0.20.3 reader, unchanged styling writer versions, blocked old read APIs and actual XLSB import`);

      const exports = await page.evaluate(async () => {
        const files = [];
        const writeExport = store.writeExport;
        store.writeExport = async (id, name, blob) => { files.push({ id, name, bytes: Array.from(new Uint8Array(await blob.arrayBuffer())) }); return name; };
        try { await exportExcel(true); await exportSessionForm(sessions[0].id); }
        finally { store.writeExport = writeExport; }
        return files;
      });
      assert.equal(exports.length, 2);
      assert.equal(exports[0].id, null, 'The all-client export must be exercised');
      for (const [index, file] of exports.entries()) {
        const styles = zipText(file.bytes, 'xl/styles.xml');
        assert.match(styles, /<name val="Noto Sans TC"\s*\/>/);
        assert.match(styles, /<fgColor rgb="(?:FF)?E3EDF6"\s*\/>/);
        assert.match(styles, /wrapText="(?:true|1)"/);
        if (index === 1) assert.match(styles, /<(?:top|bottom|left|right) style="thin">/);
        assert.match(zipText(file.bytes, 'xl/worksheets/sheet1.xml'), /<c\b[^>]*\bs="[1-9]\d*"/);
        await fs.writeFile(path.join(output, `${locale}-${index === 0 ? 'all-clients' : 'soap'}.xlsx`), Buffer.from(file.bytes));
      }
      console.log(`PASS: ${locale} all-client and SOAP exports retain serialized font, fill and wrapping; SOAP retains borders with all old read APIs blocked`);

      await open('/missing');
      await page.evaluate(() => { window.XLSX = undefined; });
      await page.locator('#importFile').setInputFiles({ name: 'missing-reader.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('synthetic') });
      const message = locale === 'en' ? 'Import failed: The Excel import component is unavailable. Reopen the complete EzEMR.html file.' : '匯入失敗：Excel 匯入元件無法使用，請重新開啟完整的 EzEMR.html。';
      await page.waitForFunction(message => [...document.querySelectorAll('.toast')].some(node => node.textContent === message), message);
      assert.deepEqual(await page.evaluate(() => ({ clients: clients.length, sessions: sessions.length })), { clients: 0, sessions: 0 });
      console.log(`PASS: ${locale} missing-reader error is translated and does not load the export CDN fallback`);
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
