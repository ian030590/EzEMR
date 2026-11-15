const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '..', '.tmp', 'verification', 'button-affordance');
const evidence = [];
const check = message => { evidence.push(message); console.log('PASS: ' + message); };
const contrast = (foreground, background) => {
  const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};

async function inspectScreen(page, label) {
  await page.mouse.move(0, 0);
  await page.waitForFunction(() => {
    const probe = document.createElement('span'); probe.style.setProperty('transition', 'none', 'important'); probe.style.color = 'var(--control-line)'; document.body.append(probe);
    const outline = getComputedStyle(probe).color; probe.remove();
    return [...document.querySelectorAll('.btn')].filter(node => node.checkVisibility({ visibilityProperty: true }) && !node.disabled && !node.matches('.link, .x, .help-trigger, .workflow-steps .btn'))
      .every(node => getComputedStyle(node).borderTopColor === outline);
  }).catch(async error => {
    const borders = await page.evaluate(() => [...document.querySelectorAll('.btn')].filter(node => node.checkVisibility({ visibilityProperty: true }) && !node.disabled && !node.matches('.link, .x, .help-trigger, .workflow-steps .btn'))
      .map(node => ({ text: node.id || node.textContent.trim(), border: getComputedStyle(node).borderTopColor, token: getComputedStyle(node).getPropertyValue('--control-line'), hover: node.matches(':hover') })));
    throw new Error(`${label}: resting outlines did not settle: ${JSON.stringify(borders)}`, { cause: error });
  });
  const result = await page.evaluate(() => {
    const visible = node => node.checkVisibility({ visibilityProperty: true });
    const probe = document.createElement('span'); probe.style.setProperty('transition', 'none', 'important'); probe.style.position = 'fixed'; document.body.append(probe);
    const resolve = color => { probe.style.color = color; return getComputedStyle(probe).color; };
    const tokens = Object.fromEntries(['surface', 'sunk', 'line', 'control-line', 'muted', 'accent', 'accent-soft', 'bad'].map(name => [name, resolve('var(--' + name + ')')]));
    probe.remove();
    const buttons = [...document.querySelectorAll('.btn')].filter(visible).map(node => {
      const style = getComputedStyle(node);
      return { label: node.id || node.textContent.trim(), disabled: node.disabled, borderless: node.matches('.link, .x, .help-trigger, .workflow-steps .btn'),
        width: style.borderTopWidth, border: style.borderTopColor, background: style.backgroundColor, color: style.color, radius: style.borderTopLeftRadius,
        opacity: style.opacity, cursor: style.cursor };
    });
    const eyebrows = [...document.querySelectorAll('.eyebrow')].filter(node => visible(node) && !node.classList.contains('sr-only') && node.nextElementSibling?.matches('h1, h2, h3, h4, h5, h6')).map(node => node.textContent);
    const allowed = 'table.sym td.tp, #soapForm .short-stage > legend, .comparison-warning, .consistency-warning, .failure-message, .empty[role="alert"]';
    const stripes = [...document.querySelectorAll('#main *, #failureHost *')].filter(node => visible(node) && !node.matches(allowed)).filter(node => {
      const style = getComputedStyle(node);
      if (parseFloat(style.borderLeftWidth) >= 3 && style.borderLeftColor !== 'rgba(0, 0, 0, 0)') return true;
      return style.boxShadow.split(/,(?![^()]*\))/).some(shadow => {
        const lengths = shadow.replace(/rgba?\([^)]*\)/g, '').match(/-?[\d.]+px/g)?.map(parseFloat) || [];
        return shadow.includes('inset') && lengths[0] >= 3 && lengths[1] === 0 && lengths[2] === 0;
      });
    }).map(node => node.id || node.className);
    const borderless = [...document.querySelectorAll('.btn.link, .btn.x, .workflow-steps .btn, .app-chrome .tool-button, .command-menu button, .tab')].filter(visible)
      .map(node => [getComputedStyle(node).borderTopWidth, getComputedStyle(node).borderLeftWidth, getComputedStyle(node).borderRightWidth]);
    const help = [...document.querySelectorAll('.btn.help-trigger')].filter(visible).map(node => {
      const style = getComputedStyle(node); return [style.borderTopWidth, style.borderTopStyle, style.borderRadius];
    });
    const vendorUtilities = [...document.querySelectorAll('.gradient-text, .shape-decagon, .ani-pass, .ani-hover-pass, .focusable.primary, .metro-input.primary, .file.primary, .input.primary, .select.primary, .textarea.primary, .keypad.primary, .tag-input.primary, .spinner.primary, .dragged-item-avatar, [class*="bg-pattern-"], .progress, .progress-bar')]
      .filter(visible).map(node => node.className);
    return { tokens, buttons, eyebrows, stripes, borderless, help, vendorUtilities, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  assert.deepEqual(result.eyebrows, [], `${label}: no eyebrow immediately above a heading`);
  assert.deepEqual(result.stripes, [], `${label}: left edges belong only to stages and alerts`);
  assert.deepEqual(result.vendorUtilities, [], `${label}: flagged decorative Metro utilities are not used in the rendered interface`);
  assert.equal(result.overflow, false, `${label}: page-level overflow`);
  for (const button of result.buttons) {
    if (button.borderless) continue;
    if (button.disabled) {
      assert.equal(button.opacity, '1'); assert.equal(button.background, result.tokens.sunk); assert.equal(button.border, result.tokens.line);
      assert.equal(button.color, result.tokens.muted); assert.equal(button.cursor, 'not-allowed');
      assert.ok(contrast(button.color, button.background) >= 4.5, `${label}: readable disabled ${button.label}`);
    } else {
      assert.equal(button.width, '1px', `${label}: outlined ${button.label}`); assert.equal(button.radius, '6px');
      assert.notEqual(button.border, button.background, `${label}: resting border remains visible on ${button.label}`);
      assert.ok(contrast(button.border, result.tokens.surface) >= 3, `${label}: border contrast on ${button.label}`);
    }
  }
  for (const border of result.borderless) assert.deepEqual(border, ['0px', '0px', '0px'], `${label}: navigation, links and icon controls stay borderless`);
  for (const help of result.help) assert.deepEqual(help, ['1px', 'solid', '50%'], `${label}: help retains its control circle`);
  return result.tokens;
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en', errors = [], outbound = [];
      const context = await browser.newContext({ viewport: { width: 1440, height: 844 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route('**/*', route => {
        if (route.request().url().startsWith(url) || route.request().url().startsWith('data:')) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const screens = async name => {
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
          for (const width of [1440, 390]) {
            await page.setViewportSize({ width, height: 844 });
            await inspectScreen(page, `${locale}/${theme}/${width}/${name}`);
            if (name === 'editor') {
              assert.equal(await page.locator('.editor-head h2').innerText(), en ? 'Edit rehabilitation record' : '編輯復健紀錄');
              assert.equal(await page.locator('.editor-head .eyebrow, .editor-head .chip').count(), 0);
              const create = await page.locator('#useSubjectiveProblem').evaluate(node => {
                const box = node.getBoundingClientRect(), parent = node.parentElement.getBoundingClientRect();
                return { left: box.left - parent.left, width: box.width, parentWidth: parent.width, align: getComputedStyle(node).textAlign };
              });
              assert.equal(create.left, 0); assert.ok(create.width < create.parentWidth); assert.equal(create.align, 'left');
              const icon = page.locator(width === 390 ? '.editor-copy-action svg' : '#draftTools [data-action="copy-editing"] svg');
              const style = await icon.evaluate(node => {
                const s = getComputedStyle(node); return [s.width, s.height, s.fill, s.strokeWidth, s.strokeLinecap, s.strokeLinejoin, node.getAttribute('aria-hidden')];
              });
              assert.deepEqual(style, ['18px', '18px', 'none', '1.7px', 'square', 'miter', 'true']);
              assert.equal(await page.locator('#draftTools [data-action="cancel-edit"] svg').getAttribute('aria-hidden'), 'true');
            }
            if (name === 'dashboard') {
              const heading = await page.locator('.client-identity h2').evaluate(node => ({ size: parseFloat(getComputedStyle(node).fontSize), width: node.getBoundingClientRect().width, parent: node.parentElement.getBoundingClientRect().width }));
              assert.ok(heading.size >= 24); assert.ok(heading.width <= heading.parent);
              assert.equal(await page.locator('.clinical-category').evaluate(node => node.previousElementSibling.matches('.clinical-symptom')), true);
              assert.equal(await page.locator('.clinical-category').innerText(), en ? 'Visual function' : '視覺功能');
            }
            await page.evaluate(() => scrollTo(0, 0));
            await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-${name}.png`) });
          }
        }
        check(`${locale}: ${name} default/disabled/borderless buttons, headings and stage/alert-only edges fit 390/1440px in both themes`);
      };
      try {
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
          for (const width of [1440, 700, 699, 390]) {
            await page.setViewportSize({ width, height: 844 });
            const colors = await inspectScreen(page, `${locale}/${theme}/${width}/connect`);
            const options = await page.locator('.connect-choice').evaluateAll(nodes => nodes.map(node => {
              const r = node.getBoundingClientRect(), s = getComputedStyle(node);
              return { width: r.width, height: r.height, x: r.x, y: r.y, background: s.backgroundColor, font: s.fontSize, weight: s.fontWeight, padding: s.padding,
                classes: node.className, primary: node.classList.contains('app-primary'), description: document.getElementById(node.getAttribute('aria-describedby')).textContent };
            }));
            assert.equal(options.length, 2);
            assert.equal(options[0].width, options[1].width); assert.equal(options[0].height, options[1].height);
            assert.equal(options[0].classes, options[1].classes); assert.equal(options[0].background, options[1].background);
            assert.ok(options.every(o => !o.primary && o.background === colors.surface && o.font === '16px' && o.weight === '600' && o.padding === '14px 16px' && o.description));
            if (width >= 700) { assert.equal(options[0].y, options[1].y); assert.ok(options[1].x > options[0].x); }
            else { assert.equal(options[0].x, options[1].x); assert.ok(options[1].y > options[0].y + options[0].height); }
            if ([390, 1440].includes(width)) await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-connect.png`), fullPage: true });
          }
        }
        check(`${locale}: equal outlined first-run options retain labels/descriptions and switch from two columns at 700px to a stack at 699px`);

        await page.evaluate(async () => {
          const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('button-affordance-records', { create: true });
          store = folderStore(root); await finishBoot();
        });
        await screens('welcome');
        await action('example').click(); await page.waitForFunction(() => sessions.length === 4);
        await page.evaluate(() => {
          cur().name = 'Synthetic long client name for wrapping / 合成測試個案的很長姓名，用來檢查窄螢幕換行';
          const last = byDate(sessions).at(-1);
          last.training = clone(sessions.find(s => s.training?.ocular?.on).training);
          last.clinicalLinks = [{ id: 'synthetic-affordance-link', category: 'visual', symptom: 'Synthetic reading difficulty', peo: [], reasoning: 'Synthetic reasoning',
            evidence: ['pursuit'], evidenceNotes: '', interventions: ['rehab:ocular'], interventionNotes: '' }];
          window.affordanceBaseline = JSON.stringify({ client: cur(), sessions });
          view = 'dashboard'; renderMain();
        });
        await screens('dashboard');
        await page.locator('#tab-outcomes').click(); await screens('progress');
        await page.locator('#tab-dashboard').click(); await action('open-session').click();
        const hint = en ? 'After you jump to another section, use this to return to where you were.' : '跳到其他區段後，可用這個按鈕回到原本填寫的位置。';
        const back = page.locator('#workflowBack');
        assert.equal(await back.isDisabled(), true); assert.equal(await back.getAttribute('title'), hint);
        assert.equal(await back.getAttribute('aria-describedby'), 'workflowBackHint');
        assert.equal(await page.locator('#workflowBackHint').textContent(), hint); assert.equal(await page.locator('#workflowBackHint').getAttribute('hidden'), null);
        await screens('editor');
        const clearButtons = page.locator('[data-workflow-clear]:visible'); assert.ok(await clearButtons.count() >= 2);
        for (const clear of await clearButtons.all()) {
          assert.equal(await clear.evaluate(node => node.classList.contains('danger')), true);
          assert.equal(await clear.innerText(), en ? 'Clear results' : '清除結果');
        }
        await page.locator('#s-subj').focus();
        if (await page.locator('#workflowSections').isVisible() && await page.locator('#workflowSections').getAttribute('aria-expanded') === 'false') await page.locator('#workflowSections').click();
        await page.locator('[data-workflow-go="plan"]').click();
        assert.equal(await back.isDisabled(), false); assert.equal(await back.getAttribute('title'), null); assert.equal(await back.getAttribute('aria-describedby'), null);
        assert.equal(await page.locator('#workflowBackHint').getAttribute('hidden'), '');
        await back.click(); await page.waitForFunction(() => document.activeElement?.id === 's-subj');
        const colors = await inspectScreen(page, `${locale}/active-card`);
        if (await page.locator('#workflowSections').isVisible() && await page.locator('#workflowSections').getAttribute('aria-expanded') === 'false') await page.locator('#workflowSections').click();
        await page.locator('[data-workflow-go="interview"]').hover();
        await page.waitForFunction(color => getComputedStyle(document.querySelector('[data-workflow-go="interview"]')).backgroundColor === color, colors['accent-soft']);
        assert.equal(await page.locator('[data-workflow-go="interview"]').getAttribute('aria-current'), 'location');
        assert.equal(await page.locator('[data-workflow-go="interview"]').evaluate(node => getComputedStyle(node).borderBottomWidth), '3px');
        assert.equal(await page.locator('[data-workflow-go="interview"]').evaluate(node => getComputedStyle(node).borderRadius), '0px', 'The workflow underline belongs to square navigation, not a rounded card');
        await page.mouse.move(0, 0);
        await page.locator('#workflowAssessment').selectOption('pursuit');
        await page.waitForFunction(color => getComputedStyle(document.querySelector('#as-pursuit')).borderLeftColor === color, colors.accent);
        const active = await page.locator('#as-pursuit').evaluate(node => {
          const s = getComputedStyle(node); return { active: node.classList.contains('workflow-active'), shadow: s.boxShadow, left: s.borderLeftWidth, border: s.borderLeftColor };
        });
        assert.equal(active.active, true); assert.equal(active.shadow, 'none'); assert.equal(active.left, '1px');
        assert.equal(active.border, colors.accent);
        const clear = page.locator('[data-workflow-clear="as-pursuit"]');
        assert.equal(await clear.evaluate(node => getComputedStyle(node).color), colors.bad);
        await clear.click(); await page.locator('#askNo').click();
        assert.equal(await page.evaluate(() => editing.assess.pursuit.done), true);
        await clear.click(); await page.locator('#askYes').click();
        await page.waitForFunction(() => !editing.assess.pursuit);
        assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), await page.evaluate(() => affordanceBaseline));
        await action('cancel-edit').click(); if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await page.waitForSelector('.sess'); await action('new-session').click();
        assert.equal(await page.locator('.editor-head h2').innerText(), en ? 'New rehabilitation record' : '新增復健紀錄');
        assert.equal(await back.isDisabled(), true); assert.equal(await back.getAttribute('title'), hint);
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        check(`${locale}: disabled return explanation disappears after navigation, Back returns to the field, active cards have no inset stripe, destructive clear retains confirmation, and stored clinical values stay unchanged; zero outbound requests/page errors`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
