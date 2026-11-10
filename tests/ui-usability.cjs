const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/ui-usability');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [], requests = [];
      page.on('pageerror', e => errors.push(e.message));
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await page.locator('[data-action="example"]:visible').click();
        const toastLayout = await page.locator('.toast').evaluate(node => {
          const toast = node.getBoundingClientRect(), main = document.querySelector('#main').getBoundingClientRect();
          return { position: getComputedStyle(node).position, toastBottom: toast.bottom, mainTop: main.top };
        });
        assert.equal(toastLayout.position, 'static', `${locale}: confirmation stays in document flow`);
        assert.ok(toastLayout.toastBottom <= toastLayout.mainTop, `${locale}: confirmation does not cover the workspace`);
        await page.locator('.toast').evaluate(node => node.remove());
        const disabledCursor = await page.evaluate(() => {
          const button = document.createElement('button'); button.className = 'btn'; button.disabled = true; document.body.append(button);
          const cursor = getComputedStyle(button).cursor; button.remove(); return cursor;
        });
        assert.equal(disabledCursor, 'not-allowed', 'Disabled actions do not imply that work is still loading');
        assert.ok(await page.locator('body').evaluate(node => parseFloat(getComputedStyle(node).lineHeight) / parseFloat(getComputedStyle(node).fontSize) >= 1.4), 'Body leading remains readable');
        const original = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
          for (const width of [320, 360, 768, 1280]) {
            await page.setViewportSize({ width, height: 800 });
            await page.locator('#tab-plan').click();
            const searchFits = await page.locator('#clientSearch').evaluate(input => {
              const canvas = document.createElement('canvas'), style = getComputedStyle(input), context = canvas.getContext('2d');
              context.font = style.font;
              return context.measureText(input.placeholder).width <= input.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 24;
            });
            assert.equal(searchFits, true, `${locale} ${theme} ${width}px: the search hint fits without clipping`);
            assert.ok(parseFloat(await page.locator('#clientSearch').evaluate(input => getComputedStyle(input).fontSize)) >= 14, `${locale}: search text is at least 14px`);
            const limit = width === 1280 ? 68 : width === 320 ? 230 : 180;
            assert.ok((await page.locator('.app-chrome').boundingBox()).height <= limit, `${locale} ${theme} ${width}: browsing header stays compact`);
            const row = page.locator('.template-row').nth(1);
            await row.scrollIntoViewIfNeeded();
            const buttons = await row.locator('.row button').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().toJSON()));
            assert.equal(buttons.length, 3);
            assert.ok(buttons.every(button => button.width >= 44 && button.height >= 44 && Math.abs(button.y - buttons[0].y) < 1), 'Edit, copy and enable/disable actions share a row with usable targets');
            const position = await page.evaluate(() => scrollY);
            await row.locator('[data-action="item-edit"]').click();
            assert.equal(await page.locator('.app').evaluate(node => node.inert), true);
            assert.equal(await page.locator('.app-chrome').evaluate(node => node.inert), true);
            await page.mouse.move(4, 760); await page.mouse.wheel(0, 480);
            await page.waitForTimeout(120);
            assert.equal(await page.evaluate(() => scrollY), position, 'Scrolling outside a dialog does not move the patient workspace');
            await page.locator('.modal').evaluate(node => { node.scrollTop = node.scrollHeight; });
            await page.locator('#itemForm [type="submit"]').focus();
            await page.keyboard.press('Tab');
            assert.equal(await page.locator('#item-name').evaluate(node => node === document.activeElement), true, 'Tab wraps from Save to the first dialog field');
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('.modal').count(), 0);
            assert.equal(await page.locator('.app').evaluate(node => node.inert), false);
            assert.equal(await row.locator('[data-action="item-edit"]').evaluate(node => node === document.activeElement), true, 'Escape restores focus to the opening action');
            assert.equal(await page.evaluate(() => scrollY), position);

            await page.locator('.client-head [data-action="new-session"]').click();
            const editLimit = width === 1280 ? 68 : width === 320 ? 280 : width === 360 ? 230 : 180;
            assert.ok((await page.locator('.app-chrome').boundingBox()).height <= editLimit, `${locale} ${theme} ${width}: editing header stays compact`);
            if (width === 320 || width === 360) {
              const compactLimit = width === 320 ? 220 : 180;
              assert.ok((await page.locator('.app-chrome').boundingBox()).height <= compactLimit, `${locale} ${theme} ${width}: draft actions do not add another header row`);
              assert.equal(await page.locator('#draftTools').isVisible(), false, 'Mobile draft actions move out of the sticky header');
              assert.equal(await page.locator('.editor-copy-action').isVisible(), true, 'Copy note remains available in the editor');
            }
            const noteWidth = await page.locator('#soapForm .note').first().evaluate(node => getComputedStyle(node).maxWidth);
            assert.notEqual(noteWidth, 'none', 'Long instructions have a readable line measure');
            await page.waitForFunction(() => Math.abs(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--chrome-height')) - document.querySelector('.app-chrome').getBoundingClientRect().height) < 1);
            await page.locator('#s-subj').evaluate(node => node.scrollIntoView({ block: 'start' }));
            const header = await page.locator('.app-chrome').boundingBox(), field = await page.locator('#s-subj').boundingBox();
            assert.ok(field.y >= header.y + header.height, 'Scrolling to a form field keeps it below the sticky header');
            if (width === 360 || width === 1280) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-editor.png`) });
            const hint = page.locator('#symWrap').locator('xpath=preceding-sibling::p[1]');
            assert.equal(await hint.innerText(), locale === 'en' ? 'Scroll the table horizontally, or focus it and use the left and right arrow keys.' : '表格可左右捲動，或聚焦後使用左右方向鍵。');
            await page.locator('[data-action="cancel-edit"]:visible').first().click();
            await page.locator('#tab-outcomes').click();
            const region = page.locator('#tabBody .scroll').first();
            assert.equal(await region.getAttribute('tabindex'), '0');
            assert.equal(await region.getAttribute('role'), 'region');
            assert.equal(await region.evaluate(node => node.scrollHeight > node.clientHeight || getComputedStyle(node).overflowY !== 'scroll'), true, 'Tables do not force an empty vertical scrollbar');
            if (locale === 'en') assert.doesNotMatch(await region.getAttribute('aria-label'), /\p{Script=Han}/u);
            if (width <= 360) {
              assert.equal(await page.locator('.table-scroll-hint').first().isVisible(), true);
              await region.focus(); await page.keyboard.press('ArrowRight');
              await page.waitForFunction(() => document.querySelector('#tabBody .scroll').scrollLeft > 0);
              const headers = await region.locator('th').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().width));
              assert.ok(headers.every(value => value >= 96), 'Narrow tables preserve readable column widths');
              const rowHeader = region.locator('table.out tbody tr:first-child > :first-child');
              assert.equal(await rowHeader.evaluate(node => getComputedStyle(node).position), 'sticky', 'The first outcome column stays fixed while scrolling');
              const rowBounds = await rowHeader.boundingBox(), regionBounds = await region.boundingBox();
              assert.ok(rowBounds.x >= regionBounds.x && rowBounds.x < regionBounds.x + 120, 'Outcome values keep their row label in view');
            }
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            if (width === 360) await region.screenshot({ path: path.join(output, `${locale}-${theme}-360-progress.png`) });
          }
        }
        await page.evaluate(() => modal(ui('<h3>基本資料欄位</h3><details><summary>病史與基本資料</summary><p>基本資料</p></details><select aria-label="語言"><option>English</option></select><button>取消</button>')));
        assert.equal(await page.locator('.modal summary').evaluate(node => node === document.activeElement), true, 'A dialog focuses its first disclosure control');
        await page.keyboard.press('Tab');
        assert.equal(await page.locator('.modal select').evaluate(node => node === document.activeElement), true);
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.locator('.modal summary').evaluate(node => node === document.activeElement), true, 'Reverse navigation reaches the disclosure before the select');
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.locator('.modal button').evaluate(node => node === document.activeElement), true);
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), original, 'Reviewing, navigating and cancelling dialogs preserve all clinical data');
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale} light/dark offline UI at 320/360/768/1280px: compact headers, action rows, locked dialog background, focus restoration, readable keyboard-scrollable tables and unchanged patient data`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
