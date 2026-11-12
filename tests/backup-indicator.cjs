const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const DAY = 86400000, start = Date.parse('2026-11-12T04:00:00Z');
(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/backup-indicator');
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath);
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const en = locale === 'en', context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(12000);
      await page.clock.setFixedTime(new Date(start));
      await context.route(/^https?:/, route => {
        if (route.request().url().startsWith(url)) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      page.on('pageerror', error => errors.push(error.message));
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const openExport = async () => { await page.locator('#exportMenuButton').click(); };
      const expectAge = async (days, at) => {
        const date = await page.evaluate(at => new Date(at).toLocaleDateString(language), at);
        assert.equal(await page.locator('#lastBackupStatus').innerText(), en ? `Last backup: ${days} ${days === 1 ? 'day' : 'days'} ago (${date})` : `上次備份：${days} 天前（${date}）`);
      };
      const reconnect = () => page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.indicatorRoot = await disk.getDirectoryHandle('indicator-records');
        store = folderStore(indicatorRoot); await finishBoot();
      });
      const fingerprint = () => page.evaluate(async () => {
        const files = {};
        const visit = async (dir, prefix = '') => {
          for await (const [name, handle] of dir.entries()) {
            if (handle.kind === 'directory') await visit(handle, prefix + name + '/');
            else files[prefix + name] = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await (await handle.getFile()).arrayBuffer()))).join(',');
          }
        };
        await visit(indicatorRoot); return files;
      });
      await page.goto(url); await ready(); await page.locator('#languageSelect').selectOption(locale);
      await openExport();
      assert.equal(await page.locator('#lastBackupStatus').innerText(), en ? 'No backup yet' : '尚未備份');
      assert.match(await page.locator('.backup-status-note').innerText(), en ? /started from this browser.*Check/ : /此瀏覽器開始下載.*確認/);
      await page.keyboard.press('Escape');
      await action('use-default').click();
      assert.equal(await page.evaluate(() => store.root.deferred), true);
      await openExport();
      const setupDownload = page.waitForEvent('download'); await action('export-all').click(); await setupDownload;
      await page.waitForFunction(() => !!deviceBackupStatus().startedAt);
      await openExport(); await expectAge(0, start); await page.keyboard.press('Escape');
      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.indicatorRoot = await disk.getDirectoryHandle('indicator-records', { create: true });
        store = folderStore(indicatorRoot);
        await store.saveClient({ id: 'indicator-client', name: 'Synthetic saved client', ref: 'INDICATOR-001', plan: newClientPlan(), trainingPlan: clone(TRAIN) });
        await store.saveClient({ id: 'indicator-empty', name: 'Synthetic empty client', ref: 'INDICATOR-002', plan: newClientPlan(), trainingPlan: clone(TRAIN) });
        await store.saveSettings(clone(DEFAULT_APP_SETTINGS));
        await finishBoot();
      });
      assert.equal(await page.locator('#backupReminder').count(), 0, 'No reminder before any records are saved');
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt || null), null, 'A setup-only backup does not claim a backup of the newly connected folder');
      await openExport();
      const rosterDownload = page.waitForEvent('download'); await action('export-roster').click(); await rosterDownload;
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt || null), null, 'A roster export is not a full backup');
      await page.evaluate(async () => {
        await store.saveSession('indicator-client', { id: 'indicator-session', date: '2026-11-12', visit: 'treatment', num: 1, sym: [], assess: {}, training: {}, subjective: 'Synthetic saved record' });
        curId = 'indicator-empty'; await loadSessions(); renderMain();
      });
      await page.waitForSelector('#backupReminder');
      assert.equal(await page.evaluate(() => sessions.length), 0, 'A storage-wide backup reminder also covers an empty client when another has saved records');
      await page.evaluate(async () => { curId = 'indicator-client'; await loadSessions(); renderMain(); });
      const before = await fingerprint(), dataBefore = await page.evaluate(async () => { const data = await backupData(); delete data.exported; return data; });
      for (const theme of ['light', 'dark']) for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 }); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
        assert.equal(await page.locator('#backupReminder').isVisible(), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        if (width === 320) await page.screenshot({ path: path.join(output, `${locale}-${theme}-reminder.png`), fullPage: true });
      }
      await page.locator('#tab-sessions').click(); assert.equal(await page.locator('#backupReminder').count(), 0);
      await page.locator('#tab-outcomes').click(); assert.equal(await page.locator('#backupReminder').count(), 0);
      await action('new-session').click();
      assert.equal(await page.locator('#backupReminder').count(), 0, 'Backup guidance never appears in the record editor');
      await action('cancel-edit').click(); await page.locator('#tab-dashboard').click();
      await page.locator('#backupReminder [data-action="backup-options"]').click();
      assert.equal(await page.locator('#exportMenuButton').getAttribute('aria-expanded'), 'true');
      assert.equal(await page.locator('#exportMenu [data-action="export-all"]').evaluate(node => node === document.activeElement), true);
      const downloading = page.waitForEvent('download'); await action('export-all').click();
      const plain = await downloading, plainPath = path.join(output, `${locale}-plain.json`); await plain.saveAs(plainPath);
      assert.equal(plain.suggestedFilename(), 'EzEMR-backup-2026-11-12.json');
      await page.waitForFunction(() => !!deviceBackupStatus().startedAt);
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt), new Date(start).toISOString());
      assert.equal(await page.locator('#backupReminder').count(), 0);
      const backup = JSON.parse(await fs.readFile(plainPath, 'utf8'));
      assert.deepEqual(Object.keys(backup).sort(), ['app', 'clients', 'exported', 'settings', 'version']);
      delete backup.exported; assert.deepEqual(backup, dataBefore);
      assert.doesNotMatch(JSON.stringify(backup), /startedAt|dismissedAt|ezrehab-backup-status/);
      assert.deepEqual(await fingerprint(), before, 'Backing up changes no CSV, PDF, TXT or settings bytes');
      await openExport(); await expectAge(0, start); await page.keyboard.press('Escape');
      await page.reload(); await ready(); await reconnect();
      await openExport(); await expectAge(0, start); await page.keyboard.press('Escape');

      await page.clock.setFixedTime(new Date(start + DAY));
      await openExport(); await expectAge(1, start); await page.keyboard.press('Escape');

      await page.clock.setFixedTime(new Date(start + 14 * DAY));
      await page.evaluate(() => renderMain()); assert.equal(await page.locator('#backupReminder').count(), 0, 'Exactly 14 days is not overdue');
      await page.clock.setFixedTime(new Date(start + 15 * DAY));
      await page.evaluate(() => renderMain()); await page.waitForSelector('#backupReminder');
      await openExport(); await expectAge(15, start); await page.keyboard.press('Escape');
      await action('dismiss-backup-reminder').click(); assert.equal(await page.locator('#backupReminder').count(), 0);
      await page.reload(); await ready(); await reconnect();
      assert.equal(await page.locator('#backupReminder').count(), 0, 'Dismissal survives reopening the app');
      await page.clock.setFixedTime(new Date(start + 22 * DAY - 1));
      await page.evaluate(() => renderMain()); assert.equal(await page.locator('#backupReminder').count(), 0);
      await page.clock.setFixedTime(new Date(start + 22 * DAY));
      await page.evaluate(() => renderMain()); await page.waitForSelector('#backupReminder');

      await openExport(); await action('export-encrypted').click();
      await page.waitForSelector('#backupPasswordForm'); await page.keyboard.press('Escape');
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt), new Date(start).toISOString(), 'Canceling a password dialog does not record a backup');
      await openExport(); await action('export-encrypted').click();
      const password = 'Synthetic backup indicator passphrase';
      await page.locator('#backupPassword').fill(password); await page.locator('#backupPasswordConfirm').fill(password);
      const encryptedDownload = page.waitForEvent('download'); await page.locator('#backupPasswordForm [type="submit"]').click();
      const encrypted = await encryptedDownload, encryptedPath = path.join(output, `${locale}-encrypted.json`); await encrypted.saveAs(encryptedPath);
      await page.waitForFunction(() => !savingSession);
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt), new Date(start + 22 * DAY).toISOString());
      const decoded = await page.evaluate(async ({ envelope, password }) => { const data = await decryptBackup(envelope, password); delete data.exported; return data; }, { envelope: JSON.parse(await fs.readFile(encryptedPath, 'utf8')), password });
      assert.deepEqual(decoded, dataBefore, 'Password protection includes no device backup metadata');
      await openExport(); await expectAge(0, start + 22 * DAY); await page.keyboard.press('Escape');
      assert.deepEqual(await fingerprint(), before);
      const raw = await page.evaluate(() => ({ data: JSON.parse(localStorage.getItem(BACKUP_STATUS_KEY)), key: deviceStorageKey() }));
      assert.equal(raw.data[raw.key].startedAt, new Date(start + 22 * DAY).toISOString());
      await page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        store = folderStore(await disk.getDirectoryHandle('indicator-other', { create: true })); await finishBoot();
      });
      await openExport(); assert.equal(await page.locator('#lastBackupStatus').innerText(), en ? 'No backup yet' : '尚未備份'); await page.keyboard.press('Escape');
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await openExport(); assert.equal(await page.locator('#lastBackupStatus').innerText(), en ? 'No backup yet' : '尚未備份'); await page.keyboard.press('Escape');
      await reconnect();
      await page.evaluate(() => {
        window.indicatorSaveFile = saveFile;
        saveFile = async () => { throw new Error('Synthetic download failure'); };
      });
      await page.clock.setFixedTime(new Date(start + 23 * DAY));
      await openExport(); await action('export-all').click();
      await page.waitForSelector('.failure-message');
      assert.equal(await page.evaluate(() => deviceBackupStatus().startedAt), new Date(start + 22 * DAY).toISOString(), 'A failed download does not advance the indicator');
      await page.evaluate(() => { saveFile = indicatorSaveFile; });
      assert.deepEqual(await fingerprint(), before);
      assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
      await context.close();
      console.log(`PASS: ${locale}: absent/plain/password backup indicator, fixed-clock date/age, storage isolation, saved-record-only dashboard reminder, editor exclusion, 14-day boundary, persistent 7-day dismissal, canceled/failed downloads, unchanged CSV/settings/backups and no outbound requests`);
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
