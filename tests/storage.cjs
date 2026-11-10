const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const evidence = [];
const check = name => { evidence.push(name); console.log('PASS: ' + name); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  assert.doesNotMatch(source.toString(), /dropbox|dbxForm|oauth2/i);
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1360, height: 960 }, colorScheme: 'light', reducedMotion: 'reduce', acceptDownloads: true });
  // Isolate offline file operations from the optional web font download.
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!request.url().startsWith(url) && !request.url().startsWith('blob:') && !/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(request.url())) requests.push(request.url()); });
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const menuAction = async (menu, name) => { await page.locator(`#${menu}MenuButton`).click(); await action(name).click(); };
  const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  const create = async (name, ref) => {
    await menuAction('client', 'new-client');
    await page.locator('#cf-name').fill(name); await page.locator('#cf-ref').fill(ref);
    await page.locator('#cf-dx').fill('合成測試資料，非真實病歷');
    await page.locator('#cf-referral').fill('中文，含逗號與"引號"\n第二行');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
  };
  try {
    await page.goto(url); await ready();
    assert.match(await page.locator('#main').innerText(), /開啟本機病歷資料夾/);
    const fonts = await page.evaluate(() => ['h1', 'h2', 'button', '#clientSearch'].map(selector => getComputedStyle(document.querySelector(selector)).fontFamily));
    for (const font of fonts) assert.match(font, /^"?Noto Sans TC/);
    check('Noto Sans TC leads UI headings, buttons and inputs; storage setup describes local folders');
    await page.screenshot({ path: path.join(output, 'washi-storage-light.png'), fullPage: true });
    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory(); window.parentFolder = await disk.getDirectoryHandle('local-records', { create: true });
      await writeFile(parentFolder, 'EzEMR.html', '<title>測試 HTML</title>');
      window.pickerCalls = 0; window.showDirectoryPicker = async () => { pickerCalls++; return parentFolder; };
    });
    await action('use-default').click(); assert.equal(await page.evaluate(() => pickerCalls), 0);
    assert.deepEqual(await page.evaluate(async () => fileNames(parentFolder)), ['EzEMR.html']);
    await create('測試預設個案', 'TEST-DEFAULT'); assert.equal(await page.evaluate(() => pickerCalls), 1);
    const roster = await page.evaluate(async () => {
      const file = await (await store.root.getFileHandle('clients.csv')).getFile(), text = await file.text();
      return { text, bom: Array.from(new Uint8Array(await file.arrayBuffer()).slice(0, 3)), clients: readClientsCSV(text), root: store.root.name, html: await (await (await parentFolder.getFileHandle('EzEMR.html')).getFile()).text() };
    });
    assert.equal(roster.root, 'Data'); assert.equal(roster.clients.length, 1); assert.deepEqual(roster.bom, [239, 187, 191]); assert.match(roster.html, /測試 HTML/);
    await fs.writeFile(path.join(output, 'clients.csv'), '\ufeff' + roster.text);
    // Reopen OPFS directly; OS handle permission restoration needs a manual check.
    await page.evaluate(() => idbSet('root', null)); await page.reload(); await ready();
    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory(), parent = await disk.getDirectoryHandle('local-records');
      store = folderStore(await parent.getDirectoryHandle('Data')); await finishBoot();
    });
    assert.equal(await page.locator('.client-btn').count(), 0, 'Reopening a folder does not reveal the full roster');
    await page.locator('#clientSearch').fill('TEST-DEFAULT');
    assert.match(await page.locator('#clientList').textContent(), /測試預設個案/);
    await page.keyboard.press('Escape');
    check('First save creates Data/clients.csv beside the selected HTML; reopening the folder reads the roster and leaves HTML untouched');

    await action('new-session').click(); await page.locator('#s-subj').fill('本機資料夾讀寫測試');
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.deepEqual((await page.evaluate(async () => fileNames(await store.root.getDirectoryHandle('TEST-DEFAULT')))).map(name => path.extname(name)).sort(), ['.csv', '.pdf', '.txt']);
    await page.evaluate(async () => { store = folderStore(store.root); await finishBoot(); });
    await page.locator('#tab-sessions').click();
    await action('open-session').click(); assert.equal(await page.locator('#s-subj').inputValue(), '本機資料夾讀寫測試'); await action('cancel-edit').click();
    check('SOAP CSV, PDF and TXT files save and reopen in the selected local folder without record-data network requests');

    const roundTrip = await page.evaluate(() => {
      const c = clone(cur()); c.name = "'=測試"; c.dx = '=SUM(1,2)'; c.referral = '\n@中文'; c.custom = { zero: 0, no: false };
      const csv = clientsCSV([{ client: c, folder: 'TEST-DEFAULT' }]);
      const invalid = [csv.replace('schema_version', 'invalid'), csv + csv.split('\r\n')[1] + '\r\n', csv.replace('TEST-DEFAULT', '../escape')];
      return { c, restored: readClientsCSV(csv)[0].client, invalid: invalid.map(text => { try { readClientsCSV(text); return false; } catch (_) { return true; } }) };
    });
    assert.deepEqual(roundTrip.restored, roundTrip.c); assert.deepEqual(roundTrip.invalid, [true, true, true]);
    const downloaded = page.waitForEvent('download'); await menuAction('export', 'export-roster'); const download = await downloaded;
    assert.equal(download.suggestedFilename(), 'clients.csv'); assert.deepEqual([...(await fs.readFile(await download.path())).subarray(0, 3)], [239, 187, 191]);
    await page.locator('#importFile').setInputFiles({ name: 'clients.csv', mimeType: 'text/csv', buffer: Buffer.from(roster.text) });
    await page.waitForFunction(() => document.querySelector('.toast')?.textContent.includes('已匯入')); assert.equal(await page.evaluate(() => clients.length), 1);
    check('CSV roster export/import preserves templates, extra fields, formula-like text and BOM; unsafe paths and duplicates are rejected');

    const legacy = await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory(), root = await disk.getDirectoryHandle('legacy', { create: true });
      const c = clone(cur()); c.id = 'legacy-client'; c.ref = 'LEGACY';
      const folder = await root.getDirectoryHandle(c.ref, { create: true }); await writeFile(folder, 'client.json', JSON.stringify(c));
      const storage = folderStore(root); await storage.listClients(); await storage.saveClient({ ...c, dx: '已轉為 CSV' });
      const reopened = await folderStore(root).listClients(); await writeFile(root, 'clients.csv', 'broken');
      let refused = false; try { await storage.saveClient(c); } catch (_) { refused = true; }
      return { reopened, refused, original: await readJSON(folder, 'client.json'), unchanged: await (await (await root.getFileHandle('clients.csv')).getFile()).text() };
    });
    assert.equal(legacy.reopened[0].dx, '已轉為 CSV'); assert.equal(legacy.original.id, 'legacy-client'); assert.equal(legacy.refused, true); assert.equal(legacy.unchanged, 'broken');
    check('Legacy JSON converts to a CSV roster without deleting originals; corrupt CSV is never silently overwritten');

    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory(); window.directFolder = await disk.getDirectoryHandle('local-direct', { create: true });
      await writeFile(directFolder, 'EzEMR.html', '<title>同層 HTML</title>');
      window.showDirectoryPicker = async () => ({ name: directFolder.name, requestPermission: async () => 'granted', getDirectoryHandle: directFolder.getDirectoryHandle.bind(directFolder), getFileHandle: directFolder.getFileHandle.bind(directFolder), entries: directFolder.entries.bind(directFolder), removeEntry: directFolder.removeEntry.bind(directFolder) });
    });
    await menuAction('file', 'storage-settings'); await page.locator('#layer [data-action="pick-folder"]').click(); await page.waitForFunction(() => store.root.name === 'local-direct');
    await create('測試同層個案', 'DIRECT');
    assert.deepEqual((await page.evaluate(async () => fileNames(directFolder))).sort(), ['EzEMR.html', 'clients.csv']);
    await page.evaluate(async () => {
      const rows = readClientsCSV(await (await (await directFolder.getFileHandle('clients.csv')).getFile()).text());
      rows[0].client.dx = '模擬本機 CSV 修改'; await writeFile(directFolder, 'clients.csv', clientsCSV(rows));
    });
    await menuAction('file', 'reload-storage'); await page.waitForFunction(() => cur()?.dx === '模擬本機 CSV 修改');
    check('Custom storage puts clients.csv beside HTML; Reload reads external CSV changes from that same selected folder');

    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
      for (const width of [360, 768, 1360]) {
        await page.setViewportSize({ width, height: 900 }); await menuAction('file', 'storage-settings');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.locator('.modal').evaluate(el => el.scrollWidth <= el.clientWidth), true); await page.keyboard.press('Escape');
      }
      await page.setViewportSize({ width: 1360, height: 960 }); await page.screenshot({ path: path.join(output, `washi-roster-${theme}.png`), fullPage: true });
    }
    assert.deepEqual(errors, []); assert.deepEqual(requests, []);
    check('Light/dark settings fit 360/768/1360px; Escape works and offline file operations produce no record-data requests or uncaught errors');
    await fs.writeFile(path.join(output, 'storage-results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
