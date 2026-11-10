const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { inflateRawSync } = require('node:zlib');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'export-security');
const client = { id: 'export-client', name: 'Export fixture', ref: 'TEST-EXPORT', plan: [], trainingPlan: [] };
const session = { id: 'export-session', date: '2026-11-02', visit: 'treatment', num: 3, duration: 7, sym: [], assess: {}, training: {} };

// Inspect serialized entries without trusting either workbook library's reader.
function zipEntries(bytes) {
  const zip = Buffer.from(bytes), entries = new Map();
  let end = zip.length - 22;
  while (end >= 0 && zip.readUInt32LE(end) !== 0x06054b50) end--;
  assert(end >= 0, 'Export must be a ZIP archive');
  let entry = zip.readUInt32LE(end + 16);
  for (let i = 0; i < zip.readUInt16LE(end + 10); i++) {
    assert.equal(zip.readUInt32LE(entry), 0x02014b50);
    const length = zip.readUInt16LE(entry + 28), name = zip.toString('utf8', entry + 46, entry + 46 + length);
    const local = zip.readUInt32LE(entry + 42);
    const start = local + 30 + zip.readUInt16LE(local + 26) + zip.readUInt16LE(local + 28);
    const data = zip.subarray(start, start + zip.readUInt32LE(entry + 20)), method = zip.readUInt16LE(entry + 10);
    assert([0, 8].includes(method), 'Unexpected ZIP compression');
    assert(!entries.has(name), 'ZIP member names must be unique');
    entries.set(name, method === 8 ? inflateRawSync(data) : data);
    entry += 46 + length + zip.readUInt16LE(entry + 30) + zip.readUInt16LE(entry + 32);
  }
  return entries;
}

function checkPair(bytes, base) {
  const entries = zipEntries(bytes);
  assert.deepEqual([...entries.keys()], [`TEST-EXPORT/${base}.csv`, `TEST-EXPORT/${base}.pdf`]);
  for (const name of entries.keys()) {
    assert.equal(name.split('/').length, 2); assert.doesNotMatch(name, /\.\.|\\|[\x00-\x1f\x7f-\x9f]/);
  }
  assert.match(entries.get(`TEST-EXPORT/${base}.pdf`).toString('ascii', 0, 8), /^%PDF-/);
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  const errors = [], external = [], evidence = [];
  const check = name => { evidence.push(name); console.log('PASS: ' + name); };
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ acceptDownloads: true, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        external.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const messages = locale === 'en'
        ? { duration: 'Session length must be a number of 0 or more', num: 'Session number must be a number of 0 or more', zip: 'Invalid ZIP member name' }
        : { duration: '復健時間須為 0 以上的數字', num: '復健次數須為 0 以上的數字', zip: 'ZIP 檔案名稱不合法' };
      for (const field of ['duration', 'num']) {
        const validation = await page.evaluate(({ client, session, field }) => {
          const valid = ['7', '', ' 2.5 ', ' \t ', 0, 7, '.5', '+7', '07', '7.'];
          const invalid = [{ t: 'n', f: '1+1' }, [], '../../x', -1, NaN, Infinity, -Infinity, true, false, '1e0', '0x7', 'NaN'];
          return {
            normalized: valid.map(value => { const s = { ...session, [field]: value }; validateRecord(client, s); return s[field]; }),
            nullable: [null, undefined].map(value => { const s = { ...session, [field]: value }; validateRecord(client, s); return s[field] == null; }),
            errors: invalid.map(value => { try { validateRecord(client, { ...session, [field]: value }); return null; } catch (e) { return e.message; } })
          };
        }, { client, session, field });
        assert.deepEqual(validation.normalized, [7, null, 2.5, null, 0, 7, 0.5, 7, 7, 7]);
        assert.deepEqual(validation.nullable, [true, true]);
        assert(validation.errors.every(message => message === messages[field]), JSON.stringify(validation.errors));
      }
      check(`${locale} duration and session number normalize decimals/blanks and reject nonfinite, structured, negative and malformed values with translated errors`);

      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory(); window.exportRoot = await disk.getDirectoryHandle('export-imports', { create: true });
        store = folderStore(exportRoot); await finishBoot();
      });
      for (const field of ['duration', 'num']) for (const value of [{ t: 'n', f: '1+1' }, '../../x', -1, 'NaN']) {
        const backup = { clients: [
          { ...client, sessions: [session] },
          { ...client, id: 'invalid-client', ref: 'TEST-INVALID', sessions: [{ ...session, [field]: value }] }
        ] };
        await page.evaluate(() => document.querySelectorAll('.toast').forEach(node => node.remove()));
        await page.locator('#importFile').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
        await page.waitForFunction(message => document.querySelector('.toast')?.textContent.endsWith(message), messages[field]);
        assert.deepEqual(await page.evaluate(async () => {
          const entries = []; for await (const [name] of exportRoot.entries()) entries.push(name);
          return { entries, clients: clients.length, sessions: sessions.length };
        }), { entries: [], clients: 0, sessions: 0 });
      }
      check(`${locale} invalid JSON backups reject all clients and leave no files or records saved`);

      const workbooks = await page.evaluate(async ({ client, session }) => {
        const serialize = wb => Array.from(new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })));
        const result = [];
        for (const unsafe of [true, false]) {
          const s = unsafe ? { ...session, duration: { t: 'n', f: '1+1' }, num: { t: 'n', f: '2+2' } } : session;
          const wb = buildWorkbook([{ c: client, ss: [s] }]), sheet = soapFormSheet(client, s, [s]);
          const soap = wb.Sheets['SOAP notes'];
          const num = Object.keys(soap).find(ref => soap[ref]?.v === 'Session no.');
          const duration = Object.keys(soap).find(ref => soap[ref]?.v === 'Length (min)');
          const below = ref => { const cell = XLSX.utils.decode_cell(ref); return XLSX.utils.encode_cell({ r: cell.r + 1, c: cell.c }); };
          const after = label => {
            const ref = Object.keys(sheet).find(ref => sheet[ref]?.v === ui(label)), cell = XLSX.utils.decode_cell(ref);
            return XLSX.utils.encode_cell({ r: cell.r, c: cell.c + 1 });
          };
          result.push({ unsafe, workbook: serialize(wb), form: Array.from(new Uint8Array(await soapFormBlob(client, s, [s]).arrayBuffer())),
            workbookCells: [below(num), below(duration)].map(ref => ({ ref, type: soap[ref].t, value: soap[ref].v })),
            formCells: [after('復健次數'), after('復健時間（分鐘）')].map(ref => ({ ref, type: sheet[ref].t, value: sheet[ref].v })) });
        }
        return result;
      }, { client, session });
      for (const item of workbooks) for (const [kind, bytes, cells] of [['workbook', item.workbook, item.workbookCells], ['form', item.form, item.formCells]]) {
        const entries = zipEntries(bytes), sheetName = kind === 'workbook' ? 'xl/worksheets/sheet5.xml' : 'xl/worksheets/sheet1.xml';
        for (const [name, data] of entries) if (/^xl\/worksheets\/.*\.xml$/.test(name)) assert.doesNotMatch(data.toString('utf8'), /<f\b/, name);
        const xml = entries.get(sheetName).toString('utf8');
        if (item.unsafe) {
          const text = xml.replace(/&quot;/g, '"');
          for (const formula of ['1+1', '2+2']) assert(text.includes(JSON.stringify({ t: 'n', f: formula })), `${kind}: structured value must appear as text`);
          for (const cell of cells) assert.equal(cell.type, 's');
        } else for (const [index, cell] of cells.entries()) {
          assert.equal(cell.type, 'n'); assert.equal(cell.value, index === 0 ? 3 : 7);
          assert.match(xml, new RegExp(`<c\\b[^>]*r="${cell.ref}"[^>]*><v>${cell.value}</v></c>`));
        }
        await fs.writeFile(path.join(output, `${locale}-${kind}-${item.unsafe ? 'unsafe' : 'valid'}.xlsx`), Buffer.from(bytes));
      }
      const primitives = await page.evaluate(() => {
        const values = ['=1+1', 0, 2.5, true, false, null, undefined, { t: 'n', f: '1+1' }, [1, 2], NaN, Infinity, -Infinity, 7n, Symbol('fixture'), new Date('2026-11-02T00:00:00Z'), function fixture() {}];
        const circular = {}; circular.self = circular; values.push(circular, Object.create(null));
        return values.map(value => { const safe = excelCellValue(value); return { type: typeof safe, value: safe }; });
      });
      assert.deepEqual(primitives.slice(0, 5).map(cell => cell.value), ['=1+1', 0, 2.5, true, false]);
      assert(primitives.slice(5).every(cell => cell.type === 'string'));
      assert.deepEqual(primitives.slice(5, 14).map(cell => cell.value), ['', '', '{"t":"n","f":"1+1"}', '[1,2]', 'NaN', 'Infinity', '-Infinity', '7', 'Symbol(fixture)']);
      check(`${locale} workbook and SOAP serialization contain text instead of injected formula cells; valid numeric cells and primitive types are retained`);

      const archives = await page.evaluate(async ({ client, session }) => {
        const bytes = async blob => Array.from(new Uint8Array(await blob.arrayBuffer()));
        const suffix = safeName(visitLabel(session.visit)).replace(/\s+/g, '-');
        const rejected = [];
        for (const date of ['../evil', 'bad\\name', 'bad\nname', 'bad\x7fname']) {
          try { await sessionZIP(client, { ...session, date }, [session]); rejected.push(null); } catch (e) { rejected.push(e.message); }
        }
        return { suffix, unsafe: await bytes(await sessionZIP(client, { ...session, num: '../../evil' }, [session])),
          valid: await bytes(await sessionZIP(client, session, [session])), rejected,
          fragments: [3, 12, 0, 2.5, '3', '003', '+3', '3.', null, undefined, '', ' \t ', '../../evil', {}, [], -1, NaN, Infinity, true, 3n, Symbol('fixture'), '3\n', '3\r', '3\u2028'].map(sessionNumberName) };
      }, { client, session });
      assert.deepEqual(archives.fragments, ['03', '12', '00', '2.5', '03', '003', '+3', '3.', ...Array(16).fill('00')]);
      assert(archives.rejected.every(message => message === messages.zip), JSON.stringify(archives.rejected));
      const unsafeBase = `2026-11-02_S00_${archives.suffix}`, validBase = `2026-11-02_S03_${archives.suffix}`;
      checkPair(archives.unsafe, unsafeBase); checkPair(archives.valid, validBase);
      check(`${locale} ZIP has exactly two safe members, malformed numbers use S00, valid numbers retain S03 and unsafe member paths report translated errors`);

      await page.evaluate(async ({ client, session }) => {
        store = localStore(); await store.saveClient(client); await store.saveSession(client.id, { ...session, num: '../../evil' }); await finishBoot();
      }, { client, session });
      await page.locator('#tab-sessions').click();
      const downloading = page.waitForEvent('download');
      await page.locator('[data-action="export-session"]:visible').first().click();
      const download = await downloading;
      assert.equal(download.suggestedFilename(), `TEST-EXPORT_${unsafeBase}.zip`);
      checkPair(await fs.readFile(await download.path()), unsafeBase);
      const formDownloading = page.waitForEvent('download');
      await page.locator('[data-action="xlsx-session"]:visible').first().click();
      assert.equal((await formDownloading).suggestedFilename(), 'TEST-EXPORT_2026-11-02_S00_SOAP.xlsx');
      const folderNames = await page.evaluate(async () => {
        const saved = store, names = [];
        try {
          store = { kind: 'folder', sessionBase: () => null, writeExport: async (cid, name) => { names.push(name); return 'fixture'; } };
          await exportSessionForm(sessions[0].id); sessions[0].num = 3; await exportSessionForm(sessions[0].id);
        } finally { store = saved; }
        return names;
      });
      assert.deepEqual(folderNames, ['2026-11-02_S00.xlsx', '2026-11-02_S03.xlsx']);
      check(`${locale} browser CSV/PDF ZIP and SOAP downloads plus folder SOAP fallback filenames use the safe session number`);

      const roster = await page.evaluate(async ({ client }) => {
        const disk = await navigator.storage.getDirectory(); window.rosterRoot = await disk.getDirectoryHandle('roster-export', { create: true });
        const csv = clientsCSV([{ client: { ...client, dx: '=1+1' }, folder: 'actual-patient-folder' }]).replace("'=1+1", '=1+1');
        await rosterRoot.getDirectoryHandle('actual-patient-folder', { create: true });
        await writeFile(rosterRoot, 'clients.csv', csv); store = folderStore(rosterRoot); await finishBoot();
        return { folder: store.folderOf(client.id), dx: cur().dx };
      }, { client });
      assert.deepEqual(roster, { folder: 'actual-patient-folder', dx: '=1+1' });
      const exportRoster = async () => {
        const downloading = page.waitForEvent('download');
        await page.locator('#exportMenuButton').click(); await page.locator('[data-action="export-roster"]:visible').click();
        const download = await downloading; assert.equal(download.suggestedFilename(), 'clients.csv');
        const bytes = await fs.readFile(await download.path()); assert.deepEqual([...bytes.subarray(0, 3)], [239, 187, 191]);
        return bytes;
      };
      const exported = await exportRoster(); assert(exported.toString('utf8').includes(",'=1+1,"));
      assert.deepEqual(await page.evaluate(text => readClientsCSV(text).map(row => ({ folder: row.folder, dx: row.client.dx })), exported.toString('utf8')), [{ folder: 'actual-patient-folder', dx: '=1+1' }]);
      await page.evaluate(async () => { await store.saveClient({ ...cur(), dx: '=1+1' }); });
      const appExport = await exportRoster();
      const onDisk = await page.evaluate(async () => Array.from(new Uint8Array(await (await (await rosterRoot.getFileHandle('clients.csv')).getFile()).arrayBuffer())));
      assert.deepEqual(appExport, Buffer.from(onDisk));
      check(`${locale} roster downloads neutralize externally written formulas, retain the actual folder and BOM, and match app-written roster bytes`);
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
