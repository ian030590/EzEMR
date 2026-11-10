const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '..', '.tmp', 'verification', 'metro-ui');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const evidence = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], requests = [];
      page.setDefaultTimeout(10000);
      const palette = selector => page.locator(selector).evaluate(node => {
        const style = getComputedStyle(node), background = style.backgroundColor, foreground = style.color, border = style.borderColor;
        const swatch = document.createElement('span'); swatch.style.setProperty('transition', 'none', 'important'); document.body.append(swatch);
        const resolve = color => { swatch.style.color = color; return getComputedStyle(swatch).color; };
        const colors = { background, foreground, border, accent: resolve('var(--accent)'), ink: resolve('var(--accent-ink)'), bad: resolve('var(--bad)'), surface: resolve('var(--surface)'), hover: resolve('hsl(from var(--accent) h s calc(l - 10))') };
        swatch.remove(); return colors;
      });
      const settledPalette = async (selector, properties) => {
        const colors = await palette(selector);
        const expected = Object.fromEntries(Object.entries(properties).map(([property, token]) => [property, colors[token]]));
        await page.waitForFunction(({ selector, expected }) => {
          const style = getComputedStyle(document.querySelector(selector));
          return Object.entries(expected).every(([property, color]) => style[property] === color);
        }, { selector, expected });
        return palette(selector);
      };
      const equalButtons = async selector => {
        for (const group of await page.locator(selector).all()) {
          const buttons = await group.locator(':scope > button:visible').evaluateAll(nodes => nodes.map(node => {
            const box = node.getBoundingClientRect(), style = getComputedStyle(node);
            return { width: box.width, height: box.height, padding: style.padding, margin: style.margin };
          }));
          if (buttons.length < 2) continue;
          assert.ok(buttons.every(button => Math.abs(button.width - buttons[0].width) < 1 && Math.abs(button.height - buttons[0].height) < 1 && button.padding === buttons[0].padding && button.margin === buttons[0].margin), `${selector}: adjacent Metro buttons use equal dimensions and spacing: ${JSON.stringify(buttons)}`);
        }
      };
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (/^https?:/i.test(request.url())) requests.push(request.url()); });
      await context.route(/^https?:/, route => route.abort());
      await page.goto(pathToFileURL(appPath).href);
      await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const components = await page.evaluate(() => ({
        version: Metro.version, autoInit: METRO_INIT,
        appbar: Metro.getPlugin('#applicationBar', 'app-bar')?.name,
        input: Metro.getPlugin('#clientSearch', 'input')?.name,
        dropdowns: ['file', 'client', 'view', 'export'].map(name => ({ name, plugin: Metro.getPlugin('#' + name + 'Menu', 'dropdown')?.name, ready: Metro.getPlugin('#' + name + 'Menu', 'dropdown')?.ready }))
      }));
      assert.equal(components.version, '5.1.20');
      assert.equal(components.autoInit, false, 'Only the explicitly selected Metro widgets initialize');
      assert.equal(components.appbar, 'appbar');
      assert.equal(components.input, 'input');
      assert.ok(components.dropdowns.every(component => component.plugin === 'dropdown' && component.ready));
      await page.locator('#clientSearch').focus();
      assert.equal(await page.locator('#clientSearch').evaluate(input => input.closest('.input').classList.contains('focused')), true, 'Metro Input owns focus presentation');
      await page.locator('h1').click();
      assert.equal(await page.locator('#clientSearch').evaluate(input => input.closest('.input').classList.contains('focused')), false);

      for (const name of ['file', 'client', 'view', 'export']) {
        const button = page.locator('#' + name + 'MenuButton'), menu = page.locator('#' + name + 'Menu');
        await button.click();
        assert.equal(await page.evaluate(name => Metro.getPlugin('#' + name + 'Menu', 'dropdown').isOpen, name), true, 'Clicks open the genuine Metro dropdown instance');
        assert.equal(await button.getAttribute('aria-expanded'), 'true');
        assert.equal(await menu.isVisible(), true);
        await page.evaluate(name => Metro.getPlugin('#' + name + 'Menu', 'dropdown').close(true), name);
        assert.equal(await menu.isHidden(), true, 'The Metro close API updates the application menu state');
        assert.equal(await button.getAttribute('aria-expanded'), 'false');
      }
      await page.locator('#fileMenuButton').focus(); await page.keyboard.press('ArrowDown');
      assert.equal(await page.locator('#fileMenu [data-action="new-client"]').evaluate(button => button === document.activeElement), true);
      assert.equal(await page.locator('#fileMenu [data-action="new-client"]').evaluate(button => getComputedStyle(button).outlineStyle), 'solid', 'Keyboard navigation retains a visible focus ring after Metro resets');
      await page.keyboard.press('End'); await page.keyboard.press('Home');
      assert.equal(await page.locator('#fileMenu [data-action="new-client"]').evaluate(button => button === document.activeElement), true);
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#fileMenuButton').evaluate(button => button === document.activeElement), true);
      evidence.push(`${locale}: pinned Metro app-bar/Input/dropdown instances own actual focus, click and programmatic state; the accessibility adapter preserves menu keyboard navigation`);

      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await page.locator('#patientSearch [data-action="new-client"]').click();
      await page.waitForFunction(() => [...document.querySelectorAll('#cForm button')].every(button => button.classList.contains('button')));
      await equalButtons('.modal .row');
      await page.locator('#cf-name').fill('Metro fixture'); await page.locator('#cf-ref').fill('TEST-METRO');
      await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
      await page.locator('#viewMenuButton').click(); await page.locator('#viewMenu [data-action="global-settings"]').click();
      await page.waitForFunction(() => [...document.querySelectorAll('#appSettingsForm button')].every(button => button.classList.contains('button')));
      await equalButtons('.modal .row');
      assert.equal(await page.locator('#appSettingsForm input[type="checkbox"]').count(), 14);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        await page.mouse.move(0, 0);
        let colors = await settledPalette('#settingsSave', { backgroundColor: 'accent', color: 'ink' });
        assert.equal(colors.background, colors.accent, `${locale} ${theme}: Save settings uses the application accent rather than Metro's red primary color`);
        assert.equal(colors.foreground, colors.ink);
        await page.screenshot({ path: path.join(output, `${locale}-settings-${theme}-1280.png`) });
        await page.locator('#settingsSave').hover();
        colors = await settledPalette('#settingsSave', { backgroundColor: 'hover', color: 'ink' });
        assert.equal(colors.background, colors.hover, `${locale} ${theme}: the Metro hover shade follows the application accent`);
      }
      await page.keyboard.press('Escape');
      await page.locator('.patient-actions [data-action="edit-client"]').click();
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        const colors = await settledPalette('#cDel', { color: 'bad' });
        assert.equal(colors.foreground, colors.bad, `${locale} ${theme}: Delete retains its destructive color`);
        await page.locator('#cDel').hover();
        assert.equal((await settledPalette('#cDel', { borderColor: 'bad' })).border, colors.bad);
      }
      await page.locator('#cDel').click();
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        await page.mouse.move(0, 0);
        const colors = await settledPalette('#askYes', { backgroundColor: 'bad', color: 'surface' });
        assert.equal(colors.background, colors.bad, `${locale} ${theme}: confirmation uses the destructive fill`);
        assert.equal(colors.foreground, colors.surface);
      }
      await page.locator('#askNo').click();
      evidence.push(`${locale}: light/dark save buttons and their Metro hover use the application accent; delete buttons and confirmation retain destructive colors`);
      await equalButtons('.patient-actions');
      await page.evaluate(async () => {
        await store.saveSession(curId, { id: 'metro-session', date: today(), visit: 'treatment', sym: [], assess: {}, training: {} });
        await loadSessions(); view = 'sessions'; renderMain();
      });
      await equalButtons('.session-actions');
      await page.locator('.client-head [data-action="new-session"]').click();
      await page.waitForFunction(() => [...document.querySelectorAll('#soapForm button')].every(button => button.classList.contains('button')));
      assert.ok(await page.locator('#soapForm button.button').count());
      evidence.push(`${locale}: dynamically created patient/settings/editor buttons use Metro button styling while native form semantics and stored data remain intact`);

      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        for (const width of [320, 360, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          const layout = await page.evaluate(() => ({ fits: document.documentElement.scrollWidth <= innerWidth,
            overflow: [...document.querySelectorAll('body *')].filter(node => !node.closest('script,style,.scroll') && node.getBoundingClientRect().width && node.getBoundingClientRect().right > innerWidth + .5).map(node => ({ tag: node.tagName, cls: node.className?.baseVal || node.className, right: node.getBoundingClientRect().right })) }));
          assert.equal(layout.fits, true, `${locale} ${theme} ${width}px editor fit: ${JSON.stringify(layout.overflow)}`);
          const sizes = await page.locator('.app-chrome button:visible, .app-chrome select:visible, #clientSearch').evaluateAll(nodes => nodes.map(node => {
            const style = getComputedStyle(node), rect = node.getBoundingClientRect();
            return { width: rect.width, height: rect.height, font: parseFloat(style.fontSize) };
          }));
          assert.ok(sizes.every(size => size.width >= 44 && size.height >= 44 && size.font === 13));
          if (width === 1280) assert.equal((await page.locator('.app-chrome').boundingBox()).height, 61, 'Metro controls retain 8px outer spacing and 44px control height');
          await equalButtons('.menubar, .tool-group:visible');
          for (const name of ['file', 'client', 'view', 'export']) {
            await page.locator('#' + name + 'MenuButton').click();
            const box = await page.locator('#' + name + 'Menu').boundingBox();
            assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= width && box.y + box.height <= 900, `${locale} ${theme} ${width}px ${name} dropdown fits immediately after a resize`);
            await page.keyboard.press('Escape');
          }
          if ([360, 1280].includes(width)) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
        }
      }
      assert.deepEqual(errors, []);
      assert.deepEqual(requests, [], 'The local UI initializes and works without any HTTP request');
      evidence.push(`${locale}: Metro controls, menus and editor fit 320/360/768/1280px in both themes with 13px text, equal targets, outer spacing and zero HTTP requests`);
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
    evidence.forEach(message => console.log('PASS: ' + message));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
