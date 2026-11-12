const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/clinical-links-usability');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
      const requests = [], errors = [];
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await page.locator('[data-action="new-client"]:visible').first().click();
        await page.locator('#cf-name').fill('Synthetic linked form patient');
        await page.locator('#cf-ref').fill('TEST-LINKED-FORM');
        await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        await page.evaluate(() => {
          editing = blankSession(); delete editing.mode;
          editing.peo = { person: 'Original person note', environment: 'Original environment note', occupation: 'Original occupation note' };
          editing.assessment = 'Original general judgement';
          editing.clinicalLinks = [{ id: 'linked-form', category: 'visual', symptom: 'Reading difficulty', peo: ['person', 'occupation'], reasoning: 'Original symptom reasoning', evidence: [], evidenceNotes: '', interventions: [], interventionNotes: '' }];
          view = 'edit'; renderMain();
        });
        const link = page.locator('#clinicalLinks [data-clinical-link]').first();
        await link.locator(':scope > details').nth(1).locator('summary').click();
        assert.ok(await link.locator('[data-clinical="interventions"]').count() > 0, 'Unspecified service mode has actionable intervention choices');
        assert.equal(await link.locator('[data-clinical="interventions"][value="rehab:ocular"]').count(), 1);
        assert.equal(await link.locator('[data-clinical="interventions"][value="ocular_sol"], [data-clinical="interventions"][value="ocular_remote"]').count(), 0);
        if (locale === 'en') assert.doesNotMatch(await page.locator('#clinicalLinks').innerText(), /\p{Script=Han}/u, 'Unspecified-mode help and intervention options are translated');
        await link.locator('[data-clinical-focus="s-mode"]').click();
        assert.equal(await page.evaluate(() => document.activeElement.id), 's-mode');

        await link.locator('[data-clinical="interventions"][value="workstation_setup"]').check();
        const shared = page.locator('#adaptationPicks [data-strategy="workstation_setup"]');
        assert.equal(await shared.isChecked(), true, 'Associating a strategy also selects it for this visit');
        await shared.click();
        assert.equal(await shared.isChecked(), true, 'A whole-visit checkbox cannot silently erase a symptom association');
        assert.equal(await page.locator('.modal [data-linked-problem]').count(), 1, 'The guard identifies the linked problem');
        if (locale === 'en') assert.doesNotMatch(await page.locator('.modal').innerText(), /\p{Script=Han}/u);
        await page.locator('.modal [data-linked-problem]').click();
        await page.waitForSelector('.modal', { state: 'detached' });
        assert.equal(await link.locator('[data-clinical="symptom"]').evaluate(node => node === document.activeElement), true, 'The guard links directly back to the editable problem');
        assert.equal(await link.locator('[data-clinical="interventions"][value="workstation_setup"]').isChecked(), true);
        await link.locator('[data-clinical="reasoning"]').fill('Updated symptom reasoning <script>');
        await link.locator('[data-clinical="interventionNotes"]').fill('One source for the intervention goal');
        assert.equal(await page.locator('#clinicalReasoningSummary, #clinicalInterventionSummary').count(), 0, 'Already editable symptom links do not create a second editing location');
        assert.match(await page.evaluate(() => noteText(cur(), collectSession())), /Updated symptom reasoning <script>/);
        assert.match(await page.evaluate(() => noteText(cur(), collectSession())), /One source for the intervention goal/);
        assert.equal(await page.locator('#clinicalLinks script').count(), 0);
        for (const theme of ['light', 'dark']) for (const width of [360, 1280]) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await page.setViewportSize({ width, height: 900 });
          const gaps = await link.locator('.clinical-approach').evaluateAll(nodes => nodes.map(node => {
            const heading = node.querySelector('h4').getBoundingClientRect(), picks = node.querySelector('.pick-group').getBoundingClientRect();
            return picks.top - heading.bottom;
          }));
          assert.equal(gaps.length, 3);
          assert.ok(gaps.every(gap => Math.abs(gap - 8) <= 1), 'Every intervention heading has the same gap before its choices');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale}/${theme}/${width}: no page overflow`);
          await link.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
        }
        await page.setViewportSize({ width: 1280, height: 900 });

        await link.locator('[data-clinical="interventions"][value="rehab:ocular"]').check();
        assert.equal(await page.locator('#tx-ocular-on').isChecked(), true);
        assert.equal(await page.locator('#trainingResultForm').count(), 0, 'Linking a rehabilitation item does not force its dialog open');
        assert.equal(await page.locator('#tx-summary-ocular .assessment-empty').isVisible(), true);
        const customName = 'Custom adaptive plan <img src=x>';
        await page.locator('#adaptation-new').fill(customName);
        await page.locator('[data-action="strategy-add"][data-approach="adaptation"]').click();
        const custom = await page.evaluate(() => collectSession().interventions.adaptation.custom[0]);
        assert.equal(custom.name, customName);
        const customChoice = link.locator(`[data-clinical="interventions"][value="${custom.id}"]`);
        assert.match(await customChoice.locator('..').innerText(), /Custom adaptive plan <img src=x>/);
        await customChoice.check();
        assert.match(await page.evaluate(() => noteText(cur(), collectSession())), /Custom adaptive plan <img src=x>/);
        assert.equal(await page.locator('#clinicalLinks img').count(), 0);

        await page.locator('#s-mode').selectOption('telerehab');
        assert.equal(await link.locator('[data-clinical="interventions"][value="rehab:ocular"]').count(), 1, 'The SOAP rehabilitation item is available once in either service mode');
        assert.equal(await link.locator(':scope > details').nth(1).getAttribute('open'), '', 'Changing service mode keeps the active picker open');
        assert.equal(await link.locator('[data-clinical="interventions"][value="workstation_setup"]').isChecked(), true);
        assert.equal(await link.locator('[data-clinical="reasoning"]').inputValue(), 'Updated symptom reasoning <script>');
        const draft = await page.evaluate(() => collectSession());
        assert.deepEqual(draft.peo, { person: 'Original person note', environment: 'Original environment note', occupation: 'Original occupation note' });
        assert.equal(draft.assessment, 'Original general judgement');
        assert.match(await page.evaluate(() => noteText(cur(), collectSession())), /One source for the intervention goal/);
        const csv = await page.evaluate(() => {
          const s = collectSession(); s.id = 'linked-form-roundtrip';
          validateRecord(cur(), s);
          return { s, restored: readRecordCSV(sessionCSV(cur(), s)).session };
        });
        assert.deepEqual(csv.restored, csv.s, 'Custom plan names, IDs and symptom associations round-trip in the record CSV');
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        await page.locator('#languageSelect').selectOption(locale);
        assert.deepEqual(await page.evaluate(() => collectSession()), draft, 'Language changes preserve clinical source data');
        if (locale === 'en') {
          const text = await page.locator('#clinicalLinks').innerText();
          assert.doesNotMatch(text, /\p{Script=Han}/u, 'All new empty-mode and picker labels are bilingual');
        }
        assert.equal(await link.locator(':scope > details').nth(1).evaluate(node => node.open), true, 'Language changes retain the open intervention picker');
        await link.locator(`[data-clinical="interventions"][value="${custom.id}"]`).uncheck();
        await page.locator(`#adaptationPicks [data-strategy="${custom.id}"]`).uncheck();
        assert.equal(await page.locator(`#adaptationPicks [data-strategy="${custom.id}"]`).isChecked(), false, 'A strategy can be removed after its symptom association is explicitly removed');
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale}: single symptom editing location, consistent intervention spacing, linked choices and preserved offline draft in both themes`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
