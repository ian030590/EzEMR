const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/assessment-periods');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await action('new-client').click();
        await page.locator('#cf-name').fill('Synthetic period patient');
        await page.locator('#cf-ref').fill('TEST-PERIODS');
        await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        const original = await page.evaluate(async () => {
          cur().plan = [clone(DEFAULT_PLAN.find(item => item.id === 'va'))];
          await store.saveClient(cur());
          return clone(cur().plan);
        });
        await action('new-session').click();
        await page.locator('#s-subj').fill('Keep original clinical wording 原文');
        assert.equal(await page.locator('#assess-short .assessment-empty').innerText(), locale === 'en' ? 'No short-term measures configured.' : '尚未設定短期指標。');
        assert.equal(await page.locator('#assess-long #ac-va').count(), 1);
        assert.equal(await page.locator('.short-guide').count(), 0);
        await page.locator('#assess-short [data-action="plan-add"]').click();
        assert.equal(await page.locator('#item-period').inputValue(), 'short');
        assert.equal(await page.locator('#item-timing').inputValue(), 'session');
        const seed = await page.evaluate(() => DEFAULT_PLAN.filter(item => !item.copm).findIndex(item => item.id === 'st_neglect'));
        await page.locator('#item-base').selectOption(String(seed));
        assert.equal(await page.locator('#item-category').inputValue(), 'cognitive');
        assert.equal(await page.locator('#item-name').inputValue(), locale === 'en' ? 'Spatial neglect / attention (short-term)' : '空間忽略／注意（短期）');
        await page.locator('#item-base').selectOption('');
        assert.equal(await page.locator('#item-period').inputValue(), 'short', 'Returning to a blank template retains the short-term entry');
        assert.equal(await page.locator('#item-timing').inputValue(), 'session');
        await page.locator('#item-base').selectOption(String(seed));
        await page.locator('#itemForm [type="submit"]').click();
        await page.waitForSelector('#itemForm', { state: 'detached' });
        const added = await page.evaluate(() => clone(cur().plan.at(-1)));
        assert.equal(added.functionCategory, 'cognitive');
        assert.equal(added.outcomePeriod, 'short');
        assert.equal(added.name, 'Spatial neglect / attention (short-term)');
        const invalid = await page.evaluate(item => [{ functionCategory: 'invalid' }, { outcomePeriod: 'invalid' }].map(change => {
          try { validateItems([{ ...item, ...change }], 'assessment'); return null; } catch (error) { return error.message; }
        }), added);
        assert.deepEqual(invalid, Array(2).fill(locale === 'en' ? 'Invalid function category or outcome period.' : '功能分類或指標期程格式錯誤。'));
        assert.equal(await page.locator(`#assess-short [data-function="cognitive"] #ac-${added.id}`).isChecked(), true);
        assert.deepEqual(await page.evaluate(() => cur().plan.slice(0, -1)), original, 'Adding a short-term measure leaves older definitions unchanged');
        const before = added.fields.findIndex(field => field.phase === 'pre' && field.label === 'Signed line-bisection deviation (mm)');
        const after = added.fields.findIndex(field => field.phase === 'post' && field.label === 'Signed line-bisection deviation (mm)');
        await page.locator(`#af-${added.id}-${before}`).fill('-3');
        await page.locator(`#af-${added.id}-${after}`).fill('0');
        await page.screenshot({ path: path.join(output, `${locale}-fields.png`), fullPage: true });
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.equal(await page.locator(`#af-${added.id}-${before}`).inputValue(), '-3');
        assert.equal(await page.locator(`#af-${added.id}-${after}`).inputValue(), '0');
        await page.locator('#languageSelect').selectOption(locale);
        await action('save-session').click();
        await page.waitForSelector('.sess');
        const saved = await page.evaluate(() => {
          const s = sessions[0]; return { session: clone(s), csv: readRecordCSV(sessionCSV(cur(), s)).session, note: noteText(cur(), s) };
        });
        assert.deepEqual(saved.csv, saved.session);
        assert.equal(saved.session.assess[added.id].values[added.fields[before].id], -3);
        assert.equal(saved.session.assess[added.id].values[added.fields[after].id], 0);
        assert.equal(saved.session.assessmentPlan[0].functionCategory, 'cognitive');
        assert.match(saved.note, /Keep original clinical wording 原文/);
        assert.doesNotMatch(saved.note, /MCID|measurement workflow|施測流程/);
        await action('open-session').click();
        assert.equal(await page.locator(`#af-${added.id}-${after}`).inputValue(), '0');
        assert.equal(await page.locator('#s-subj').inputValue(), 'Keep original clinical wording 原文');
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale}: old-client short-term entry, grouped template, real pre/post fields, metadata, original text, negative/zero values and CSV/save/reopen`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
