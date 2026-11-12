const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { completeAssessment } = require('./lib/assessments.cjs');
const { completeTraining } = require('./training-modal.cjs');

(async () => {
  const dataRoot = path.resolve(__dirname, '../Data');
  const cases = ['STROKE', 'TBI', 'DIPLOPIA', 'MONOCULAR', 'FIELD', 'NEGLECT', 'MOTOR', 'SCI'];
  const bases = ['2026-10-05_S01_基準評估', '2026-10-12_S02_復健', '2026-10-26_S03_療程後評估'];
  const demos = await Promise.all(cases.flatMap(key => bases.map(base => fs.readFile(path.join(dataRoot, 'DEMO-' + key, base + '.csv'), 'utf8'))));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } }), page = await context.newPage(), errors = [], outbound = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => { outbound.push(route.request().url()); return route.abort(); });
      try {
        await page.goto(pathToFileURL(appPath).href); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          store = localStore();
          const c = { id: 'link_sources', name: 'Synthetic link sources', ref: 'TEST-SOURCES', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          c.plan.push({ id: 'disabled_evidence', name: 'Historical assessment label', active: false, timing: 'session', fields: [] });
          c.plan.push({ id: 'disabled_builtin', templateId: 'npc', name: 'Historical NPC original label', active: false, timing: 'session', fields: [] });
          await store.saveClient(c); clients = [c]; curId = c.id; sessions = []; patientReady = true;
          editing = blankSession(); editing.assess.npc = { done: true, values: { 'NPC break (cm)': '0' } };
          editing.interventions = { adaptation: { picks: [], custom: [{ id: 'rehab__ocular', name: 'Synthetic strategy with a similar identifier' }] } };
          editing.clinicalLinks = [{ id: 'problem', category: 'visual', symptom: 'Synthetic reading problem', peo: [], reasoning: 'Original reasoning', evidence: ['disabled_evidence', 'disabled_builtin', 'missing_evidence', 'npc', 'st_npc'], evidenceNotes: '', interventions: ['ocular_sol', 'ocular_remote', 'eyedot_trainer'], interventionNotes: '' }];
          view = 'edit'; dirty = false; renderMain();
          window.legacyReport = clinicalLinkLines(cur(), collectSession()).join('\n');
        });
        const link = page.locator('[data-clinical-link]').first();
        await link.locator(':scope > details').nth(0).locator('summary').click();
        await link.locator(':scope > details').nth(1).locator('summary').click();
        const compareSources = async () => {
          for (const period of ['short', 'long']) {
            const expectedGroups = await page.locator(`#assess-${period} .assessment-group`).evaluateAll(nodes => nodes.map(node => ({ category: node.dataset.function, heading: node.querySelector('h4').textContent,
              items: [...node.querySelectorAll('.pick input')].map(input => ({ id: input.id.slice(3), label: input.parentElement.textContent })) })));
            const actual = await link.locator(`[data-evidence-period="${period}"] [data-evidence-function]`).evaluateAll(nodes => nodes.map(node => ({ category: node.dataset.evidenceFunction, heading: node.querySelector('h6').textContent,
              items: [...node.querySelectorAll('[data-clinical="evidence"]')].map(input => ({ id: input.value, label: input.parentElement.querySelector('[data-choice-label]').textContent })) })));
            assert.deepEqual(actual, expectedGroups, `${locale}: same ${period} items, labels, function groups and order as O`);
          }
          const markers = await link.locator('[data-clinical="evidence"]').evaluateAll(nodes => nodes.map(input => ({ id: input.value, marker: input.parentElement.querySelector('[data-evidence-state]')?.textContent || '' })));
          const done = await page.evaluate(() => Object.keys(collectSession().assess).filter(id => collectSession().assess[id]?.done));
          for (const choice of markers) assert.equal(choice.marker, done.includes(choice.id) ? (locale === 'en' ? '✓ Assessed this visit' : '✓ 本次已施測') : '', `${choice.id}: only performed assessments show a state marker`);
          const hierarchy = await link.evaluate(node => ({ legend: parseFloat(getComputedStyle(node.querySelector('legend')).fontSize),
            periods: [...node.querySelectorAll('[data-evidence-period] > h5')].map(heading => parseFloat(getComputedStyle(heading).fontSize)),
            functions: [...node.querySelectorAll('[data-evidence-function] > h6')].map(heading => parseFloat(getComputedStyle(heading).fontSize)) }));
          assert.ok(hierarchy.periods.length && hierarchy.functions.length);
          assert.equal(new Set(hierarchy.periods).size, 1); assert.equal(new Set(hierarchy.functions).size, 1);
          assert.ok(hierarchy.periods[0] < hierarchy.legend && hierarchy.functions[0] < hierarchy.periods[0], 'Picker period and function headings are consistently subordinate to the symptom-link legend');
          const sourceTraining = await page.locator('#remediation > .pick-group .pick').evaluateAll(nodes => nodes.map(node => ({ id: 'rehab:' + node.querySelector('input').id.slice(3, -3), label: node.textContent })));
          const targetTraining = await link.locator('[data-link-approach="remediation"] .pick').evaluateAll(nodes => nodes.map(node => ({ id: node.querySelector('input').value, label: node.querySelector('[data-choice-label]').textContent })));
          assert.deepEqual(targetTraining, sourceTraining);
          for (const approach of ['adaptation', 'compensation']) {
            const source = await page.locator(`#${approach}Picks .pick`).evaluateAll(nodes => nodes.map(node => ({ id: node.querySelector('input').dataset.strategy, label: node.textContent })));
            const target = await link.locator(`[data-link-approach="${approach}"] .pick`).evaluateAll(nodes => nodes.map(node => ({ id: node.querySelector('input').value, label: node.querySelector('[data-choice-label]').textContent })));
            assert.deepEqual(target, source, `${locale}: ${approach} follows P`);
          }
        };
        for (const mode of ['inperson', 'telerehab', '']) {
          await page.evaluate(mode => { editing = collectSession(); if (mode) editing.mode = mode; else delete editing.mode; renderEditor(); }, mode);
          await compareSources();
        }
        const selectedState = await link.locator('[value="npc"]').locator('..').locator('[data-evidence-state]').innerText();
        assert.equal(selectedState, locale === 'en' ? '✓ Assessed this visit' : '✓ 本次已施測');
        assert.match(await link.locator('.clinical-evidence-preview').innerText(), locale === 'en' ? /Not marked as assessed in this record/ : /本次未勾選施測/);
        assert.match(await page.evaluate(() => clinicalLinkLines(cur(), collectSession()).join('\n')), locale === 'en' ? /Not marked as assessed in this record/ : /本次未勾選施測/);
        assert.match(await link.locator('[data-legacy="evidence"]').innerText(), /Historical assessment label/);
        assert.match(await link.locator('[data-legacy="evidence"]').innerText(), /Historical NPC original label/, 'Historical evidence keeps its original label even when a current template has a shorter display title');
        assert.equal(await link.locator('[data-legacy="interventions"] input:checked').count(), 3);
        assert.equal(await page.evaluate(() => clinicalLinkLines(cur(), collectSession()).join('\n') === legacyReport), true);
        await page.locator('[data-action="plan-add"][data-period="long"]').click();
        await page.locator('#item-name').fill('Synthetic new assessment'); await page.locator('#itemForm [type="submit"]').click(); await completeAssessment(page);
        await page.locator('[data-action="training-add"][data-editor]').click();
        await page.locator('#item-name').fill('Synthetic new rehabilitation item'); await page.locator('#itemForm [type="submit"]').click(); await completeTraining(page);
        await page.locator('#adaptation-new').fill('Synthetic custom strategy'); await page.locator('[data-action="strategy-add"][data-approach="adaptation"]').click();
        await compareSources();
        assert.match(await link.locator('[data-evidence-period="long"]').innerText(), /Synthetic new assessment/);
        assert.match(await link.locator('[data-link-approach="remediation"]').innerText(), /Synthetic new rehabilitation item/);
        assert.match(await link.locator('[data-link-approach="adaptation"]').innerText(), /Synthetic custom strategy/);
        assert.equal(await link.locator('[data-clinical="interventions"][value="rehab__ocular"]').count(), 1, 'Strategy identifiers stay distinct from rehabilitation links');
        assert.equal(await page.evaluate(() => {
          const s = collectSession(); s.id = 'long_link_id'; s.clinicalLinks[0].interventions = [trainingLinkId('x'.repeat(120))]; validateRecord(cur(), s);
          s.interventions.adaptation.custom.push({ id: 'rehab:ocular', name: 'Invalid strategy identifier' });
          try { validateRecord(cur(), s); return false; } catch { return true; }
        }), true, 'The full training key fits the link namespace, while strategy IDs cannot use that namespace');
        await link.locator('[data-clinical="interventions"][value="rehab:ocular"]').check();
        assert.equal(await page.locator('#tx-ocular-on').isChecked(), true); assert.equal(await page.locator('#trainingResultForm').count(), 0);
        assert.equal(await page.locator('#tx-summary-ocular .assessment-empty').isVisible(), true);
        await page.locator('#tx-ocular-on').click();
        assert.equal(await page.locator('#tx-ocular-on').isChecked(), true); assert.equal(await page.locator('[data-linked-problem]').count(), 1);
        await page.locator('[data-linked-problem]').click();
        assert.equal(await link.locator('[data-clinical="symptom"]').evaluate(node => node === document.activeElement), true);
        const saved = await page.evaluate(async () => {
          const s = collectSession(); s.id = 'saved_links'; validateRecord(cur(), s); await store.saveSession(curId, s);
          return { links: s.clinicalLinks, csv: readRecordCSV(sessionCSV(cur(), s)).session.clinicalLinks, json: await backupData(store) };
        });
        assert.deepEqual(saved.csv, saved.links);
        assert.deepEqual(saved.json.clients[0].sessions[0].clinicalLinks, saved.links);
        await page.evaluate(async data => {
          dirty = false; editing = null; view = 'sessions'; renderMain();
          window.linkRestore = importAll({ name: 'synthetic-links.json', text: async () => JSON.stringify(data) }, true);
        }, saved.json);
        await page.locator('#restoreBackupOverwrite').check(); await page.locator('#restoreBackupConfirm').click(); await page.evaluate(() => linkRestore);
        assert.deepEqual(await page.evaluate(async () => (await store.listSessions('link_sources'))[0].clinicalLinks), saved.links);
        await page.evaluate(() => { editing = clone(sessions[0]); view = 'edit'; renderMain(); });
        await link.locator(':scope > details').nth(1).locator('summary').click();
        await link.locator('[data-legacy="interventions"] [value="ocular_sol"]').click();
        assert.equal(await link.locator('[value="ocular_sol"]').count(), 0, 'Removed historical items are not offered as new choices');
        const demoResults = await page.evaluate(texts => texts.map(text => {
          const parsed = readRecordCSV(text), { client, session } = parsed;
          clients = [client]; curId = client.id; sessions = [session]; editing = clone(session); editing.sym = shapeSym(editing.sym, editing.visit); editorWorkflow = null; view = 'edit'; renderMain();
          const before = JSON.stringify(session.clinicalLinks), collected = collectSession();
          collected.id = session.id; validateRecord(client, collected);
          const restored = readRecordCSV(sessionCSV(client, collected)).session;
          return { before, after: JSON.stringify(restored.clinicalLinks), reportSame: JSON.stringify(clinicalLinkLines(client, session)) === JSON.stringify(clinicalLinkLines(client, restored)) };
        }), demos);
        assert.equal(demoResults.length, 24); for (const result of demoResults) { assert.equal(result.after, result.before, 'All demo clinical links retain byte-identical JSON content on re-save'); assert.equal(result.reportSame, true); }
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: exact SOAP sources/groups/labels/order in all modes, immediate additions, linked rehabilitation guard, historical labels/removal, CSV/JSON restore and byte-identical links in all 24 demo records`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
