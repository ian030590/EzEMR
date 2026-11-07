const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(path.join(root, 'EzEMR.html'), 'utf8');
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const choose = locale => page.locator('#languageSelect').selectOption(locale);
  const checkEnglish = async selector => {
    const untranslated = await page.locator(selector).evaluate(element => {
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT), found = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.parentElement.closest('script, style, textarea, [data-language-names]') && /\p{Script=Han}/u.test(node.nodeValue)) found.push(node.nodeValue.trim());
      }
      for (const node of element.querySelectorAll('[title], [aria-label], [placeholder]')) {
        for (const name of ['title', 'aria-label', 'placeholder']) {
          const value = node.getAttribute(name);
          if (value && /\p{Script=Han}/u.test(value)) found.push(`${name}: ${value}`);
        }
      }
      return [...new Set(found)];
    });
    assert.deepEqual(untranslated, [], `Untranslated built-in UI in ${selector}`);
  };
  try {
    await page.goto(url); await ready();
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-Hant');
    await choose('en');
    assert.equal(await page.locator('h1').innerText(), 'EzEMR');
    assert.match(await page.title(), /^EzEMR \|/);
    assert.equal(await page.locator('.connect-options h3').innerText(), 'Choose where to keep your records');
    assert.equal(await page.locator('.storage-preview').getAttribute('aria-label'), 'Your local folder');
    assert.equal(await page.locator('#fileMenuButton').innerText(), 'File');
    assert.equal(await page.locator('html').getAttribute('lang'), 'en');
    await checkEnglish('body');
    await page.reload(); await ready();
    assert.equal(await page.locator('#languageSelect').inputValue(), 'en');
    await checkEnglish('body');
    await choose('zh-TW'); await action('use-default').click(); await choose('en');
    assert.equal(await page.locator('.welcome h2').innerText(), 'Start a rehabilitation record here.');
    await checkEnglish('body');
    await page.locator('#fileMenuButton').click(); await action('storage-settings').click();
    await checkEnglish('.modal'); await page.keyboard.press('Escape');
    console.log('PASS: English and Traditional Chinese selection, document language and persisted preference');

    await page.evaluate(async () => {
      const disk = await navigator.storage.getDirectory();
      window.languageRoot = await disk.getDirectoryHandle('language-records', { create: true });
      store = folderStore(languageRoot); await finishBoot();
    });
    await action('new-client').click();
    assert.equal(await page.locator('#languageSelect').isDisabled(), true);
    await checkEnglish('.modal');
    await page.locator('#esAdd').click();
    await checkEnglish('.modal');
    await page.locator('#cf-name').fill('姓名');
    await page.locator('#cf-ref').fill('TEST-LANGUAGE');
    await page.locator('#cf-dx').fill('臨床評估');
    await page.locator('#es-proc-0').fill('LASIK');
    await page.locator('#cForm [type="submit"]').click();
    await page.waitForSelector('#cForm', { state: 'detached' });
    // Client names and diagnoses are clinical data, so only built-in parts of the summary are checked.
    await checkEnglish('.client-summary .eyebrow');
    await checkEnglish('.client-head .btn');
    await checkEnglish('.medical-history summary');
    await checkEnglish('.client-stats');
    await checkEnglish('.rail-head');
    await checkEnglish('label[for="clientSearch"]');
    await checkEnglish('.tabs');
    await checkEnglish('.filters');
    await checkEnglish('#tabBody');
    assert.equal(await page.locator('#tab-sessions').innerText(), 'Rehabilitation records (0)');
    await page.locator('#viewMenuButton').click(); await checkEnglish('#viewMenu'); await page.keyboard.press('Escape');
    await page.locator('#clientSearch').fill('no matching patient');
    assert.equal(await page.locator('#clientList').innerText(), 'No matching clients. Change your search text.');
    await page.locator('#clientSearch').fill('');
    assert.equal(await page.locator('.client-btn').count(), 1);
    assert.equal(await page.locator('.client-stats dd').nth(1).innerText(), 'No records yet');
    await choose('zh-TW');
    assert.equal(await page.locator('.client-stats dt').first().innerText(), '紀錄總數');
    assert.equal(await page.locator('.client-summary .eyebrow').innerText(), '個案');
    assert.equal(await page.locator('#tab-sessions').innerText(), '復健紀錄 (0)');
    assert.equal(await page.locator('.client-head h2').innerText(), '姓名');
    await choose('en');
    await checkEnglish('#tabBody');
    const client = await page.evaluate(() => JSON.stringify(cur()));
    await page.locator('#tab-outcomes').click(); await checkEnglish('#tabBody');
    await page.locator('#tab-plan').click();
    await checkEnglish('#planEdit'); await checkEnglish('#trainingEdit');
    await action('new-session').click();
    await checkEnglish('#soapForm');
    // A training test record added by hand: its card, result boxes and folded settings are in English.
    await page.locator('#tx-ocular-on').check();
    await page.locator('#tx-ocular-run-item').selectOption('fixation'); await action('run-add').click();
    const settings = page.locator('#tx-ocular-runs details.settings');
    await settings.locator('summary').click();
    assert.equal(await settings.locator('summary').innerText(), 'Test settings');
    assert.match(await page.locator('#tx-ocular-runs .run h5').innerText(), /^Fixation \(OcuTrain FIXATION\)/);
    assert.deepEqual(await settings.locator('select').first().locator('option').allTextContents(), ['Please select', 'Evaluation', 'Predictable', 'Random']);
    await checkEnglish('#tx-ocular');
    await page.locator('#tx-ocular-runs [data-action="run-del"]').click();
    assert.equal(await page.locator('#tx-ocular-runs .run').count(), 0);
    await page.locator('#tx-ocular-on').uncheck();
    await action('plan-add').click(); await checkEnglish('.modal');
    await page.locator('#item-field-0-type').selectOption('number'); await checkEnglish('.modal');
    for (const width of [320, 768, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth), true);
    }
    await page.locator('#item-field-0-type').selectOption('select'); await checkEnglish('.modal');
    await page.locator('[data-item-action="cancel"]').click();
    await action('training-add').click(); await checkEnglish('.modal');
    await page.locator('[data-item-action="cancel"]').click();
    console.log('PASS: English editor, progress, item settings and all field-type dialogs contain translated built-in labels');
    const note = '儲存、主觀描述與個案原文 / original clinical note';
    await page.locator('#s-subj').fill(note);
    await page.locator('#s-fb').fill('回饋原文');
    await page.locator('#sy-' + await page.evaluate(() => editing.sym[0].id) + '-ef').fill('0');
    await page.locator('#tx-ocular-on').check();
    await page.locator('#tx-ocular-a0').check();
    await page.locator('#tx-ocular-notes').fill('觀察原文');
    await choose('zh-TW');
    assert.equal(await page.locator('#s-subj').inputValue(), note);
    assert.equal(await page.locator('#s-fb').inputValue(), '回饋原文');
    assert.equal(await page.locator('#tx-ocular-a0').isChecked(), true);
    assert.equal(await page.locator('#tx-ocular-notes').inputValue(), '觀察原文');
    assert.equal(await page.evaluate(() => dirty), true);
    await action('save-session').click(); await page.waitForSelector('.sess');
    const originalNames = await page.evaluate(async () => fileNames(await languageRoot.getDirectoryHandle('TEST-LANGUAGE')));
    const record = await page.evaluate(() => JSON.stringify(sessions[0]));
    await choose('en');
    assert.equal(await page.locator('#toolbarSave [data-label]').innerText(), 'Save');
    assert.match(await page.locator('#fileMenu [data-action="save-session"] [data-label]').textContent(), /Save.*CSV.*PDF/i);
    assert.equal(await page.evaluate(() => JSON.stringify(cur())), client);
    assert.equal(await page.evaluate(() => JSON.stringify(sessions[0])), record);
    assert.doesNotMatch(await page.locator('.sess .when').first().innerText(), /times/);
    assert.equal(await page.locator('.client-head h2').innerText(), '姓名');
    await checkEnglish('.section-heading');
    await checkEnglish('.client-stats');
    await checkEnglish('.chart');
    await choose('zh-TW');
    assert.equal(await page.locator('#recordHistoryHeading').innerText(), '紀錄歷程');
    assert.equal(await page.locator('#tab-sessions').innerText(), '復健紀錄 (1)');
    assert.equal(await page.evaluate(() => JSON.stringify(sessions[0])), record);
    await choose('en');
    assert.equal(await page.locator('#recordHistoryHeading').innerText(), 'Record history');
    assert.equal(await page.evaluate(() => JSON.stringify(cur())), client);
    await page.locator('#tab-sessions').click();
    await action('open-session').click();
    assert.equal(await page.locator('#s-subj').inputValue(), note);
    await page.locator('#s-date').fill('2026-11-02');
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.deepEqual(await page.evaluate(async () => fileNames(await languageRoot.getDirectoryHandle('TEST-LANGUAGE'))), originalNames);
    console.log('PASS: Language changes preserve drafts, clinical text, checkbox values, client data and existing filenames');

    await page.locator('#filter-from').fill('2099-01-01'); await page.locator('#filter-from').dispatchEvent('change');
    await checkEnglish('#tabBody'); await checkEnglish('#filterCount');
    assert.equal(await page.locator('#tabBody h3').innerText(), 'No matching rehabilitation records');
    await choose('zh-TW');
    assert.equal(await page.locator('#tabBody h3').innerText(), '沒有符合條件的復健紀錄');
    await choose('en'); await action('clear-filters').click();
    await page.locator('#tab-plan').click();
    await page.evaluate(() => { window.languagePlan = cur().plan; window.languageTraining = cur().trainingPlan; cur().plan = []; cur().trainingPlan = []; renderPlan(); });
    await checkEnglish('#planEdit');
    assert.match(await page.locator('#planEdit').innerText(), /^No items yet/);
    await choose('zh-TW');
    assert.match(await page.locator('#planEdit').innerText(), /^尚無項目/);
    await page.evaluate(() => { cur().plan = languagePlan; cur().trainingPlan = languageTraining; renderPlan(); });
    await choose('en');
    console.log('PASS: Client summary, roster search, tabs, record history, accessible names and empty states are bilingual');

    await page.locator('#tab-outcomes').click();
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      for (const width of [320, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        const gaps = await page.locator('#tabBody > .panel').evaluateAll(panels => panels.slice(1).map((panel, i) => panel.getBoundingClientRect().top - panels[i].getBoundingClientRect().bottom));
        assert.ok(gaps.length > 0, 'Saved symptoms and training produce multiple progress panels');
        assert.ok(gaps.every(gap => gap === 20), `${locale} at ${width}px: progress panel gaps ${gaps}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      }
      await page.screenshot({ path: path.join(output, `language-${locale}-progress.png`), fullPage: true });
    }
    await page.locator('#tab-sessions').click();
    console.log('PASS: Progress panels have 20px spacing in both languages at 320/768/1280px');

    await action('new-session').click();
    await page.locator('#s-visit').selectOption('absent');
    const reason = await page.evaluate(() => ABSENCE_REASONS[0]);
    await page.locator('#abs-reason').selectOption(reason);
    await choose('zh-TW'); await choose('en');
    assert.equal(await page.locator('#abs-reason').inputValue(), reason);
    assert.doesNotMatch(await page.locator('#abs-reason option:checked').innerText(), /\p{Script=Han}/u);
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.equal(await page.evaluate(() => sessions.find(s => s.visit === 'absent').absence.reason), reason);
    await checkEnglish('.sess:has(.chip.bad)');
    assert.equal(await page.evaluate(reason => noteText(cur(), sessions.find(s => s.visit === 'absent')).includes(reason), reason), false);
    console.log('PASS: Localized absence choices keep canonical stored values across language changes');

    for (const locale of ['en', 'zh-TW']) {
      await choose(locale);
      for (const width of [320, 360, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} at ${width}px`);
      }
      await page.screenshot({ path: path.join(output, `language-${locale}.png`), fullPage: true });
    }
    assert.deepEqual(errors, []);
    console.log('PASS: Both languages fit 320/360/768/1280px without browser errors');

    const blocked = await browser.newContext();
    await blocked.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
    const blockedPage = await blocked.newPage();
    await blockedPage.goto(url); await blockedPage.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    await blockedPage.locator('#languageSelect').selectOption('en');
    assert.equal(await blockedPage.locator('html').getAttribute('lang'), 'en');
    assert.doesNotMatch(await blockedPage.locator('.toast').innerText(), /\p{Script=Han}/u);
    await blocked.close();
    console.log('PASS: Language switching works when browser preference storage is blocked');
  } finally {
    await browser.close(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
