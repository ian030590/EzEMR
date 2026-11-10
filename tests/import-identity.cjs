const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'import-identity');

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
      const identity = await page.evaluate(() => {
        const c = (id, ref = '') => ({ id, name: 'Same Name', ref, dob: '', plan: [] });
        const s = (id, date) => ({ id, date, visit: 'treatment', sym: [], assess: {}, training: {}, subjective: id });
        const existing = [{ client: c('patient-a', 'MRN-A'), sessions: [s('session-a', '2026-11-01')] }];
        const incoming = [{ client: c('patient-b', 'MRN-B'), sessions: [s('session-b', '2026-11-01')] }];
        const before = JSON.stringify({ existing, incoming });
        const separated = mergeImportBundles(incoming, existing);
        const sameRef = mergeImportBundles([{ client: c('source-a', ' mrn-a '), sessions: [s('later-a', '2026-11-02')] }], existing);
        const fallback = mergeImportBundles([{ client: c('old-a'), sessions: [s('legacy-a', '2026-11-02')] }], existing);
        const noRefs = mergeImportBundles([{ client: c('old-b'), sessions: [s('legacy-b', '2026-11-02')] }], [{ client: c('old-a'), sessions: [] }]);
        const assignedRef = mergeImportBundles([
          { client: c('source-a', 'MRN-A'), sessions: [s('assigned-a', '2026-11-01')] },
          { client: c('source-b', 'MRN-B'), sessions: [s('assigned-b', '2026-11-01')] }
        ], [{ client: c('old-a', '  '), sessions: [] }]);
        let conflict = '', ambiguity = '', birth = '';
        try { mergeImportBundles([{ client: c('patient-a', 'MRN-B'), sessions: [] }], existing); } catch (e) { conflict = e.message; }
        try { mergeImportBundles([{ client: c('old-a'), sessions: [] }], separated.bundles); } catch (e) { ambiguity = e.message; }
        try { mergeImportBundles([{ client: { ...c('source-a', 'MRN-A'), dob: '1981-01-01' }, sessions: [] }], [{ client: { ...c('patient-a', 'MRN-A'), dob: '1980-01-01' }, sessions: [] }]); } catch (e) { birth = e.message; }
        return {
          separated: separated.bundles.map(b => ({ id: b.client.id, ref: b.client.ref, sessions: b.sessions.map(s => s.subjective) })),
          sameRef: sameRef.bundles.map(b => ({ id: b.client.id, count: b.sessions.length })),
          fallback: fallback.bundles.map(b => ({ id: b.client.id, count: b.sessions.length })),
          noRefs: noRefs.bundles.map(b => b.client.id),
          assignedRef: assignedRef.bundles.map(b => ({ id: b.client.id, ref: b.client.ref, count: b.sessions.length })),
          unchanged: JSON.stringify({ existing, incoming }) === before,
          conflict, ambiguity, birth,
          expected: [ui('{0} 的病歷號與既有個案不一致，已停止匯入。', 'Same Name'), ui('{0} 對應多位個案，無法自動合併。', 'Same Name'), ui('{0} 的姓名或出生日期與既有個案不一致，已停止匯入。', 'Same Name')]
        };
      });
      assert.deepEqual(identity.separated, [{ id: 'patient-a', ref: 'MRN-A', sessions: ['session-a'] }, { id: 'patient-b', ref: 'MRN-B', sessions: ['session-b'] }]);
      assert.deepEqual(identity.sameRef, [{ id: 'patient-a', count: 2 }]);
      assert.deepEqual(identity.fallback, [{ id: 'patient-a', count: 2 }]);
      assert.deepEqual(identity.noRefs, ['old-a']);
      assert.deepEqual(identity.assignedRef, [{ id: 'old-a', ref: 'MRN-A', count: 1 }, { id: 'source-b', ref: 'MRN-B', count: 1 }], 'A legacy client receives its first known record number so another number cannot reuse its blank-number fallback');
      assert.equal(identity.unchanged, true);
      assert.deepEqual([identity.conflict, identity.ambiguity, identity.birth], identity.expected);
      if (locale === 'en') assert.doesNotMatch(identity.expected.join(' '), /\p{Script=Han}/u);
      evidence.push(`${locale}: equal names with different medical record numbers stay separate; matching IDs, missing-number fallback, ambiguity and birth-date conflicts retain safe behavior`);

      const backup = await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory(), results = [];
        const c = (id, ref) => ({ id, name: id, ref, plan: [] });
        const s = id => ({ id, date: '2026-11-01', visit: 'treatment', sym: [], assess: {}, training: {} });
        const variants = [
          { name: 'clients', clients: [{ ...c('first', 'FIRST'), sessions: [] }, { ...c('duplicate', 'ONE'), sessions: [s('a')] }, { ...c('duplicate', 'TWO'), sessions: [s('b')] }], expected: ui('備份含有重複的個案識別碼：{0}', 'duplicate') },
          { name: 'sessions', clients: [{ ...c('first', 'FIRST'), sessions: [] }, { ...c('second', 'SECOND'), sessions: [s('duplicate'), { ...s('duplicate'), subjective: 'Different note' }] }], expected: ui('備份含有重複的紀錄識別碼：{0}', 'duplicate') }
        ];
        for (const variant of variants) {
          const directory = await disk.getDirectoryHandle('duplicate-backup-' + variant.name, { create: true });
          store = folderStore(directory);
          let writes = 0, error = '';
          const saveClient = store.saveClient.bind(store), saveSession = store.saveSession.bind(store);
          store.saveClient = (...args) => { writes++; return saveClient(...args); };
          store.saveSession = (...args) => { writes++; return saveSession(...args); };
          const before = JSON.stringify({ clients, sessions });
          try { await importAll({ text: async () => JSON.stringify({ clients: variant.clients }) }); } catch (e) { error = e.message; }
          results.push({ error, expected: variant.expected, writes, files: await fileNames(directory), unchanged: JSON.stringify({ clients, sessions }) === before });
        }
        return results;
      });
      for (const result of backup) {
        assert.equal(result.error, result.expected);
        assert.equal(result.writes, 0, 'Every backup is checked before the first client or session write');
        assert.deepEqual(result.files, []);
        assert.equal(result.unchanged, true);
        if (locale === 'en') assert.doesNotMatch(result.error, /\p{Script=Han}/u);
      }
      evidence.push(`${locale}: duplicate client or session IDs reject the whole backup before any memory or folder write`);

      const legacy = await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory(), results = [];
        const c = { id: 'legacy-patient', name: 'Legacy patient', ref: 'LEGACY', plan: [] };
        for (const kind of ['client', 'session']) {
          const directory = await disk.getDirectoryHandle('bad-json-' + kind, { create: true });
          let folder, reader;
          if (kind === 'client') {
            folder = await directory.getDirectoryHandle('LEGACY', { create: true });
            await writeFile(folder, 'client.json', '{broken');
            reader = () => folderStore(directory).listClients();
          } else {
            const storage = folderStore(directory);
            await storage.saveClient(c);
            folder = await directory.getDirectoryHandle('LEGACY');
            await writeFile(folder, 'session.json', '{broken');
            reader = () => storage.listSessions(c.id);
          }
          let error = '';
          try { await reader(); } catch (e) { error = e.message; renderLoadError(e); }
          const name = kind + '.json';
          results.push({ error, expected: ui('無法讀取'), file: name, original: await (await (await folder.getFileHandle(name)).getFile()).text(), alert: document.querySelector('#main [role="alert"]')?.textContent });
        }
        const directory = await disk.getDirectoryHandle('valid-legacy', { create: true });
        const absent = await readJSON(directory, 'missing.json');
        await writeFile(directory, 'valid.json', '\ufeff' + JSON.stringify(c));
        const valid = await readJSON(directory, 'valid.json');
        const errors = [];
        for (const name of ['NotAllowedError', 'NotReadableError']) {
          try { await readJSON({ name: 'BLOCKED', getFileHandle: async () => { throw new DOMException('Read denied', name); } }, 'client.json'); } catch (e) { errors.push(e.message); }
        }
        return { results, absent, valid, expected: c, errors };
      });
      for (const result of legacy.results) {
        assert.ok(result.error.includes(result.expected) && result.error.includes('LEGACY/' + result.file));
        assert.ok(result.alert.includes(result.error));
        assert.equal(result.original, '{broken', 'Failed reads preserve the source bytes');
        if (locale === 'en') assert.doesNotMatch(result.alert, /\p{Script=Han}/u);
      }
      assert.equal(legacy.absent, null);
      assert.deepEqual(legacy.valid, legacy.expected, 'A BOM-prefixed legacy JSON file remains readable');
      assert.equal(legacy.errors.length, 2);
      assert.ok(legacy.errors.every(error => error.includes('BLOCKED/client.json')));
      const fixedFolder = await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory(), directory = await disk.getDirectoryHandle('fixed-client-folder', { create: true });
        const storage = folderStore(directory), c = { id: 'fixed-client', name: 'Fixed client', ref: 'ORIGINAL', plan: [] };
        await storage.saveClient(c);
        await writeFile(await directory.getDirectoryHandle('ORIGINAL'), 'retained.txt', 'Existing file');
        await storage.saveClient({ ...c, ref: 'UPDATED' });
        const folders = []; for await (const [name, handle] of directory.entries()) if (handle.kind === 'directory') folders.push(name);
        return { folders, folder: storage.folderOf(c.id), ref: (await storage.listClients())[0].ref, text: await (await (await (await directory.getDirectoryHandle('ORIGINAL')).getFileHandle('retained.txt')).getFile()).text() };
      });
      assert.deepEqual(fixedFolder, { folders: ['ORIGINAL'], folder: 'ORIGINAL', ref: 'UPDATED', text: 'Existing file' });
      assert.deepEqual(errors, []);
      evidence.push(`${locale}: corrupt legacy JSON and read-denied errors surface with filenames and preserve files; missing JSON still falls back and valid BOM-prefixed JSON loads`);
      evidence.push(`${locale}: editing a medical record number keeps the existing client folder and its files`);
      await context.close();
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
    for (const line of evidence) console.log('PASS: ' + line);
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
