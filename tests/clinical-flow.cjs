const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'clinical-flow');
const extraColumns = ['Service mode', 'PEO – Person', 'PEO – Environment', 'PEO – Occupation', 'Adaptation', 'Adaptation notes', 'Compensation', 'Compensation notes'];
const evidence = [];
const check = text => { evidence.push(text); console.log('PASS: ' + text); };
const ordered = (text, parts) => {
  let previous = -1;
  for (const part of parts) {
    const index = text.indexOf(part, previous + 1);
    assert.ok(index > previous, `Missing or misordered ${part}`); previous = index;
  }
};

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en';
      const headings = en ? ['Subjective', 'Assessment', 'PEO clinical reasoning', 'Intervention and plan'] : ['主觀描述', '評估', 'PEO 臨床推理', '介入與計畫'];
      const sections = headings.map((heading, i) => `${'SOAP'[i]}${en ? ': ' : '：'}${heading}`);
      const terms = en ? ['Remediation', 'Adaptation', 'Compensation', 'Next steps'] : ['復能', '調適', '代償', '後續計畫'];
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const pick = (approach, id) => page.locator(`#${approach}Picks [data-strategy="${id}"]`);
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const connect = name => page.evaluate(async name => {
        const disk = await navigator.storage.getDirectory();
        window.flowRoot = await disk.getDirectoryHandle(name, { create: true });
        store = folderStore(flowRoot); await finishBoot();
      }, name);
      try {
        await page.goto(url); await ready(); await page.locator('#languageSelect').selectOption(locale); await connect('flow-records');
        await action('new-client').click(); await page.locator('#cf-name').fill('Synthetic clinical flow'); await page.locator('#cf-ref').fill('TEST-FLOW');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        await action('new-session').click();
        assert.deepEqual(await page.locator('.soap-sec > .letter').allTextContents(), ['S', 'O', 'A', 'P']);
        assert.deepEqual(await page.locator('.soap-sec .sec-title > h3').allTextContents(), headings);
        const pSection = page.locator('.soap-sec').nth(3);
        for (const selector of ['#tx-ocular-on', '#s-otx', '#s-tol', '#s-plan', '#s-next']) assert.equal(await pSection.locator(selector).count(), 1, selector);
        assert.equal(await page.locator('.soap-sec').nth(1).locator('#assessList, #symWrap, #s-obj').count(), 3);
        assert.deepEqual(await pSection.locator('.sec-body > h4, .sec-body > .sub > h4').allTextContents(), terms.slice(0, 3));
        assert.equal(await page.locator('#s-mode').inputValue(), 'inperson');
        assert.equal(await page.locator('#s-mode option[value=""]').count(), 0);
        assert.equal(await page.locator('#s-mode').getAttribute('id'), await page.getByLabel(en ? 'Service mode' : '服務型態', { exact: true }).getAttribute('id'));
        await page.locator('#s-person').focus(); await page.keyboard.press('Tab');
        assert.equal(await page.evaluate(() => document.activeElement.id), 's-environment');
        assert.equal(await page.locator('#s-environment').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
        await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 's-occupation');
        await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 's-ass');
        check(`${locale}: SOAP order, Assessment contents, P remediation/training/tolerance and new In-person default`);

        const text = '個案原文 <img src=x onerror=alert(1)> =1+1';
        await page.locator('#s-date').fill('2026-11-07');
        await page.locator('#s-subj').fill(text); await page.locator('#s-obj').fill('Observation fixture');
        for (const [id, value] of [['s-person', text], ['s-environment', 'Home lighting'], ['s-occupation', 'Reading reports'], ['s-ass', 'Clinical judgement fixture'], ['s-otx', 'Home exercise fixture'], ['s-plan', 'Next steps fixture'], ['s-adaptation-notes', '=1+1'], ['s-compensation-notes', '休息與活動原文']]) await page.locator('#' + id).fill(value);
        await page.locator('#s-next').fill('2026-11-14'); await page.locator('#s-tol').fill('8');
        await page.locator('#tx-ocular-on').check(); await page.locator('#tx-ocular-a0').check(); await page.locator('#tx-ocular-s0').fill('85%');
        await page.locator('#tx-ocular-run-item').selectOption('fixation'); await action('run-add').click();
        await page.locator('#ac-npc').check();
        await pick('adaptation', 'workstation_setup').focus(); await page.keyboard.press('Space');
        assert.equal(await pick('adaptation', 'workstation_setup').isChecked(), true);
        await pick('compensation', 'scanning').check();
        await page.locator('#s-mode').selectOption('telerehab');
        assert.equal(await pick('adaptation', 'environment_mod').count(), 0);
        assert.equal(await pick('adaptation', 'env_consult').count(), 1);
        assert.equal(await pick('compensation', 'self_management').count(), 1);
        for (const [approach, id] of [['adaptation', 'workstation_setup'], ['compensation', 'scanning']]) {
          assert.equal(await pick(approach, id).isChecked(), true);
          assert.match(await pick(approach, id).locator('..').innerText(), en ? /In-person/ : /面對面/);
        }
        await pick('adaptation', 'digital_tools').check(); await pick('compensation', 'stepwise').check();
        await page.locator('#s-mode').selectOption('inperson');
        assert.match(await pick('adaptation', 'digital_tools').locator('..').innerText(), en ? /Telerehab/ : /遠距復健/);
        assert.equal(await pick('compensation', 'stepwise').isChecked(), true);
        await page.locator('#s-mode').selectOption('telerehab');
        assert.equal(await page.locator('#s-subj').inputValue(), text);
        assert.equal(await page.locator('#s-person').inputValue(), text);
        assert.equal(await page.locator('#tx-ocular-s0').inputValue(), '85%');
        assert.equal(await page.locator('#tx-ocular-runs .run').count(), 1);
        assert.equal(await page.locator('#s-adaptation-notes').inputValue(), '=1+1');
        assert.equal(await page.locator('#ac-npc').isChecked(), true);
        check(`${locale}: keyboard checkbox and bidirectional mode changes retain cross-mode ticks, text, assessment and training drafts`);

        await page.evaluate(() => {
          window.pdfLines = [];
          const original = CanvasRenderingContext2D.prototype.fillText;
          CanvasRenderingContext2D.prototype.fillText = function(text, ...args) { pdfLines.push(text); return original.call(this, text, ...args); };
        });
        await action('save-session').click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(async () => {
          const s = (await store.listSessions(curId))[0], dir = await flowRoot.getDirectoryHandle('TEST-FLOW'), base = store.sessionBase(curId, s.id);
          const csv = await (await dir.getFileHandle(base + '.csv')).getFile();
          const txt = await (await dir.getFileHandle(base + '.txt')).getFile();
          const pdf = await (await dir.getFileHandle(base + '.pdf')).getFile();
          return { s, csv: readRecordCSV(await csv.text()).session, txt: await txt.text(), pdf: Array.from(new Uint8Array(await pdf.arrayBuffer()).slice(0, 8)), lines: pdfLines, note: noteText(cur(), s) };
        });
        assert.equal(saved.s.mode, 'telerehab');
        assert.deepEqual(saved.s.peo, { person: text, environment: 'Home lighting', occupation: 'Reading reports' });
        assert.deepEqual(saved.s.interventions, { adaptation: { picks: ['digital_tools', 'workstation_setup'], notes: '=1+1' }, compensation: { picks: ['stepwise', 'scanning'], notes: '休息與活動原文' } });
        assert.deepEqual(saved.csv, saved.s); assert.equal(saved.txt, saved.note);
        assert.match(Buffer.from(saved.pdf).toString(), /^%PDF-/);
        for (const report of [saved.note, saved.lines.join('\n')]) ordered(report, [...sections, ...terms.slice(0, 3), terms[3]]);
        ordered(saved.note, [sections[3], '85%', 'Home exercise fixture', terms[1], '=1+1', terms[2], '休息與活動原文', '8/10', terms[3], 'Next steps fixture', '2026-11-14']);
        assert.ok(saved.note.includes(en ? 'Service mode: Telerehab' : '服務型態：遠距復健'));
        await page.reload(); await ready(); await connect('flow-records');
        assert.deepEqual(await page.evaluate(() => sessions[0]), saved.s);
        await action('open-session').click();
        assert.equal(await page.locator('#s-person').inputValue(), text);
        assert.equal(await page.locator('#soapForm img').count(), 0);
        assert.equal(await pick('adaptation', 'workstation_setup').isChecked(), true);
        assert.equal(await pick('adaptation', 'digital_tools').isChecked(), true);
        await action('cancel-edit').click(); await page.waitForSelector('.sess');
        check(`${locale}: real folder CSV/TXT/PDF save, browser reload and escaped editor values preserve the clinical flow`);

        const validation = await page.evaluate(() => {
          const c = cur(), base = clone(sessions[0]);
          const bad = {
            mode: ['', 'remote', 0, true, {}, []],
            peo: [[], '', 7, false, { person: 2 }, { environment: null }, { occupation: [] }],
            interventions: [[], '', false, { adaptation: [] }, { compensation: 'x' }, { adaptation: {} }, { compensation: { picks: null } }, { adaptation: { picks: [3] } }, { adaptation: { picks: ['bad id'] } }, { adaptation: { picks: ['__proto__'] } }, { compensation: { picks: ['x'], notes: [] } }, { compensation: { picks: ['x'], notes: null } }]
          };
          const invalid = Object.fromEntries(Object.entries(bad).map(([key, values]) => [key, values.map(value => {
            try { validateRecord(c, { ...base, [key]: value }); return null; } catch (e) { return e.message; }
          })]));
          const valid = [{}, { mode: null, peo: null, interventions: null }, { mode: 'inperson', peo: {}, interventions: { adaptation: null } }, { mode: 'telerehab', peo: { person: '' }, interventions: { compensation: { picks: ['future_strategy-v2'] } } }];
          for (const fields of valid) { const s = { id: 'valid', date: '2026-11-07', visit: 'treatment', sym: [], assess: {}, training: {}, ...fields }; validateRecord(c, s); }
          return invalid;
        });
        const messages = en ? ['Invalid service mode', 'Invalid PEO framework fields', 'Invalid intervention strategy fields'] : ['服務型態格式錯誤', 'PEO 架構欄位格式錯誤', '介入策略欄位格式錯誤'];
        Object.values(validation).forEach((values, i) => assert.ok(values.every(value => value === messages[i]), JSON.stringify(values)));
        const legacy = { id: 'legacy-flow', date: '2026-11-01', num: 1, visit: 'treatment', sym: [], assess: {}, training: {}, subjective: 'Old record', assessment: '', plan: '' };
        await page.evaluate(async s => { await store.saveSession(curId, s); await loadSessions(); renderMain(); }, legacy);
        const oldReport = await page.evaluate(s => {
          const loaded = sessions.find(x => x.id === s.id), csv = readRecordCSV(sessionCSV(cur(), loaded)).session;
          return { loaded, csv, note: noteText(cur(), loaded), form: XLSX.utils.sheet_to_json(soapFormSheet(cur(), loaded), { header: 1 }) };
        }, legacy);
        for (const s of [oldReport.loaded, oldReport.csv]) for (const key of ['mode', 'peo', 'interventions']) assert.equal(Object.hasOwn(s, key), false);
        ordered(oldReport.note, [sections[0], 'Old record', sections[1], sections[2], en ? 'Clinical judgement and intervention planning\n-' : '臨床判斷與介入規劃\n-', sections[3], terms[3] + '\n-']);
        for (const label of terms.slice(0, 3)) assert.equal(oldReport.note.split('\n').includes(label), false);
        await page.locator('[data-action="open-session"][data-id="legacy-flow"]').click();
        assert.equal(await page.locator('#s-mode').inputValue(), '');
        assert.equal(await page.locator('#s-mode option:checked').innerText(), en ? 'Not specified' : '未指定');
        assert.equal(await pick('adaptation', 'workstation_setup').count(), 1);
        assert.equal(await page.evaluate(() => Object.hasOwn(sessions.find(s => s.id === 'legacy-flow'), 'mode')), false);
        await action('save-session').click(); await page.waitForSelector('.sess');
        assert.equal(await page.evaluate(() => Object.hasOwn(sessions.find(s => s.id === 'legacy-flow'), 'mode')), false);
        await page.evaluate(async () => {
          const s = clone(sessions.find(s => s.id !== 'legacy-flow')); s.interventions.adaptation.picks.push('future_strategy-v2');
          validateRecord(cur(), s); await store.saveSession(curId, s); await loadSessions(); renderMain();
        });
        await page.locator(`[data-action="open-session"][data-id="${saved.s.id}"]`).click();
        assert.equal(await pick('adaptation', 'future_strategy-v2').locator('..').innerText(), 'future_strategy-v2');
        await action('save-session').click(); await page.waitForSelector('.sess');
        check(`${locale}: translated validation rejects malformed structures; absent new fields stay absent on load; old records re-save with mode unset; unknown IDs remain visible`);

        const workbook = await page.evaluate(id => {
          const s = sessions.find(s => s.id === id), wb = buildWorkbook([{ c: cur(), ss: [s] }]);
          const serial = XLSXReader.read(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          const form = soapFormSheet(cur(), s);
          const styled = Object.values(form).filter(cell => cell?.s?.fill?.fgColor?.rgb === '245F93').map(cell => cell.v).filter(Boolean);
          const serializedForm = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(serializedForm, form, 'SOAP');
          const readForm = XLSXReader.read(XLSX.write(serializedForm, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          return { names: serial.SheetNames, soap: XLSXReader.utils.sheet_to_json(serial.Sheets['SOAP notes']),
            headers: XLSXReader.utils.sheet_to_json(serial.Sheets['SOAP notes'], { header: 1 })[0],
            interventions: XLSXReader.utils.sheet_to_json(serial.Sheets.Interventions),
            form: XLSXReader.utils.sheet_to_json(readForm.Sheets.SOAP, { header: 1 }),
            formulas: Object.values(serial.Sheets).flatMap(ws => Object.values(ws).filter(cell => cell?.f)),
            styled, note: noteText(cur(), s) };
        }, saved.s.id);
        assert.ok(workbook.names.includes('Interventions')); assert.deepEqual(workbook.headers.slice(-8), extraColumns);
        assert.deepEqual(workbook.headers.slice(0, 12), ['Client ID', 'Client name', 'Date', 'Session no.', 'Visit', 'Attendance', 'Clinician', 'Length (min)', 'S – Subjective', 'O – Objective', 'A – Assessment', 'P – Plan']);
        assert.equal(workbook.soap[0]['PEO – Person'], text); assert.equal(workbook.soap[0]['Adaptation notes'], '=1+1');
        assert.equal(workbook.soap[0]['Service mode'], en ? 'Telerehab' : '遠距復健');
        assert.match(workbook.soap[0]['O – Objective'], /Observation fixture/);
        assert.doesNotMatch(workbook.soap[0]['O – Objective'], /Home exercise fixture|85%|Clinical judgement fixture/);
        assert.deepEqual(workbook.interventions.map(row => row['Strategy ID']), ['digital_tools', 'workstation_setup', 'future_strategy-v2', 'stepwise', 'scanning']);
        for (const row of workbook.interventions) {
          assert.equal(row['Client ID'], 'TEST-FLOW'); assert.equal(row.Date, '2026-11-07');
          assert.equal(row['Service mode'], en ? 'Telerehab' : '遠距復健');
          assert.ok(workbook.note.includes(row['Strategy label']));
        }
        assert.deepEqual([...new Set(workbook.interventions.map(row => row.Approach))], terms.slice(1, 3));
        assert.deepEqual(workbook.form.flat().filter(value => sections.includes(value)), sections);
        ordered(workbook.form.flat().join('\n'), [...sections, ...terms.slice(0, 3), terms[3]]);
        assert.ok(workbook.form.flat().includes(text)); assert.ok(workbook.form.flat().includes('=1+1'));
        assert.deepEqual(workbook.styled, [en ? 'S: Subjective' : 'S：主觀描述', ...sections.slice(1)]);
        assert.deepEqual(workbook.formulas, []);
        check(`${locale}: serialized Excel retains original column order, adds eight SOAP columns and per-strategy Interventions rows; styled SOAP form follows the same flow with safe cells`);

        const downloadPromise = page.waitForEvent('download'); await page.evaluate(() => exportAll());
        const download = await downloadPromise, backupPath = path.join(output, `${locale}-backup.json`); await download.saveAs(backupPath);
        const backup = JSON.parse(await fs.readFile(backupPath, 'utf8'));
        const before = await page.evaluate(() => clone(sessions));
        assert.deepEqual(backup.clients[0].sessions, before);
        await connect('flow-restored');
        assert.equal(await page.evaluate(() => clients.length), 0);
        await page.locator('#importFile').setInputFiles(backupPath);
        await page.waitForFunction(() => sessions.length === 2 && !savingSession);
        assert.deepEqual(await page.evaluate(() => sessions), before);
        check(`${locale}: actual JSON backup download/import into a fresh folder round-trips mode, PEO, cross-mode/unknown strategy IDs and notes`);
        assert.deepEqual(errors, []);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
