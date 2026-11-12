const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const source = await fs.readFile(appPath), evidence = [];
  const output = path.resolve(__dirname, '../.tmp/verification/draft-recovery');
  await fs.mkdir(output, { recursive: true });
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
      await context.addInitScript(locale => { try { localStorage.setItem('ezrehab-language', locale); } catch (_) {} }, locale);
      const outbound = [], errors = [], page = await context.newPage();
      page.on('request', request => { if (!request.url().startsWith(url) && !request.url().startsWith('blob:') && !request.url().startsWith('data:')) outbound.push(request.url()); });
      page.on('pageerror', error => errors.push(error.message));
      page.on('dialog', dialog => dialog.accept());
      page.setDefaultTimeout(12000);
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const reconnect = () => page.evaluate(async locale => {
        const disk = await navigator.storage.getDirectory();
        store = folderStore(await disk.getDirectoryHandle('draft-' + locale)); await finishBoot();
      }, locale);
      const reload = async () => { await page.reload(); await ready(); await reconnect(); };
      const kept = () => page.waitForFunction(() => !!readDraftCopies().find(copy => copy.clientId === curId));
      const cancel = async () => { await action('cancel-edit').click(); if (await page.locator('#askYes').count()) await page.locator('#askYes').click(); await page.waitForSelector('#soapForm', { state: 'detached' }); };
      await page.goto(url); await ready();
      await page.evaluate(async locale => {
        const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('draft-' + locale, { create: true });
        store = folderStore(root);
        const client = { id: 'draft-client', name: 'Synthetic draft client', ref: 'TEST-DRAFT', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
        client.plan.push({ id: 'custom_draft', name: 'Synthetic measure', domain: '', timing: 'session', category: 'functional', fields: [{ id: 'draft_value', label: 'Synthetic value', type: 'text' }] });
        await store.saveClient(client); await idbSet('root', null); await finishBoot();
      }, locale);
      await action('new-session').click();
      await page.locator('#s-date').fill('2026-10-21');
      for (const [id, value] of Object.entries({ 's-clin': 'Synthetic therapist', 's-dur': '35', 's-subj': 'Synthetic draft 中文 <safe>', 's-obj': 'Synthetic observation', 's-fb': 'Synthetic response', 's-person': 'Synthetic person', 's-environment': 'Synthetic environment', 's-occupation': 'Synthetic occupation', 's-otx': 'Synthetic treatment', 's-ass': 'Synthetic reasoning', 's-plan': 'Synthetic plan', 's-next': '2026-10-28' })) await page.locator('#' + id).fill(value);
      await page.locator('#useSubjectiveProblem').click();
      await page.locator('[data-clinical="reasoning"]').first().fill('Synthetic linked reasoning');
      await openAssessment(page, 'custom_draft');
      await page.locator('#af-custom_draft-0').fill('Custom typed value 0');
      await page.locator('[data-action="measure-add"][data-id="custom_draft"]').click();
      await page.locator('#measure-name').fill('Synthetic additional measure');
      await page.locator('#measure-type').selectOption('text');
      await page.locator('#measure-name').evaluate(input => input.closest('form').requestSubmit());
      await page.locator('#af-custom_draft-1').fill('Additional committed value');
      await completeAssessment(page);
      await openAssessment(page, 'st_npc'); await page.locator('#af-st_npc-0').fill('8'); await completeAssessment(page);
      await openAssessment(page, 'npc'); await page.locator('[data-measurement-ref="npc"]').selectOption('st_npc/pre'); await completeAssessment(page);
      await kept();
      const expected = await page.evaluate(() => collectSession());
      const metadata = await page.evaluate(() => readDraftCopies()[0]);
      assert.equal(metadata.recordId, null); assert.equal(metadata.baseUpdated, null);
      assert.equal(metadata.date, expected.date); assert.equal(metadata.visit, expected.visit);
      assert.equal(metadata.storage.kind, 'folder'); assert.equal(metadata.storage.name, 'draft-' + locale);
      assert.match(await page.locator('#workflowDirty').innerText(), locale === 'en' ? /Unsaved changes.*Safety copy kept at/ : /未儲存變更.*已自動暫存/);
      const otherLocale = locale === 'en' ? 'zh-TW' : 'en';
      await page.locator('#languageSelect').selectOption(otherLocale);
      assert.deepEqual(await page.evaluate(() => collectSession()), expected);
      assert.match(await page.locator('#workflowDirty').innerText(), otherLocale === 'en' ? /Safety copy kept at/ : /已自動暫存/);
      await page.locator('#languageSelect').selectOption(locale);
      await openAssessment(page, 'custom_draft');
      await page.locator('#af-custom_draft-0').fill('Uncommitted dialog value');
      await page.evaluate(() => keepDraftNow());
      await reload();
      assert.match(await page.locator('.modal').innerText(), locale === 'en' ? /Found an unsaved record/ : /找到上次沒有儲存的紀錄/);
      const prompt = await page.locator('.modal').innerText();
      assert.ok(prompt.includes('Synthetic draft client') && prompt.includes(expected.date));
      assert.ok(prompt.includes(await page.evaluate(visit => visitLabel(visit), expected.visit)));
      assert.ok(prompt.includes(await page.evaluate(time => new Date(time).toLocaleString(language), metadata.copiedAt)));
      for (const theme of ['light', 'dark']) for (const width of [320, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth), true);
        assert.equal(await page.locator('#draftResume, #draftDiscard').evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().height >= 44)), true);
        await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
      }
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#soapForm').count(), 0);
      assert.equal(await page.evaluate(() => readDraftCopies().length), 1);
      await reload(); await page.locator('#draftResume').click();
      assert.deepEqual(await page.evaluate(() => collectSession()), expected, 'All editor values, custom measures, references and links recover; open dialog changes remain uncommitted');
      assert.equal(await page.evaluate(() => dirty), true);
      const backupDownload = page.waitForEvent('download');
      await page.locator('#exportMenuButton').click(); await action('export-all').click();
      const backup = JSON.parse(await fs.readFile(await (await backupDownload).path(), 'utf8'));
      assert.equal(backup.clients[0].sessions.length, 0);
      assert.doesNotMatch(JSON.stringify(backup), /ezrehab-draft|copiedAt|baseUpdated|Synthetic draft 中文/);
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);
      const saved = await page.evaluate(async () => {
        const s = sessions[0], dir = await store.root.getDirectoryHandle(store.folderOf(curId));
        const csv = await (await (await dir.getFileHandle(store.sessionBase(curId, s.id) + '.csv')).getFile()).text();
        return { session: s, csv, parsed: readRecordCSV(csv).session };
      });
      assert.equal(saved.parsed.subjective, expected.subjective);
      assert.deepEqual(saved.parsed.assess, expected.assess);
      assert.doesNotMatch(saved.csv, /ezrehab-draft|copiedAt|baseUpdated|Safety copy kept|已自動暫存/);

      await action('open-session').click(); await page.locator('#s-subj').fill('Edited existing synthetic note');
      await kept();
      const existing = await page.evaluate(() => ({ session: collectSession(), copy: readDraftCopies()[0] }));
      assert.equal(existing.copy.recordId, saved.session.id); assert.equal(existing.copy.baseUpdated, saved.session.updated);
      await page.evaluate(() => { window.realRecoverySave = store.saveSession; store.saveSession = async () => { throw new Error('Synthetic save failure'); }; });
      await action('save-session').click(); await page.waitForSelector('.failure-message');
      assert.equal(await page.evaluate(() => readDraftCopies()[0].session.subjective), existing.session.subjective);
      await page.evaluate(() => { store.saveSession = realRecoverySave; });
      await page.evaluate(async () => { const s = clone(sessions[0]); s.subjective = 'Newer saved note'; s.updated = '2099-01-01T00:00:00.000Z'; await store.saveSession(curId, s); });
      await reload();
      assert.match(await page.locator('.modal').innerText(), locale === 'en' ? /saved record has changed/ : /原本的病歷後來有更新/);
      await page.locator('#draftResume').click();
      assert.deepEqual(await page.evaluate(() => collectSession()), existing.session);
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);

      await action('new-session').click(); await page.locator('#s-visit').selectOption('absent');
      await page.locator('#abs-reason').selectOption({ index: 1 }); await page.locator('#abs-contact').fill('Synthetic absence contact'); await page.locator('#abs-next').fill('2026-11-15');
      await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));
      const absence = await page.evaluate(() => collectSession());
      await reload(); await page.locator('#draftResume').click();
      assert.deepEqual(await page.evaluate(() => collectSession()), absence);
      await cancel(); assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);
      await action('new-session').click(); await page.locator('#s-subj').fill('Discard synthetic copy'); await kept();
      const copy = await page.evaluate(() => readDraftCopies()[0]);
      await reload(); await page.locator('#draftDiscard').click();
      assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);
      assert.equal(await page.locator('#soapForm').count(), 0);

      for (const change of ['missing-client', 'other-storage']) {
        await page.evaluate(({ copy, change }) => {
          const next = clone(copy);
          if (change === 'missing-client') next.clientId = 'missing-client'; else next.storage.name = 'another-folder';
          writeDraftCopies([next]);
        }, { copy, change });
        await reload(); assert.equal(await page.locator('#draftResume').count(), 0);
        assert.equal(await page.evaluate(() => readDraftCopies().length), 1);
        await action('new-session').click(); await page.locator('#s-subj').fill('Keep the other safety copy');
        await page.evaluate(() => keepDraftNow());
        assert.equal(await page.evaluate(() => readDraftCopies().length), 2, 'Editing does not overwrite a copy for another storage or missing client');
        await cancel(); assert.equal(await page.evaluate(() => readDraftCopies().length), 1);
      }
      for (const raw of ['', '{broken', JSON.stringify({ version: 99, copies: [copy] }), JSON.stringify({ version: 1, copies: [{ bad: true }] }), JSON.stringify({ version: 1, copies: [{ ...copy, session: { ...copy.session, subjective: { invalid: true } } }] })]) {
        await page.evaluate(raw => localStorage.setItem(DRAFT_KEY, raw), raw); await reload();
        assert.equal(await page.locator('#draftResume').count(), 0);
        assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);
      }
      await action('new-session').click();
      await page.evaluate(() => {
        window.realDraftSetItem = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) { if (key === DRAFT_KEY) throw new DOMException('Synthetic quota', 'QuotaExceededError'); return realDraftSetItem.call(this, key, value); };
        window.safekeepingNotes = 0; window.realDraftToast = toast;
        toast = message => { if (message === ui('無法自動暫存，請定期儲存。')) safekeepingNotes++; realDraftToast(message); };
      });
      await page.locator('#s-subj').fill('Typing despite synthetic quota'); await page.evaluate(() => keepDraftNow());
      await page.locator('#s-obj').fill('Still typing'); await page.evaluate(() => keepDraftNow());
      assert.equal(await page.evaluate(() => safekeepingNotes), 1);
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => sessions.some(s => s.subjective === 'Typing despite synthetic quota' && s.objective === 'Still typing')), true);
      await page.evaluate(() => { Storage.prototype.setItem = realDraftSetItem; toast = realDraftToast; });

      await action('new-session').click(); await page.locator('#s-subj').fill('Immediate hidden-page copy');
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange')); delete document.visibilityState;
      });
      assert.equal(await page.evaluate(() => readDraftCopies()[0].session.subjective), 'Immediate hidden-page copy');
      await cancel();
      await action('new-session').click();
      await page.evaluate(() => {
        window.realDraftGetItem = Storage.prototype.getItem;
        Storage.prototype.getItem = function(key) { if (key === DRAFT_KEY) throw new DOMException('Synthetic blocked storage', 'SecurityError'); return realDraftGetItem.call(this, key); };
      });
      await page.locator('#s-subj').fill('Typing despite unavailable localStorage'); await page.evaluate(() => keepDraftNow());
      assert.match(await page.locator('#workflowDirty').innerText(), locale === 'en' ? /safekeeping is unavailable/ : /無法自動暫存/);
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => sessions.some(s => s.subjective === 'Typing despite unavailable localStorage')), true);
      await page.evaluate(() => { Storage.prototype.getItem = realDraftGetItem; });

      await page.evaluate(async () => { const client = clone(cur()); store = localStore(); await store.saveClient(client); await finishBoot(); });
      await action('new-session').click(); await page.locator('#s-subj').fill('Synthetic browser-mode draft'); await kept();
      assert.deepEqual(await page.evaluate(() => readDraftCopies()[0].storage), { kind: 'local' });
      await page.reload(); await ready();
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await page.locator('#draftResume').click();
      assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic browser-mode draft');
      await action('save-session').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      assert.equal(await page.evaluate(() => localStorage.getItem(DRAFT_KEY)), null);
      assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
      evidence.push(`${locale}: new/existing records, committed assessments/custom measures/references/links, absence, reload/reconnect, unsaved restore/save, conflict warning, Escape/discard/cancel, foreign/missing/corrupt copies, quota, isolated exports and zero outbound requests`);
      console.log('PASS: ' + evidence.at(-1));
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
