const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'profile-storage');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const evidence = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext();
      await context.route('https://fonts.googleapis.com/**', route => route.abort());
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}/`);
      await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);

      const settings = await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        const aDir = await disk.getDirectoryHandle('profile-a', { create: true }), bDir = await disk.getDirectoryHandle('profile-b', { create: true });
        const a = folderStore(aDir), b = folderStore(bDir), defaults = clone(DEFAULT_APP_SETTINGS);
        const initial = await a.getSettings(), emptyFiles = await fileNames(aDir);
        const configured = { version: 1, requiredFields: ['name', 'dob', 'sex', 'smoking', 'chronicConditions'] };
        await a.saveSettings(configured);
        const reread = await folderStore(aDir).getSettings(), untouched = await b.getSettings();
        reread.requiredFields.push('occupation');
        const stable = await a.getSettings();
        const invalid = [null, [], {}, { version: 2, requiredFields: [] }, { version: 1, requiredFields: ['unknown'] }, { version: 1, requiredFields: ['name', 'name'] }];
        const rejected = [];
        for (const value of invalid) { try { await a.saveSettings(value); rejected.push('accepted'); } catch (error) { rejected.push(error.message); } }
        const before = await a.getSettings();
        let writeError = '';
        const failing = folderStore({ getFileHandle: async () => { throw new Error('Synthetic settings write failure'); } });
        try { await failing.saveSettings({ version: 1, requiredFields: [] }); } catch (error) { writeError = error.message; }
        await writeFile(bDir, 'settings.json', '{broken');
        let corruptError = ''; try { await b.getSettings(); } catch (error) { corruptError = error.message; }
        await bDir.removeEntry('settings.json');
        const copy = await disk.getDirectoryHandle('profile-copy', { create: true });
        copyRoot = copy;
        try {
          await a.saveSettings(configured);
          const mirrored = await folderStore(copy).getSettings();
          await b.syncCopy();
          return { initial, defaults, emptyFiles, configured, stable, untouched, rejected, expectedError: ui('基本資料欄位設定格式錯誤'), before, after: await a.getSettings(), writeError, corruptError, mirrored, copyDefaults: await folderStore(copy).getSettings(), bFiles: await fileNames(bDir) };
        } finally { copyRoot = null; }
      });
      assert.deepEqual(settings.initial, settings.defaults);
      assert.deepEqual(settings.emptyFiles, [], 'Reading defaults does not create settings.json');
      assert.deepEqual(settings.stable, settings.configured, 'Settings reads are isolated copies');
      assert.deepEqual(settings.untouched, settings.defaults, 'Each record folder owns its settings');
      assert.ok(settings.rejected.every(error => error === settings.expectedError));
      assert.deepEqual(settings.after, settings.before, 'Failed writes preserve prior settings');
      assert.match(settings.writeError, /Synthetic settings write failure/);
      assert.match(settings.corruptError, /profile-b\/settings\.json/);
      assert.deepEqual(settings.mirrored, settings.configured);
      assert.deepEqual(settings.copyDefaults, settings.defaults, 'Explicit full copy cannot retain an older folder policy');
      assert.deepEqual(settings.bFiles, [], 'Copying defaults does not create a primary settings file');
      if (locale === 'en') assert.doesNotMatch(settings.expectedError, /\p{Script=Han}/u);
      evidence.push(`${locale}: per-folder settings, missing-file defaults, invalid/corrupt input, failed writes and mirrored settings retain correct ownership`);

      const profiles = await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory(), dir = await disk.getDirectoryHandle('profile-clients', { create: true });
        const storage = folderStore(dir);
        const profile = { id: 'anonymous-one', name: '', ref: '', dob: '', doi: '', dx: '', referral: '', eyeSurgery: null, created: '', plan: [], nationalId: '原文 ID 001', sex: 'unknown', smoking: 'never', alcohol: 'former', betel: 'current', occupation: '工程師 / Engineer', religion: '原文信仰', chronicConditions: '無 / None', phone: '0012345', address: '原文地址', allergies: '未記錄 / Original' };
        const second = { ...clone(profile), id: 'anonymous-two' };
        await storage.saveClient(profile); await storage.saveClient(second);
        const folders = [storage.folderOf(profile.id), storage.folderOf(second.id)], bytes = await (await (await dir.getFileHandle('clients.csv')).getFile()).text();
        await storage.saveSettings({ version: 1, requiredFields: ['name', 'dob'] });
        const unchanged = bytes === await (await (await dir.getFileHandle('clients.csv')).getFile()).text();
        const loaded = await folderStore(dir).listClients();
        const csv = readClientsCSV(clientsCSV(loaded.map(client => ({ client, folder: storage.folderOf(client.id) }))));
        const session = { id: 'profile-session', date: '2026-11-10', visit: 'treatment', sym: [], assess: {}, training: {} };
        const record = readRecordCSV(sessionCSV(profile, session));
        const sameNames = [{ client: { ...clone(profile), name: 'Same Name' }, sessions: [] }, { client: { ...clone(second), name: 'Same Name' }, sessions: [] }];
        const namedStorage = folderStore(await disk.getDirectoryHandle('same-names', { create: true }));
        for (const item of sameNames) await namedStorage.saveClient(item.client);
        const namedFolders = sameNames.map(item => namedStorage.folderOf(item.client.id));
        const separate = mergeImportBundles([{ client: second, sessions: [] }], [{ client: profile, sessions: [] }]).bundles;
        const exact = mergeImportBundles([{ client: clone(sameNames[0].client), sessions: [] }], sameNames).bundles;
        const legacy = { ...clone(profile), id: 'legacy-profile', sex: '原始性別', smoking: 'No', alcohol: '原始飲酒', betel: '原始檳榔' };
        await storage.saveClient(legacy);
        const legacyReloaded = (await folderStore(dir).listClients()).find(client => client.id === legacy.id);
        const invalid = [{ ...profile, occupation: [] }, { ...profile, sex: 1 }, { ...profile, smoking: {} }];
        const rejected = invalid.map(client => { try { validateRecord(client, session); return ''; } catch (error) { return error.message; } });
        const report = noteText(profile, session), workbook = buildWorkbook([{ c: profile, ss: [session] }]);
        return { profile, second, folders, loaded, csv: csv.map(row => row.client), record: record.client, unchanged, namedFolders, separate: separate.map(row => row.client.id), exact: exact.map(row => row.client.id), legacy, legacyReloaded, report, reportId: XLSX.utils.sheet_to_json(workbook.Sheets.Clients)[0]['Client ID'], rejected, expectedError: ui('個案基本資料欄位格式錯誤') };
      });
      assert.deepEqual(profiles.folders, ['anonymous-one', 'anonymous-two']);
      assert.deepEqual(profiles.namedFolders, ['anonymous-one', 'anonymous-two'], 'Equal names without MRNs keep distinct folders');
      assert.deepEqual(profiles.loaded, [profiles.profile, profiles.second]);
      assert.deepEqual(profiles.csv, profiles.loaded, 'New profile data uses the existing extra_fields CSV column');
      assert.deepEqual(profiles.record, profiles.profile, 'Session CSV keeps canonical values and original patient text');
      assert.equal(profiles.unchanged, true, 'Changing global requirements never rewrites existing patient data');
      assert.deepEqual(profiles.separate.sort(), ['anonymous-one', 'anonymous-two']);
      assert.deepEqual(profiles.exact.sort(), ['anonymous-one', 'anonymous-two'], 'Exact patient IDs take precedence over ambiguous names');
      assert.deepEqual(profiles.legacyReloaded, profiles.legacy, 'Historical string options retain their original values');
      assert.ok(profiles.report.includes(profiles.profile.id), 'Anonymous clinical reports show the stable patient identifier');
      assert.equal(profiles.reportId, profiles.profile.id);
      assert.equal(profiles.profile.name, '');
      assert.ok(profiles.rejected.every(error => error === profiles.expectedError));
      evidence.push(`${locale}: optional name/MRN, duplicate names, stable IDs, profile types and unchanged CSV schemas preserve original patient data`);

      const local = await page.evaluate(async () => {
        const storage = localStore(), value = { version: 1, requiredFields: ['dob', 'occupation'] };
        await storage.saveSettings(value);
        const persisted = await localStore().getSettings(), originalSet = Storage.prototype.setItem;
        let error = '';
        try { Storage.prototype.setItem = () => { throw new Error('Synthetic preference failure'); }; await storage.saveSettings({ version: 1, requiredFields: [] }); }
        catch (e) { error = e.message; }
        finally { Storage.prototype.setItem = originalSet; }
        const pending = defaultFolderStore(); await pending.saveSettings(value);
        return { value, persisted, afterFailure: await storage.getSettings(), error, pending: await defaultFolderStore().getSettings() };
      });
      assert.deepEqual(local.persisted, local.value);
      assert.deepEqual(local.afterFailure, local.value);
      assert.match(local.error, /Synthetic preference failure/);
      assert.deepEqual(local.pending, local.value);
      await page.reload(); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const deferred = await page.evaluate(async () => {
        const value = await defaultFolderStore().getSettings(), disk = await navigator.storage.getDirectory();
        const parent = await disk.getDirectoryHandle('pending-parent', { create: true }), picker = window.showDirectoryPicker;
        try {
          window.showDirectoryPicker = async () => parent;
          await defaultFolderStore().saveClient({ id: 'pending-client', name: '', ref: '', plan: [] });
          return { value, saved: await store.getSettings(), pending: localStorage.getItem('ezrehab-default-profile-settings'), files: await fileNames(await parent.getDirectoryHandle('Data')) };
        } finally { window.showDirectoryPicker = picker; }
      });
      assert.deepEqual(deferred.value, local.value, 'Pending default-folder settings survive browser reload');
      assert.deepEqual(deferred.saved, local.value);
      assert.equal(deferred.pending, null);
      assert.ok(deferred.files.includes('settings.json') && deferred.files.includes('clients.csv'));
      evidence.push(`${locale}: browser settings and pending default-folder settings persist; failed preferences do not alter memory and first materialization carries settings`);

      const backup = await page.evaluate(async profile => {
        store = localStore(); await store.saveClient(profile);
        const configured = { version: 1, requiredFields: ['dob', 'sex'] };
        await store.saveSettings(configured); appSettings = clone(configured); clients = await store.listClients();
        const originalSave = saveFile; let captured;
        try { saveFile = async (name, data) => { captured = { name, data: String(data) }; }; await exportAll(); }
        finally { saveFile = originalSave; }
        const disk = await navigator.storage.getDirectory(), dir = await disk.getDirectoryHandle('backup-target', { create: true });
        store = folderStore(dir); clients = []; sessions = []; curId = null; appSettings = clone(DEFAULT_APP_SETTINGS);
        await importAll({ text: async () => captured.data });
        const restored = await store.getSettings(), restoredClient = (await store.listClients()).find(c => c.id === profile.id);
        const bytes = await (await (await dir.getFileHandle('settings.json')).getFile()).text();
        await importAll({ text: async () => JSON.stringify({ clients: [{ ...profile, sessions: [] }] }) });
        const legacyRetained = bytes === await (await (await dir.getFileHandle('settings.json')).getFile()).text();
        let writes = 0, error = '';
        const oldSaveClient = store.saveClient.bind(store); store.saveClient = (...args) => { writes++; return oldSaveClient(...args); };
        try { await importAll({ text: async () => JSON.stringify({ settings: { version: 1, requiredFields: ['unsupported'] }, clients: [{ ...profile, sessions: [] }] }) }); }
        catch (e) { error = e.message; }
        return { configured, exported: JSON.parse(captured.data).settings, filename: captured.name, restored, restoredClient, legacyRetained, writes, error, expectedError: ui('基本資料欄位設定格式錯誤') };
      }, profiles.profile);
      assert.match(backup.filename, /^EzEMR-backup-\d{4}-\d{2}-\d{2}\.json$/);
      assert.deepEqual(backup.exported, backup.configured);
      assert.deepEqual(backup.restored, backup.configured);
      assert.deepEqual(backup.restoredClient, profiles.profile);
      assert.equal(backup.legacyRetained, true, 'Old backups do not reset the current global requirements');
      assert.equal(backup.writes, 0, 'Invalid settings reject the entire backup before patient writes');
      assert.equal(backup.error, backup.expectedError);
      assert.deepEqual(errors, []);
      evidence.push(`${locale}: full backups roundtrip settings and original profile values; old backups preserve requirements and invalid settings block every write`);
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
    evidence.forEach(text => console.log('PASS: ' + text));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
