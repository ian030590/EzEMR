const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/help-menu');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en', context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(12000);
      await context.route(/^https?:/, route => { outbound.push(route.request().url()); return route.abort(); });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(appPath).href); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const trigger = page.locator('#helpMenuButton'), menu = page.locator('#helpMenu');
      const focusIs = selector => page.locator(selector).evaluate(node => node === document.activeElement);
      assert.equal(await page.evaluate(() => !!store), false);
      assert.equal(await trigger.innerText(), en ? 'Help' : '說明');
      assert.equal(await trigger.getAttribute('aria-haspopup'), 'menu');
      assert.equal(await trigger.getAttribute('aria-controls'), 'helpMenu');
      assert.equal(await menu.getAttribute('role'), 'menu');
      assert.equal(await menu.getAttribute('aria-labelledby'), 'helpMenuButton');
      await page.locator('#viewMenuButton').focus(); await page.keyboard.press('ArrowRight');
      assert.equal(await focusIs('#helpMenuButton'), true);
      await page.keyboard.press('ArrowRight'); assert.equal(await focusIs('#fileMenuButton'), true);
      await page.keyboard.press('ArrowLeft'); await page.keyboard.press('ArrowDown');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      assert.equal(await focusIs('#helpMenu [data-action="help-start"]'), true);
      await page.keyboard.press('ArrowDown'); assert.equal(await focusIs('#helpMenu [data-action="help-shortcuts"]'), true);
      await page.keyboard.press('End'); assert.equal(await focusIs('#helpMenu [data-action="example"]'), true);
      await page.keyboard.press('ArrowDown'); assert.equal(await focusIs('#helpMenu [data-action="help-start"]'), true);
      await page.keyboard.press('Enter'); await page.waitForSelector('.modal');
      assert.equal(await page.locator('.modal h3').innerText(), en ? 'Quick start' : '快速上手');
      assert.equal(await page.locator('.modal ol > li').count(), 7);
      assert.equal(await page.locator('.modal').getAttribute('aria-modal'), 'true');
      assert.equal(await page.locator('.modal').getAttribute('aria-labelledby'), 'dialogTitle');
      assert.equal(await focusIs('#helpClose'), true);
      await page.keyboard.press('Tab'); assert.equal(await focusIs('#helpClose'), true, 'Dialog focus remains inside');
      await page.keyboard.press('Escape');
      assert.equal(await focusIs('#helpMenuButton'), true);
      assert.equal(await page.evaluate(() => !!store), false, 'Opening Help does not create or connect storage');
      await trigger.focus(); await page.keyboard.press('ArrowUp');
      assert.equal(await focusIs('#helpMenu [data-action="example"]'), true);
      await page.keyboard.press('Tab'); assert.equal(await menu.isHidden(), true);

      for (const theme of ['light', 'dark']) for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        for (const [action, heading] of [['help-start', en ? 'Quick start' : '快速上手'], ['help-shortcuts', en ? 'Keyboard shortcuts' : '鍵盤快速鍵']]) {
          await trigger.click();
          const bounds = await menu.boundingBox();
          assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= 900);
          await menu.locator(`[data-action="${action}"]`).click();
          assert.equal(await page.locator('.modal h3').innerText(), heading);
          if (action === 'help-shortcuts') {
            const text = await page.locator('.modal').innerText();
            for (const key of ['S', 'O', 'Enter', 'Escape']) assert.ok(text.includes(key));
            assert.match(text, en ? /up and down arrows/ : /上下方向鍵/);
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.modal').scrollWidth <= document.querySelector('.modal').clientWidth), true);
          if (en) assert.doesNotMatch(await page.locator('.modal').innerText(), /\p{Script=Han}/u);
          if (width === 320) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${action}.png`), fullPage: true });
          await page.locator('#helpClose').click();
          assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
        }
      }

      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await trigger.click(); await menu.locator('[data-action="example"]').click();
      await page.waitForSelector('.client-summary');
      assert.equal(await page.evaluate(() => cur().ref), 'DEMO-001');
      assert.equal(await page.evaluate(() => sessions.length), 4, 'Help reuses the existing example dataset');
      const stored = await page.evaluate(async () => JSON.stringify(await backupData()));
      await page.locator('.client-head [data-action="new-session"]').click();
      await page.locator('#s-subj').fill('Synthetic unfinished record');
      await trigger.click(); await menu.locator('[data-action="help-start"]').click();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic unfinished record');
      await trigger.click(); await menu.locator('[data-action="example"]').click();
      await page.waitForSelector('#askNo'); await page.locator('#askNo').click();
      assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic unfinished record');
      assert.equal(await page.evaluate(() => clients.length), 1, 'Canceling the existing discard confirmation leaves the current client and draft intact');
      assert.equal(await page.evaluate(async before => { const a = JSON.parse(before), b = await backupData(); delete a.exported; delete b.exported; return JSON.stringify(a) === JSON.stringify(b); }, stored), true);
      await page.evaluate(() => { dirty = false; });
      assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
      await context.close();
      console.log(`PASS: ${locale}: Help without storage, shared menu keyboard/ARIA, 7-step guide, actual shortcuts, focus trap/restore, sample entry, dirty-draft confirmation, light/dark 320/768/1280px and no outbound requests`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
