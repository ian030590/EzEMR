const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const appPath = path.join(root, 'EzEMR.html');
  assert.doesNotMatch(await fs.readFile(appPath, 'utf8'), /id="integratedRecords"/, 'The published HTML must not embed client records');
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en';
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, colorScheme: 'light', reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const capture = async state => {
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: path.join(output, `workspace-${locale}-${state}.png`) });
      };
      const fits = async state => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}: ${state} overflow`);
      const focused = selector => page.locator(selector).evaluate(node => node === document.activeElement);

      // First run: the storage setup screen opened straight from disk.
      await page.goto(pathToFileURL(appPath).href);
      await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      assert.equal(await page.locator('h1').innerText(), 'EzEMR');
      assert.match(await page.title(), /^EzEMR \|/);
      assert.equal(await page.locator('.storage-preview').isVisible(), true);
      assert.equal(await action('pick-folder').isVisible(), true);
      assert.equal(await page.locator('#clientCount').innerText(), '0');
      await fits('connect'); await capture('connect');
      await action('use-default').click();
      assert.equal(await page.locator('.welcome').isVisible(), true);
      assert.match(await page.locator('#storeStatus').innerText(), en ? /Data \(created on first save\)/ : /Data（首次儲存時建立）/);
      assert.equal(await page.locator('#clientList .muted').isVisible(), true);
      await fits('welcome'); await capture('welcome');

      // Native folder dialogs cannot be automated, so synthetic records use browser storage from here on.
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await action('new-client').click();
      await page.locator('#cf-name').fill('Workspace test client');
      await page.locator('#cf-ref').fill('TEST-WORKSPACE');
      await page.locator('#cf-dx').fill('Synthetic history for layout checks.\n'.repeat(20));
      await page.locator('#cForm [type="submit"]').click();
      await page.waitForSelector('.client-summary');
      assert.equal(await page.locator('#tab-sessions').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('#tabBody .empty').isVisible(), true);
      assert.equal(await page.locator('.sess').count(), 0);
      assert.equal(await page.locator('#clientCount').textContent(), '1');
      assert.deepEqual(await page.locator('.client-stats dd').allTextContents(), ['0', en ? 'No records yet' : '尚無紀錄', en ? 'Not selected' : '尚未指定']);
      await action('edit-client').click();
      assert.equal(await page.locator('#cf-name').inputValue(), 'Workspace test client');
      await page.keyboard.press('Escape');
      await page.waitForSelector('#cForm', { state: 'detached' });

      // Saved records fill the summary; the history lists the newest record first.
      const expectedStats = await page.evaluate(async () => {
        const row = (kind, score) => ({ id: uid('r'), kind, scores: Object.fromEntries(SK.map(k => [k, score])) });
        const records = [
          { id: 'workspace-earlier', date: '2026-10-01', num: 1, nextDate: '2026-10-08' },
          { id: 'workspace-latest', date: '2026-11-02', num: 2, nextDate: '2026-11-09' }
        ];
        for (const record of records) await store.saveSession(curId, {
          ...record, visit: record.num === 2 ? 'baseline' : 'treatment', sym: [row('pre', 2), row('end', 1)],
          assess: record.num === 2 ? { copm: { done: true, copm: [{ occ: 'Synthetic activity', perf: 0, sat: 0 }] } } : {},
          training: record.num === 1 ? { ocular: { on: true, dur: 0, notes: 'Synthetic observation' } } : {}
        });
        await loadSessions(); renderMain();
        return ['2', fmtDate('2026-11-02'), fmtDate('2026-11-09')];
      });
      assert.deepEqual(await page.locator('.client-stats dd').allTextContents(), expectedStats);
      assert.equal(await page.locator('.chart').isVisible(), true);
      assert.deepEqual(await page.locator('.sess [data-action="open-session"]').evaluateAll(buttons => buttons.map(button => button.dataset.id)), ['workspace-latest', 'workspace-earlier']);
      assert.equal(await page.locator('#tab-sessions').innerText(), en ? 'Rehabilitation records (2)' : '復健紀錄 (2)');
      const stored = await page.evaluate(() => JSON.stringify(sessions));
      await page.locator('.sess [data-action="open-session"]').first().click();
      assert.equal(await page.evaluate(() => editing.id), 'workspace-latest');
      assert.equal(await page.locator('#s-date').inputValue(), '2026-11-02');
      await action('cancel-edit').click();
      await page.locator('.sess [data-action="open-session"][data-id="workspace-earlier"]').click();
      assert.equal(await page.evaluate(() => editing.training.ocular.dur), 0);
      await action('cancel-edit').click();
      assert.equal(await page.evaluate(() => JSON.stringify(sessions)), stored, 'Opening and cancelling preserves saved records');

      // Expanded medical history survives chart changes; the tab bar keeps its position between tabs.
      const navTop = () => page.locator('.tabs').evaluate(node => node.getBoundingClientRect().top + scrollY);
      await page.locator('.medical-history > summary').click();
      await page.locator('#chartSym').selectOption('ef');
      assert.equal(await page.locator('.medical-history').evaluate(node => node.open), true, 'Changing chart symptoms keeps medical history open');
      await page.locator('#chartSym').selectOption('total');
      await page.locator('#tab-outcomes').click();
      const outcomesTop = await navTop();
      await page.locator('#tab-sessions').click();
      assert.equal(await navTop(), outcomesTop, 'Client header and tabs keep their position between tabs');

      // History filters narrow the list without changing the client summary.
      await page.locator('#filter-from').fill('2026-11-01');
      await page.locator('#filter-from').dispatchEvent('change');
      assert.equal(await page.locator('.sess').count(), 1);
      assert.match(await page.locator('#filterCount').innerText(), /1 \/ 2/);
      assert.deepEqual(await page.locator('.client-stats dd').allTextContents(), expectedStats, 'Filters do not change the summary');
      await page.locator('#tab-outcomes').click(); await page.locator('#tab-sessions').click();
      assert.equal(await page.locator('.sess').count(), 1, 'Filters survive switching tabs');
      await page.locator('#filter-from').fill('2027-01-01');
      await page.locator('#filter-from').dispatchEvent('change');
      assert.equal(await page.locator('#tabBody .empty').isVisible(), true);
      await action('clear-filters').click();
      assert.equal(await page.locator('.sess').count(), 2);

      // Arrow keys, Home and End move between tabs with a single tab stop.
      await page.locator('#tab-sessions').focus();
      for (const [key, selected] of [['ArrowRight', 'outcomes'], ['End', 'plan'], ['Home', 'sessions'], ['ArrowLeft', 'plan'], ['ArrowRight', 'sessions']]) {
        await page.keyboard.press(key);
        assert.equal(await page.locator(`#tab-${selected}`).getAttribute('aria-selected'), 'true');
        assert.equal(await focused(`#tab-${selected}`), true);
        assert.equal(await page.locator('[role="tab"][tabindex="0"]').count(), 1);
        assert.equal(await page.locator('#tabBody').getAttribute('aria-labelledby'), `tab-${selected}`);
      }

      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        for (const width of [320, 768, 1280, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.locator('#tab-sessions').click();
          await fits(`${theme} ${width} records`);
          for (const tab of await page.locator('.tab').all()) {
            const rect = await tab.boundingBox();
            assert.ok(rect.x >= 0 && rect.x + rect.width <= width && rect.height >= 44, `${theme} ${width}px: every tab is visible with a 44px target`);
          }
          await page.evaluate(() => document.querySelectorAll('.toast').forEach(node => node.remove()));
          if ([320, 1440].includes(width)) await capture(`${theme}-${width}-records`);
          await page.locator('#tab-outcomes').click();
          await fits(`${theme} ${width} progress`);
          await action('new-session').click();
          await fits(`${theme} ${width} editor`);
          await page.locator('#s-subj').fill('Offline workspace test draft');
          await page.locator('#s-subj').scrollIntoViewIfNeeded();
          // Narrow layouts let the toolbar scroll with the page; wider layouts keep Save in view.
          if (width > 860) {
            const save = await page.locator('#toolbarSave').boundingBox();
            assert.ok(save.y >= 0 && save.y + save.height <= 1000, `${locale} ${theme} ${width}px: Save stays visible (${JSON.stringify(save)})`);
          }
          await page.locator('#s-subj').fill('');
          await page.evaluate(() => { dirty = false; });
          if ([320, 1440].includes(width)) await capture(`${theme}-${width}-editor`);
          await action('cancel-edit').click();
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 });

      // Switching clients from the roster protects an unsaved draft.
      await page.evaluate(async () => {
        await store.saveClient({ ...clone(cur()), id: 'workspace-other', name: 'Other patient', ref: 'TEST-OTHER' });
        await loadClients(); renderClients();
      });
      assert.equal(await page.locator('#clientCount').innerText(), '2');
      await page.locator('#clientSearch').fill('no matching client');
      assert.equal(await page.locator('.client-btn').count(), 0);
      await page.locator('#clientSearch').fill('TEST-OTHER');
      assert.equal(await page.locator('.client-btn').count(), 1);
      await action('new-session').click();
      await page.locator('#s-subj').fill('Keep this draft');
      await page.locator('.client-btn').click();
      await page.waitForSelector('#askNo');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#s-subj').inputValue(), 'Keep this draft');
      assert.equal(await page.evaluate(() => dirty), true);
      await page.locator('.client-btn').click();
      await page.locator('#askYes').click();
      await page.waitForSelector('.client-summary');
      assert.equal(await page.locator('.client-head h2').innerText(), 'Other patient');
      assert.equal(await page.locator('#tab-sessions').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('.client-stats dd').first().innerText(), '0');
      assert.equal(await page.locator('.sess').count(), 0);
      await page.locator('#clientSearch').fill('');
      assert.equal(await page.locator('.client-btn').count(), 2);
      assert.deepEqual(errors, []);
      console.log(`PASS: ${locale} offline file opening, storage setup, empty and filled client summaries, newest-first history, filters independent of the summary, keyboard tabs, draft protection, light/dark 320/768/1280/1440px layouts and sticky Save on wide screens`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
