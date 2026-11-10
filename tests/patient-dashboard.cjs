const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'patient-dashboard');
const evidence = [];
const check = message => { evidence.push(message); console.log('PASS: ' + message); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en';
      const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const choose = value => page.locator('#languageSelect').selectOption(value);
      const links = () => page.locator('#clinicalLinks [data-clinical-link]');
      const field = name => links().first().locator(`[data-clinical="${name}"]`);
      const selectLink = (name, value) => links().first().locator(`[data-clinical="${name}"][value="${value}"]`);
      const capture = async name => {
        await page.evaluate(() => { document.querySelectorAll('.toast').forEach(node => node.remove()); scrollTo(0, 0); });
        await page.screenshot({ path: path.join(output, name), fullPage: true });
      };
      const english = async selector => {
        const untranslated = await page.locator(selector).evaluate(element => {
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), found = [];
          while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.parentElement.closest('script, style, textarea, input, [data-language-names]') && /\p{Script=Han}/u.test(node.nodeValue)) found.push(node.nodeValue.trim());
          }
          for (const node of element.querySelectorAll('[title], [aria-label], [placeholder]')) {
            for (const name of ['title', 'aria-label', 'placeholder']) {
              const value = node.getAttribute(name);
              if (value && /\p{Script=Han}/u.test(value)) found.push(`${name}: ${value}`);
            }
          }
          return [...new Set(found)];
        });
        assert.deepEqual(untranslated, [], `Untranslated dashboard UI: ${selector}`);
      };
      try {
        await page.goto(pathToFileURL(appPath).href);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await choose(locale);
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await action('new-client').click();
        await page.locator('#cf-name').fill('Synthetic dashboard patient');
        await page.locator('#cf-ref').fill('TEST-DASHBOARD');
        await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        await page.waitForSelector('#patientDashboard');
        assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('#tab-dashboard').innerText(), en ? 'Patient dashboard' : '病人總覽');
        assert.equal(await page.locator('#clinicalMap [data-clinical-row]').count(), 0);
        if (en) await english('#patientDashboard');
        await page.locator('#patientDashboard').screenshot({ path: path.join(output, `${locale}-empty.png`) });
        check(`${locale}: direct offline opening and new patient land on the translated empty dashboard`);

        const fixture = await page.evaluate(async () => {
          const c = cur();
          const va = clone(assessmentItems(c).find(item => item.id === 'va'));
          va.name = 'Historical assessment definition';
          const valueKey = va.fields[0].id;
          const legacy = {
            id: 'dashboard-legacy', date: '2026-11-01', num: 1, visit: 'treatment', sym: [],
            subjective: 'Legacy symptom fixture', assessment: 'Legacy reasoning fixture',
            assess: {}, training: {}, otherTx: 'Legacy intervention fixture'
          };
          const linked = {
            id: 'dashboard-linked', date: '2026-11-07', num: 2, visit: 'treatment', mode: 'inperson',
            sym: [{ id: 'dashboard-pre', kind: 'pre', scores: { ef: 4, bv: 0, dz: 2, ha: 3, na: null } },
              { id: 'dashboard-end', kind: 'end', scores: { ef: 1, bv: 2, dz: 2, ha: null, na: 1 } }],
            subjective: 'Current symptom fixture', assessment: 'Current reasoning fixture', training: {},
            assessmentPlan: [va], assess: { va: { done: true, values: { [valueKey]: '0.42 synthetic result' }, notes: 'Evidence observation fixture' } },
            clinicalLinks: [
              { id: 'link-reading', category: 'visual', symptom: 'Reading symptom fixture', reasoning: 'Reading reasoning fixture', peo: ['person', 'occupation'], evidence: ['va', 'vf'], evidenceNotes: 'Reading evidence fixture', interventions: ['ocular_sol', 'scanning'], interventionNotes: 'Reading intervention fixture' },
              { id: 'link-work', category: 'functional', symptom: 'Work symptom fixture', reasoning: 'Work reasoning fixture', peo: ['environment'], evidence: [], evidenceNotes: 'Work observation fixture', interventions: ['workstation_setup'], interventionNotes: 'Work intervention fixture' }
            ]
          };
          const absent = { id: 'dashboard-absent', date: '2026-11-09', num: 3, visit: 'absent', sym: [], assess: {}, training: {}, absence: { reason: ABSENCE_REASONS[0] } };
          for (const s of [legacy, linked, absent]) { validateRecord(c, s); await store.saveSession(c.id, s); }
          await loadSessions(); renderMain();
          return { clientId: c.id, linked, legacy, valueKey };
        });
        assert.equal(await page.locator('#dashboard-session').inputValue(), fixture.linked.id);
        assert.equal(await page.locator('.record-state').innerText(), en ? 'Latest attended visit' : '最近出席');
        assert.ok((await page.locator('.dashboard-context').innerText()).includes(await page.evaluate(() => ui('最近一次紀錄為缺席：{0}', fmtDate('2026-11-09')))), 'The newest missed visit is explicit beside the attended summary');
        assert.deepEqual(await page.locator('#dashboard-session option').evaluateAll(options => options.map(option => option.value)), [fixture.linked.id, fixture.legacy.id]);
        assert.equal(await page.locator('#clinicalMap [data-clinical-row]').count(), 2);
        assert.equal(await page.locator('.command-area [data-action="new-session"]').count(), 0);
        assert.equal(await page.locator('.client-head [data-action="new-session"]').isVisible(), true);
        const patientBeforeSearch = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
        const search = page.locator('#clientSearch');
        const popup = page.locator('#clientSearchPopup');
        assert.equal(await page.locator('aside, #railToggle, #patientRoster').count(), 0, 'Patient data has no reserved sidebar');
        assert.equal(await page.locator('.app-chrome #clientSearch').isVisible(), true);
        assert.equal(await search.getAttribute('role'), 'combobox');
        const fullMain = await page.locator('#main').boundingBox();
        assert.ok(fullMain.x <= 1 && fullMain.width >= 1278, 'The main area uses the width released by removing the sidebar');
        assert.equal(await page.locator('.client-btn').count(), 0, 'An empty search never lists the roster');
        assert.equal(await search.getAttribute('aria-expanded'), 'false');
        await search.fill('no matching patient');
        assert.equal(await popup.isVisible(), true);
        assert.equal(await page.locator('.client-btn').count(), 0);
        if (en) await english('#clientSearchPopup');
        await search.fill('TEST-DASHBOARD');
        assert.equal(await page.locator('.client-btn').count(), 1);
        await page.keyboard.press('Escape');
        assert.equal(await popup.isHidden(), true, 'Escape closes search results');
        assert.equal(await search.evaluate(node => node === document.activeElement), true);
        await search.fill('Synthetic');
        await page.locator('h1').click();
        assert.equal(await popup.isHidden(), true, 'Outside clicks close search results');
        await page.evaluate(() => {
          window.clientsBeforeSearchFixture = clients;
          clients = [...clients, ...Array.from({ length: 12 }, (_, i) => ({ id: 'search-bound-' + i, name: 'Bounded search fixture ' + i, ref: 'SEARCH-' + i }))];
          renderClients();
        });
        await search.fill('Bounded search fixture');
        assert.equal(await page.locator('.client-btn').count(), 8, 'Search renders a bounded result set');
        assert.match(await popup.innerText(), /8[\s\S]*12/);
        if (en) await english('#clientSearchPopup');
        await search.press('ArrowDown');
        assert.equal(await search.getAttribute('aria-activedescendant'), await page.locator('.client-btn').first().getAttribute('id'));
        await search.press('ArrowUp');
        assert.equal(await search.getAttribute('aria-activedescendant'), await page.locator('.client-btn').last().getAttribute('id'));
        await page.keyboard.press('Escape');
        await page.evaluate(() => { clients = clientsBeforeSearchFixture; delete window.clientsBeforeSearchFixture; renderClients(); });
        await search.fill('TEST-DASHBOARD');
        await search.press('ArrowDown');
        assert.equal(await search.evaluate(node => node === document.activeElement), true);
        assert.equal(await search.getAttribute('aria-activedescendant'), await page.locator('.client-btn').first().getAttribute('id'));
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#dashboard-session').inputValue(), fixture.linked.id);
        assert.equal(await popup.isHidden(), true);
        await search.fill('');
        await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        assert.equal(await search.getAttribute('aria-expanded'), 'false');
        assert.equal(await page.locator('.client-btn').count(), 0, 'Reload never opens a full roster');
        assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), patientBeforeSearch, 'Searching and reload preserve all patient data');
        check(`${locale}: patient-header record action, full-width main area and bounded sticky-header search support keyboard, Escape, outside close and unchanged patient data`);
        const reading = page.locator('#clinicalMap [data-clinical-row][data-id="link-reading"]');
        const deltaLabel = await page.evaluate(() => ui('本次變化'));
        for (const [label, sign] of [[en ? 'Eye fatigue' : '眼睛疲勞', '-3'], [en ? 'Blurred vision' : '視線模糊', '+2'], [en ? 'Dizziness' : '頭暈', '0']]) {
          const delta = page.locator('.dashboard-ratings > div').filter({ has: page.locator('dt', { hasText: label }) }).locator('.rating-change');
          assert.equal(await delta.innerText(), sign, 'Score differences stay concise');
          assert.equal(await delta.getAttribute('aria-label'), deltaLabel + ' ' + sign);
          assert.equal(await delta.getAttribute('title'), deltaLabel + ' ' + sign);
          assert.equal(await delta.evaluate(node => node.classList.contains('good')), sign.startsWith('-'));
          assert.equal(await delta.evaluate(node => node.classList.contains('bad')), sign.startsWith('+'));
        }
        for (const label of [en ? 'Headache' : '頭痛', en ? 'Nausea' : '噁心']) {
          assert.equal(await page.locator('.dashboard-ratings > div').filter({ has: page.locator('dt', { hasText: label }) }).locator('.rating-change').count(), 0, 'Incomplete score pairs have no fabricated difference');
        }
        assert.match(await reading.innerText(), /Reading symptom fixture/);
        assert.match(await reading.innerText(), /Reading reasoning fixture/);
        assert.match(await reading.innerText(), /0\.42 synthetic result/);
        assert.match(await reading.innerText(), /Historical assessment definition/);
        assert.doesNotMatch(await reading.innerText(), /Work reasoning fixture|Legacy reasoning fixture/);
        assert.match(await page.locator('#clinicalMap [data-id="link-work"]').innerText(), /Work intervention fixture/);
        const referenced = await page.evaluate(() => clinicalEvidenceText(cur(), sessions.find(s => s.id === 'dashboard-linked'), ['va', 'vf']));
        assert.match(referenced.join('\n'), /0\.42 synthetic result/);
        assert.ok(referenced.join('\n').includes(await page.evaluate(() => ui('本次未勾選施測'))), 'Linked but untested evidence is identified explicitly');
        if (en) await english('#patientDashboard');
        const storedBeforeRead = await page.evaluate(() => JSON.stringify(sessions));
        await page.locator('#dashboard-session').selectOption(fixture.legacy.id);
        assert.equal(await page.locator('.record-state').innerText(), en ? 'Previous visit' : '歷次紀錄');
        assert.deepEqual(await page.locator('#clinicalMap [data-clinical-row]').evaluateAll(rows => rows.map(row => row.dataset.id)), [''], 'Legacy summary has no fabricated link IDs');
        const legacyText = await page.locator('#patientDashboard').innerText();
        for (const text of ['Legacy symptom fixture', 'Legacy reasoning fixture', 'Legacy intervention fixture']) assert.ok(legacyText.includes(text));
        assert.doesNotMatch(legacyText, /Reading reasoning fixture|Work intervention fixture/);
        if (en) await english('#patientDashboard');
        await page.locator('#patientDashboard').screenshot({ path: path.join(output, `${locale}-legacy.png`) });
        await page.locator('#dashboard-session').selectOption(fixture.linked.id);
        assert.equal(await page.evaluate(() => JSON.stringify(sessions)), storedBeforeRead, 'Dashboard selection does not rewrite old records');
        const findings = page.locator('.dashboard-findings').first();
        await findings.locator('summary').click();
        assert.equal(await findings.locator('.clinical-note').first().isVisible(), true);
        assert.match(await findings.innerText(), /0\.42 synthetic result/);
        await findings.locator('summary').click();
        check(`${locale}: latest attended record, explicit per-symptom links, selected-record evidence, missing evidence and unfabricated legacy summaries`);
        assert.equal(await page.locator('.clinical-map-head').count(), 0, 'Stacked clinical sections have no duplicate horizontal header');

        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
          const typography = await reading.evaluate(row => {
            const heading = getComputedStyle(row.querySelector('h4'));
            const body = getComputedStyle(row.querySelector('.clinical-map-cell:nth-child(2) > p'));
            return { headingWeight: Number(heading.fontWeight), bodyWeight: Number(body.fontWeight), bodyLeading: parseFloat(body.lineHeight) / parseFloat(body.fontSize) };
          });
          assert.ok(typography.headingWeight > typography.bodyWeight, `${locale} ${theme}: clinical headings are visibly heavier than note text`);
          assert.ok(typography.bodyLeading <= 1.5, `${locale} ${theme}: clinical note line spacing stays compact`);
          for (const width of [320, 360, 768, 1024, 1200, 1280, 1366, 1440, 1600, 1680, 1920]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} dashboard at ${width}px`);
            const cells = await reading.locator('.clinical-map-cell').evaluateAll(nodes => nodes.map(node => {
              const rect = node.getBoundingClientRect(), heading = node.querySelector('h4'), title = heading.getBoundingClientRect();
              return { x: rect.x, y: rect.y, width: rect.width, bottom: rect.bottom, heading: heading.textContent, headingWidth: title.width, headingHeight: title.height, rowWidth: node.parentElement.getBoundingClientRect().width };
            }));
            assert.deepEqual(cells.map(cell => cell.heading), en ? ['Symptoms and function', 'Reasoning and evidence', 'Intervention and plan'] : ['症狀與功能', '推理與依據', '介入與計畫']);
            assert.ok(cells.every(cell => Math.abs(cell.x - cells[0].x) < 1 && Math.abs(cell.width - cell.rowWidth) < 1), `${locale} ${theme} ${width}px: symptoms, reasoning and interventions each use the full row: ${JSON.stringify(cells)}`);
            assert.ok(cells.slice(1).every((cell, index) => cell.y >= cells[index].bottom - 1), 'Every viewport preserves symptom, reasoning, intervention reading order');
            assert.ok(cells.every(cell => cell.headingWidth > 1 && cell.headingHeight >= 16), 'Each stacked section keeps its visible heading');
            if (width >= 1280) {
              const chrome = await page.locator('.app-chrome').evaluate(node => {
                const box = node.getBoundingClientRect(), input = node.querySelector('#clientSearch').getBoundingClientRect();
                return { height: box.height, topGap: input.top - box.top, bottomGap: box.bottom - input.bottom };
              });
              assert.ok(chrome.height <= 68 && chrome.topGap >= 8 && chrome.bottomGap >= 8, `${locale} ${theme} ${width}px: desktop controls have outside breathing room within one row`);
            }
            const controls = await page.locator('#patientDashboard select, #patientDashboard button').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
            assert.ok(controls.every(control => control.width >= 44 && control.height >= 44), 'Dashboard controls have 44px targets');
            if ([360, 1280, 1440, 1680].includes(width)) await capture(`${locale}-${theme}-${width}.png`);
            await search.fill('TEST-DASHBOARD');
            const popupRect = await popup.boundingBox();
            assert.ok(popupRect.x >= 0 && popupRect.x + popupRect.width <= width, 'Search results stay within the viewport');
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} open search at ${width}px`);
            await page.keyboard.press('Escape');
          }
          await page.locator('#patientDashboard').evaluate(node => node.style.maxWidth = '700px');
          const constrained = await reading.locator('.clinical-map-cell').evaluateAll(nodes => nodes.map(node => ({ x: node.getBoundingClientRect().x, y: node.getBoundingClientRect().y, bottom: node.getBoundingClientRect().bottom, width: node.getBoundingClientRect().width })));
          assert.ok(constrained.every(cell => Math.abs(cell.x - constrained[0].x) < 1 && Math.abs(cell.width - constrained[0].width) < 1), 'A constrained dashboard keeps full-width sections inside a wide browser window');
          assert.ok(constrained.slice(1).every((cell, index) => cell.y >= constrained[index].bottom - 1), 'Constrained panels retain the same vertical reading order');
          await page.locator('#patientDashboard').evaluate(node => node.style.maxWidth = '');
        }
        check(`${locale}: compact desktop chrome and full-width clinical sections stack at every viewport in both themes, with visible headings and preserved reading order in constrained panels`);
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.locator('#dashboard-session').focus();
        assert.equal(await page.locator('#dashboard-session').evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
        await action('open-session').click();
        assert.equal(await page.evaluate(() => editing.id), fixture.linked.id);
        assert.equal(await links().count(), 2);
        assert.equal(await field('symptom').inputValue(), 'Reading symptom fixture');
        await links().first().locator('details').first().locator('summary').click();
        await selectLink('evidence', 'va').focus(); await page.keyboard.press('Space');
        assert.equal(await selectLink('evidence', 'va').isChecked(), false);
        assert.doesNotMatch(await links().first().locator('.clinical-evidence-preview').innerText(), /0\.42 synthetic result/);
        await page.keyboard.press('Space');
        assert.equal(await selectLink('evidence', 'va').isChecked(), true);
        assert.match(await links().first().locator('.clinical-evidence-preview').innerText(), /0\.42 synthetic result/);
        await page.locator('#af-va-0').fill('0.84 live draft result');
        assert.match(await links().first().locator('.clinical-evidence-preview').innerText(), /0\.84 live draft result/);
        await page.locator('#af-va-0').fill('0.42 synthetic result');
        const note = '病人原文 <img src=x onerror=alert(1)> =1+1';
        await field('symptom').fill(note);
        await field('reasoning').fill('臨床推理原文 / reasoning fixture');
        await field('evidenceNotes').fill('=1+1\n依據原文 / evidence fixture');
        await field('interventionNotes').fill('介入原文 / intervention fixture');
        const draftBeforeSearch = await page.evaluate(() => JSON.stringify(collectSession()));
        await search.fill('TEST-DASHBOARD');
        await page.keyboard.press('Escape');
        assert.equal(await field('symptom').inputValue(), note);
        assert.equal(await page.evaluate(() => JSON.stringify(collectSession())), draftBeforeSearch, 'Opening and closing search preserves the unsaved editor');
        await field('category').selectOption('functional');
        await selectLink('peo', 'environment').check();
        await action('clinical-link-add').click();
        assert.equal(await links().count(), 3);
        assert.equal(await field('symptom').inputValue(), note, 'Adding a row preserves the existing draft');
        await links().last().locator('[data-clinical="symptom"]').fill('Temporary symptom fixture');
        await links().last().locator('[data-action="clinical-link-del"]').click();
        assert.equal(await links().count(), 2);
        assert.equal(await field('symptom').inputValue(), note);
        await page.locator('#s-mode').selectOption('telerehab');
        assert.equal(await selectLink('interventions', 'ocular_sol').isChecked(), true);
        await links().first().locator('details').nth(1).locator('summary').click();
        await selectLink('interventions', 'home_modules').check();
        await page.locator('#s-mode').selectOption('inperson');
        assert.equal(await selectLink('interventions', 'home_modules').isChecked(), true);
        const draft = await page.evaluate(() => collectSession().clinicalLinks);
        for (const language of ['en', 'zh-TW', locale]) {
          await choose(language);
          assert.deepEqual(await page.evaluate(() => collectSession().clinicalLinks), draft);
          assert.equal(await page.locator('#clinicalLinks img').count(), 0);
          if (language === 'en') await english('#clinicalLinks');
        }
        for (const width of [320, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} linked editor at ${width}px`);
        }
        await capture(`${locale}-editor.png`);
        check(`${locale}: editable links add/remove, retain cross-mode interventions and preserve original clinical text through language changes`);

        await action('save-session').click(); await page.waitForSelector('.sess');
        const roundtrip = await page.evaluate(async () => {
          const s = sessions.find(s => s.id === 'dashboard-linked'), c = cur();
          return { saved: s.clinicalLinks, disk: (await store.listSessions(c.id)).find(record => record.id === s.id).clinicalLinks,
            csv: readRecordCSV(sessionCSV(c, s)).session.clinicalLinks, note: noteText(c, s), lines: clinicalLinkLines(c, s) };
        });
        assert.deepEqual(roundtrip.saved, draft); assert.deepEqual(roundtrip.disk, draft); assert.deepEqual(roundtrip.csv, draft);
        for (const report of [roundtrip.note, roundtrip.lines.join('\n')]) {
          for (const text of [note, '臨床推理原文', '依據原文', '介入原文', '0.42 synthetic result']) assert.ok(report.includes(text), `Clinical link export misses ${text}`);
        }
        const workbook = await page.evaluate(() => {
          const c = cur(), s = sessions.find(s => s.id === 'dashboard-linked');
          const wb = buildWorkbook([{ c, ss: [s] }]);
          const serial = XLSXReader.read(XLSX.write(wb, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          const formBook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(formBook, soapFormSheet(c, s), 'SOAP');
          const form = XLSXReader.read(XLSX.write(formBook, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
          const cells = [...Object.values(serial.Sheets), ...Object.values(form.Sheets)].flatMap(sheet => Object.values(sheet));
          return { names: serial.SheetNames, rows: XLSXReader.utils.sheet_to_json(serial.Sheets['Clinical links']),
            headers: XLSXReader.utils.sheet_to_json(serial.Sheets['Clinical links'], { header: 1 })[0],
            form: XLSXReader.utils.sheet_to_json(form.Sheets.SOAP, { header: 1 }), formulas: cells.filter(cell => cell?.f),
            category: assessmentCategoryLabel(s.clinicalLinks[0].category), peo: s.clinicalLinks[0].peo.map(peoLabel) };
        });
        assert.ok(workbook.names.includes('Clinical links')); assert.equal(workbook.rows.length, 2);
        for (const header of ['Link ID', 'Category', 'Symptom', 'PEO', 'Reasoning', 'Evidence IDs', 'Evidence', 'Evidence notes', 'Intervention IDs', 'Interventions', 'Intervention notes']) assert.ok(workbook.headers.includes(header));
        const exported = workbook.rows[0];
        assert.equal(exported['Link ID'], draft[0].id); assert.equal(exported.Category, workbook.category); assert.equal(exported.Symptom, note);
        assert.equal(exported.Reasoning, draft[0].reasoning); assert.equal(exported['Evidence notes'], draft[0].evidenceNotes);
        assert.equal(exported['Intervention notes'], draft[0].interventionNotes);
        assert.deepEqual(exported['Evidence IDs'].split('; '), draft[0].evidence);
        assert.deepEqual(exported['Intervention IDs'].split('; '), draft[0].interventions);
        assert.match(exported.Evidence, /0\.42 synthetic result/);
        assert.match(exported.Interventions, en ? /Home-based practice modules/ : /居家視覺練習模組/);
        for (const label of workbook.peo) assert.ok(exported.PEO.includes(label));
        const formText = workbook.form.flat().join('\n');
        for (const text of [note, draft[0].reasoning, draft[0].evidenceNotes, draft[0].interventionNotes, '0.42 synthetic result']) assert.ok(formText.includes(text));
        assert.deepEqual(workbook.formulas, [], 'Original notes beginning with = remain literal Excel strings');
        await fs.writeFile(path.join(output, `${locale}-workbook.json`), JSON.stringify(workbook, null, 2));
        check(`${locale}: serialized Clinical links worksheet and SOAP form retain IDs, translated labels, PEO, selected evidence and literal formula-like notes`);
        await page.locator('#tab-dashboard').click();
        assert.equal(await page.locator('#clinicalMap img').count(), 0);
        assert.ok((await page.locator('#clinicalMap').innerText()).includes(note));
        await fs.writeFile(path.join(output, `${locale}-clinical-links.json`), JSON.stringify(roundtrip, null, 2));

        const validation = await page.evaluate(() => {
          const c = cur(), base = clone(sessions.find(s => s.id === 'dashboard-linked')), row = base.clinicalLinks[0];
          const malformed = [null, {}, 'bad', [null], [{ ...row, id: '__proto__' }], [row, row],
            [{ ...row, category: 'unknown' }], [{ ...row, symptom: '' }], [{ ...row, reasoning: 4 }],
            [{ ...row, peo: ['unknown'] }], [{ ...row, evidence: ['bad id'] }], [{ ...row, evidence: ['constructor'] }],
            [{ ...row, interventions: [null] }], [{ ...row, evidenceNotes: [] }], [{ ...row, interventionNotes: {} }]];
          const messages = malformed.map(clinicalLinks => { try { validateRecord(c, { ...base, clinicalLinks }); return null; } catch (error) { return error.message; } });
          const future = { ...base, clinicalLinks: [{ ...row, evidence: ['future_assessment'], interventions: ['future_strategy-v2'] }] };
          validateRecord(c, future);
          const old = clone(sessions.find(s => s.id === 'dashboard-legacy'));
          const csv = readRecordCSV(sessionCSV(c, old)).session;
          return { messages, expected: ui('臨床連結欄位格式錯誤'), future: readRecordCSV(sessionCSV(c, future)).session.clinicalLinks, old, csv };
        });
        assert.ok(validation.messages.every(message => message === validation.expected), JSON.stringify(validation.messages));
        assert.equal(validation.future[0].interventions[0], 'future_strategy-v2');
        assert.equal(Object.hasOwn(validation.old, 'clinicalLinks'), false); assert.equal(Object.hasOwn(validation.csv, 'clinicalLinks'), false);
        check(`${locale}: CSV and note exports preserve links; translated validation rejects malformed data and unsafe IDs while legacy fields stay absent`);

        await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
        assert.deepEqual(await page.evaluate(() => sessions.find(s => s.id === 'dashboard-linked').clinicalLinks), draft);
        await action('new-client').click();
        await page.locator('#cf-name').fill('Other synthetic dashboard patient');
        await page.locator('#cf-ref').fill('TEST-DASHBOARD-OTHER');
        await page.locator('#cForm [type="submit"]').click();
        await page.waitForSelector('#cForm', { state: 'detached' });
        assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('#clinicalMap [data-clinical-row]').count(), 0);
        assert.doesNotMatch(await page.locator('#patientDashboard').innerText(), /Reading|Work|病人原文/);
        await page.evaluate(async () => {
          await store.saveSession(curId, { id: 'only-absence', date: '2026-11-10', visit: 'absent', sym: [], assess: {}, training: {} });
          await loadSessions(); renderMain();
        });
        assert.equal(await page.locator('#dashboard-session').count(), 0, 'An absence-only patient has no clinical-record selector');
        assert.equal(await page.locator('#patientDashboard h3').innerText(), en ? 'No attended visits' : '尚無出席紀錄');
        assert.ok((await page.locator('#patientDashboard').innerText()).includes(await page.evaluate(() => ui('最近一次紀錄為缺席：{0}', fmtDate('2026-11-10')))), 'An absence-only dashboard identifies its latest missed visit');
        if (en) await english('#patientDashboard');
        await search.fill('TEST-DASHBOARD');
        await page.locator(`[data-action="pick"][data-id="${fixture.clientId}"]`).click();
        assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
        assert.equal(await page.locator('#dashboard-session').inputValue(), fixture.linked.id);
        assert.ok((await page.locator('#clinicalMap').innerText()).includes(note));
        check(`${locale}: reload and patient switching retain isolated dashboards; absent visits never become clinical records; both themes fit 320/360/768/1280px`);

        await action('new-session').click(); await action('clinical-link-add').click();
        await field('reasoning').fill('Unfinished absence reasoning fixture');
        await field('interventionNotes').fill('Unfinished absence intervention fixture');
        const absenceDraftId = await page.evaluate(() => editing.id);
        await page.locator('#s-visit').selectOption('absent');
        assert.equal(await field('symptom').getAttribute('required'), null, 'Hidden clinical drafts do not block absence saving');
        assert.equal(await field('reasoning').inputValue(), 'Unfinished absence reasoning fixture');
        await page.locator('#s-visit').selectOption('treatment');
        assert.equal(await field('symptom').evaluate(input => input.required && input.validity.valueMissing), true);
        assert.equal(await field('interventionNotes').inputValue(), 'Unfinished absence intervention fixture');
        await action('save-session').click();
        assert.equal(await page.evaluate(id => editing?.id === id, absenceDraftId), true, 'An attended visit requires its symptom before saving');
        assert.equal(await page.evaluate(async id => (await store.listSessions(curId)).some(s => s.id === id), absenceDraftId), false);
        await page.locator('#s-visit').selectOption('absent');
        await action('save-session').click(); await page.waitForSelector('.sess');
        const absence = await page.evaluate(async () => {
          const s = (await store.listSessions(curId)).find(s => s.clinicalLinks?.[0]?.reasoning === 'Unfinished absence reasoning fixture');
          const wb = buildWorkbook([{ c: cur(), ss: [s] }]);
          return { s, note: noteText(cur(), s), csv: readRecordCSV(sessionCSV(cur(), s)).session,
            exportedLinks: XLSX.utils.sheet_to_json(wb.Sheets['Clinical links']) };
        });
        assert.equal(absence.s.visit, 'absent'); assert.equal(absence.s.clinicalLinks[0].symptom, '');
        assert.equal(absence.s.clinicalLinks[0].reasoning, 'Unfinished absence reasoning fixture');
        assert.deepEqual(absence.csv.clinicalLinks, absence.s.clinicalLinks);
        assert.doesNotMatch(absence.note, /Unfinished absence (reasoning|intervention) fixture/);
        assert.ok(absence.exportedLinks.every(row => !Object.hasOwn(row, 'Link ID')), 'Absence drafts do not become clinical-link report rows');
        await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        await search.fill('TEST-DASHBOARD');
        await page.locator(`[data-action="pick"][data-id="${fixture.clientId}"]`).click();
        assert.equal(await page.locator('#dashboard-session').inputValue(), fixture.linked.id);
        await page.locator('#tab-sessions').click();
        await page.locator(`[data-action="open-session"][data-id="${absence.s.id}"]`).click();
        assert.equal(await page.locator('#s-visit').inputValue(), 'absent');
        assert.equal(await field('symptom').getAttribute('required'), null);
        await page.locator('#s-visit').selectOption('treatment');
        assert.equal(await field('symptom').evaluate(input => input.required && input.validity.valueMissing), true);
        assert.equal(await field('reasoning').inputValue(), 'Unfinished absence reasoning fixture');
        assert.equal(await field('interventionNotes').inputValue(), 'Unfinished absence intervention fixture');
        await page.evaluate(() => { dirty = false; }); await action('cancel-edit').click();
        assert.deepEqual(errors, []);
        check(`${locale}: unfinished clinical drafts save on absent visits, stay out of absence notes, survive CSV/reload, and require a symptom when attendance resumes`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
