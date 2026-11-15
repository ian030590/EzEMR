const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '..', '.tmp', 'verification', 'progress-trends');
const evidence = [];
const check = message => { evidence.push(message); console.log('PASS: ' + message); };
const contrast = (foreground, background) => {
  const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};

async function noEmptyColumns(page) {
  const empty = await page.locator('#tabBody table.out').evaluateAll(tables => tables.flatMap(table => {
    const panel = table.closest('section');
    // COPM columns are fixed; staged tables retain their existing measured-column logic.
    if (panel.classList.contains('short-outcomes') || panel.querySelector('h3').textContent.startsWith('COPM')) return [];
    return [...table.tHead.rows[0].cells].flatMap((cell, index) => {
      const values = [...table.tBodies[0].rows].map(row => row.cells[index].textContent.trim());
      return values.every(value => /^[\s–-]*$/.test(value)) ? [cell.textContent] : [];
    });
  }));
  assert.deepEqual(empty, [], 'Optional columns must contain at least one displayed value');
}

async function settleLayout(page) {
  await page.evaluate(async () => {
    let last = '', stable = 0;
    for (let frame = 0; frame < 120; frame++) {
      await new Promise(requestAnimationFrame);
      const sample = JSON.stringify([...document.querySelectorAll('#tabBody, .outcome-trend, .chart-plot svg')].map(node => {
        const r = node.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
      }));
      stable = sample === last ? stable + 1 : 0; last = sample;
      if (stable >= 2) return;
    }
    throw new Error('Progress tracking layout did not settle');
  });
}
async function chartsFit(page) {
  await settleLayout(page);
  const charts = await page.evaluate(() => [...document.querySelectorAll('.outcome-trend svg')].map(svg => {
      const plot = svg.closest('.chart-plot'), box = plot.getBoundingClientRect();
      return { scrollWidth: plot.scrollWidth, clientWidth: plot.clientWidth, scaled: svg.hasAttribute('viewBox'),
        elements: [...plot.querySelectorAll('circle, text, .outcome-axis span')].map(node => { const b = node.getBoundingClientRect(); return { left: b.left - box.left, right: b.right - box.left, size: parseFloat(getComputedStyle(node).fontSize) }; }),
        circles: [...svg.querySelectorAll('circle')].map(node => { const b = node.getBoundingClientRect(); return [b.width, b.height]; }) };
  }));
  assert.ok(charts.length > 0);
  for (const bounds of charts) {
    assert.ok(bounds.scrollWidth <= bounds.clientWidth);
    assert.equal(bounds.scaled, false, 'The fluid SVG never scales text or points through a viewBox');
    assert.ok(bounds.circles.every(([width, height]) => Math.abs(width - 8) < .01 && Math.abs(height - 8) < .01), 'Points stay round and unscaled');
    assert.ok(bounds.elements.every(b => b.left >= -1 && b.right <= bounds.clientWidth + 1), 'Every point and axis label, including the latest point, stays in view');
    assert.ok(bounds.elements.every(b => b.size >= 14));
  }
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
      const en = locale === 'en';
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route('**/*', route => {
        if (route.request().url().startsWith(url) || route.request().url().startsWith('data:')) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const panel = (kind, id) => page.locator(`#tabBody [data-outcome-kind="${kind}"][data-item-id="${id}"]`);
      const pursuit = panel('assessment', 'pursuit');
      const recoveryLabel = en ? 'Recovery time' : '恢復時間';
      try {
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('progress-trend-records', { create: true });
          store = folderStore(root); await finishBoot();
        });
        await action('example').click(); await page.waitForFunction(() => sessions.length === 4);
        const original = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
        await page.locator('#tab-outcomes').click();
        assert.equal(await pursuit.locator('svg[role="img"]').count(), 1);
        assert.equal(await pursuit.locator('.outcome-change').innerText(), '71.2 → 86.9 (+15.7) %');
        assert.match(await panel('assessment', 'ufov_divided').locator('.outcome-change').innerText(), /^180 → 90 \(-90\) /);
        assert.match(await panel('assessment', 'npc').locator('.outcome-change').innerText(), /^12 → 6 \(-6\) /);
        assert.equal(await panel('run', 'pursuit').locator('svg').count(), 0, 'A single dated run has no trend');
        assert.ok((await pursuit.locator('svg').getAttribute('aria-label')).includes(en ? 'Smooth pursuit' : '平滑追視'));
        const titles = await pursuit.locator('circle title').allTextContents();
        assert.ok(titles[0].startsWith(en ? '9/1/2026' : '2026/9/1')); assert.match(titles[0], /71\.2/);
        assert.ok(titles[1].startsWith(en ? '10/6/2026' : '2026/10/6')); assert.match(titles[1], /86\.9/);
        assert.deepEqual((await pursuit.locator('svg > text').allTextContents()).slice(-2), en ? ['9/1/2026', '10/6/2026'] : ['2026/9/1', '2026/10/6']);
        assert.ok(titles[0].includes(en ? 'Baseline assessment' : '基準評估'));
        assert.match(await panel('assessment', 'npc').locator('tbody').innerText(), /x\/12\/6/);
        await noEmptyColumns(page);

        const settings = pursuit.locator('.outcome-settings');
        assert.equal(await settings.evaluate(node => node.open), false);
        assert.equal(await settings.locator('summary').innerText(), en ? 'Test settings (visits: 2)' : '測驗設定（就診次數：2）');
        assert.equal(await settings.locator('li').count(), 2);
        assert.equal(await pursuit.locator('thead').getByText(en ? 'Test settings' : '測驗設定', { exact: true }).count(), 0);
        await settings.locator('summary').focus(); await page.keyboard.press('Enter');
        assert.equal(await settings.evaluate(node => node.open), true);
        assert.ok((await settings.locator('li').first().innerText()).startsWith(en ? '9/1/2026' : '2026/9/1'));
        assert.match(await settings.locator('li').first().innerText(), /60/);
        await page.keyboard.press('Enter'); assert.equal(await settings.evaluate(node => node.open), false);
        for (const detail of await page.locator('.outcome-settings').all()) {
          assert.equal(await detail.evaluate(node => node.open), false);
          assert.equal(await detail.evaluate(node => node.previousElementSibling.classList.contains('scroll')), true);
        }
        if (en) {
          const untranslated = await page.locator('.outcome-trend, .outcome-settings').evaluateAll(nodes => nodes.flatMap(node =>
            [node.textContent, ...[...node.querySelectorAll('[aria-label]')].map(child => child.getAttribute('aria-label'))]).filter(value => /\p{Script=Han}/u.test(value)));
          assert.deepEqual(untranslated, []);
        }
        check(`${locale}: demo numeric trends, dated point titles, neutral signed changes, fixed clinical values, and closed settings beneath tables`);

        await page.setViewportSize({ width: 1440, height: 844 }); await settleLayout(page);
        await settings.locator('summary').click(); await pursuit.locator('.scroll').focus();
        await page.evaluate(() => {
          window.progressPanels = [...document.querySelectorAll('#tabBody section.panel')];
          progressPanels.forEach((node, i) => { node.resizeIdentity = i; });
          window.progressRegion = document.querySelector('[data-outcome-kind="assessment"][data-item-id="pursuit"] .scroll');
        });
        let scrollPosition = 0;
        for (const width of [390, 420, 480, 768, 390, 1440]) {
          await page.setViewportSize({ width, height: 844 }); await chartsFit(page);
          const state = await page.evaluate(() => ({
            same: [...document.querySelectorAll('#tabBody section.panel')].every((node, i) => node === progressPanels[i] && node.resizeIdentity === i),
            focused: document.activeElement === progressRegion,
            open: document.querySelector('[data-outcome-kind="assessment"][data-item-id="pursuit"] .outcome-settings').open,
            scroll: progressRegion.scrollLeft, maximum: progressRegion.scrollWidth - progressRegion.clientWidth
          }));
          assert.equal(state.same, true, 'Resizing preserves the panel objects'); assert.equal(state.focused, true, 'Resizing preserves table keyboard focus');
          assert.equal(state.open, true, 'Resizing preserves open settings'); assert.equal(state.scroll, Math.min(scrollPosition, state.maximum));
          scrollPosition = await page.evaluate(() => { progressRegion.scrollLeft = Math.min(20, progressRegion.scrollWidth - progressRegion.clientWidth); return progressRegion.scrollLeft; });
        }
        await settings.locator('summary').click();
        check(`${locale}: resize and zoom-width changes retain open disclosures, focus, panel identity and table scrolling`);

        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
          for (const width of [360, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 844 });
            await chartsFit(page);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}/${theme}/${width}: page overflow`);
            const regions = await page.locator('#tabBody .scroll').evaluateAll(nodes => nodes.map(node => {
              const style = getComputedStyle(node);
              return { border: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth], radius: style.borderRadius,
                tab: node.tabIndex, role: node.getAttribute('role'), label: node.getAttribute('aria-label'), sticky: getComputedStyle(node.querySelector('tbody tr > :first-child')).position };
            }));
            for (const region of regions) {
              assert.deepEqual(region.border, ['0px', '0px', '0px', '0px']); assert.equal(region.radius, '0px');
              assert.equal(region.tab, 0); assert.equal(region.role, 'region'); assert.equal(region.sticky, 'sticky');
              assert.ok(region.label.includes(en ? 'Scroll the table horizontally' : '表格可左右捲動'));
            }
            assert.ok((await settings.locator('summary').boundingBox()).height >= 44);
            const colors = await pursuit.evaluate(node => {
              const surface = getComputedStyle(node).backgroundColor;
              return [...node.querySelectorAll('.outcome-trend text, .outcome-axis span, .outcome-change span, .outcome-measure')].map(text => {
                const style = getComputedStyle(text);
                return { color: text.tagName.toLowerCase() === 'text' ? style.fill : style.color, surface, size: parseFloat(style.fontSize), numerals: style.fontVariantNumeric };
              });
            });
            for (const color of colors) { assert.ok(contrast(color.color, color.surface) >= 4.5); assert.ok(color.size >= 14); }
            assert.ok(colors.some(color => color.numerals.includes('tabular-nums')));
            assert.ok((await pursuit.locator('svg').boundingBox()).height <= 160);
            await page.keyboard.press('Tab'); await pursuit.locator('.scroll').focus();
            await page.waitForFunction(() => {
              const node = document.querySelector('[data-outcome-kind="assessment"][data-item-id="pursuit"] .scroll'), style = getComputedStyle(node);
              return style.outlineWidth === '2px' && style.outlineColor === getComputedStyle(node.closest('section').querySelector('.outcome-series')).stroke;
            });
            const focus = await pursuit.locator('.scroll').evaluate(node => {
              const style = getComputedStyle(node); return [style.outlineWidth, style.outlineStyle, style.outlineColor, getComputedStyle(node.closest('section')).backgroundColor,
                getComputedStyle(node.closest('section').querySelector('.outcome-series')).stroke];
            });
            assert.equal(focus[0], '2px'); assert.equal(focus[1], 'solid'); assert.equal(focus[2], focus[4]); assert.ok(contrast(focus[2], focus[3]) >= 3);
            if (width === 390) {
              await pursuit.locator('.scroll').evaluate(node => { node.scrollLeft = 0; });
              await page.keyboard.press('ArrowRight');
              await page.waitForFunction(() => document.querySelector('[data-outcome-kind="assessment"][data-item-id="pursuit"] .scroll').scrollLeft > 0);
              const plot = pursuit.locator('.chart-plot'); await plot.focus(); await page.keyboard.press('ArrowRight');
              assert.equal(await plot.evaluate(node => node.scrollLeft), 0, 'Phone charts fit without horizontal scrolling');
            }
            if (width !== 768) await pursuit.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          }
        }
        check(`${locale}: light/dark at 360/390/768/1440px, fully visible charts with localized dates and 14px text, no nested borders or page overflow, AA text contrast, 44px summaries, teal focus and keyboard scrolling`);

        await page.locator('#filter-visit').selectOption('post');
        assert.equal(await pursuit.locator('svg').count(), 0);
        assert.equal(await pursuit.locator('tbody tr').count(), 1);
        assert.equal(await pursuit.locator('thead').getByText(en ? 'Notes' : '備註', { exact: true }).count(), 0);
        assert.equal(await page.locator('#tabBody > .panel').first().locator('thead').getByText(recoveryLabel, { exact: true }).count(), 0);
        const copm = page.locator('#tabBody section.panel').filter({ has: page.locator('h3', { hasText: /^COPM/ }) });
        assert.equal(await copm.locator('thead th').count(), 6, 'COPM columns remain fixed after filtering to one post visit');
        await noEmptyColumns(page);
        await action('clear-filters').click();
        await page.locator('#filter-to').fill('2026-09-08'); await page.locator('#filter-to').dispatchEvent('change');
        assert.equal(await pursuit.locator('svg').count(), 0); assert.equal(await pursuit.locator('tbody tr').count(), 1);
        await action('clear-filters').click();
        await page.locator('#filter-text').fill('Catch-up saccades on the return path');
        assert.equal(await pursuit.locator('svg').count(), 0); assert.equal(await pursuit.locator('tbody tr').count(), 1);
        assert.equal(await pursuit.locator('.outcome-settings li').count(), 1);
        await page.locator('#filter-text').fill('SYNTHETIC-NO-MATCH');
        assert.equal(await page.locator('#tabBody .empty h3').innerText(), en ? 'No progress results yet' : '尚無追蹤結果');
        await action('clear-filters').click(); assert.equal(await pursuit.locator('svg').count(), 1);
        assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), original, 'Views, filters and language leave clinical records unchanged');
        check(`${locale}: type, date and text filters update tables, trends, settings and recovery columns; COPM stays fixed and empty state is translated`);

        // Supplement the shipped demo with explicitly synthetic cases for missing and staged values.
        await page.evaluate(() => {
          const visits = byDate(sessions), early = visits[1], late = visits[2];
          for (const [s, pre, post] of [[early, 40, 35], [late, 30, 25]]) s.assess.st_search = { done: true, values: { pre_time_s: pre, post_time_s: post, protocol: 'Synthetic fixed task' } };
          early.assess.st_coordination = { done: true, values: { post_hit_rate: 80 } };
          late.assess.st_coordination = { done: true, values: { post_hit_rate: 90 } };
          early.assess.st_tug = { done: true, values: { pre_time_s: 10, post_time_s: 8 } };
          early.training.ocular.runs.push({ id: 'synthetic-same-day', item: 'pursuit', time: '10:22', values: { accuracy_rate: 76, mode: 'Evaluation' } },
            { id: 'synthetic-fixation', item: 'fixation', time: '10:24', values: { accuracy_rate: 70 } });
          late.training.ocular = { on: true, acts: [], dur: 0, runs: [{ id: 'synthetic-next-day', item: 'pursuit', time: '10:00', values: { accuracy_rate: 81.5, mode: 'Evaluation' } }] };
          const fields = [{ id: 'score', label: 'Synthetic primary', type: 'number', unit: 'mm' }, { id: 'secondary', label: 'Synthetic secondary', type: 'number' }];
          cur().plan.push({ id: 'strict_trend', name: 'Synthetic strict numeric series', timing: 'assessment', fields },
            { id: 'strict_single', name: 'Synthetic single primary value', timing: 'assessment', fields });
          for (const [s, score] of [[early, 0], [late, 'x/12/6'], [visits[3], '-.25']]) s.assess.strict_trend = { done: true, values: { score, secondary: 900 } };
          early.assess.strict_single = { done: true, values: { score: 'x/12/6', secondary: 900 } };
          late.assess.strict_single = { done: true, values: { score: 8, secondary: 900 } };
          sessions.reverse(); renderOutcomes();
        });
        const short = page.locator('.short-outcomes[data-item-id="st_search"]');
        assert.equal(await short.locator('svg').count(), 1); assert.equal(await short.locator('circle').count(), 4);
        assert.deepEqual(await short.locator('.outcome-change > span:last-child').allTextContents(), [en ? '40 → 30 (-10) s' : '40 → 30 (-10) 秒', en ? '35 → 25 (-10) s' : '35 → 25 (-10) 秒']);
        assert.deepEqual(await short.locator('.outcome-series').evaluateAll(nodes => nodes.map(node => node.getAttribute('stroke'))), ['var(--pre)', 'var(--accent)']);
        assert.equal(await short.locator('.outcome-series').first().getAttribute('stroke-dasharray'), '5 3');
        const laterMetric = page.locator('.short-outcomes[data-item-id="st_coordination"]');
        assert.equal(await laterMetric.locator('circle').count(), 2, 'Use the first measured metric even when earlier metrics and Pre 1 are empty');
        assert.equal(await laterMetric.locator('.outcome-change > span:last-child').innerText(), '80 → 90 (+10) %');
        assert.equal(await page.locator('.short-outcomes[data-item-id="st_tug"] svg').count(), 0, 'Two stages on one date do not create a trend');
        assert.equal(await panel('run', 'pursuit').locator('circle').count(), 3);
        assert.equal(await panel('run', 'pursuit').locator('.outcome-change').innerText(), '74 → 81.5 (+7.5) %');
        assert.equal(await panel('run', 'pursuit').locator('.outcome-settings li').count(), 3);
        assert.equal(await panel('run', 'pursuit').locator('.outcome-settings summary').innerText(), en ? 'Test settings (visits: 2)' : '測驗設定（就診次數：2）');
        assert.equal(await panel('run', 'fixation').locator('svg').count(), 0, 'Multiple runs on the same date do not create a trend');
        const strict = panel('assessment', 'strict_trend');
        assert.equal(await strict.locator('circle').count(), 2);
        assert.equal(await strict.locator('.outcome-change').innerText(), '0 → -0.25 (-0.25) mm');
        assert.match(await strict.locator('tbody').innerText(), /x\/12\/6/);
        assert.equal(await strict.locator('.outcome-series line').count(), 0, 'Missing numeric values break the line rather than filling a gap');
        assert.equal(await panel('assessment', 'strict_single').locator('svg').count(), 0, 'Secondary results do not replace a missing primary value');
        for (const value of ['', ' ', '-', '–', '12abc', '12%', '0x10', 'Infinity', true, null]) {
          await page.evaluate(value => { sessions.find(s => s.date === '2026-09-08').assess.strict_trend.values.score = value; renderOutcomes(); }, value);
          assert.equal(await strict.locator('svg').count(), 0, `Strict numeric rejection: ${JSON.stringify(value)}`);
        }
        await page.evaluate(() => { sessions.find(s => s.date === '2026-09-08').assess.strict_trend.values.score = '-.25'; renderOutcomes(); });
        assert.equal(await strict.locator('.outcome-change').innerText(), '-0.25 → -0.25 (+0) mm', 'Zero change has an explicit sign');
        await page.evaluate(() => { sessions.find(s => s.date === '2026-09-08').assess.strict_trend.values.score = 0; renderOutcomes(); });
        await noEmptyColumns(page);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
          for (const width of [360, 390, 1440]) {
            await page.setViewportSize({ width, height: 844 });
            await chartsFit(page);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
            const stageColors = await short.locator('.outcome-stage, .outcome-series').evaluateAll(nodes => nodes.map(node => {
              const style = getComputedStyle(node), line = node.tagName.toLowerCase() === 'g';
              return { color: line ? style.stroke : style.color, background: getComputedStyle(node.closest('section')).backgroundColor, minimum: line ? 3 : 4.5 };
            }));
            for (const color of stageColors) assert.ok(contrast(color.color, color.background) >= color.minimum);
            await short.screenshot({ path: path.join(output, `${locale}-${theme}-${width}-staged.png`) });
          }
        }
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        check(`${locale}: staged and run series follow date order, preserve zero and fractions, reject nonnumeric values, break missing lines, count visits rather than runs, and make no outbound requests or page errors`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
