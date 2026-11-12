const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const root = path.resolve(__dirname, '..');
const dataRoot = path.join(root, 'Data');
const output = path.join(root, '.tmp', 'verification', 'demo-data');
const cases = [
  ['STROKE', '中風', ['st_tug', 'st_bbt']],
  ['TBI', '腦傷', ['search_time', 'coordination_time', 'st_search']],
  ['DIPLOPIA', '複視', ['npc', 'demo_diplopia', 'st_npc']],
  ['MONOCULAR', '單側視覺受損', ['va', 'reading_speed', 'st_reading']],
  ['FIELD', '視野受損', ['vf', 'search_time', 'st_search']],
  ['NEGLECT', '忽略', ['st_neglect']],
  ['MOTOR', '動作障礙', ['st_9hpt', 'st_bbt']],
  ['SCI', '脊髓損傷', ['demo_transfer', 'demo_wheelchair']]
];
const bases = ['2026-10-05_S01_基準評估', '2026-10-12_S02_復健', '2026-10-26_S03_療程後評估'];

(async () => {
  await fs.mkdir(output, { recursive: true });
  const names = ['README.md', 'clients.csv', ...cases.flatMap(([key]) => bases.flatMap(base => ['csv', 'pdf', 'txt'].map(ext => `DEMO-${key}/${base}.${ext}`)))];
  const files = await Promise.all(names.map(async name => ({ name, bytes: await fs.readFile(path.join(dataRoot, name)) })));
  const hashes = files.map(file => createHash('sha256').update(file.bytes).digest('hex'));
  for (const file of files.filter(file => file.name.endsWith('.csv'))) assert.deepEqual([...file.bytes.subarray(0, 3)], [239, 187, 191], file.name + ': UTF-8 BOM');
  const versioned = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], { cwd: root, encoding: 'utf8', input: names.map(name => 'Data/' + name).join('\0') + '\0' });
  assert.equal(versioned.status, 1, 'All supplied demo files must be included by Git: ' + versioned.stdout + versioned.stderr);
  const privatePaths = ['Data/REAL-RECORD/visit.csv', 'Data/DEMO-UNKNOWN/' + bases[0] + '.csv', 'Data/DEMO-STROKE/2026-11-11_S04_復健.csv', 'Data/settings.json'];
  const ignored = spawnSync('git', ['check-ignore', '--no-index', '-z', '--stdin'], { cwd: root, encoding: 'utf8', input: privatePaths.join('\0') + '\0' });
  assert.equal(ignored.status, 0); assert.deepEqual(ignored.stdout.split('\0').filter(Boolean), privatePaths);
  const pdfs = files.filter(file => file.name.endsWith('.pdf'));
  const pdfCheck = spawnSync(process.env.PYTHON || 'python', ['-c',
    'import json, sys\nfrom pypdf import PdfReader\ncounts = []\nfor name in sys.argv[1:]:\n reader = PdfReader(name, strict=True)\n assert not reader.is_encrypted and len(reader.pages) > 0, name\n for page in reader.pages:\n  assert len(page.images) == 1, name\n counts.append(len(reader.pages))\nprint(json.dumps(counts))',
    ...pdfs.map(file => path.join(dataRoot, file.name))], { encoding: 'utf8' });
  assert.equal(pdfCheck.status, 0, pdfCheck.stderr);
  assert.equal(JSON.parse(pdfCheck.stdout).length, 24);
  const source = await fs.readFile(appPath, 'utf8');
  for (const [key] of cases) assert.ok(!source.includes('DEMO-' + key), 'The HTML must not embed demo records');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route(/^https?:/, route => {
        if (route.request().url() === url) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      try {
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        assert.equal(await page.evaluate(() => clients.length), 0);
        // Copy the shipped CSV/TXT bytes into an isolated browser folder. PDFs are parsed independently above.
        await page.evaluate(async entries => {
          window.demoRoot = await (await navigator.storage.getDirectory()).getDirectoryHandle('Data', { create: true });
          for (const entry of entries) {
            const parts = entry.name.split('/'), name = parts.pop(); let dir = demoRoot;
            for (const part of parts) dir = await dir.getDirectoryHandle(part, { create: true });
            await writeFile(dir, name, new Blob([Uint8Array.from(atob(entry.data), char => char.charCodeAt(0))]));
          }
          window.showDirectoryPicker = async () => demoRoot;
        }, files.filter(file => /\.(csv|txt)$/.test(file.name)).map(file => ({ name: file.name, data: file.bytes.toString('base64') })));
        await action('pick-folder').click();
        await page.waitForFunction(() => clients.length === 8);
        const loaded = await page.evaluate(async definitions => {
          const roster = readClientsCSV(await (await (await demoRoot.getFileHandle('clients.csv')).getFile()).text());
          const result = [];
          for (const [key, label, required] of definitions) {
            const { client: c, folder } = roster.find(row => row.client.ref === 'DEMO-' + key);
            if (folder !== c.ref || !c.name.includes(label) || c.demo !== true || !c.referral.includes('虛構')) throw new Error('Invalid demo identity: ' + key);
            const records = (await store.listSessions(c.id)).sort((a, b) => a.date.localeCompare(b.date));
            if (records.map(s => s.visit).join(',') !== 'baseline,treatment,post') throw new Error('Missing visit: ' + key);
            for (const s of records) {
              validateRecord(c, s);
              if (!s.demo || !s.subjective || !s.objective || !s.assessment || !s.plan || !s.clinicalLinks?.length) throw new Error('Incomplete SOAP: ' + s.id);
              for (const item of assessmentItems(c, s)) {
                const values = s.assess[item.id]?.values || {}, fields = fieldsFor(item);
                for (const [id, value] of Object.entries(values)) {
                  const field = fields.find(field => field.id === id);
                  if (!field) throw new Error('Unknown result field: ' + item.id + '/' + id);
                  if (field.type === 'number' && (typeof value !== 'number' || !Number.isFinite(value) || value < (field.min ?? -Infinity) || value > (field.max ?? Infinity))) throw new Error('Invalid number: ' + item.id + '/' + id);
                }
              }
              for (const training of Object.values(s.training)) {
                if (!training.on || !training.acts.length || training.acts.some(isRetiredCombinedActivity) || new Set(training.acts.map(activityLabel)).size !== training.acts.length || Object.keys(training.actScores).join('|') !== training.acts.join('|')) throw new Error('Invalid activity results: ' + s.id);
              }
              for (const link of s.clinicalLinks) if (link.evidence.some(id => !s.assess[id]?.done)) throw new Error('Missing linked evidence: ' + s.id);
              const roundTrip = readRecordCSV(sessionCSV(c, s));
              if (JSON.stringify(roundTrip.client) !== JSON.stringify(c) || JSON.stringify(roundTrip.session) !== JSON.stringify(s)) throw new Error('CSV round trip: ' + s.id);
            }
            const post = records[2];
            if (required.some(id => !post.assess[id]?.done)) throw new Error('Missing case-specific results: ' + key);
            if (key === 'SCI' && records.some(s => s.assess.st_tug?.done || s.assess.st_10mwt?.done)) throw new Error('Wheelchair case has fabricated walking results');
            if (key === 'NEGLECT') for (const s of records) for (const phase of ['pre', 'post']) {
              const v = s.assess.st_neglect.values;
              if (v[phase + '_omissions'] !== v[phase + '_left'] + v[phase + '_right']) throw new Error('Neglect counts disagree');
            }
            result.push({ key, id: c.id, records: records.length });
          }
          return result;
        }, cases);
        assert.equal(loaded.length, 8); assert.equal(loaded.reduce((sum, item) => sum + item.records, 0), 24);
        await page.locator('#clientSearch').fill('DEMO-'); assert.equal(await page.locator('.client-btn').count(), 8);
        for (const { key, id } of loaded) {
          await page.locator('#clientSearch').fill('DEMO-' + key);
          await page.locator(`.client-btn[data-id="${id}"]`).click();
          await page.waitForSelector('#patientDashboard');
          assert.equal(await page.locator('#tab-dashboard').innerText(), locale === 'en' ? 'Patient dashboard' : '病人總覽');
          assert.match(await page.locator('#main').innerText(), /虛構情境/);
          if (['STROKE', 'SCI'].includes(key)) await page.screenshot({ path: path.join(output, `${locale}-${key}.png`) });
          await page.locator('#tab-outcomes').click();
          if (key === 'SCI') {
            assert.match(await page.locator('#tabBody').innerText(), /移位板轉位時間/);
            assert.doesNotMatch(await page.locator('#tabBody').innerText(), /TUG|10MWT/);
          }
          await page.locator('#tab-sessions').click(); assert.equal(await page.locator('.sess').count(), 3);
          await action('open-session').click(); await page.waitForSelector('#soapForm');
          assert.equal(await page.locator('#s-mode').inputValue(), 'inperson');
          const content = await page.locator('#s-subj').inputValue();
          const preserved = await page.evaluate(() => {
            const s = collectSession();
            return Object.entries(editing.assess).filter(([, result]) => result.done).every(([id, result]) =>
              Object.entries(result.values || {}).every(([field, value]) => s.assess[id]?.values?.[field] === value)) &&
              Object.entries(editing.training).every(([key, data]) => JSON.stringify(s.training[key]?.actScores) === JSON.stringify(data.actScores));
          });
          assert.equal(preserved, true, `${locale} ${key}: original results survive editing`);
          const marker = `Demo edit ${locale} ${key}`;
          await page.locator('#s-subj').fill(content + '\n' + marker);
          await action('save-session').click(); await page.waitForFunction(() => editing === null);
          const saved = await page.evaluate(async () => {
            const records = await store.listSessions(curId), latest = records.find(s => s.visit === 'post');
            const dir = await demoRoot.getDirectoryHandle(store.folderOf(curId)), base = store.sessionBase(curId, latest.id);
            const text = await (await (await dir.getFileHandle(base + '.txt')).getFile()).text();
            const csv = readRecordCSV(await (await (await dir.getFileHandle(base + '.csv')).getFile()).text());
            const pdf = await (await dir.getFileHandle(base + '.pdf')).getFile();
            return { count: records.length, subject: csv.session.subjective, text, pdfHeader: await pdf.slice(0, 8).text(), num: latest.num };
          });
          assert.equal(saved.count, 3); assert.equal(saved.subject, content + '\n' + marker); assert.ok(saved.text.includes(marker)); assert.equal(saved.pdfHeader, '%PDF-1.4'); assert.equal(saved.num, 3);
          await page.evaluate(async () => { store = folderStore(demoRoot); await finishBoot(); });
          assert.equal(await page.evaluate(() => clients.length), 8);
          await page.locator('#clientSearch').fill('DEMO-' + key); await page.locator(`.client-btn[data-id="${id}"]`).click();
          await page.locator('#tab-sessions').click(); await action('open-session').click();
          assert.equal(await page.locator('#s-subj').inputValue(), content + '\n' + marker);
          await action('cancel-edit').click();
        }
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS ${locale}: eight shipped demo clients, 24 validated records, bilingual navigation, preserved results and isolated folder save/reload`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
  for (const [index, file] of files.entries()) assert.equal(createHash('sha256').update(await fs.readFile(path.join(dataRoot, file.name))).digest('hex'), hashes[index], 'Tests must not modify shipped demo files');
  console.log('PASS: All 24 PDFs parse, demo files are versioned, unrelated local records remain ignored, and shipped examples are unchanged');
})().catch(error => { console.error(error); process.exitCode = 1; });
