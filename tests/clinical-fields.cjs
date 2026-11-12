const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/clinical-fields');
const profileKeys = ['nationalId', 'religion', 'phone', 'address'];
(async () => {
  await fs.mkdir(output, { recursive: true });
  const html = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
      const page = await context.newPage(), errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => route.request().url() === url ? route.continue() : (requests.push(route.request().url()), route.abort()));
      await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const original = await page.evaluate(async () => {
        const source = { file: 'legacy-measurements.xlsx', sheet: 'Original sheet', row: 7 };
        const client = { id: 'clinical-fields', name: 'Synthetic patient 原文', ref: 'CLINICAL-FIELDS', dob: '1982-01-08', sex: 'male', doi: '2022-03-22',
          dx: 'Synthetic diagnosis', medicalHistory: 'Clinical history 原文\nSecond line', referral: 'Clinical functional concern', eyeSurgery: { none: true, list: [] },
          occupation: 'Synthetic occupation', chronicConditions: 'Clinical condition', allergies: 'Clinical allergy', smoking: 'former', alcohol: 'never', betel: 'unknown',
          nationalId: 'Original ID 001', religion: 'Original religion', phone: '0012345', address: 'Original address',
          sourceMedical: [{ file: 'legacy-medical.pdf', pages: [1, 2] }], sourceRoster: [{ file: 'legacy-roster.xlsx', sheet: 'Raw roster', fields: { unused: 'legacy-raw-value' } }],
          plan: [...clone(DEFAULT_PLAN), clone(SOURCE_ASSESSMENTS.find(p => p.id === 'src_va'))] };
        const session = { id: 'clinical-session', date: '2026-11-10', visit: 'baseline', num: 1, subjective: 'Clinical subjective note',
          objective: 'Clinical observations', assessment: 'Clinical reasoning', plan: 'Clinical plan', sym: [], sourceRecords: [source],
          assess: { src_va: { done: true, notes: sourceLabel(source, false), values: { va_ou: 0 } },
            npc: { done: true, notes: 'Clinical note mentions clinical-notes.xlsx', values: {} } },
          training: { ocular: { on: true, notes: 'Clinical training observation', runs: [{ id: 'clinical-run', item: 'saccade', time: '14:05:09', file: 'legacy-run.csv', values: { accuracy_rate: 0 } }] } } };
        const settings = { version: 1, requiredFields: ['name', 'ref', 'nationalId', 'religion', 'phone', 'address'] };
        localStorage.setItem('vision-rehab-notes-v1', JSON.stringify({ clients: { [client.id]: client }, sessions: { [client.id]: { [session.id]: session } }, settings }));
        store = localStore(); await finishBoot(); view = 'sessions'; renderMain();
        const disk = await navigator.storage.getDirectory(), dir = await disk.getDirectoryHandle('legacy-clinical-settings', { create: true });
        const rawSettings = JSON.stringify(settings);
        await writeFile(dir, 'settings.json', rawSettings);
        const folderSettings = await folderStore(dir).getSettings();
        const settingsUnchanged = await (await (await dir.getFileHandle('settings.json')).getFile()).text() === rawSettings;
        localStorage.setItem('ezrehab-default-profile-settings', rawSettings);
        const pendingSettings = await defaultFolderStore().getSettings();
        localStorage.removeItem('ezrehab-default-profile-settings');
        await importAll({ text: async () => JSON.stringify({ settings, clients: [{ ...client, sessions: [session] }] }) });
        view = 'sessions'; renderMain();
        return { client, session, active: appSettings, folderSettings, pendingSettings, settingsUnchanged };
      });
      for (const settings of [original.active, original.folderSettings, original.pendingSettings]) assert.deepEqual(settings.requiredFields, ['name', 'ref', ...profileKeys], 'Browser, folder, pending and backup settings retain identity and contact requirements');
      assert.equal(original.settingsUnchanged, true, 'Opening an old settings file does not rewrite it');
      assert.equal(await page.locator('#profileIncomplete').count(), 0);
      for (const disclosure of await page.locator('.patient-details > details').all()) await disclosure.evaluate(node => node.open = true);
      const summary = await page.locator('.client-summary').innerText();
      assert.doesNotMatch(summary, /legacy-|病歷來源|收案資料|Total records|紀錄總數/);
      assert.equal(summary.split('Synthetic diagnosis').length - 1, 1, 'Diagnosis appears once in the summary');
      assert.deepEqual(await page.locator('.client-demographics dt').allTextContents(), locale === 'en' ? ['Date of birth', 'Sex'] : ['出生日期', '性別']);
      assert.equal(await page.locator('.profile-facts').getByText('Clinical allergy', { exact: true }).count(), 1, 'Clinical profile facts remain visible');
      for (const key of profileKeys) assert.equal(await page.locator('.profile-facts').getByText(original.client[key], { exact: true }).count(), 1, `${key} remains visible in the patient profile`);
      await page.locator('.client-summary').screenshot({ path: path.join(output, `${locale}-summary.png`) });

      await page.locator('#viewMenuButton').click(); await page.locator('[data-action="global-settings"]:visible').click();
      assert.equal(await page.locator('#appSettingsForm [name="requiredField"]').count(), 14);
      for (const key of profileKeys) assert.equal(await page.locator(`#appSettingsForm [value="${key}"]`).isChecked(), true);
      await page.keyboard.press('Escape');
      await page.locator('.client-head [data-action="edit-client"]').click();
      const labels = locale === 'en' ? ['National ID number', 'Religion', 'Phone', 'Address'] : ['身分證字號', '宗教', '聯絡電話', '聯絡地址'];
      const updatedProfile = { nationalId: 'ID-原文-002', religion: '信仰原文', phone: '0012345 ext 9', address: '原文地址\nSecond line' };
      for (const [index, key] of profileKeys.entries()) {
        const field = page.locator(`#cf-${key}`);
        assert.equal(await field.inputValue(), original.client[key]);
        assert.equal(await field.getAttribute('aria-label'), labels[index]);
        assert.notEqual(await field.getAttribute('required'), null);
        await field.fill(updatedProfile[key]);
      }
      assert.equal(await page.locator('#cf-phone').getAttribute('type'), 'tel');
      assert.equal(await page.locator('textarea#cf-address').count(), 1);
      await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
      assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), profileKeys), updatedProfile, 'All four fields remain editable and preserve original text and phone leading zeros');

      await page.locator('[data-action="open-session"][data-id="clinical-session"]').click();
      await openAssessment(page, 'src_va');
      assert.equal(await page.locator('#an-src_va').inputValue(), '', 'Automatically generated provenance is absent from clinical notes');
      await openAssessment(page, 'npc');
      assert.equal(await page.locator('#an-npc').inputValue(), original.session.assess.npc.notes, 'Clinician-authored filenames remain original clinical text');
      await completeAssessment(page);
      await openTraining(page, 'ocular');
      assert.equal(await page.locator('#rn-clinical-run-h').innerText(), `${locale === 'en' ? 'Saccade (OcuTrain SACCADE)' : '跳視（OcuTrain SACCADE）'} · 14:05:09`);
      await completeTraining(page);
      await page.locator('[data-action="save-session"]:visible').first().click(); await page.waitForSelector('.sess');
      const saved = await page.evaluate(() => ({ sourceMedical: cur().sourceMedical, sourceRoster: cur().sourceRoster, session: sessions[0] }));
      assert.deepEqual(saved.sourceMedical, original.client.sourceMedical);
      assert.deepEqual(saved.sourceRoster, original.client.sourceRoster);
      assert.deepEqual(saved.session.sourceRecords, original.session.sourceRecords);
      assert.equal(saved.session.assess.src_va.notes, original.session.assess.src_va.notes, 'Saving keeps the hidden historical provenance');
      assert.deepEqual(saved.session.assess.src_va.values, { va_ou: 0 });
      assert.equal(saved.session.training.ocular.runs[0].file, 'legacy-run.csv');

      const reports = await page.evaluate(async () => {
        const c = cur(), s = sessions[0], wb = buildWorkbook([{ c, ss: [s] }]);
        const values = ws => XLSX.utils.sheet_to_json(ws, { header: 1 }).flat().join('\n');
        const drawn = [], fillText = CanvasRenderingContext2D.prototype.fillText;
        let pdf;
        try {
          CanvasRenderingContext2D.prototype.fillText = function(text, ...args) { drawn.push(String(text)); return fillText.call(this, text, ...args); };
          pdf = await sessionPDF(c, s);
        } finally { CanvasRenderingContext2D.prototype.fillText = fillText; }
        return { note: noteText(c, s), form: values(soapFormSheet(c, s)), sheets: wb.SheetNames, workbook: Object.values(wb.Sheets).map(values).join('\n'),
          pdf: drawn.join('\n'), pdfSize: pdf.size, csv: readRecordCSV(sessionCSV(c, s)),
          authored: clinicalAssessmentNotes({ notes: sourceLabel(s.sourceRecords[0], false) + '\nClinical qualification' }, s) };
      });
      for (const text of [reports.note, reports.form, reports.workbook, reports.pdf]) {
        assert.doesNotMatch(text, /legacy-|Medical sources|Source records|Source roster|病歷來源|收案資料/);
        assert.match(text, /Clinical history/); assert.match(text, /Clinical observations/); assert.match(text, /Clinical reasoning/);
        assert.match(text, /clinical-notes.xlsx/); assert.match(text, /Clinical training observation/);
      }
      assert.ok(reports.pdfSize > 1000);
      assert.ok(!reports.sheets.includes('Source records') && !reports.sheets.includes('Source roster'));
      assert.equal(reports.authored, original.session.assess.src_va.notes + '\nClinical qualification', 'Only the exact generated label is filtered');
      assert.deepEqual(reports.csv.client.sourceRoster, original.client.sourceRoster);
      assert.deepEqual(reports.csv.session.sourceRecords, original.session.sourceRecords, 'The unchanged CSV schema retains original provenance for round trips');

      await page.evaluate(() => { view = 'outcomes'; renderMain(); });
      assert.doesNotMatch(await page.locator('#tabBody').innerText(), /legacy-measurements|legacy-run/);
      assert.match(await page.locator('#tabBody').innerText(), /clinical-notes.xlsx/);
      await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
      assert.equal(await page.evaluate(() => sessions[0].assess.src_va.notes), original.session.assess.src_va.notes);
      assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), profileKeys), updatedProfile, 'Language switching preserves identity and contact values');
      await page.locator('#languageSelect').selectOption(locale);
      await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), profileKeys), updatedProfile, 'Identity and contact edits survive reopening');
      await page.locator('#clientSearch').fill(updatedProfile.nationalId);
      assert.equal(await page.locator('.client-btn').count(), 1, 'National ID remains available for patient identification');
      await page.keyboard.press('Escape'); await page.locator('#clientSearch').fill('');
      await page.evaluate(() => {
        Object.assign(cur(), { dob: '', sex: '', doi: '', smoking: '', alcohol: '', betel: '', occupation: '', chronicConditions: '', allergies: '', nationalId: '', religion: '', phone: '', address: '', medicalHistory: '', referral: '', eyeSurgery: null });
        sessions = []; view = 'dashboard'; renderMain();
      });
      assert.equal(await page.locator('.client-demographics, .patient-details > details').count(), 0, 'Metadata alone creates neither empty demographics nor history disclosures');
      assert.deepEqual(errors, []); assert.deepEqual(requests, []);
      await context.close();
      console.log(`PASS: ${locale} identity/contact fields, retained requirements, editing/reopen/search, clinical notes, zero results, source-free TXT/PDF/Excel, empty states and offline use`);
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
