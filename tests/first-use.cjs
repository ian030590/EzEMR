const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/first-use');
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath);
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en', errors = [], outbound = [];
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(12000);
      page.on('pageerror', error => errors.push(error.message));
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      await page.goto(pathToFileURL(appPath).href); await ready();
      await page.locator('#languageSelect').selectOption(locale);
      assert.equal(await page.locator('.connect-intro h2').innerText(), en ? 'Start keeping records' : '開始記錄病歷');
      assert.match(await page.locator('.connect-intro > p').first().innerText(), en ? /never sent over the internet/ : /不會透過網路傳送/);
      assert.equal(await page.locator('.connect-steps li').count(), 3);
      assert.equal(await action('pick-folder').innerText(), en ? 'I already have a record folder' : '我已經有病歷資料夾');
      assert.equal(await action('use-default').innerText(), en ? 'First time: help me set up' : '第一次使用，幫我建立');
      assert.equal(await page.locator('.connect-advanced').evaluate(node => node.open), false);
      assert.equal(await page.locator('.storage-preview').isVisible(), false);
      assert.doesNotMatch(await page.locator('.connect-intro, .connect-options, .connect-notes').allInnerTexts().then(parts => parts.join(' ')), /clients\.csv|EzEMR\.html|\bData\b|\bJSON\b|\bPDF\b|\bTXT\b/);
      assert.match(await page.locator('.connect-notes').innerText(), en ? /each time.*back up all data/is : /每次開啟.*備份全部資料/s);
      for (const theme of ['light', 'dark']) for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        for (const expanded of [false, true]) {
          if (await page.locator('.connect-advanced').evaluate(node => node.open) !== expanded) await page.locator('.connect-advanced > summary').click();
          assert.equal(await page.locator('.storage-preview').isVisible(), expanded);
          if (expanded) assert.match(await page.locator('.connect-advanced').innerText(), /EzEMR\.html[\s\S]*clients\.csv[\s\S]*JSON/);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}px advanced=${expanded}`);
          for (const name of ['pick-folder', 'use-default']) {
            const rect = await action(name).boundingBox(); assert.ok(rect.width >= 44 && rect.height >= 44 && rect.x >= 0 && rect.x + rect.width <= width);
          }
          if (width === 320 || width === 1280) {
            await page.evaluate(() => scrollTo(0, 0));
            await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-${expanded ? 'advanced' : 'plain'}.png`), fullPage: true });
          }
        }
      }
      await action('use-default').click();
      assert.equal(await page.evaluate(() => store.root.deferred), true);
      assert.equal(await page.locator('.welcome').isVisible(), true);

      // Use real isolated handles for the existing picker, deferred creation and reconnect actions.
      await page.goto(url); await ready(); await page.locator('#languageSelect').selectOption(locale);
      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.firstUseFolder = await disk.getDirectoryHandle('existing-first-use', { create: true });
        const target = folderStore(firstUseFolder);
        await target.saveClient({ id: 'existing-client', name: 'Synthetic existing client', ref: 'FIRST-001', plan: [] });
        window.pickerCalls = [];
        window.showDirectoryPicker = async options => { pickerCalls.push(options.id); return firstUseFolder; };
      });
      await action('pick-folder').click(); await page.waitForSelector('.client-summary');
      assert.equal(await page.evaluate(() => curId), 'existing-client');
      assert.deepEqual(await page.evaluate(() => pickerCalls), ['progress-notes']);
      await page.evaluate(() => { pendingHandle = firstUseFolder; store = null; curId = null; clients = []; renderConnect(); });
      assert.match(await action('reconnect').innerText(), /existing-first-use/);
      await action('reconnect').click(); await page.waitForSelector('.client-summary');
      assert.equal(await page.evaluate(() => curId), 'existing-client');
      assert.equal(await page.evaluate(() => pendingHandle), null);
      assert.equal(await page.evaluate(() => pickerCalls.length), 1, 'Reconnect uses the remembered handle');
      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.firstUseParent = await disk.getDirectoryHandle('new-first-use', { create: true });
        window.showDirectoryPicker = async options => { pickerCalls.push(options.id); return firstUseParent; };
        store = null; curId = null; clients = []; renderConnect();
      });
      await action('use-default').click();
      assert.equal(await page.evaluate(async () => (await fileNames(firstUseParent)).length), 0, 'Setup waits until the first client save to create Data');
      await action('new-client').click();
      await page.locator('#cf-name').fill('Synthetic first client'); await page.locator('#cf-ref').fill('FIRST-002');
      await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
      assert.equal(await page.evaluate(() => store.root.name), 'Data');
      assert.ok(await page.evaluate(async () => (await fileNames(await firstUseParent.getDirectoryHandle('Data'))).includes('clients.csv')));
      assert.deepEqual(await page.evaluate(() => pickerCalls), ['progress-notes', 'progress-default']);

      await page.evaluate(() => {
        localStorage.setItem(BROWSER_KEY, JSON.stringify({ clients: { pending: { id: 'pending', name: 'Synthetic pending' } }, sessions: { pending: { saved: { id: 'saved', updated: new Date().toISOString() } } } }));
        store = null; renderConnect();
      });
      assert.equal(await page.locator('.connect-intro b').count(), 1, 'Pending browser records remain visible');
      await context.close();

      const fallback = await browser.newContext({ viewport: { width: 320, height: 900 } });
      await fallback.addInitScript(() => { window.showDirectoryPicker = undefined; });
      await fallback.route(/^https?:/, route => { outbound.push(route.request().url()); return route.abort(); });
      const unsupported = await fallback.newPage(); unsupported.on('pageerror', error => errors.push(error.message));
      await unsupported.goto(pathToFileURL(appPath).href); await unsupported.waitForSelector('.welcome');
      await unsupported.locator('#languageSelect').selectOption(locale);
      assert.match(await unsupported.locator('.browser-save-guidance').innerText(), en ? /cannot save straight to a folder.*each save downloads.*Chrome or Edge/ : /無法直接存入資料夾.*每次儲存會下載.*Chrome 或 Edge/);
      assert.equal(await unsupported.evaluate(() => clients.length), 0, 'The explanation is visible on the first browser-mode visit');
      for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
        await unsupported.setViewportSize({ width, height: 900 });
        await unsupported.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        assert.equal(await unsupported.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await unsupported.locator('.browser-save-guidance').isVisible(), true);
        await unsupported.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-browser.png`), fullPage: true });
      }
      await fallback.close();
      assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
      console.log(`PASS: ${locale}: plain first open, collapsed/expanded file details, both existing actions, deferred Data creation, reconnect, pending browser records, first browser-mode guidance, light/dark 320/768/1280px and no outbound requests`);
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
