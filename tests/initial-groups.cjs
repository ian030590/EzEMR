const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '..', '.tmp', 'verification', 'initial-groups');
const evidence = [];
const contrast = (foreground, background) => {
  const lum = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).map(v => v / 255)
    .map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
  const a = lum(foreground), b = lum(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
};

async function settleLayout(page) {
  await page.evaluate(async () => {
    let last = '', stable = 0;
    for (let frame = 0; frame < 120; frame++) {
      await new Promise(requestAnimationFrame);
      const sample = JSON.stringify([...document.querySelectorAll('#initialPicks, .initial-period, .initial-function')].map(node => {
        const r = node.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
      }));
      stable = sample === last ? stable + 1 : 0; last = sample;
      if (stable >= 2) return;
    }
    throw new Error('Initial assessment layout did not settle');
  });
}

async function countsMatch(page, en) {
  const counts = await page.locator('#initialPicks .initial-function').evaluateAll(groups => groups.map(group => {
    const inputs = [...group.querySelectorAll('[data-initial]')], count = group.querySelector('[data-initial-count]');
    return { selected: inputs.filter(input => input.checked).length, total: inputs.length, text: count.textContent, role: count.getAttribute('role'), atomic: count.getAttribute('aria-atomic') };
  }));
  assert.ok(counts.length > 0);
  for (const count of counts) {
    assert.ok(count.total > 0, 'Only populated function groups appear');
    assert.equal(count.text, en ? `${count.selected} of ${count.total} selected` : `已選 ${count.selected}/${count.total}`);
    assert.equal(count.role, 'status'); assert.equal(count.atomic, 'true');
  }
  return counts;
}

async function matchEditor(page) {
  const flat = await page.evaluate(() => cur().plan.filter(item => item.active !== false && !['src_other', 'func'].includes(assessmentSourceId(item)))
    .map(item => ({ id: item.id, label: assessmentTemplateLabel(item), key: assessmentGroupKey(item) })));
  await page.evaluate(() => {
    editing = { date: today(), visit: 'baseline', sym: [], assess: {}, training: {} };
    editorWorkflow = null; dirty = false; view = 'edit'; renderMain(); window.scrollTo(0, 0);
  });
  const editor = await page.locator('.assessment-period').evaluateAll(periods => periods.map(period => ({
    period: period.id.slice('assess-'.length), label: period.querySelector(':scope > .spread > h3').textContent,
    groups: [...period.querySelectorAll(':scope > .assessment-group')].map(group => ({ category: group.dataset.function,
      label: group.querySelector(':scope > h4').textContent,
      keys: [...group.querySelectorAll('.pick input[data-assessment-members]')].map(input => assessmentGroupKey(assessmentItems(cur(), editing).find(item => item.id === input.id.slice(3)))) }))
  })));
  await page.locator('[data-action="cancel-edit"]:visible').first().click();
  await page.waitForSelector('#soapForm', { state: 'detached' });
  await page.locator('#tab-plan').click(); await settleLayout(page);
  const actual = await page.locator('#initialPicks > .initial-period').evaluateAll(periods => periods.map(period => ({
    period: period.dataset.initialPeriod, label: period.querySelector(':scope > h4').textContent,
    groups: [...period.querySelectorAll(':scope > .initial-function')].map(group => ({ category: group.dataset.initialFunction,
      label: group.querySelector('h5').textContent, ids: [...group.querySelectorAll('[data-initial]')].map(input => input.dataset.initial) }))
  })));
  const expected = editor.map(period => ({ ...period, groups: period.groups.map(({ keys, ...group }) => ({ ...group,
    ids: keys.flatMap(key => flat.filter(item => item.key === key).map(item => item.id)) })).filter(group => group.ids.length) })).filter(period => period.groups.length);
  assert.deepEqual(actual, expected, 'Period, function and tile order match the actual baseline editor');
  assert.ok(actual.every(period => period.groups.length > 0));
  const tiles = await page.locator('#initialPicks [data-initial]').evaluateAll(inputs => inputs.map(input => ({ id: input.dataset.initial, label: input.parentElement.textContent })));
  assert.equal(new Set(tiles.map(tile => tile.id)).size, flat.length);
  assert.deepEqual(tiles.map(tile => tile.id).sort(), flat.map(tile => tile.id).sort(), 'Every tile from the previous flat list appears once');
  for (const tile of tiles) assert.equal(tile.label, flat.find(item => item.id === tile.id).label, 'Existing tile labels are preserved');
  assert.equal(await page.locator('#initialPicks').getAttribute('role'), 'group');
  assert.equal(await page.locator('#initialPicks').getAttribute('aria-labelledby'), 'initialHeading');
  return actual;
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
      const en = locale === 'en', context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route('**/*', route => {
        if (route.request().url().startsWith(url) || route.request().url().startsWith('data:')) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      try {
        const connect = () => page.evaluate(async () => {
          const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('initial-group-records', { create: true });
          store = folderStore(root); await finishBoot();
        });
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale); await connect();
        await page.locator('[data-action="example"]:visible').click(); await page.waitForFunction(() => sessions.length === 4);
        const clinical = await page.evaluate(() => JSON.stringify({ sessions, plan: cur().plan.map(({ initial, ...item }) => item) }));
        const order = await matchEditor(page);
        assert.deepEqual(order.map(period => period.label), en ? ['Short-term outcomes', 'Long-term assessments'] : ['短期成效', '長期評估']);
        const initialCounts = await countsMatch(page, en);
        const id = await page.locator('#initialPicks [data-initial]:not(:checked)').first().getAttribute('data-initial');
        const tile = page.locator(`[data-initial="${id}"]`);
        await page.evaluate(() => {
          window.initialSave = store.saveClient;
          window.initialSaveGate = new Promise(resolve => { window.finishInitialSave = resolve; });
          store.saveClient = async (...args) => { await initialSaveGate; return initialSave.apply(store, args); };
        });
        await tile.focus(); await page.keyboard.press('Space');
        await page.waitForFunction(() => savingItems);
        assert.equal(await tile.isChecked(), true);
        assert.equal(await page.evaluate(id => cur().plan.find(item => item.id === id).initial, id), false, 'The live count updates before the pending write commits');
        assert.equal(await tile.evaluate(node => document.activeElement === node), true, 'Count updates preserve keyboard focus');
        const pendingCounts = await countsMatch(page, en);
        assert.equal(pendingCounts.reduce((sum, count) => sum + count.selected, 0), initialCounts.reduce((sum, count) => sum + count.selected, 0) + 1);
        const busyTile = page.locator('#initialPicks [data-initial]:not(:checked)').first();
        await busyTile.click();
        assert.equal(await busyTile.isChecked(), false, 'A second change is reverted while the first write is pending');
        assert.deepEqual(await countsMatch(page, en), pendingCounts);
        await page.evaluate(() => finishInitialSave());
        await page.waitForFunction(id => !savingItems && cur().plan.find(item => item.id === id).initial === true, id);
        await page.evaluate(() => { store.saveClient = initialSave; });
        await matchEditor(page); await countsMatch(page, en);
        assert.equal(await tile.isChecked(), true, 'The selected tile persists after the plan view is rebuilt');
        assert.equal(await page.evaluate(async id => (await store.listClients()).find(client => client.id === curId).plan.find(item => item.id === id).initial, id), true);
        await tile.uncheck(); await page.waitForFunction(id => !savingItems && cur().plan.find(item => item.id === id).initial === false, id);
        await matchEditor(page); assert.deepEqual(await countsMatch(page, en), initialCounts);
        assert.equal(await tile.isChecked(), false, 'The cleared tile persists after the plan view is rebuilt');
        await page.evaluate(() => { store.saveClient = async () => { throw new Error('Synthetic initial item write failure'); }; });
        await tile.click();
        await page.waitForFunction(() => !savingItems && [...document.querySelectorAll('.failure-message pre')].some(node => node.textContent.includes('Synthetic initial item write failure')));
        assert.equal(await tile.isChecked(), false, 'A failed write restores the previous tick');
        assert.deepEqual(await countsMatch(page, en), initialCounts, 'A failed write restores the live counts');
        await page.evaluate(() => { store.saveClient = initialSave; document.querySelectorAll('.failure-message, .toast').forEach(node => node.remove()); });
        await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' }); await connect();
        await page.locator('#tab-plan').click(); await countsMatch(page, en);
        assert.equal(await tile.isChecked(), false, 'The cleared choice persists after reconnecting the OPFS folder');
        assert.equal(await page.evaluate(() => JSON.stringify({ sessions, plan: cur().plan.map(({ initial, ...item }) => item) })), clinical, 'Grouping and choices preserve assessment definitions and all clinical results');
        for (const theme of ['light', 'dark']) for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 }); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme); await settleLayout(page);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}: no page overflow`);
          const styles = await page.locator('#initialPicks').evaluate(root => ({
            above: parseFloat(getComputedStyle(root).marginTop), periods: parseFloat(getComputedStyle(root).rowGap),
            groups: [...root.querySelectorAll('.initial-period')].map(node => parseFloat(getComputedStyle(node).rowGap)),
            tiles: [...root.querySelectorAll('.pick-group')].map(node => [getComputedStyle(node).gap, node.getBoundingClientRect().top - node.previousElementSibling.getBoundingClientRect().bottom]),
            headings: [...root.querySelectorAll('h5')].map(node => [getComputedStyle(node).color, getComputedStyle(node).fontWeight]),
            text: [...root.querySelectorAll('h4, h5, [data-initial-count]')].map(node => { const c = getComputedStyle(node); return { size: parseFloat(c.fontSize), color: c.color, surface: getComputedStyle(root.closest('.panel')).backgroundColor }; })
          }));
          assert.ok(styles.groups.every(gap => gap === 20)); assert.ok(styles.above > 20 && styles.periods > 20);
          assert.ok(styles.tiles.every(([gap, distance]) => gap === '8px' && Math.abs(distance - 12) < 1));
          assert.ok(styles.headings.every(([color, weight]) => weight === '600' && color === styles.text.find(text => text.size === 14).color));
          assert.ok(styles.text.every(text => text.size >= 14 && contrast(text.color, text.surface) >= 4.5));
          if (en) assert.doesNotMatch(await page.locator('#initialPicks').innerText(), /\p{Script=Han}/u);
          await page.locator('[aria-labelledby="initialHeading"].panel').screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
        }
        evidence.push({ locale, order, initialCounts });
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: editor order, every initial tile once, live/busy/failed counts, OPFS persistence, spacing, contrast and responsive themes`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'evidence.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
