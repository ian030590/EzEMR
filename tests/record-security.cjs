const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'record-security');
const client = { id: 'security-client', name: 'Security fixture', ref: 'TEST-SECURITY', plan: [] };
const session = { id: 'security-session', date: '2026-11-02', visit: 'treatment', sym: [], assess: {}, training: {} };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  let browser;
  const errors = [], external = [], evidence = [];
  const check = name => { evidence.push(name); console.log('PASS: ' + name); };
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        external.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      const toleranceError = locale === 'en' ? 'Tolerance must be a number from 0 to 10' : '耐受度須為 0 至 10 的數字';
      const validation = await page.evaluate(({ client, session }) => {
        const valid = [0, 10, 7.5, '7', ' 7.5 ', '', ' \t ', '.5', '+7', '07', '7.'];
        const invalid = ['<img src=x onerror=alert(1)>', {}, [], true, false, NaN, Infinity, -Infinity, -1, 11, '1e0', '0x7', '7/10', '10.1', 'Infinity', 'NaN'];
        return {
          normalized: valid.map(tolerance => { const s = { ...session, tolerance }; validateRecord(client, s); return s.tolerance; }),
          nullable: [undefined, null].map(tolerance => { const s = { ...session, tolerance }; validateRecord(client, s); return s.tolerance == null; }),
          errors: invalid.map(tolerance => { try { validateRecord(client, { ...session, tolerance }); return null; } catch (e) { return e.message; } })
        };
      }, { client, session });
      assert.deepEqual(validation.normalized, [0, 10, 7.5, 7, 7.5, null, null, 0.5, 7, 7, 7]);
      assert.deepEqual(validation.nullable, [true, true]);
      assert(validation.errors.every(message => message === toleranceError), JSON.stringify(validation.errors));
      check(`${locale} tolerance accepts only finite 0–10 numbers, normalizes plain decimal and blank strings, and reports translated errors`);

      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.securityRoot = await disk.getDirectoryHandle('security-imports', { create: true });
        store = folderStore(securityRoot); await finishBoot();
      });
      for (const tolerance of ['<img src=x onerror=alert(1)>', { value: 7 }]) {
        const backup = { clients: [
          { ...client, sessions: [session] },
          { ...client, id: 'invalid-client', ref: 'TEST-INVALID', sessions: [{ ...session, tolerance }] }
        ] };
        await page.locator('#importFile').setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
        await page.waitForFunction(message => [...document.querySelectorAll('.failure-message pre')].some(node => node.textContent === message), toleranceError);
        const unchanged = await page.evaluate(async () => {
          const entries = []; for await (const [name] of securityRoot.entries()) entries.push(name);
          return { entries, clients: clients.length, sessions: sessions.length };
        });
        assert.deepEqual(unchanged, { entries: [], clients: 0, sessions: 0 });
      }
      check(`${locale} malformed tolerance aborts a whole JSON backup before any client, session or file is saved`);

      const backup = { clients: [{ ...client, sessions: [
        { ...session, id: 'tolerance-seven', tolerance: '7' },
        { ...session, id: 'tolerance-empty', tolerance: '' }
      ] }] };
      await page.locator('#importFile').setInputFiles({ name: 'valid.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
      await page.locator('#restoreBackupConfirm').click();
      await page.waitForFunction(() => clients.length === 1 && sessions.length === 2 && document.querySelector('#tab-sessions'));
      await page.locator('#tab-sessions').click();
      assert.equal(await page.locator('.sess').count(), 2);
      assert.match((await page.locator('.sess').allTextContents()).join('\n'), locale === 'en' ? /Tolerance\s*7\/10/ : /耐受度\s*7\/10/);
      assert.deepEqual(await page.evaluate(async () => (await store.listSessions(curId)).sort((a, b) => a.id.localeCompare(b.id)).map(s => s.tolerance)), [null, 7]);
      check(`${locale} normalized tolerance survives JSON import and CSV folder reload, and the session card shows 7/10`);

      const sinks = await page.evaluate(({ client, session }) => {
        const saved = { clients, sessions, curId, search: $('#clientSearch').value };
        const markup = '<img src=x>', id = 'x"><img src=x>';
        try {
          clients = [{ ...client, id }]; curId = id; $('#clientSearch').value = client.name; renderClients();
          const clientHTML = $('#clientList').innerHTML;
          clients = [client]; curId = client.id;
          const s = { ...session, tolerance: '<b>x</b>', sym: [
            { id: 'pre', kind: 'pre', scores: { ef: markup } },
            { id: 'sub', kind: 'sub', test: 'pursuit', scores: { ef: markup } },
            { id: 'end', kind: 'end', scores: { ef: markup } },
            { id: 'rec', kind: 'rec', scores: {}, recMin: markup }
          ], training: { ocular: { on: true, eyedot: [{ id: 'eye', count: markup }] } } };
          const cardHTML = sessCard(s);
          sessions = [s]; renderOutcomes();
          const outcomesHTML = $('#tabBody').innerHTML;
          const runHTML = runCard('ocular', { id, item: RUN_ITEMS.ocular[0], values: {} });
          const template = document.createElement('template'); template.innerHTML = runHTML;
          return { clientHTML, cardHTML, outcomesHTML, runHTML, runID: template.content.querySelector('.run').dataset.run };
        } finally { clients = saved.clients; sessions = saved.sessions; curId = saved.curId; $('#clientSearch').value = saved.search; renderClients(); renderMain(); }
      }, { client, session });
      assert.match(sinks.cardHTML, /&lt;b&gt;x&lt;\/b&gt;/);
      for (const key of ['clientHTML', 'cardHTML', 'outcomesHTML', 'runHTML']) {
        assert.doesNotMatch(sinks[key], /<img\b/, key);
        assert.match(sinks[key], /&lt;img src=x&gt;/, key);
      }
      assert.equal(sinks.runID, 'x"><img src=x>');
      check(`${locale} client IDs, card tolerance/recovery/totals, outcome totals/EyeDot counts and all run-ID attributes escape markup even without validation`);

      for (const kind of ['client', 'recovery', 'tolerance']) {
        const original = await page.evaluate(async ({ client, session, kind }) => {
          const disk = await navigator.storage.getDirectory(), root = await disk.getDirectoryHandle('legacy-invalid-' + kind, { create: true });
          const folder = await root.getDirectoryHandle('TEST-LEGACY', { create: true });
          const c = kind === 'client' ? { ...client, id: 'x"><img src=x>' } : client;
          const s = kind === 'recovery' ? { ...session, sym: [{ id: 'rec', kind: 'rec', scores: {}, recMin: '<img src=x>' }] } : { ...session, tolerance: '<img src=x>' };
          await writeFile(folder, 'client.json', JSON.stringify(c));
          if (kind !== 'client') await writeFile(folder, 'session.json', JSON.stringify(s));
          store = folderStore(root); await finishBoot();
          return { client: await readJSON(folder, 'client.json'), session: await readJSON(folder, 'session.json'), files: (await fileNames(folder)).sort(), rootFiles: await fileNames(root) };
        }, { client, session, kind });
        const alert = page.locator('#main [role="alert"]');
        const text = await alert.innerText();
        assert.match(text, locale === 'en' ? /Cannot read/ : /無法讀取/);
        const details = page.locator('.failure-message pre').last(), raw = await details.textContent();
        assert.match(raw, kind === 'client' ? /TEST-LEGACY\/client\.json/ : /session\.json/);
        if (kind === 'tolerance') assert(raw.includes(toleranceError));
        assert.equal(await details.isVisible(), false);
        assert.equal(await page.locator('#main img, #clientList img, #failureHost img').count(), 0);
        if (locale === 'en') assert.doesNotMatch(text, /\p{Script=Han}/u);
        assert.deepEqual(original.rootFiles, []);
        assert.deepEqual(original.files, kind === 'client' ? ['client.json'] : ['client.json', 'session.json']);
        assert.deepEqual(original.client, kind === 'client' ? { ...client, id: 'x"><img src=x>' } : client);
        if (kind !== 'client') assert.deepEqual(original.session, kind === 'recovery' ? { ...session, sym: [{ id: 'rec', kind: 'rec', scores: {}, recMin: '<img src=x>' }] } : { ...session, tolerance: '<img src=x>' });
      }
      check(`${locale} unsafe legacy client IDs, recovery times and tolerance surface translated file errors, render no markup and leave files unchanged`);

      const legacy = await page.evaluate(async ({ client, session }) => {
        const disk = await navigator.storage.getDirectory(), root = await disk.getDirectoryHandle('legacy-valid', { create: true });
        const folder = await root.getDirectoryHandle('TEST-LEGACY', { create: true });
        await writeFile(folder, 'client.json', JSON.stringify(client));
        const s = { id: session.id, date: session.date, tolerance: '7', subjective: 'Latest legacy', updated: '2026-11-02T00:00:00Z' };
        await writeFile(folder, 'latest.json', JSON.stringify(s));
        await writeFile(folder, 'older.json', JSON.stringify({ ...s, subjective: 'Older legacy', updated: '2026-11-01T00:00:00Z' }));
        store = folderStore(root); await finishBoot();
        const loaded = clone(sessions);
        await writeFile(folder, 'record.csv', sessionCSV(client, { ...session, tolerance: 2, subjective: 'CSV wins', updated: '2026-01-01T00:00:00Z' }));
        store = folderStore(root); await store.listClients();
        return { loaded, replaced: await store.listSessions(client.id) };
      }, { client, session });
      assert.equal(legacy.loaded.length, 1); assert.equal(legacy.loaded[0].subjective, 'Latest legacy');
      assert.equal(legacy.loaded[0].tolerance, 7); assert.equal(legacy.loaded[0].visit, 'treatment');
      assert.deepEqual(legacy.loaded[0].sym, []); assert.deepEqual(legacy.loaded[0].assess, {}); assert.deepEqual(legacy.loaded[0].training, {});
      assert.equal(legacy.replaced.length, 1); assert.equal(legacy.replaced[0].subjective, 'CSV wins'); assert.equal(legacy.replaced[0].tolerance, 2);
      check(`${locale} valid legacy JSON gets session defaults, keeps the newest duplicate and yields to validated CSV with the same ID`);
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
