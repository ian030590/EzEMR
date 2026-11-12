const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const source = await fs.readFile(appPath), evidence = [];
  const output = path.resolve(__dirname, '../.tmp/verification/error-guidance');
  await fs.mkdir(output, { recursive: true });
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      await context.addInitScript(locale => { try { localStorage.setItem('ezrehab-language', locale); } catch (_) {} }, locale);
      const page = await context.newPage(), errors = [], outbound = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (!request.url().startsWith(url) && !/^(blob:|data:)/.test(request.url())) outbound.push(request.url()); });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.evaluate(async () => {
        const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('errors', { create: true });
        store = folderStore(root);
        await store.saveClient({ id: 'error-client', name: 'Synthetic error client', ref: 'TEST-ERROR', plan: newClientPlan(), trainingPlan: clone(TRAIN) });
        await finishBoot(); window.realErrorSave = store.saveSession;
      });
      await action('new-session').click(); await page.locator('#s-subj').fill('Synthetic draft must remain');
      const cases = [
        { name: 'Error', match: locale === 'en' ? /Try again.*keep this window open.*backup/s : /請再試一次.*保留此視窗.*備份/s },
        { name: 'NotAllowedError', match: locale === 'en' ? /Reconnect the record folder and allow editing/ : /重新連接病歷資料夾，並允許編輯/, reconnect: true },
        { name: 'Error', message: 'Permission denied', match: locale === 'en' ? /Reconnect the record folder/ : /重新連接病歷資料夾/, reconnect: true },
        { name: 'SecurityError', message: 'Blocked', match: locale === 'en' ? /Reconnect the record folder/ : /重新連接病歷資料夾/, reconnect: true },
        { name: 'NotFoundError', match: locale === 'en' ? /moved, renamed or deleted/ : /移動、改名或刪除/, reconnect: true },
        { name: 'NoModificationAllowedError', message: 'Modifications are not allowed', match: locale === 'en' ? /Excel.*Close that file.*save again/s : /Excel.*關閉該檔案.*儲存/s },
        { name: 'InvalidStateError', match: /Excel/ },
        { name: 'QuotaExceededError', match: locale === 'en' ? /storage is full.*Free some space/s : /儲存空間已滿.*騰出空間/s },
        { name: 'Error', message: 'File locked by another program', match: /Excel/ }
      ];
      let index = 0;
      for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        for (const test of cases) {
          const raw = (test.message || test.name) + ' INTERNAL_RAW_' + index++;
          await page.evaluate(({ name, raw }) => { store.saveSession = async () => { throw new DOMException(raw, name); }; }, { name: test.name, raw });
          await page.locator('#s-plan').scrollIntoViewIfNeeded();
          await action('save-session').click();
          const alert = page.locator('.failure-message');
          await alert.waitFor().catch(async error => {
            console.error({ locale, theme, width, test, state: await page.evaluate(() => ({ view, dirty, savingSession, patientReady, failures: failures.map(f => f.raw), invalid: [...document.querySelectorAll('#soapForm :invalid')].map(node => node.id), main: document.querySelector('#main')?.innerText.slice(0, 250) })) });
            throw error;
          });
          assert.equal(await alert.getAttribute('role'), 'alert');
          assert.equal(await alert.evaluate(node => { const r = node.getBoundingClientRect(); return r.top >= document.querySelector('#applicationBar').getBoundingClientRect().bottom - 1 && r.top < innerHeight; }), true, 'A failure is brought into view below the toolbar');
          assert.equal(await alert.locator('strong').innerText(), locale === 'en' ? 'Failed to save record' : '病歷儲存失敗');
          assert.match(await alert.innerText(), test.match);
          assert.match(await alert.innerText(), locale === 'en' ? /still on screen.*has not been lost/ : /仍在畫面上.*沒有遺失/);
          assert.equal((await alert.innerText()).includes(raw), false);
          assert.equal((await alert.textContent()).includes(raw), true);
          assert.equal(await alert.locator('details').getAttribute('open'), null);
          assert.equal(await alert.locator('[data-failure-reconnect]').count(), test.reconnect ? 1 : 0);
          if (test.name === 'Error' && !test.message || test.name === 'NotAllowedError' && theme === 'light' && width === 320) {
            await page.waitForTimeout(6200);
            assert.equal(await alert.isVisible(), true, 'Failure persists beyond the previous toast timeout');
            await page.evaluate(() => toast(ui('病歷已複製')));
            assert.equal(await alert.isVisible(), true, 'A confirmation cannot replace an undismissed error');
          }
          await alert.locator('summary').focus(); await page.keyboard.press('Enter');
          assert.equal(await alert.locator('pre').innerText(), raw);
          await page.keyboard.press('Enter');
          assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic draft must remain');
          assert.equal(await page.evaluate(() => dirty), true);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          const layout = await page.evaluate(() => {
            const failure = document.querySelector('.failure-message').getBoundingClientRect(), save = document.querySelector('#toolbarSave').getBoundingClientRect();
            return { overlap: failure.left < save.right && failure.right > save.left && failure.top < save.bottom && failure.bottom > save.top, fits: document.querySelector('.failure-message').scrollWidth <= document.querySelector('.failure-message').clientWidth };
          });
          assert.equal(layout.overlap, false, 'The failure does not cover Save'); assert.equal(layout.fits, true);
          if (test.name === 'Error' && !test.message) {
            const contrast = await alert.evaluate(node => {
              const luminance = value => { const rgb = value.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }); return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2]; };
              const style = getComputedStyle(node), background = luminance(style.backgroundColor);
              const ratio = color => { const foreground = luminance(color); return (Math.max(foreground, background) + .05) / (Math.min(foreground, background) + .05); };
              return { text: ratio(style.color), boundary: ratio(style.borderLeftColor), focus: getComputedStyle(node.querySelector('summary')).outlineStyle };
            });
            assert.ok(contrast.text >= 4.5 && contrast.boundary >= 3, 'Failure text and status border meet AA contrast in each theme');
          }
          assert.equal(await page.evaluate(() => readDraftCopies().some(copy => copy.clientId === curId)), true, 'A failed save retains its safety copy');
          await page.locator('#toolbarSave').scrollIntoViewIfNeeded();
          assert.equal(await page.locator('#toolbarSave').evaluate(node => { const r = node.getBoundingClientRect(); return document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)?.closest('#toolbarSave') === node; }), true);
          if (test.name === 'NotAllowedError' && theme === 'light' && width === 1280) {
            await page.evaluate(() => {
              const root = store.root;
              window.showDirectoryPicker = async () => ({ name: root.name, requestPermission: async () => 'granted', getDirectoryHandle: root.getDirectoryHandle.bind(root), getFileHandle: root.getFileHandle.bind(root), entries: root.entries.bind(root), removeEntry: root.removeEntry.bind(root) });
              window.realReconnectGet = Storage.prototype.getItem; window.realReconnectToast = toast; window.reconnectSafekeepingNotes = 0;
              Storage.prototype.getItem = function(key) { if (key === DRAFT_KEY) throw new DOMException('Synthetic blocked draft storage', 'SecurityError'); return realReconnectGet.call(this, key); };
              toast = message => { if (message === ui('無法自動暫存，請定期儲存。')) reconnectSafekeepingNotes++; realReconnectToast(message); };
              draftLastJSON = null; keepDraftNow();
            });
            await alert.locator('[data-failure-reconnect]').click();
            await page.waitForFunction(() => !failures.some(failure => failure.reconnecting));
            assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic draft must remain', 'Reconnecting from an error retains the draft');
            assert.equal(await page.evaluate(() => dirty), true);
            assert.equal(await page.evaluate(() => reconnectSafekeepingNotes), 1, 'Reconnecting does not repeat the safekeeping note for the same edit session');
            await page.evaluate(() => { Storage.prototype.getItem = realReconnectGet; toast = realReconnectToast; keepDraftNow(); });
          }
          if (test.name === 'Error' && !test.message) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          await page.locator('.failure-message [data-failure-dismiss]').focus(); await page.keyboard.press('Enter');
          assert.equal(await page.locator('.failure-message').count(), 0);
        }
      }
      await page.evaluate(async () => {
        await safe(async () => { throw new Error('Unknown synthetic settings failure'); }, ui('無法儲存設定')).catch(() => {});
      });
      assert.match(await page.locator('.failure-message').innerText(), locale === 'en' ? /Settings could not be saved/ : /無法儲存設定/);
      await page.locator('.failure-message summary').focus(); await page.keyboard.press('Escape');
      assert.equal(await page.locator('.failure-message').count(), 0);
      await page.evaluate(() => { store.saveSession = realErrorSave; });
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => sessions[0].subjective), 'Synthetic draft must remain');
      assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
      evidence.push(`${locale}: save/permission/moved/locked/quota/unknown failures, collapsed details, persistent alert, success isolation, keyboard disclosure/dismiss, reconnect retention and accessible Save at 320/1280px in light/dark`);
      console.log('PASS: ' + evidence.at(-1)); await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
