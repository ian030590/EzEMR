const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');

(async () => {
  await fs.mkdir(output, { recursive: true });
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
      assert.equal(await page.evaluate(() => clients.length), 0);
      await fits('connect'); await capture('connect');
      await action('use-default').click();
      assert.equal(await page.locator('.welcome').isVisible(), true);
      assert.match(await page.locator('#storeStatus').textContent(), en ? /Data \(created on first save\)/ : /Data（首次儲存時建立）/);
      const storageStatus = await page.locator('#storeStatus').boundingBox();
      assert.ok(storageStatus.width <= 1 && storageStatus.height <= 1, 'Storage details do not reserve header layout space');
      assert.equal(await page.locator('#clientSearchPopup').isHidden(), true);
      assert.equal(await page.locator('.client-btn').count(), 0);
      await fits('welcome'); await capture('welcome');

      // Native folder dialogs cannot be automated, so synthetic records use browser storage from here on.
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await action('new-client').click();
      await page.locator('#cf-name').fill('Workspace test client');
      await page.locator('#cf-ref').fill('TEST-WORKSPACE');
      await page.locator('#cf-dx').fill('Synthetic history for layout checks.\n'.repeat(20));
      await page.locator('#cForm [type="submit"]').click();
      await page.waitForSelector('.client-summary');
      assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('#patientDashboard').isVisible(), true);
      assert.equal(await page.locator('#tabBody .empty').isVisible(), true);
      assert.equal(await page.locator('.sess').count(), 0);
      assert.equal(await page.evaluate(() => clients.length), 1);
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
      await page.locator('#tab-sessions').click();
      assert.equal(await page.locator('.chart').isVisible(), true);
      assert.equal(await page.locator('.sess .line, .sess .chip').count(), 0, 'Record data does not depend on unlabelled chip rows');
      assert.equal(await page.locator('.sess .metric-change').count(), 2);
      for (const change of await page.locator('.sess .metric-change').all()) {
        assert.match(await change.locator('dt').innerText(), en ? /change/i : /變化|差異/);
        assert.equal(await change.locator('dd').innerText(), '-5');
      }
      for (const metric of ['.metric-pre', '.metric-end', '.metric-change']) {
        assert.equal(await page.locator('.session-metrics ' + metric + ' dt').count(), 2, 'Each score has a persistent label');
      }
      const edgeCards = await page.evaluate(() => {
        const row = (kind, extra = {}) => ({ id: uid('r'), kind, scores: Object.fromEntries(SK.map(key => [key, 0])), ...extra });
        const zero = { ...clone(sessions[0]), sym: [row('pre'), row('sub', { test: SUBTESTS[0].k }), row('end'), row('rec', { recMin: 0 })],
          tolerance: 0, assess: {}, training: { ocular: { on: true, eyedot: [{ id: 'zero-eye', count: 0 }] } } };
        const empty = { ...zero, sym: [], tolerance: null, training: {} };
        const parse = session => { const template = document.createElement('template'); template.innerHTML = sessCard(session); return template.content; };
        const a = parse(zero), b = parse(empty);
        const values = node => [...node.querySelectorAll('.session-metrics dd')].map(cell => cell.textContent);
        const labels = node => [...node.querySelectorAll('.session-metrics dt')].map(cell => cell.textContent);
        const context = label => [...a.querySelectorAll('.session-context > div')].find(node => node.querySelector('dt').textContent === label)?.querySelector('dd').textContent;
        return { zero: values(a), empty: values(b), zeroLabels: labels(a), emptyLabels: labels(b), stages: [...a.querySelectorAll('.session-stages dd')].map(cell => cell.textContent),
          recovery: context(ui('恢復時間')), tolerance: context(ui('耐受度')), assessments: context(ui('評估')), eyeDot: context(ui('EyeDot 次數')) };
      });
      assert.deepEqual(edgeCards.zero, ['0', '0', '0'], 'Zero ratings remain visible before, after and in the signed change');
      assert.deepEqual(edgeCards.empty, ['-', '-', '-'], 'Missing scores retain the same three slots');
      assert.deepEqual(edgeCards.emptyLabels, edgeCards.zeroLabels, 'Empty scores do not shift the field labels');
      assert.deepEqual(edgeCards.stages, ['0', '-', '-'], 'Subtest zero and missing subtests remain distinct');
      assert.match(edgeCards.recovery, /^0\s/); assert.equal(edgeCards.tolerance, '0/10');
      assert.equal(edgeCards.assessments, '0'); assert.equal(edgeCards.eyeDot, '1');
      assert.deepEqual(await page.locator('.sess [data-action="open-session"]').evaluateAll(buttons => buttons.map(button => button.dataset.id)), ['workspace-latest', 'workspace-earlier']);
      assert.equal(await page.locator('#tab-sessions').innerText(), en ? 'Rehabilitation records (2)' : '復健紀錄 (2)');
      const stored = await page.evaluate(() => JSON.stringify(sessions));
      await page.locator('.sess [data-action="open-session"]').first().click();
      assert.equal(await page.evaluate(() => editing.id), 'workspace-latest');
      assert.equal(await page.locator('#symSummary').evaluate(node => node.tagName), 'DL');
      assert.equal(await page.locator('#symSummary .chip').count(), 0);
      assert.equal(await page.locator('#symSummary .metric-pre dd').innerText(), '10');
      assert.equal(await page.locator('#symSummary .metric-end dd').innerText(), '5');
      assert.equal(await page.locator('#symSummary .metric-change dd').innerText(), '-5');
      const summaryLabels = await page.locator('#symSummary dt').allTextContents();
      assert.equal(summaryLabels.some(label => /\p{Script=Han}/u.test(label)), !en, 'Editor symptom metric labels follow the selected language');
      assert.equal(await page.locator('#copmSum').evaluate(node => node.tagName), 'DL');
      assert.equal(await page.locator('#copmSum .chip').count(), 0);
      assert.deepEqual(await page.locator('#copmSum dd').allTextContents(), ['0', '0'], 'COPM average zero remains visible in labelled fields');
      const copmLabels = await page.locator('#copmSum dt').allTextContents();
      assert.equal(copmLabels.some(label => /\p{Script=Han}/u.test(label)), !en, 'COPM summary labels follow the selected language');
      const controlFonts = await page.locator('#soapForm button:visible, #soapForm input:not([type="checkbox"]):not([type="range"]):visible, #soapForm select:visible, #soapForm textarea:visible').evaluateAll(nodes => nodes.map(node => ({ id: node.id, size: parseFloat(getComputedStyle(node).fontSize) })));
      assert.ok(controlFonts.length > 10 && controlFonts.every(control => control.size < 16), `Editor text controls are smaller than the 16px clinical text: ${JSON.stringify(controlFonts)}`);
      assert.match((await page.locator('#as-npc label').allTextContents()).join(' '), /Δ/, 'Prism-diopter notation stays on the clinical measurement field');
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
      for (const [key, selected] of [['ArrowRight', 'outcomes'], ['End', 'plan'], ['Home', 'dashboard'], ['ArrowLeft', 'plan'], ['ArrowRight', 'dashboard'], ['ArrowRight', 'sessions']]) {
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
          const metricBoxes = await page.locator('.sess .session-metrics').evaluateAll(lists => lists.map(list => [...list.querySelectorAll(':scope > div')].slice(0, 3).map(cell => {
            const rect = cell.getBoundingClientRect(); return { x: rect.x, width: rect.width, label: cell.querySelector('dt').textContent };
          })));
          assert.ok(metricBoxes.every(cells => cells.length === 3), 'Before, after and change always have distinct fields');
          if (width >= 768) {
            for (let i = 0; i < 3; i++) assert.ok(metricBoxes.every(cells => Math.abs(cells[i].x - metricBoxes[0][i].x) < 1 && Math.abs(cells[i].width - metricBoxes[0][i].width) < 1), 'Score fields align across visits');
          }
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
          const searchBox = await page.locator('#clientSearch').boundingBox();
          assert.ok(searchBox.y >= 0 && searchBox.y + searchBox.height <= 1000, 'Patient search remains available while scrolling');
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

      // Searching for another patient protects an unsaved draft.
      await page.evaluate(async () => {
        await store.saveClient({ ...clone(cur()), id: 'workspace-other', name: 'Other patient', ref: 'TEST-OTHER' });
        await loadClients(); renderClients();
      });
      assert.equal(await page.evaluate(() => clients.length), 2);
      await page.locator('#clientSearch').fill('no matching client');
      assert.equal(await page.locator('.client-btn').count(), 0);
      await page.locator('#clientSearch').fill('TEST-OTHER');
      assert.equal(await page.locator('.client-btn').count(), 1);
      await action('new-session').click();
      await page.locator('#s-subj').fill('Keep this draft');
      await page.locator('#clientSearch').fill('TEST-OTHER');
      await page.locator('.client-btn').click();
      await page.waitForSelector('#askNo');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#s-subj').inputValue(), 'Keep this draft');
      assert.equal(await page.evaluate(() => dirty), true);
      await page.locator('#clientSearch').fill('TEST-OTHER');
      await page.locator('.client-btn').click();
      await page.locator('#askYes').click();
      await page.waitForSelector('.client-summary');
      assert.equal(await page.locator('.client-head h2').innerText(), 'Other patient');
      assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('#patientDashboard').isVisible(), true);
      assert.equal(await page.locator('.client-stats dd').first().innerText(), '0');
      assert.equal(await page.locator('.sess').count(), 0);
      await page.locator('#clientSearch').fill('');
      assert.equal(await page.locator('.client-btn').count(), 0);

      const race = await page.evaluate(async () => {
        const a = clients.find(client => client.ref === 'TEST-WORKSPACE');
        const b = cur();
        window.patientListBeforeRace = store.listSessions;
        window.patientRecordsBeforeRace = await patientListBeforeRace.call(store, a.id);
        window.rejectDelayedPatient = false;
        store.listSessions = id => id === a.id ? new Promise((resolve, reject) => {
          window.releasePatientLoad = () => rejectDelayedPatient ? reject(new Error('Stale patient read fixture')) : resolve(clone(patientRecordsBeforeRace));
        }) : patientListBeforeRace.call(store, id);
        return { a: a.id, b: b.id, bName: b.name };
      });
      try {
        for (const reject of [false, true]) {
          await page.evaluate(reject => { rejectDelayedPatient = reject; delete window.releasePatientLoad; }, reject);
          await page.locator('#clientSearch').fill('TEST-WORKSPACE');
          await page.locator(`.client-btn[data-id="${race.a}"]`).click();
          await page.waitForFunction(() => !!window.releasePatientLoad);
          assert.equal(await page.evaluate(() => sessions.length), 0, 'Loading a patient clears records from the previous patient');
          await page.locator('#fileMenuButton').click();
          assert.equal(await page.locator('#fileMenu [data-action="new-session"]').isDisabled(), true, 'New record is unavailable until the selected patient loads');
          await page.keyboard.press('Escape');
          await page.locator('#clientMenuButton').click();
          assert.equal(await page.locator('#clientMenu [data-action="edit-client"]').isDisabled(), true, 'Client editing cannot use stale loading data');
          await page.keyboard.press('Escape');
          await page.locator('#clientSearch').fill('TEST-OTHER');
          await page.locator(`.client-btn[data-id="${race.b}"]`).click();
          await page.waitForFunction(name => document.querySelector('.client-head h2')?.textContent === name, race.bName);
          assert.equal(await page.evaluate(() => sessions.length), 0);
          assert.equal(await page.locator('.client-head [data-action="new-session"]').isEnabled(), true, 'The current loaded patient can add a record');
          await page.locator('#clientMenuButton').click();
          assert.equal(await page.locator('#clientMenu [data-action="edit-client"]').isEnabled(), true);
          await page.keyboard.press('Escape');
          if (!reject) {
            await action('new-session').click();
            await page.locator('#s-subj').fill('Keep the current patient draft');
          }
          const currentDraft = await page.evaluate(() => editing ? JSON.stringify(collectSession()) : null);
          await page.evaluate(async () => { releasePatientLoad(); await new Promise(requestAnimationFrame); });
          assert.equal(await page.evaluate(() => curId), race.b, 'A late read cannot select its old patient again');
          assert.equal(await page.evaluate(() => sessions.length), 0, 'A late read cannot attach another patient\'s records');
          assert.equal(await page.locator('[data-action="retry-load"]').count(), 0, 'A stale failure cannot replace the current patient with a load error');
          assert.equal(await page.locator('.toast').filter({ hasText: 'Stale patient read fixture' }).count(), 0, 'A stale failure cannot show an error for the current patient');
          if (!reject) {
            assert.equal(await page.locator('#s-subj').inputValue(), 'Keep the current patient draft');
            assert.equal(await page.evaluate(() => JSON.stringify(collectSession())), currentDraft, 'A late read cannot rerender and discard the current draft');
            await action('cancel-edit').click();
            await page.waitForSelector('#askYes'); await page.locator('#askYes').click();
            await page.waitForSelector('#soapForm', { state: 'detached' });
          } else assert.equal(await page.locator('.client-head h2').innerText(), race.bName);
        }
        assert.equal(await page.evaluate(async () => JSON.stringify(await patientListBeforeRace.call(store, clients.find(client => client.ref === 'TEST-WORKSPACE').id)) === JSON.stringify(patientRecordsBeforeRace)), true, 'Switching patients never rewrites stored records');
      } finally {
        await page.evaluate(() => { store.listSessions = patientListBeforeRace; delete window.patientListBeforeRace; delete window.patientRecordsBeforeRace; delete window.releasePatientLoad; delete window.rejectDelayedPatient; });
      }
      assert.deepEqual(errors, []);
      console.log(`PASS: ${locale} offline file opening, labelled aligned visit metrics, header search, filters, keyboard tabs, dirty-switch protection, stale read/rejection isolation, unchanged records, light/dark 320/768/1280/1440px layouts and sticky controls`);
      await context.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
