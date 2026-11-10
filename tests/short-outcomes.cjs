const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'short-outcomes');
const expected = {
  st_search: ['time_s', 'correct', 'omissions', 'errors', 'accuracy'],
  st_neglect: ['omissions', 'left', 'right', 'time_s', 'bisection_mm'],
  st_reading: ['speed', 'errors', 'error_rate', 'comprehension'],
  st_npc: ['trials', 'break_cm', 'recovery_cm'], st_pfv: ['blur', 'break', 'recovery'],
  st_coordination: ['time_s', 'rt_ms', 'hit_rate', 'error'], st_gaze: ['stability', 'latency_ms', 'precision'],
  st_tug: ['time_s'], st_10mwt: ['speed_ms'], st_bbt: ['blocks', 'hand'], st_9hpt: ['time_s', 'hand'], st_cop: ['distance', 'velocity'],
  st_tolerance: ['symptom_0', 'symptom_1', 'symptom_2', 'symptom_3', 'symptom_4', 'symptom_5'], st_load: ['before_load', 'after_load']
};

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [], outbound = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:') && !request.url().startsWith('data:')) outbound.push(request.url()); });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const connect = () => page.evaluate(async () => {
        window.shortRoot = await (await navigator.storage.getDirectory()).getDirectoryHandle('short-outcome-records', { create: true });
        store = folderStore(shortRoot); await finishBoot();
      });
      const field = async (item, key) => page.locator('#af-' + item + '-' + await page.evaluate(({ item, key }) => fieldsFor(cur().plan.find(p => p.id === item)).findIndex(f => f.id === key), { item, key }));
      const fill = async (item, key, value) => (await field(item, key)).fill(String(value));
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`); await ready(); await connect();
        await page.locator('#languageSelect').selectOption(locale);
        await action('new-client').click(); await page.locator('#cf-name').fill('Synthetic short outcomes'); await page.locator('#cf-ref').fill('TEST-SHORT');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        const definitions = await page.evaluate(() => { validateItems(cur().plan, 'assessment'); return SHORT_TERM_ITEMS; });
        assert.deepEqual(definitions.map(item => item.id), Object.keys(expected));
        for (const item of definitions) {
          assert.equal(item.timing, 'session');
          for (const phase of ['pre', 'pre2', 'post', 'recovery', 'followup']) {
            assert.deepEqual(item.fields.filter(f => f.phase === phase).map(f => f.id), [phase + '_context', ...expected[item.id].map(id => phase + '_' + id)]);
          }
          assert.match(item.domain, item.id === 'st_tolerance' || item.id === 'st_load' ? /tolerability/ : /functional outcomes/);
        }
        await action('new-session').click(); await page.locator('#s-visit').selectOption('treatment');
        assert.equal(await page.locator('[aria-labelledby^="assessPlanned-"] input').count(), 14);
        for (const item of ['st_search', 'st_neglect', 'st_tolerance', 'st_load', 'st_reading']) await page.locator('#ac-' + item).check();
        const searchValues = {
          pre_context: '09:00 form A', pre_time_s: 50, pre_accuracy: 90, pre_omissions: 3,
          pre2_context: '09:05 form B', pre2_time_s: 48,
          post_context: '09:30 form C, 2 min after training', post_time_s: 43, post_accuracy: 95, post_errors: 0,
          recovery_context: '09:48 form D, 20 min after training', recovery_time_s: 44,
          followup_context: '2026-11-12 09:00 form E, 48 h', followup_time_s: 42,
          protocol: '等值題型 <test> / fixed difficulty', primary: 'Completion time', intervention: 'Search / 20 min / level 2 / 1 break / rest comparator'
        };
        for (const summary of await page.locator('#as-st_search details > summary').all()) await summary.click();
        for (const [key, value] of Object.entries(searchValues)) await fill('st_search', key, value);
        await fill('st_neglect', 'pre_bisection_mm', -8); await fill('st_neglect', 'post_bisection_mm', -3);
        await fill('st_tolerance', 'pre_symptom_0', 1); await fill('st_tolerance', 'post_symptom_0', 3);
        await fill('st_tolerance', 'post_symptom_1', 11);
        assert.equal(await (await field('st_tolerance', 'post_symptom_1')).evaluate(el => el.validity.rangeOverflow), true);
        await action('save-session').click(); assert.equal(await page.locator('#soapForm').count(), 1); assert.equal(await page.evaluate(() => sessions.length), 0);
        await fill('st_tolerance', 'post_symptom_1', 0); await fill('st_tolerance', 'recovery_min', 20);
        await fill('st_load', 'pre_before_load', 1); await fill('st_load', 'pre_after_load', 4);
        await fill('st_load', 'post_before_load', 2); await fill('st_load', 'post_after_load', 3);
        await fill('st_load', 'symptom', 'Eye fatigue / same 2-minute reading load');
        await fill('st_reading', 'pre_speed', 80); await page.locator('#ac-st_reading').uncheck();
        assert.equal(await (await field('st_reading', 'pre_speed')).isDisabled(), true);
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.equal(await (await field('st_search', 'protocol')).inputValue(), searchValues.protocol);
        await page.locator('#languageSelect').selectOption(locale);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [320, 360, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}px`);
            const sizes = await page.locator('#as-st_search input:visible, #as-st_search textarea:visible').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
            assert.ok(sizes.every(size => size.width >= 44 && size.height >= 44));
            if (width === 360 || width === 1280) await page.locator('#as-st_search').screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          }
        }
        await action('save-session').click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(async () => {
          const c = cur(), s = sessions[0], dir = await shortRoot.getDirectoryHandle('TEST-SHORT'), base = store.sessionBase(c.id, s.id);
          const text = async ext => (await (await dir.getFileHandle(base + ext)).getFile()).text();
          return { c: clone(c), s: clone(s), csv: readRecordCSV(await text('.csv')), note: await text('.txt') };
        });
        assert.deepEqual(saved.s.assess.st_search.values, searchValues); assert.equal(saved.s.assess.st_neglect.values.pre_bisection_mm, -8);
        assert.deepEqual(Object.keys(saved.s.assess).sort(), ['st_load', 'st_neglect', 'st_search', 'st_tolerance']);
        assert.deepEqual(saved.csv, { client: saved.c, session: saved.s });
        assert.match(saved.note, locale === 'en' ? /Immediate post: Completion time \(s\)/ : /訓練後立即：完成時間（秒）/);
        assert.match(saved.note, /2026-11-12 09:00 form E, 48 h/);
        assert.deepEqual(saved.s.assessmentPlan.find(item => item.id === 'st_search').fields, definitions[0].fields);
        await page.reload(); await ready(); await connect(); assert.deepEqual(await page.evaluate(() => sessions[0]), saved.s);
        await action('open-session').click();
        for (const [key, value] of Object.entries(searchValues)) assert.equal(await (await field('st_search', key)).inputValue(), String(value));
        assert.equal(await page.locator('#as-st_search img').count(), 0);
        await action('cancel-edit').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
        await page.locator('#tab-outcomes').click();
        assert.match(await page.locator('#tabBody').innerText(), locale === 'en' ? /24–72 h follow-up/ : /24–72 小時追蹤/);
        const excel = await page.evaluate(() => {
          const workbook = buildWorkbook([{ c: cur(), ss: sessions }]);
          const read = XLSXReader.read(XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          return XLSXReader.utils.sheet_to_json(read.Sheets.Assessments);
        });
        assert.ok(excel.some(row => row.Value === 0 && /Errors|錯誤/.test(row.Measure)));
        assert.ok(excel.some(row => row.Value === 42 && /24–72/.test(row.Measure)));
        // An older client receives no automatic template edits; the Add dialog makes new seeds available.
        await page.evaluate(async () => { const next = clone(cur()); next.plan = next.plan.filter(p => !p.id.startsWith('st_')); await store.saveClient(next); await finishBoot(); });
        const oldPlan = await page.evaluate(() => clone(cur().plan)); assert.equal(oldPlan.length, 24);
        await action('new-session').click(); await action('plan-add').click();
        const seedIndex = await page.evaluate(() => DEFAULT_PLAN.filter(p => !p.copm).findIndex(p => p.id === 'st_reading'));
        await page.locator('#item-base').selectOption(String(seedIndex));
        assert.equal(await page.locator('#item-timing').inputValue(), 'session');
        assert.equal(await page.locator('#item-category').inputValue(), 'functional');
        await page.evaluate(() => { window.actualShortSave = store.saveClient; store.saveClient = async () => { throw new Error('Synthetic storage failure'); }; });
        await page.locator('#itemForm [type="submit"]').click();
        await page.waitForFunction(() => document.querySelector('#item-error')?.textContent.includes('Synthetic storage failure'));
        assert.equal(await page.locator('#itemForm [type="submit"]').isEnabled(), true);
        assert.deepEqual(await page.evaluate(() => cur().plan), oldPlan);
        await page.evaluate(() => { store.saveClient = actualShortSave; });
        await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' });
        const added = await page.evaluate(() => cur().plan.at(-1));
        assert.equal(added.fields.filter(f => f.phase).length, 25);
        assert.equal(await page.locator('#ac-' + added.id).isChecked(), true);
        assert.equal(await page.locator('#as-' + added.id + ' .short-stage').count(), 5);
        assert.deepEqual(await page.evaluate(() => cur().plan.slice(0, -1)), oldPlan);
        assert.deepEqual(await page.evaluate(() => sessions[0]), saved.s);
        const preSpeed = added.fields.find(f => f.phase === 'pre' && f.label === 'Reading speed (characters/min or words/min)');
        const postSpeed = added.fields.find(f => f.phase === 'post' && f.label === 'Reading speed (characters/min or words/min)');
        await fill(added.id, preSpeed.id, 40); await fill(added.id, postSpeed.id, 50);
        await action('save-session').click(); await page.waitForSelector('.sess');
        await page.locator('#tab-outcomes').click();
        const cloned = page.locator(`.short-outcomes[data-item-id="${added.id}"]`);
        assert.equal(await cloned.locator('thead th').count(), 2, 'Cloned fields have independent IDs but still compare by measurement stage');
        assert.deepEqual(await cloned.locator('tbody td').allTextContents(), ['40', '50']);
        const original = page.locator('.short-outcomes[data-item-id="st_search"]');
        assert.equal(await original.locator('tbody tr').count(), 5);
        assert.ok(await original.locator('thead th').count() <= 7);
        assert.match(await page.locator('.short-outcomes[data-item-id="st_neglect"]').innerText(), /-8/);
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: 14 short-term tools; five stages; separate efficacy/tolerability; range validation; zero, signed and missing values; folder/CSV/TXT/Excel/history; legacy template add/retry; light/dark 320–1280px; zero outbound requests`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
