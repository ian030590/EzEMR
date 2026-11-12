const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const html = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        const before = await page.evaluate(async () => {
          store = localStore();
          const c = { id: 'entry-fixture', name: 'Synthetic client', ref: 'ENTRY-001', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          const s = { id: 'previous-entry', date: '2026-10-01', num: 1, visit: 'baseline', mode: 'inperson', clinician: 'Synthetic clinician', duration: 45,
            subjective: 'Past report', objective: 'Past observations', feedback: 'Past feedback',
            sym: [{ id: 'previous-pre', kind: 'pre', scores: { ef: 7, bv: 6, dz: 5, ha: 4, na: 3 } }],
            assess: { st_search: { done: true, notes: 'Past assessment note', values: { pre_time_s: 50, post_time_s: 40, protocol: 'Twenty targets on a fixed desk', primary: 'Completion time', intervention: 'Actual previous treatment' } } },
            training: { ocular: { on: true, acts: ['Fixation'], actScores: { Fixation: '88%' }, program: 'OcuTrain', level: 'Fixed target setting', dur: 15, diff: 4, notes: 'Past observation' } },
            peo: { person: 'Past personal finding', environment: 'Fixed desk height', occupation: 'Read work documents' },
            clinicalLinks: [{ id: 'old-problem', category: 'functional', symptom: 'Reading work documents', reasoning: 'Past reasoning', peo: ['environment', 'occupation'], evidence: ['st_search'], evidenceNotes: 'Past evidence', interventions: ['pacing_rest'], interventionNotes: 'Past executed treatment' }],
            plan: 'Review work-document goals', otherTx: 'Previously agreed home task', tolerance: 5, nextDate: '2026-10-08' };
          validateRecord(c, s); await store.saveClient(c); await store.saveSession(c.id, s);
          await finishBoot(); curId = c.id; await loadSessions(); view = 'dashboard'; renderMain();
          return JSON.stringify(s);
        });
        await action('new-session').click();
        await page.locator('#s-subj').fill('Current report');
        await page.locator('#s-plan').fill('Current plan must stay');
        await action('carry-context').click();
        assert.equal(await page.locator('[name="carryContext"]:checked').count(), 0);
        await page.locator('#carryContextForm [type="submit"]').click();
        assert.equal(await page.locator('#carry-error').innerText(), locale === 'en' ? 'Select the content to reuse.' : '請先選擇要沿用的內容。');
        for (const checkbox of await page.locator('[name="carryContext"]').all()) await checkbox.check();
        await page.locator('#carryContextForm [type="submit"]').click();
        await page.waitForSelector('#carryContextForm', { state: 'detached' });
        const reused = await page.evaluate(() => collectSession());
        assert.equal(reused.subjective, 'Current report'); assert.equal(reused.plan, 'Current plan must stay');
        assert.equal(reused.peo.environment, 'Fixed desk height'); assert.equal(reused.peo.occupation, 'Read work documents');
        assert.equal(reused.peo.person || '', '');
        assert.equal(reused.assess.st_search.done, false);
        assert.equal(reused.assess.st_search.values.protocol, 'Twenty targets on a fixed desk');
        assert.equal(reused.assess.st_search.values.primary, 'Completion time');
        for (const key of ['pre_time_s', 'post_time_s', 'intervention']) assert.equal(reused.assess.st_search.values[key], undefined);
        assert.equal(reused.training.ocular.on, false); assert.deepEqual(reused.training.ocular.acts, []);
        assert.equal(reused.training.ocular.program, 'OcuTrain'); assert.equal(reused.training.ocular.level, 'Fixed target setting');
        for (const key of ['dur', 'diff', 'perf']) assert.ok(reused.training.ocular[key] == null || reused.training.ocular[key] === '');
        assert.equal(reused.training.ocular.actScores, undefined); assert.equal(reused.training.ocular.runs, undefined);
        assert.notEqual(reused.clinicalLinks[0].id, 'old-problem');
        assert.equal(reused.clinicalLinks[0].reasoning, ''); assert.deepEqual(reused.clinicalLinks[0].evidence, []); assert.deepEqual(reused.clinicalLinks[0].interventions, []);
        assert.equal(reused.contextSource.sessionId, 'previous-entry');
        assert.ok(reused.sym.every(row => Object.values(row.scores).every(value => value == null)));
        assert.equal(reused.duration, null); assert.equal(reused.tolerance, null);
        assert.equal(await page.evaluate(async () => JSON.stringify((await store.listSessions(curId)).find(s => s.id === 'previous-entry'))), before);
        console.log(`PASS: ${locale} explicit context reuse fills blanks without copying prior scores, completion, current observations or stale treatment`);

        await page.locator('#ac-st_search').check();
        await page.locator('[data-action="measure-add"][data-id="st_search"]').click();
        await page.locator('#measure-name').fill('Ongoing prompt count');
        await page.locator('#measure-type').selectOption('number'); await page.locator('#measure-unit').fill('prompts');
        await page.locator('#measure-followup').check();
        await page.evaluate(() => { window.realClientSave = store.saveClient; store.saveClient = async () => { throw new Error('Fixture write failure'); }; });
        await page.locator('#measureForm [type="submit"]').click();
        const added = await page.evaluate(() => {
          const template = assessmentDialog.items.find(p => p.id === 'st_search');
          return { field: template.fields.at(-1), index: fieldsFor(template).findIndex(f => f.label === 'Ongoing prompt count') };
        });
        await page.locator(`#af-st_search-${added.index}`).fill('0');
        await page.locator('#assessment-done').click();
        await page.waitForFunction(() => [...document.querySelectorAll('.failure-message pre')].some(node => node.textContent.includes('Fixture write failure')));
        assert.equal(await page.locator('#assessmentResultForm').isVisible(), true);
        assert.equal(await page.evaluate(() => cur().plan.find(p => p.id === 'st_search').fields.some(f => f.label === 'Ongoing prompt count')), false);
        assert.equal(await page.locator(`#af-st_search-${added.index}`).inputValue(), '0');
        await page.evaluate(() => { store.saveClient = realClientSave; delete window.realClientSave; });
        await completeAssessment(page);
        assert.equal(await page.locator('#s-subj').inputValue(), 'Current report');
        const snapshot = await page.evaluate(async () => {
          const s = collectSession(); s.id = 'current-entry'; validateRecord(cur(), s); await store.saveSession(curId, s);
          const restored = readRecordCSV(sessionCSV(cur(), s)).session;
          return { stored: (await store.listSessions(curId)).find(row => row.id === s.id), restored };
        });
        assert.equal(snapshot.stored.assess.st_search.values[added.field.id], 0);
        assert.deepEqual(snapshot.restored, snapshot.stored);
        await action('cancel-edit').click();
        if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await action('new-session').click(); await page.locator('#ac-st_search').check();
        const nextIndex = await page.evaluate(id => fieldsFor(assessmentItems(cur(), editing).find(p => p.id === 'st_search')).findIndex(f => f.id === id), added.field.id);
        assert.ok(nextIndex >= 0); assert.equal(await page.locator(`#af-st_search-${nextIndex}`).inputValue(), '');
        await page.keyboard.press('Escape');
        assert.equal(await page.evaluate(async () => JSON.stringify((await store.listSessions(curId)).find(s => s.id === 'previous-entry'))), before);
        console.log(`PASS: ${locale} persistent measure validates failed writes, retains the current draft, preserves zero/CSV and appears blank in future records`);

        await action('cancel-edit').click(); if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await action('edit-client').click(); await page.locator('#esAdd').click(); await page.locator('#es-date-0').fill('2020');
        await page.locator('#cForm [type="submit"]').click();
        assert.equal(await page.locator('#cForm').isVisible(), true);
        assert.match(await page.locator('#es-proc-0').evaluate(node => node.validationMessage), locale === 'en' ? /Enter the surgery name/ : /請填寫手術名稱/);
        assert.equal(await page.evaluate(() => cur().eyeSurgery), undefined);
        await page.locator('#es-date-0').fill(''); await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        assert.deepEqual(await page.evaluate(() => cur().eyeSurgery.list), [], 'Clearing the partial row clears its validation error');
        await action('edit-client').click(); await page.locator('#esAdd').click();
        await page.locator('#es-date-0').fill('2020'); await page.locator('#es-proc-0').fill('Synthetic procedure'); await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        assert.equal(await page.evaluate(() => cur().eyeSurgery.list[0].date), '2020');
        await page.evaluate(async () => { cur().dob = '1984 (year only)'; await store.saveClient(cur()); });
        await action('edit-client').click(); await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        assert.equal(await page.evaluate(() => cur().dob), '1984 (year only)', 'Showing optional fields cannot erase a legacy date entry');
        assert.deepEqual(errors, []);
        console.log(`PASS: ${locale} incomplete surgery rows cannot disappear silently on save`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
