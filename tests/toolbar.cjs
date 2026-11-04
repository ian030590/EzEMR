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
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce', acceptDownloads: true });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  const errors = []; page.on('pageerror', error => errors.push(error.message));
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const menu = name => page.locator(`#${name}MenuButton`);
  const openMenu = async name => { await menu(name).click(); assert.equal(await menu(name).getAttribute('aria-expanded'), 'true'); };
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await page.locator('.topbar button').count(), 0);
    assert.equal(await page.locator('#toolbarSave').isDisabled(), true);
    assert.equal(await action('new-session').isDisabled(), true);
    await openMenu('export'); await page.keyboard.press('Escape');
    assert.equal(await menu('export').getAttribute('aria-expanded'), 'false');
    await openMenu('file');
    assert.equal(await page.locator('#fileMenu [data-action="save-session"]').isDisabled(), true);
    await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#fileMenu [data-action="import-records"]').evaluate(b => b === document.activeElement), true);
    await page.keyboard.press('Home');
    assert.equal(await page.locator('#fileMenu [data-action="new-client"]').evaluate(b => b === document.activeElement), true);
    await page.keyboard.press('End'); await page.keyboard.press('ArrowDown');
    assert.equal(await page.locator('#fileMenu [data-action="new-client"]').evaluate(b => b === document.activeElement), true);
    await page.keyboard.press('ArrowRight');
    assert.equal(await menu('client').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('.command-menu:visible').count(), 1);
    await page.keyboard.press('Escape');
    assert.equal(await menu('client').evaluate(b => b === document.activeElement), true);
    await menu('view').focus(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await openMenu('file'); await page.locator('h1').click();
    assert.equal(await page.locator('.command-menu:visible').count(), 0);
    await openMenu('file'); await page.keyboard.press('Tab');
    assert.equal(await menu('client').evaluate(b => b === document.activeElement), true);
    check('Title contains no commands; disabled states, exclusive menus, arrows, Home/End, Enter, Escape, Tab and outside clicks work');

    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory();
      window.testRoot = await disk.getDirectoryHandle('toolbar-records', { create: true });
      store = folderStore(testRoot); await finishBoot();
    });
    await openMenu('client'); await action('new-client').last().click();
    await page.locator('#cf-name').fill('工具列測試個案'); await page.locator('#cf-ref').fill('TEST-TOOLBAR');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
    await openMenu('client'); await action('edit-client').click();
    assert.equal(await page.locator('#cf-name').inputValue(), '工具列測試個案'); await page.keyboard.press('Escape');
    await action('new-session').click();
    assert.equal(await page.locator('#toolbarSave').isEnabled(), true);
    assert.equal(await page.locator('.editor-head button').count(), 0);
    await page.locator('#toolbarSave').focus(); await page.keyboard.press('ArrowRight');
    assert.equal(await action('import-records').evaluate(b => b === document.activeElement), true);
    await page.keyboard.press('End');
    assert.equal(await action('cancel-edit').evaluate(b => b === document.activeElement), true);
    await page.keyboard.press('Home');
    assert.equal(await action('new-session').evaluate(b => b === document.activeElement), true);
    await page.locator('#s-subj').fill('Ctrl+S 工具列儲存測試'); await page.keyboard.press('Control+s');
    await page.waitForSelector('.sess');
    assert.equal(await page.evaluate(() => sessions[0].subjective), 'Ctrl+S 工具列儲存測試');
    assert.equal(await page.locator('#toolbarSave').isDisabled(), true);
    assert.equal(await page.locator('#toolbarSave svg').count(), 1);
    assert.equal(await page.locator('#toolbarSave [data-label]').innerText(), '儲存');
    assert.deepEqual((await page.evaluate(async () => fileNames(await testRoot.getDirectoryHandle('TEST-TOOLBAR')))).map(n => path.extname(n)).sort(), ['.csv', '.pdf', '.txt']);
    check('Client menu opens creation/editing; toolbar arrows navigate; Ctrl+S writes CSV, PDF and TXT and restores the disabled Save control and icon');

    await action('open-session').click(); await page.locator('#s-subj').fill('失敗後仍保留的草稿');
    await page.evaluate(() => { window.realSave = store.saveSession; store.saveSession = async () => { throw new Error('測試寫入失敗'); }; });
    await openMenu('file'); await page.locator('#fileMenu [data-action="save-session"]').click();
    await page.waitForFunction(() => document.querySelector('.toast')?.textContent.includes('測試寫入失敗'));
    assert.equal(await page.locator('#s-subj').inputValue(), '失敗後仍保留的草稿');
    assert.equal(await page.locator('#toolbarSave').isEnabled(), true);
    assert.equal(await page.locator('#toolbarSave svg').count(), 1);
    assert.match(await page.locator('#fileMenu [data-action="save-session"]').innerText(), /Ctrl\+S/);
    await action('cancel-edit').click(); await page.waitForSelector('#askNo'); await page.keyboard.press('Escape');
    assert.equal(await page.locator('#s-subj').inputValue(), '失敗後仍保留的草稿');
    await page.evaluate(() => {
      window.saveCalls = 0;
      store.saveSession = async (...args) => { saveCalls++; await new Promise(resolve => { window.releaseSave = resolve; }); return realSave(...args); };
    });
    await page.keyboard.press('Meta+s'); await page.waitForFunction(() => !!window.releaseSave);
    assert.equal(await page.locator('#toolbarSave').isDisabled(), true);
    await page.keyboard.press('Control+s'); assert.equal(await page.evaluate(() => saveCalls), 1);
    await page.evaluate(() => releaseSave()); await page.waitForSelector('.sess');
    await page.evaluate(() => { store.saveSession = realSave; });
    assert.equal(await page.evaluate(() => sessions[0].subjective), '失敗後仍保留的草稿');
    check('File-menu Save preserves a failed draft and shortcut labels; cancel confirmation retains edits; Cmd+S retries and repeated shortcuts cannot duplicate a pending save');

    const chooserEvent = page.waitForEvent('filechooser'); await action('import-records').click();
    const chooser = await chooserEvent;
    const csv = await page.evaluate(() => clientsCSV([{ client: cur(), folder: cur().ref }]));
    await chooser.setFiles({ name: 'clients.csv', mimeType: 'text/csv', buffer: Buffer.from(csv) });
    await page.waitForFunction(() => document.querySelector('.toast')?.textContent.includes('已匯入'));
    await openMenu('export');
    const downloadEvent = page.waitForEvent('download'); await action('export-roster').click();
    assert.equal((await downloadEvent).suggestedFilename(), 'clients.csv');
    await page.evaluate(() => { window.showDirectoryPicker = async () => { window.openCalls = (window.openCalls || 0) + 1; throw new DOMException('Cancelled', 'AbortError'); }; });
    await page.keyboard.press('Control+o'); await page.waitForFunction(() => openCalls === 1);
    assert.equal(await page.locator('.client-btn').count(), 1);
    check('Toolbar Import opens the file chooser and restores CSV; Export downloads the roster; Ctrl+O cancellation preserves the current client');

    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
      for (const width of [320, 360, 768, 1280]) {
        await page.setViewportSize({ width, height: 800 });
        for (const name of ['file', 'client', 'view', 'export']) {
          await openMenu(name);
          const rect = await page.locator(`#${name}Menu`).boundingBox();
          assert.ok(rect.x >= 0 && rect.x + rect.width <= width && rect.y + rect.height <= 800, `${theme} ${width}px ${name} menu bounds`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.keyboard.press('Escape');
        }
        await action('new-session').click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const targets = await page.locator('.command-area button:visible').evaluateAll(buttons => buttons.map(b => { const r = b.getBoundingClientRect(); return [r.width, r.height]; }));
        assert.ok(targets.every(([w, h]) => w >= 44 && h >= 44));
        await page.evaluate(() => document.querySelectorAll('.toast').forEach(t => t.remove()));
        if ([360, 1280].includes(width)) await page.screenshot({ path: path.join(output, `toolbar-${theme}-${width}.png`) });
        await action('cancel-edit').click();
      }
    }
    await page.setViewportSize({ width: 1280, height: 800 }); await action('new-session').click();
    await page.locator('#s-subj').scrollIntoViewIfNeeded();
    assert.ok((await page.locator('#toolbarSave').boundingBox()).y >= 0);
    await openMenu('export');
    await page.evaluate(() => new Promise(requestAnimationFrame));
    assert.equal(await menu('export').getAttribute('aria-expanded'), 'true');
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')));
    assert.equal(await menu('export').getAttribute('aria-expanded'), 'true', 'A delayed event at the opening position must not close the menu');
    await page.evaluate(() => scrollTo(0, scrollY + 100));
    await page.waitForFunction(() => document.querySelector('#exportMenu').hidden);
    check('A sticky menu stays open after focus-related scroll events and closes when the page actually scrolls');
    assert.deepEqual(errors, []);
    check('All menus and editor controls fit light/dark 320/360/768/1280px layouts; targets are at least 44px and Save remains visible while scrolling');
    await fs.writeFile(path.join(output, 'toolbar-results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
