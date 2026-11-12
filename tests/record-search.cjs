const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/record-search');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const errors = [], external = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => { external.push(route.request().url()); return route.abort(); });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(appPath).href); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const original = await page.evaluate(async () => {
        store = localStore();
        const client = { id: 'search-client', name: 'Synthetic search client', ref: 'TEST-SEARCH', plan: [{ id: 'search_measure', name: 'Custom needle assessment', fields: [{ id: 'zero', label: 'Synthetic result', type: 'number' }], timing: 'session' }], trainingPlan: [], created: '2026-11-12' };
        const base = { visit: 'treatment', sym: [], assess: {}, training: {} };
        const records = [
          { ...base, id: 'record-one', date: '2026-11-10', subjective: '合成主訴 Reading dizziness', objective: 'Synthetic observation', assessment: 'Synthetic reasoning', plan: 'Synthetic home programme', clinician: 'Synthetic clinician', peo: { environment: 'Synthetic lighting' }, assess: { search_measure: { done: true, values: { zero: 0 }, notes: 'Synthetic assessment finding' } } },
          { ...base, id: 'record-two', date: '2026-11-11', visit: 'post', subjective: 'Synthetic cooking goal', otherTx: 'Synthetic intervention', feedback: 'Synthetic session response', assess: { search_measure: { done: false, notes: 'Suppressed measurement text' } } },
          { ...base, id: 'record-absent', date: '2026-11-12', visit: 'absent', subjective: 'Hidden absence draft needle' }
        ];
        await store.saveClient(client);
        for (const record of records) await store.saveSession(client.id, record);
        const other = { ...client, id: 'other-client', ref: 'TEST-OTHER', name: 'Synthetic other client' };
        await store.saveClient(other); await store.saveSession(other.id, { ...base, id: 'other-record', date: '2026-11-12', subjective: 'Private other client secret' });
        await finishBoot(); curId = client.id; await loadSessions(); view = 'sessions'; renderMain();
        return JSON.stringify({ clients: await store.listClients(), sessions: await store.listSessions(client.id) });
      });
      const search = page.locator('#filter-text');
      const count = () => page.locator('.sess').count();
      assert.equal(await count(), 3);
      assert.equal(await search.getAttribute('placeholder'), locale === 'en' ? 'Symptoms, assessments, interventions or plans' : '主訴、評估、介入或計畫');
      for (const query of ['合成主訴', 'READING', 'ｒｅａｄｉｎｇ', 'reading dizziness', 'Synthetic observation', 'Synthetic reasoning', 'home programme', 'Synthetic clinician', 'Synthetic lighting', 'assessment finding', 'Custom needle assessment']) {
        await search.fill(query); assert.equal(await count(), 1, `${locale}: ${query}`);
        assert.equal(await search.evaluate(el => el === document.activeElement), true, 'Filtering preserves typing focus');
      }
      for (const query of ['cooking goal', 'Synthetic intervention', 'Synthetic session response']) {
        await search.fill(query); assert.equal(await count(), 1, `${locale}: ${query}`);
      }
      await search.fill('Private other client secret'); assert.equal(await count(), 0, 'Search stays within the selected client');
      await search.fill('Hidden absence draft needle'); assert.equal(await count(), 0, 'Search excludes clinical text suppressed in an absence report');
      await search.fill('Suppressed measurement text'); assert.equal(await count(), 0, 'Deselected assessment drafts are excluded from search');
      await search.fill('reading <img src=x>'); assert.equal(await count(), 0); assert.equal(await page.locator('#tabBody img').count(), 0);
      if (locale === 'en') assert.doesNotMatch(await page.locator('#tabBody').innerText(), /\p{Script=Han}/u);
      await search.fill('Synthetic');
      await page.locator('#filter-visit').selectOption('post'); assert.equal(await count(), 1);
      await page.locator('#filter-from').fill('2026-11-12'); await page.locator('#filter-from').dispatchEvent('change'); assert.equal(await count(), 0);
      await page.locator('[data-action="clear-filters"]').first().click();
      assert.equal(await page.locator('#filter-text').inputValue(), ''); assert.equal(await count(), 3);
      await page.locator('#filter-text').fill('reading');
      await page.locator('#tab-outcomes').click(); assert.match(await page.locator('#filterCount').innerText(), /1\s*\/\s*3/);
      await page.locator('#tab-sessions').click(); assert.equal(await count(), 1);
      await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
      assert.equal(await page.locator('#filter-text').inputValue(), 'reading'); assert.equal(await count(), 1);
      await page.locator('#languageSelect').selectOption(locale);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
        for (const width of [320, 360, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}px search layout`);
          if (width === 320) await page.screenshot({ path: path.join(output, `${locale}-${theme}-mobile.png`), fullPage: true });
        }
        await page.screenshot({ path: path.join(output, `${locale}-${theme}.png`), fullPage: true });
      }
      const stored = await page.evaluate(async () => JSON.stringify({ clients: await store.listClients(), sessions: await store.listSessions('search-client') }));
      assert.equal(stored, original, 'Searching, filters, themes and language switching never rewrite stored records');
      await page.locator('#clientSearch').fill('TEST-OTHER'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
      await page.waitForSelector('#patientDashboard'); await page.locator('#tab-sessions').click();
      assert.equal(await page.locator('#filter-text').inputValue(), '', 'Switching client resets the previous search');
      assert.equal(await count(), 1);
      console.log(`PASS: ${locale} local record search covers SOAP, PEO, assessments, intervention and response; case/width-insensitive terms, filters, empty state, client isolation, source preservation and 320–1280px light/dark layouts`);
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
