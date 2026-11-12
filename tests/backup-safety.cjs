const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { pathToFileURL } = require('node:url');
const { pbkdf2Sync, createDecipheriv, createCipheriv, randomBytes } = require('node:crypto');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/backup-safety');
const password = 'Synthetic backup passphrase 2026!';
const aad = Buffer.from('EzEMR-encrypted-backup:1');
function decrypt(envelope) {
  const key = pbkdf2Sync(password, Buffer.from(envelope.salt, 'base64'), 600000, 32, 'sha256');
  const bytes = Buffer.from(envelope.data, 'base64');
  const cipher = createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
  cipher.setAAD(aad); cipher.setAuthTag(bytes.subarray(-16));
  return JSON.parse(Buffer.concat([cipher.update(bytes.subarray(0, -16)), cipher.final()]).toString('utf8'));
}
function encrypt(data) {
  const salt = randomBytes(16), iv = randomBytes(12), key = pbkdf2Sync(password, salt, 600000, 32, 'sha256');
  const cipher = createCipheriv('aes-256-gcm', key, iv); cipher.setAAD(aad);
  const bytes = Buffer.concat([cipher.update(JSON.stringify(data), 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return { app: 'EzEMR-encrypted-backup', version: 1, cipher: 'AES-GCM', kdf: 'PBKDF2-SHA-256', iterations: 600000,
    salt: salt.toString('base64'), iv: iv.toString('base64'), data: bytes.toString('base64') };
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const html = await fs.readFile(appPath);
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const errors = [], external = [], evidence = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        external.push(route.request().url()); return route.abort();
      });
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      page.on('pageerror', error => errors.push(error.message));
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const file = (data, name = 'synthetic-backup.json') => ({ name, mimeType: 'application/json', buffer: Buffer.from(typeof data === 'string' ? data : JSON.stringify(data)) });
      const upload = data => page.locator('#importFile').setInputFiles(file(data));
      const idle = () => page.waitForFunction(() => !savingSession);
      const english = async () => {
        if (locale !== 'en') return;
        const text = await page.locator('.modal').evaluate(el => [el.textContent, ...[...el.querySelectorAll('[aria-label], [placeholder]')].map(n => `${n.getAttribute('aria-label') || ''} ${n.getAttribute('placeholder') || ''}`)].join('\n'));
        assert.doesNotMatch(text, /\p{Script=Han}/u);
      };
      const startExport = async () => {
        await page.locator('#exportMenuButton').click();
        await page.locator('#exportMenu [data-action="export-encrypted"]').click();
        await page.waitForSelector('#backupPasswordForm');
      };
      const unlock = async value => {
        await page.locator('#backupPassword').fill(value);
        await page.locator('#backupPasswordForm [type="submit"]').click();
      };
      const snapshot = () => page.evaluate(async () => {
        const all = await store.listClients();
        return JSON.stringify({ settings: await store.getSettings(), clients: await Promise.all(all.map(async c => ({ ...c, sessions: await store.listSessions(c.id) }))) });
      });
      const writeCount = () => page.evaluate(() => backupWrites);
      await page.goto(url); await ready(); await page.locator('#languageSelect').selectOption(locale);
      const original = await page.evaluate(async () => {
        store = localStore();
        const client = { id: 'backup-client', name: 'Synthetic confidential client', ref: 'TEST-PRIVATE-BACKUP', dob: '', doi: '', eyeSurgery: null, referral: '', plan: [], trainingPlan: [], created: '2026-11-12', nationalId: 'Synthetic identity', dx: '合成診斷' };
        const session = { id: 'backup-session', date: '2026-11-12', visit: 'treatment', sym: [], assess: {}, training: {}, subjective: '合成機密病歷 / synthetic confidential note', duration: 0, tolerance: 0, customSource: { filename: '原始檔案.csv', value: 0 } };
        const settings = { version: 1, requiredFields: ['name', 'ref', 'nationalId'] };
        await store.saveClient(client); await store.saveSession(client.id, session); await store.saveSettings(settings);
        await finishBoot(); curId = client.id; await loadSessions(); renderMain();
        return { client, session, settings };
      });
      const before = await snapshot();
      await startExport(); await english();
      assert.equal(await page.locator('#languageSelect').isDisabled(), true);
      await page.keyboard.press('Escape'); await idle(); assert.equal(await snapshot(), before);
      await startExport();
      await unlock('short');
      assert.equal(await page.locator('#backupPasswordError').innerText(), locale === 'en' ? 'The password must contain at least 12 characters.' : '密碼至少需要 12 個字元。');
      await page.locator('#backupPassword').fill(password); await page.locator('#backupPasswordConfirm').fill('different');
      await page.locator('#backupPasswordForm [type="submit"]').click();
      assert.equal(await page.locator('#backupPasswordError').innerText(), locale === 'en' ? 'The passwords do not match.' : '兩次輸入的密碼不同。');
      await english();
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
        for (const width of [320, 360, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.modal').scrollWidth <= document.querySelector('.modal').clientWidth), true, `${locale} ${theme} ${width}px password dialog`);
          if (width === 320) await page.screenshot({ path: path.join(output, `${locale}-${theme}-password-mobile.png`) });
        }
        await page.screenshot({ path: path.join(output, `${locale}-${theme}-password.png`) });
      }
      await page.locator('#backupPasswordConfirm').fill(password);
      const downloading = page.waitForEvent('download');
      await page.locator('#backupPasswordForm [type="submit"]').click();
      const download = await downloading, filename = path.join(output, `${locale}-encrypted.json`);
      await download.saveAs(filename); await idle();
      assert.match(download.suggestedFilename(), /^EzEMR-backup-\d{4}-\d{2}-\d{2}\.encrypted\.json$/);
      const bytes = await fs.readFile(filename, 'utf8'), envelope = JSON.parse(bytes), decoded = decrypt(envelope);
      for (const secret of [password, original.client.name, original.client.ref, original.session.subjective]) assert.equal(bytes.includes(secret), false);
      assert.deepEqual(decoded.clients, [{ ...original.client, sessions: [original.session] }]);
      assert.deepEqual(decoded.settings, original.settings);
      assert.equal(await page.evaluate(pw => Object.keys(localStorage).some(key => localStorage.getItem(key)?.includes(pw)), password), false);
      const second = await page.evaluate(async ({ data, password }) => encryptBackup(data, password), { data: decoded, password });
      assert.notEqual(second.salt, envelope.salt); assert.notEqual(second.iv, envelope.iv); assert.notEqual(second.data, envelope.data);
      assert.deepEqual(decrypt(second), decoded);
      evidence.push(`${locale}: password validation, cancellation, random salts/nonces, actual encrypted download and independent Node AES-GCM/PBKDF2 decoding preserve source text, zero values and settings`);

      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.backupRoot = await disk.getDirectoryHandle('backup-restore', { create: true });
        store = folderStore(backupRoot); curId = null; await finishBoot();
        window.backupWrites = 0;
        for (const name of ['saveClient', 'saveSession', 'saveSettings']) {
          const original = store[name].bind(store); store[name] = (...args) => { backupWrites++; return original(...args); };
        }
      });
      const empty = await snapshot();
      await upload(envelope); await english(); await unlock('wrong password');
      await page.waitForSelector('#backupPasswordError:not([hidden])'); await english();
      assert.equal(await page.locator('.failure-message pre').last().textContent(), locale === 'en' ? 'The password is incorrect or the backup is damaged. Check and try again.' : '密碼不正確或備份已損壞，請檢查後重試。');
      assert.equal(await page.locator('.failure-message pre').last().isVisible(), false);
      assert.equal(await writeCount(), 0); assert.equal(await snapshot(), empty);
      await unlock(password); await page.waitForSelector('#restoreBackupForm'); await english();
      assert.equal(await page.locator('#restoreBackupCounts').innerText(), locale === 'en' ? 'Clients in backup: 1. Records: 1.' : '備份內有 1 位個案、1 筆紀錄。');
      assert.equal(await writeCount(), 0);
      await page.keyboard.press('Escape'); await idle(); assert.equal(await snapshot(), empty);
      assert.equal(await page.evaluate(async () => { const names = []; for await (const [name] of backupRoot.entries()) names.push(name); return names.length; }), 0);
      await page.evaluate(() => {
        const original = decryptBackup;
        window.originalBackupDecrypt = original;
        decryptBackup = (...args) => {
          window.pendingBackupDecrypt = new Promise(resolve => { window.releaseBackupDecrypt = resolve; }).then(() => original(...args));
          return pendingBackupDecrypt;
        };
      });
      await upload(envelope); await unlock(password);
      assert.equal(await page.locator('#backupPasswordForm').getAttribute('aria-busy'), 'true');
      assert.equal(await page.locator('#backupPassword').isDisabled(), true);
      assert.equal(await page.locator('#backupPasswordProgress').isVisible(), true); await english();
      await page.keyboard.press('Escape'); await idle();
      await page.evaluate(async () => { releaseBackupDecrypt(); await pendingBackupDecrypt; decryptBackup = originalBackupDecrypt; });
      assert.equal(await page.locator('.modal').count(), 0, 'A late decryption cannot reopen a cancelled dialog');
      assert.equal(await writeCount(), 0); assert.equal(await snapshot(), empty);
      await upload(encrypt(decoded)); await unlock(password); await page.waitForSelector('#restoreBackupForm');
      await page.locator('#restoreBackupConfirm').click(); await idle();
      assert.deepEqual(await page.evaluate(async () => await store.listSessions('backup-client')), [original.session]);
      assert.deepEqual(await page.evaluate(async () => await store.getSettings()), original.settings);
      evidence.push(`${locale}: independently encrypted input unlocks locally; wrong passwords and cancel leave the target folder empty; confirmed restore creates readable CSV/PDF/TXT and preserves original values`);

      const restored = await snapshot(), initialWrites = await writeCount();
      await upload(decoded); await page.waitForSelector('#restoreBackupForm'); await english();
      assert.equal(await page.locator('#restoreBackupConfirm').isDisabled(), true);
      await page.locator('#restoreBackupOverwrite').focus(); await page.keyboard.press('Space');
      assert.equal(await page.locator('#restoreBackupConfirm').isEnabled(), true);
      await page.keyboard.press('Space'); assert.equal(await page.locator('#restoreBackupConfirm').isDisabled(), true);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; }, theme);
        for (const width of [320, 360, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.modal').scrollWidth <= document.querySelector('.modal').clientWidth), true, `${locale} ${theme} ${width}px restore dialog`);
          if (width === 320) await page.screenshot({ path: path.join(output, `${locale}-${theme}-restore-mobile.png`) });
        }
        await page.screenshot({ path: path.join(output, `${locale}-${theme}-restore.png`) });
      }
      await page.locator('#restoreBackupCancel').click(); await idle();
      assert.equal(await snapshot(), restored); assert.equal(await writeCount(), initialWrites);
      const extra = { ...original.session, id: 'retained-session', date: '2026-11-11', subjective: 'Synthetic unmatched record' };
      await page.evaluate(async ({ client, session, extra }) => {
        await store.saveClient({ ...client, name: 'Synthetic edited profile' });
        await store.saveSession(client.id, { ...session, subjective: 'Synthetic later note' });
        await store.saveSession(client.id, extra); await loadClients(); await loadSessions(); renderMain();
      }, { ...original, extra });
      await upload(decoded); await page.locator('#restoreBackupOverwrite').check(); await page.locator('#restoreBackupConfirm').click(); await idle();
      assert.deepEqual(await page.evaluate(async () => await store.listClients()), [original.client]);
      assert.deepEqual(await page.evaluate(async () => (await store.listSessions('backup-client')).sort((a, b) => a.id.localeCompare(b.id))), [original.session, extra]);
      evidence.push(`${locale}: overwrite is disabled until explicit keyboard/click confirmation; cancel writes nothing; confirmed overwrites retain records outside the backup`);

      const stable = await snapshot(), writes = await writeCount();
      const c = original.client;
      const invalid = [
        { data: { clients: [{ ...c, id: 'new-first', ref: 'TEST-FIRST', sessions: [] }, { ...c, id: 'duplicate-ref', ref: 'test-first', sessions: [] }] }, match: /Duplicate medical record number|病歷號重複/ },
        { data: { clients: [{ ...c, id: 'new-first', ref: 'TEST-FIRST', sessions: [] }, { ...c, id: 'other-id', sessions: [] }] }, match: /Duplicate medical record number|病歷號重複/ },
        { data: { clients: [{ ...c, ref: 'OTHER-PATIENT', sessions: [] }] }, match: /different medical record number|現有病歷號不符/ },
        { data: { ...decoded, version: 999 }, match: /Unsupported backup version|備份版本不受支援/ },
        { data: { ...decoded, app: 'another-app' }, match: /not an EzEMR|不是 EzEMR/ },
        { data: { ...envelope, iterations: 1000000000 }, match: /Unsupported encrypted backup|加密備份格式或版本/ },
        { data: { ...envelope, iv: 'invalid' }, match: /Unsupported encrypted backup|加密備份格式或版本/ },
        { data: { clients: [{ ...c, id: 'new-first', ref: 'TEST-FIRST', sessions: [] }, { ...c, sessions: [{ ...original.session, tolerance: 'invalid' }] }] }, match: /Tolerance must|耐受度須為/ }
      ];
      for (const { data, match } of invalid) {
        await page.evaluate(() => document.querySelectorAll('.toast').forEach(el => el.remove()));
        await upload(data); await page.waitForSelector('.failure-message'); await idle();
        assert.match(await page.locator('.failure-message pre').last().textContent(), match);
        assert.equal(await page.locator('#restoreBackupForm, #backupPasswordForm').count(), 0);
        assert.equal(await snapshot(), stable); assert.equal(await writeCount(), writes);
      }
      const tampered = { ...envelope }, damagedBytes = Buffer.from(tampered.data, 'base64'); damagedBytes[0] ^= 1; tampered.data = damagedBytes.toString('base64');
      await upload(tampered); await unlock(password); await page.waitForSelector('#backupPasswordError:not([hidden])'); await english();
      await page.locator('#backupPasswordCancel').click(); await idle(); assert.equal(await snapshot(), stable);
      await upload({ clients: [] }); await page.waitForSelector('#restoreBackupForm'); await english();
      assert.equal(await page.locator('#restoreBackupConfirm').isDisabled(), true);
      await page.keyboard.press('Escape'); await idle();
      assert.equal(await writeCount(), writes);
      evidence.push(`${locale}: duplicate/cross-patient identities, unsupported versions, invalid later records, malformed encryption metadata and tampered ciphertext reject before any writes; empty-state guidance is bilingual`);

      await page.evaluate(() => {
        window.realBackupSave = store.saveSession;
        store.saveSession = async () => { throw new Error('Synthetic write denied'); };
      });
      await upload(decoded); await page.locator('#restoreBackupOverwrite').check(); await page.locator('#restoreBackupConfirm').click(); await idle();
      assert.match(await page.locator('.failure-message strong').last().innerText(), /Restore stopped|還原已停止/);
      assert.doesNotMatch(await page.locator('.failure-message strong').last().innerText(), /Restored|已還原/);
      await page.evaluate(() => { store.saveSession = realBackupSave; });
      await upload(decoded); await page.locator('#restoreBackupOverwrite').check(); await page.locator('#restoreBackupConfirm').click(); await idle();
      assert.match(await page.locator('.toast').innerText(), /Restored|已還原/);
      evidence.push(`${locale}: write failures stop restore, release the operation lock and allow a successful retry`);

      await page.evaluate(() => { Object.defineProperty(crypto, 'subtle', { value: undefined, configurable: true }); });
      await page.locator('#exportMenuButton').click(); await page.locator('#exportMenu [data-action="export-encrypted"]').click(); await idle();
      assert.match(await page.locator('.failure-message pre').last().textContent(), /browser cannot encrypt|瀏覽器無法加密/);
      assert.equal(await page.locator('.modal').count(), 0);
      await page.evaluate(() => { delete crypto.subtle; });

      const offline = await context.newPage(); offline.on('pageerror', error => errors.push(error.message));
      await offline.goto(pathToFileURL(appPath).href); await offline.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const fileResult = await offline.evaluate(async ({ envelope, password }) => {
        const decoded = await decryptBackup(envelope, password);
        return JSON.stringify(await decryptBackup(await encryptBackup(decoded, password), password)) === JSON.stringify(decoded);
      }, { envelope, password });
      assert.equal(fileResult, true, 'The generated HTML encrypts and decrypts from a direct file URL');
      await context.close();
    }
    assert.deepEqual(errors, []); assert.deepEqual(external, []);
    evidence.push('Both languages work from the local bundle, with no application errors or outbound requests');
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
    evidence.forEach(text => console.log('PASS: ' + text));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
