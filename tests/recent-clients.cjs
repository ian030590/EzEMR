const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const source = await fs.readFile(appPath), evidence = [];
  const output = path.resolve(__dirname, '../.tmp/verification/recent-clients');
  await fs.mkdir(output, { recursive: true });
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext();
      await context.addInitScript(locale => { try { localStorage.setItem('ezrehab-language', locale); } catch (_) {} }, locale);
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.goto(url); await ready();
      await page.evaluate(async () => {
        const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('recent-main', { create: true });
        store = folderStore(root); await finishBoot();
      });
      await page.locator('#clientSearch').focus(); assert.equal(await page.locator('#clientSearchPopup').isHidden(), true);
      await page.evaluate(async () => {
        for (let index = 0; index < 10; index++) await store.saveClient({ id: 'recent-' + index, name: 'Synthetic client ' + index, ref: 'TEST-RECENT-' + index, plan: newClientPlan() });
        await finishBoot();
      });
      assert.equal(await page.evaluate(() => curId), 'recent-0', 'No history retains alphabetical fallback');
      const open = async index => {
        await page.locator('#clientSearch').fill('TEST-RECENT-' + index);
        await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
        await page.waitForFunction(index => curId === 'recent-' + index && patientReady, index);
        assert.equal(await page.locator('#clientSearchPopup').isHidden(), true, 'Selecting a client closes the search results');
      };
      for (let index = 1; index < 10; index++) await open(index);
      assert.deepEqual(await page.evaluate(() => recentClientIds()), [9, 8, 7, 6, 5, 4, 3, 2].map(index => 'recent-' + index));
      await page.reload(); await ready();
      await page.evaluate(async () => { store = folderStore(await (await navigator.storage.getDirectory()).getDirectoryHandle('recent-main')); await finishBoot(); });
      assert.equal(await page.evaluate(() => curId), 'recent-9');
      await page.locator('#clientSearch').focus();
      assert.equal(await page.locator('#clientSearchStatus').innerText(), locale === 'en' ? 'Recently opened' : '最近開啟');
      assert.equal(await page.locator('#clientSearch').getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#clientList').getAttribute('role'), 'listbox');
      assert.deepEqual(await page.locator('#clientList [role="option"]').evaluateAll(nodes => nodes.map(node => node.dataset.id)), [9, 8, 7, 6, 5].map(index => 'recent-' + index));
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
      assert.equal(await page.locator('#clientSearch').getAttribute('aria-activedescendant'), 'client-result-1');
      assert.equal(await page.locator('#client-result-1').getAttribute('aria-selected'), 'true');
      await page.keyboard.press('Enter'); await page.waitForFunction(() => curId === 'recent-8' && patientReady);
      await page.locator('#clientSearch').focus(); await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter');
      await page.waitForFunction(() => curId === 'recent-5' && patientReady);
      await page.locator('#clientSearch').focus(); await page.keyboard.press('Escape'); assert.equal(await page.locator('#clientSearchPopup').isHidden(), true);
      await page.evaluate(() => { const data = JSON.parse(localStorage.getItem(RECENT_CLIENTS_KEY)); data[deviceStorageKey()] = ['stale-client', curId, 'recent-8']; localStorage.setItem(RECENT_CLIENTS_KEY, JSON.stringify(data)); });
      await page.locator('#clientSearch').blur(); await page.locator('#clientSearch').focus();
      assert.deepEqual(await page.evaluate(() => recentClientIds()), ['recent-5', 'recent-8']);
      assert.doesNotMatch(await page.evaluate(() => localStorage.getItem(RECENT_CLIENTS_KEY)), /stale-client/);
      await page.keyboard.press('Escape');
      await page.locator('[data-action="edit-client"]:visible').first().click();
      await page.locator('#cDel').click(); await page.locator('#askYes').click();
      await page.waitForFunction(() => !clients.some(client => client.id === 'recent-5'));
      assert.equal(await page.evaluate(() => recentClientIds().includes('recent-5')), false);
      assert.equal(await page.evaluate(() => curId), 'recent-8');
      const json = await page.evaluate(async () => JSON.stringify(await backupData()));
      assert.doesNotMatch(json, /ezrehab-recent|recentClientIds|Recently opened|最近開啟/);
      await page.evaluate(async () => {
        const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('recent-other', { create: true });
        store = folderStore(root);
        await store.saveClient({ id: 'recent-8', name: 'Other synthetic client', ref: 'OTHER', plan: newClientPlan() });
        await finishBoot();
      });
      assert.deepEqual(await page.evaluate(() => recentClientIds()), ['recent-8']);
      await page.evaluate(async () => { store = folderStore(await (await navigator.storage.getDirectory()).getDirectoryHandle('recent-main')); await finishBoot(); });
      assert.deepEqual(await page.evaluate(() => recentClientIds()), ['recent-8']);
      assert.deepEqual(errors, []);
      evidence.push(`${locale}: empty state, alphabetical fallback, max eight IDs, per-folder history, reload/startup, five recent listbox rows, Up/Down/Enter/Escape, stale cleanup, deletion and backup isolation`);
      console.log('PASS: ' + evidence.at(-1)); await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
