const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const { openTraining, completeTraining } = require('./training-modal.cjs');
const { openAssessment, completeAssessment, selectAssessment } = require('./lib/assessments.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const withoutHelp = node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
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
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      const en = locale === 'en';
      assert.equal(await page.locator('.connect-intro h2').innerText(), en ? 'Start keeping records' : '開始記錄病歷');
      assert.equal(await action('pick-folder').innerText(), en ? 'I already have a record folder' : '我已經有病歷資料夾');
      assert.equal(await action('use-default').innerText(), en ? 'First time: help me set up' : '第一次使用，幫我建立');
      assert.equal(await page.locator('.connect-advanced').evaluate(node => node.open), false);
      await page.locator('.connect-advanced > summary').click();
      assert.equal(await page.locator('.storage-preview').isVisible(), true);
      if (en) await checkEnglish('.storage-connect');
      await page.locator('.connect-advanced > summary').click();
      await page.evaluate(() => {
        pendingHandle = { name: 'Synthetic remembered folder' };
        localStorage.setItem(BROWSER_KEY, JSON.stringify({ clients: { pending: { id: 'pending', name: 'Synthetic pending client' } }, sessions: { pending: { saved: { id: 'saved', updated: new Date().toISOString() } } } }));
        renderConnect();
      });
      assert.equal(await page.locator('.connect-intro b').count(), 1);
      assert.match(await action('reconnect').innerText(), /Synthetic remembered folder/);
      if (en) await checkEnglish('.storage-connect');
      await page.evaluate(() => { localStorage.removeItem(BROWSER_KEY); pendingHandle = null; renderConnect(); });
      await page.locator('#exportMenuButton').click();
      assert.equal(await page.locator('#lastBackupStatus').innerText(), en ? 'No backup yet' : '尚未備份');
      if (en) await checkEnglish('#exportMenu');
      await page.keyboard.press('Escape');
      for (const name of ['help-start', 'help-shortcuts']) {
        await page.locator('#helpMenuButton').click();
        if (en) await checkEnglish('#helpMenu');
        await page.locator(`#helpMenu [data-action="${name}"]`).click();
        assert.equal(await page.locator('.modal h3').innerText(), en ? (name === 'help-start' ? 'Quick start' : 'Keyboard shortcuts') : (name === 'help-start' ? '快速上手' : '鍵盤快速鍵'));
        if (en) await checkEnglish('.modal');
        await page.keyboard.press('Escape');
      }
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      assert.equal(await page.locator('.browser-save-guidance').isVisible(), true);
      if (en) await checkEnglish('.welcome');
      await page.evaluate(() => { store = null; renderConnect(); });
      await action('use-default').click();
      await page.locator('#exportMenuButton').click();
      const setupDownload = page.waitForEvent('download'); await action('export-all').click(); await setupDownload;
      await page.locator('#exportMenuButton').click();
      assert.match(await page.locator('#lastBackupStatus').innerText(), en ? /Last backup: 0 days ago/ : /上次備份：0 天前/);
      if (en) await checkEnglish('#exportMenu');
      await page.keyboard.press('Escape');
      await page.evaluate(() => { store = null; renderConnect(); });
    }
    console.log('PASS: First-use wording, expanded advanced details, pending records/reconnect, browser-mode guidance, Help dialogs and absent backup status are bilingual');
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
    await page.locator('#viewMenuButton').click(); await action('global-settings').click();
    await page.waitForSelector('#appSettingsForm');
    await checkEnglish('.modal');
    assert.equal(await page.locator('#appSettingsForm [name="requiredField"]').count(), 14);
    assert.equal(await page.locator('#languageSelect').isDisabled(), true);
    await page.keyboard.press('Escape');
    await page.waitForSelector('#appSettingsForm', { state: 'detached' });
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
    await checkEnglish('.client-identity > .eyebrow');
    await checkEnglish('.client-diagnosis .eyebrow');
    const patientActions = await page.locator('.client-head .btn').evaluateAll(buttons => buttons.map(button => [button.textContent, button.title, button.getAttribute('aria-label') || ''].join(' ')));
    assert.ok(patientActions.length >= 2 && patientActions.every(text => !/\p{Script=Han}/u.test(text)), 'Patient actions are translated');
    await checkEnglish('.medical-history summary');
    await checkEnglish('.client-stats');
    await checkEnglish('label[for="clientSearch"]');
    await checkEnglish('.tabs');
    assert.equal(await page.locator('#tab-dashboard').getAttribute('aria-selected'), 'true');
    await checkEnglish('#patientDashboard');
    assert.equal(await page.locator('.clinical-map-head').count(), 0, 'Clinical sections use their own headings instead of a horizontal table header');
    assert.equal(await page.locator('.client-head [data-action="new-session"]').innerText(), 'New record');
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      const en = locale === 'en';
      assert.equal(await page.locator('aside, #railToggle').count(), 0);
      const searchText = await page.locator('#clientSearch').evaluate(node => [node.placeholder, node.getAttribute('aria-label') || ''].join(' '));
      assert.equal(/\p{Script=Han}/u.test(searchText), !en, 'Search accessible text follows the selected language');
      await page.locator('#clientSearch').fill('no matching patient');
      assert.equal(await page.locator('#clientSearchPopup').isVisible(), true);
      assert.equal(await page.locator('#clientSearch').getAttribute('aria-expanded'), 'true');
      if (en) await checkEnglish('#clientSearchPopup');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#clientSearchPopup').isHidden(), true);
      await page.locator('#clientSearch').fill('');
    }
    await choose('zh-TW');
    assert.equal(await page.locator('#tab-dashboard').innerText(), '病人總覽');
    await choose('en');
    assert.equal(await page.locator('#tab-dashboard').innerText(), 'Patient dashboard');
    await page.locator('#tab-sessions').click();
    await checkEnglish('.filters');
    await checkEnglish('#tabBody');
    assert.equal(await page.locator('#tab-sessions').innerText(), 'Rehabilitation records (0)');
    await page.locator('#viewMenuButton').click(); await checkEnglish('#viewMenu'); await page.keyboard.press('Escape');
    await page.locator('#clientSearch').fill('no matching patient');
    assert.equal(await page.locator('#clientList').innerText(), 'No matching clients. Change your search text.');
    await page.locator('#clientSearch').fill('');
    assert.equal(await page.locator('.client-btn').count(), 1, 'An empty focused query offers the recently opened client');
    assert.equal(await page.locator('#clientSearchStatus').innerText(), 'Recently opened');
    assert.equal(await page.locator('.client-stats dd').first().innerText(), 'No records yet');
    await choose('zh-TW');
    assert.equal(await page.locator('.client-stats dt').first().innerText(), '最近紀錄');
    assert.equal(await page.locator('.client-identity > .eyebrow').innerText(), '個案');
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
    const shortIds = await page.evaluate(() => SHORT_TERM_ITEMS.map(item => item.id));
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      const menuText = (await page.locator('.command-menu button').allTextContents()).join('\n');
      assert.doesNotMatch(menuText, /…|\.\.\./, 'Menu labels have no trailing ellipses');
      for (const button of await page.locator('.command-menu [data-action="new-client"], .command-menu [data-action="new-session"], #patientSearch [data-action="new-client"]').all()) {
        assert.equal(await button.locator('.add-icon[aria-hidden="true"] path[d="M8 2v12M2 8h12"]').count(), 1);
      }
      assert.equal(await page.locator('.short-guide').count(), 0);
      assert.deepEqual(await page.locator('.assessment-period > .spread > h3').allTextContents(), locale === 'en' ? ['Short-term outcomes', 'Long-term assessments'] : ['短期成效', '長期評估']);
      assert.equal(await page.locator('#assess-short .pick input').count(), 14);
      assert.equal(await page.locator('#assess-long [id^="ac-st_"]').count(), 0);
      assert.equal(await page.locator('#assess-short #symWrap').count(), 0);
      assert.equal(await page.locator('.soap-sec').nth(1).locator('#visualSymptoms').count(), 1, 'Before-test symptoms are at the assessment entry');
      assert.equal(await page.locator('#assess-long #symWrap').count(), 0);
      assert.equal(await page.locator('#visualSymptoms h4').evaluate(withoutHelp), locale === 'en' ? 'Symptom self-ratings (0 to 10)' : '症狀自評（0 至 10）');
      assert.doesNotMatch(await page.locator('#soapForm').innerText(), /\bNRS\b/);
      assert.deepEqual(await page.locator('#assess-long [data-function="visual"] .pick').allTextContents(), locale === 'en'
        ? ['Distance visual acuity', 'Near visual acuity', 'Refraction', 'Visual field', 'Contrast sensitivity', 'Color vision', 'Stereopsis', 'Saccade assessment', 'Fixation assessment', 'Pursuit assessment', 'Vestibulo-ocular reflex assessment', 'Convergence assessment', 'Medical record review', 'Optometry record']
        : ['遠距離視力', '近距離視力', '屈光', '視野', '對比敏感度', '色覺', '立體視覺', '跳視評估', '凝視評估', '追視評估', '前庭眼反射評估', '輻輳評估', '病歷資料', '視光紀錄']);
      assert.equal(await page.locator('#assess-long [data-function="functional"] input[id^="ac-ufov_"]').count(), 3);
      assert.equal(await page.locator('#remediation > .spread > h4').evaluate(withoutHelp), locale === 'en' ? 'Remediation' : '復能');
      assert.equal(await page.locator('.soap-sec').nth(3).getByRole('heading', { name: locale === 'en' ? 'Rehabilitation item' : '復健項目', exact: true }).count(), 0);
      const missingIcons = await page.locator('#soapForm button').evaluateAll(buttons => buttons.filter(button => /新增|加入活動|^(?:Add|New)\b/.test(button.textContent.trim()) && !button.querySelector('.add-icon[aria-hidden="true"]')).map(button => button.textContent));
      assert.deepEqual(missingIcons, []);
      for (const id of shortIds) {
        await page.locator('#ac-' + id).check();
        const panel = page.locator('#assessmentResultForm');
        assert.equal(await panel.locator('.short-stage').count(), 5);
        for (const summary of await panel.locator('.short-stage > summary').all()) await summary.click();
        assert.match(await panel.locator('legend').first().innerText(), locale === 'en' ? /Pre 1/ : /訓練前 1/);
        if (locale === 'en') await checkEnglish('.modal');
        await completeAssessment(page);
        if (locale === 'en') await checkEnglish('#as-' + id);
        await page.locator('#ac-' + id).uncheck();
      }
      if (locale === 'en') await checkEnglish('#assessList');
      if (locale === 'en') await checkEnglish('.workflow-controls');
    }
    console.log('PASS: Separate short/long groups, all 14 short-term templates, five measurement stages and accessible field labels support both languages without in-record guidance');
    // Clinical flow: mode-specific lists, the legacy empty choice, PEO labels and both themes.
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      await page.evaluate(() => { editing = collectSession(); delete editing.mode; renderEditor(); });
      assert.equal(await page.locator('#s-mode option:checked').innerText(), locale === 'en' ? 'Not specified' : '未指定');
      assert.deepEqual(await page.locator('.soap-sec .sec-title > h3').evaluateAll(nodes => nodes.map(node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; })), locale === 'en'
        ? ['Subjective', 'Assessment', 'PEO clinical reasoning', 'Intervention and plan'] : ['主觀描述', '評估', 'PEO 臨床推理', '介入與計畫']);
      assert.deepEqual(await page.locator('#assess-long .assessment-group > h4').allTextContents(), locale === 'en' ? ['Visual function', 'Functional vision', 'Daily living function'] : ['視覺功能', '功能性視覺', '日常生活功能']);
      for (const id of ['va', 'self_report', 'copm']) await selectAssessment(page, id);
      await page.locator('#adaptationPicks [data-strategy="workstation_setup"]').check();
      for (const mode of ['', 'inperson', 'telerehab']) {
        await page.locator('#s-mode').selectOption(mode);
        assert.equal(await page.locator('#adaptationPicks [data-strategy="workstation_setup"]').isChecked(), true);
        if (locale === 'en') await checkEnglish('#soapForm');
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [320, 360, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            const layout = await page.evaluate(() => ({ fits: document.documentElement.scrollWidth <= innerWidth, documentWidth: document.documentElement.scrollWidth, viewportWidth: innerWidth,
              overflow: [...document.querySelectorAll('body *')].filter(node => node.getClientRects().length && !node.closest('.scroll, .sr-only')).map(node => ({ tag: node.tagName, id: node.id, className: node.className?.baseVal ?? node.className,
                right: node.getBoundingClientRect().right, width: node.getBoundingClientRect().width, text: node.textContent.slice(0, 60) })).filter(node => node.right > innerWidth).slice(0, 25) }));
            if (!layout.fits) {
              await fs.writeFile(path.join(output, 'language-overflow.json'), JSON.stringify({ locale, mode, theme, width, ...layout }, null, 2));
              await page.screenshot({ path: path.join(output, 'language-overflow.png'), fullPage: true });
            }
            assert.equal(layout.fits, true, `${locale} ${mode || 'unspecified'} ${theme} editor at ${width}px: ${JSON.stringify(layout.overflow)}`);
            const sizes = await page.locator('#s-mode, #s-person, #s-environment, #s-occupation, #adaptationPicks .pick, #compensationPicks .pick, #assessList .pick, #as-va input, #as-va select, #as-self_report input, #as-self_report textarea').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
            assert.ok(sizes.every(size => size.width >= 44 && size.height >= 44), 'Clinical flow controls retain 44px touch targets');
            if (mode === 'telerehab' && width === 360) {
              for (const [section, name] of [[1, 'assessment-groups'], [2, 'peo'], [3, 'intervention']]) await page.locator('.soap-sec').nth(section).screenshot({ path: path.join(output, `language-${locale}-${name}-${theme}-360.png`) });
            }
          }
          if (mode === 'telerehab') await page.screenshot({ path: path.join(output, `language-${locale}-clinical-${theme}-1280.png`), fullPage: true });
        }
      }
    }
    await page.locator('#adaptationPicks [data-strategy="workstation_setup"]').uncheck();
    for (const id of ['va', 'self_report', 'copm']) await page.locator('#ac-' + id).uncheck();
    await page.locator('#s-mode').selectOption('inperson');
    await page.evaluate(() => document.documentElement.dataset.theme = 'light');
    console.log('PASS: Bilingual PEO/intervention sections, unspecified/in-person/telerehab modes and retained cross-mode strategies fit 320/360/768/1280px in light and dark themes');
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      await page.locator('#tx-ocular-on').check();
      assert.equal(await page.locator('#eyeDotRecords').isVisible(), false);
      await page.locator('#tx-ocular-acts [data-act="EyeDot Trainer"]').check();
      assert.equal(await page.locator('#eyeDotRecords').isVisible(), true);
      await action('ed-add').click();
      if (locale === 'en') await checkEnglish('#eyeDotRecords');
      await page.locator('#edWrap [data-action="ed-del"]').click();
      await page.locator('#tx-ocular-acts [data-act="EyeDot Trainer"]').uncheck();
      await completeTraining(page);
      await page.locator('#tx-ocular-on').uncheck();
      await page.locator('#ac-reading_speed').check();
      await page.locator('[data-action="measure-add"][data-id="reading_speed"]').click();
      assert.equal(await page.locator('#measure-name').isVisible(), true);
      if (locale === 'en') await checkEnglish('.modal');
      await page.locator('#measure-followup').check();
      if (locale === 'en') await checkEnglish('.modal');
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#assessmentResultForm').isVisible(), true);
      await page.locator('#af-reading_speed-0').fill('-1');
      await page.locator('#assessment-done').click();
      assert.equal(await page.locator('#assessment-error').innerText(), locale === 'en' ? 'Check the indicated fields before completing the assessment.' : '請核對標示的欄位後再完成填寫。');
      if (locale === 'en') await checkEnglish('.modal');
      await page.locator('#af-reading_speed-0').fill('0'); await completeAssessment(page);
      assert.equal(await page.locator('#as-reading_speed input, #as-reading_speed select, #as-reading_speed textarea').count(), 0);
      if (locale === 'en') await checkEnglish('#as-reading_speed');
      await page.locator('#ac-reading_speed').uncheck();
      for (const period of ['short', 'long']) {
        await page.locator(`[data-action="plan-add"][data-period="${period}"]`).click();
        assert.equal(await page.locator('#item-period').inputValue(), period);
        assert.deepEqual(await page.locator('#item-category option').allTextContents(), locale === 'en' ? ['Visual function', 'Functional vision', 'Motor function', 'Daily living function', 'Cognitive function'] : ['視覺功能', '功能性視覺', '動作功能', '日常生活功能', '認知功能']);
        const optgroups = await page.locator('#item-base optgroup').evaluateAll(nodes => nodes.map(node => node.label));
        assert.deepEqual(optgroups, locale === 'en' ? ['Visual function · Short-term measures', 'Visual function · Long-term measures', 'Functional vision · Short-term measures', 'Functional vision · Long-term measures', 'Motor function · Short-term measures', 'Daily living function · Long-term measures', 'Cognitive function · Short-term measures'] : ['視覺功能 · 短期指標', '視覺功能 · 長期指標', '功能性視覺 · 短期指標', '功能性視覺 · 長期指標', '動作功能 · 短期指標', '日常生活功能 · 長期指標', '認知功能 · 短期指標']);
        if (locale === 'en') await checkEnglish('.modal');
        await page.keyboard.press('Escape');
      }
      assert.equal(await page.locator('#adaptation-new').getAttribute('placeholder'), locale === 'en' ? 'Enter plan name' : '輸入方案名稱');
      assert.equal(await page.locator('#sessionResponse h4').innerText(), locale === 'en' ? 'Session response' : '本次反應');
      if (locale === 'en') await checkEnglish('#sessionResponse');
    }
    console.log('PASS: Selectable EyeDot records, measure dialog, custom-plan entry and linked session response support both languages');
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
    await completeTraining(page);
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
    await completeTraining(page);
    await choose('zh-TW');
    assert.equal(await page.locator('#s-subj').inputValue(), note);
    assert.equal(await page.locator('#s-fb').inputValue(), '回饋原文');
    await openTraining(page, 'ocular');
    assert.equal(await page.locator('#tx-ocular-a0').isChecked(), true);
    assert.equal(await page.locator('#tx-ocular-notes').inputValue(), '觀察原文');
    await completeTraining(page);
    assert.equal(await page.evaluate(() => dirty), true);
    await action('save-session').click(); await page.waitForSelector('.sess');
    const originalNames = await page.evaluate(async () => fileNames(await languageRoot.getDirectoryHandle('TEST-LANGUAGE')));
    const record = await page.evaluate(() => JSON.stringify(sessions[0]));
    await choose('en');
    assert.equal(await page.locator('#toolbarSave [data-label]').innerText(), 'Save');
    assert.equal(await page.locator('#fileMenu [data-action="save-session"] [data-label]').textContent(), 'Save record');
    assert.match(await page.locator('#fileMenu [data-action="save-session"]').getAttribute('title'), /Save.*CSV.*PDF/i);
    assert.equal(await page.evaluate(() => JSON.stringify(cur())), client);
    assert.equal(await page.evaluate(() => JSON.stringify(sessions[0])), record);
    assert.doesNotMatch(await page.locator('.sess .session-meta').first().innerText(), /times/);
    assert.equal(await page.locator('.client-head h2').innerText(), '姓名');
    await checkEnglish('.section-heading');
    await checkEnglish('.client-stats');
    await checkEnglish('.chart');
    await choose('zh-TW');
    assert.equal(await page.locator('#recordHistoryHeading').evaluate(withoutHelp), '紀錄歷程');
    assert.equal(await page.locator('#tab-sessions').innerText(), '復健紀錄 (1)');
    assert.equal(await page.evaluate(() => JSON.stringify(sessions[0])), record);
    await choose('en');
    assert.equal(await page.locator('#recordHistoryHeading').evaluate(withoutHelp), 'Record history');
    assert.equal(await page.evaluate(() => JSON.stringify(cur())), client);
    await page.locator('#tab-sessions').click();
    await action('open-session').click();
    assert.equal(await page.locator('#s-subj').inputValue(), note);
    await page.locator('#s-date').fill('2026-11-02');
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.deepEqual(await page.evaluate(async () => fileNames(await languageRoot.getDirectoryHandle('TEST-LANGUAGE'))), originalNames);
    console.log('PASS: Language changes preserve drafts, clinical text, checkbox values, client data and existing filenames');

    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      const en = locale === 'en';
      await page.evaluate(() => { localStorage.removeItem(BACKUP_STATUS_KEY); view = 'dashboard'; renderMain(); });
      await page.waitForSelector('#backupReminder');
      assert.equal(await page.locator('#backupReminder p').innerText(), en ? 'Records are saved in the “language-records” folder. No full backup has been saved yet. You can download a backup file.' : '病歷已存在「language-records」資料夾。尚未另存完整備份，可下載一份備份檔。');
      if (en) await checkEnglish('#backupReminder');
      await page.evaluate(() => { updateDeviceBackupStatus({ startedAt: new Date(Date.now() - 15 * BACKUP_DAY).toISOString() }); renderMain(); });
      assert.equal(await page.locator('#backupReminder p').innerText(), en ? 'Records are saved in the “language-records” folder. The last full backup is more than 14 days old. You can download a new backup file.' : '病歷已存在「language-records」資料夾。上次完整備份已超過 14 天，可再下載一份備份檔。');
      if (en) await checkEnglish('#backupReminder');
      await page.locator('#backupReminder [data-action="backup-options"]').click();
      assert.match(await page.locator('#lastBackupStatus').innerText(), en ? /Last backup: 15 days ago/ : /上次備份：15 天前/);
      if (en) await checkEnglish('#exportMenu');
      await page.keyboard.press('Escape');
      await action('dismiss-backup-reminder').click();
      assert.equal(await page.locator('#backupReminder').count(), 0);
      await page.locator('#exportMenuButton').click();
      const plainDownload = page.waitForEvent('download'); await action('export-all').click(); await plainDownload;
      await page.waitForFunction(() => Date.now() - stamp(deviceBackupStatus().startedAt) < BACKUP_DAY);
      if (en) await checkEnglish('#toastHost');
      await page.locator('#exportMenuButton').click();
      assert.match(await page.locator('#lastBackupStatus').innerText(), en ? /Last backup: 0 days ago/ : /上次備份：0 天前/);
      await page.evaluate(() => { updateDeviceBackupStatus({ startedAt: new Date(Date.now() - BACKUP_DAY).toISOString() }); renderBackupStatus(); });
      assert.match(await page.locator('#lastBackupStatus').innerText(), en ? /Last backup: 1 day ago/ : /上次備份：1 天前/);
      if (en) await checkEnglish('#exportMenu');
      await action('export-encrypted').click();
      await page.locator('#backupPassword').fill('Synthetic language backup password');
      await page.locator('#backupPasswordConfirm').fill('Synthetic language backup password');
      const encryptedDownload = page.waitForEvent('download'); await page.locator('#backupPasswordForm [type="submit"]').click(); await encryptedDownload;
      await page.waitForFunction(() => !savingSession);
      if (en) await checkEnglish('#toastHost');
      await page.locator('#exportMenuButton').click();
      if (en) await checkEnglish('#exportMenu');
      await page.keyboard.press('Escape');
      await page.locator('#fileMenuButton').click();
      for (const selector of ['[data-action="storage-settings"]', '#reloadStorage', '#copyBtn']) {
        const button = page.locator('#fileMenu ' + selector); await button.focus();
        const tooltip = page.locator('#' + await button.getAttribute('aria-describedby'));
        assert.equal(await tooltip.isVisible(), true);
        if (en) await checkEnglish('#' + await tooltip.getAttribute('id'));
      }
      await page.locator('#copyBtn').click();
      assert.equal(await page.locator('.modal h3').innerText(), en ? 'Set up a synced copy folder' : '設定同步副本資料夾');
      if (en) await checkEnglish('.modal');
      await page.keyboard.press('Escape');
      await page.evaluate(() => { copyRoot = { name: 'Synthetic synced copy' }; renderCopyBtn(); });
      await page.locator('#fileMenuButton').click(); await page.locator('#copyBtn').click();
      assert.equal(await page.locator('.modal h3').innerText(), en ? 'Synced copy folder' : '同步副本資料夾');
      if (en) await checkEnglish('.modal');
      await page.keyboard.press('Escape');
      await page.evaluate(() => { copyRoot = null; pendingCopy = { name: 'Synthetic pending copy' }; renderCopyBtn(); });
      assert.equal(await page.locator('#copyBtn').textContent(), en ? 'Reconnect synced copy folder' : '重新連接同步副本資料夾');
      if (en) await checkEnglish('#fileMenu');
      await page.evaluate(() => { pendingCopy = null; renderCopyBtn(); });
      await page.locator('#tab-sessions').click();
    }
    await choose('en');
    console.log('PASS: Purpose-first backup/list/save labels, plain/password download messages, backup age/reminder/dismissal and storage/reload/synced-copy guidance are bilingual');

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
    console.log('PASS: Client summary, header search, tabs, record history, accessible names and empty states are bilingual');

    await page.locator('#tab-outcomes').click();
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      await page.locator('#tab-dashboard').click();
      assert.deepEqual(await page.locator('#clinicalMap h4').allTextContents(), locale === 'en' ? ['Symptoms and function', 'Reasoning and evidence', 'Intervention and plan'] : ['症狀與功能', '推理與依據', '介入與計畫']);
      await page.locator('#tab-outcomes').click();
      const hint = locale === 'en' ? 'Scroll the table horizontally, or focus it and use the left and right arrow keys.' : '表格可左右捲動，或聚焦後使用左右方向鍵。';
      const scrollingTips = page.locator('#tabBody .help-tooltip').filter({ hasText: hint });
      assert.ok(await scrollingTips.count() > 0);
      for (const label of await page.locator('#tabBody .scroll[role="region"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')))) assert.ok(label.endsWith(hint), 'Table region accessible names include the translated scrolling help');
      for (const tooltip of await scrollingTips.all()) {
        const text = await tooltip.textContent();
        assert.ok(text === hint || text.endsWith('\n\n' + hint), 'The translated scrolling help appears alone or after the heading explanation in the same tooltip');
        if (locale === 'en') await checkEnglish('#' + await tooltip.getAttribute('id'));
      }
      assert.ok((await page.locator('#tabBody').innerText()).includes('觀察原文'), 'Clinical observations retain their original language');
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
    assert.equal(await page.locator('#s-mode').isVisible(), true, 'Service mode follows the visible basic information for absent visits');
    const reason = await page.evaluate(() => ABSENCE_REASONS[0]);
    await page.locator('#abs-reason').selectOption(reason);
    await choose('zh-TW'); await choose('en');
    assert.equal(await page.locator('#abs-reason').inputValue(), reason);
    assert.doesNotMatch(await page.locator('#abs-reason option:checked').innerText(), /\p{Script=Han}/u);
    await action('save-session').click(); await page.waitForSelector('.sess');
    assert.equal(await page.evaluate(() => sessions.find(s => s.visit === 'absent').absence.reason), reason);
    const absenceId = await page.evaluate(() => sessions.find(s => s.visit === 'absent').id);
    await checkEnglish(`.sess:has([data-action="open-session"][data-id="${absenceId}"])`);
    assert.equal(await page.evaluate(reason => noteText(cur(), sessions.find(s => s.visit === 'absent')).includes(reason), reason), false);
    console.log('PASS: Localized absence choices keep canonical stored values across language changes');

    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      await action('new-session').click();
      await page.evaluate(() => {
        const previous = sessions.find(s => s.visit !== 'absent');
        previous.peo = { environment: 'Synthetic room conditions', occupation: 'Synthetic work goal' };
        previous.plan = 'Synthetic follow-up plan';
        renderEditor();
      });
      assert.equal(await page.locator('[data-action="carry-context"]').isVisible(), true);
      await page.locator('[data-action="carry-context"]').click();
      await page.locator('#carryContextForm [type="submit"]').click();
      assert.equal(await page.locator('#carry-error').isVisible(), true);
      if (locale === 'en') await checkEnglish('.modal');
      await page.locator('#carry-cancel').click();
      await selectAssessment(page, 'st_npc'); await openAssessment(page, 'npc');
      await page.locator('[data-measurement-ref="npc"]').selectOption('st_npc/pre');
      if (locale === 'en') await checkEnglish('.modal .measurement-reference');
      await completeAssessment(page);
      await page.locator('#tx-ocular-on').check();
      await page.locator('#tx-ocular-acts [data-act="Fixation"]').check();
      if (locale === 'en') await checkEnglish('#tx-ocular-scores');
      const trainingHelp = page.locator('#trainingResultForm [data-help]:visible').first(); await trainingHelp.focus();
      if (locale === 'en') await checkEnglish('#' + await trainingHelp.getAttribute('aria-describedby'));
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#trainingResultForm').isVisible(), true);
      await page.locator('#tx-ocular-diff').fill('11'); await page.locator('#training-done').click();
      assert.equal(await page.locator('#training-error').innerText(), locale === 'en' ? 'Check the indicated fields before completing the rehabilitation item.' : '請核對標示的欄位後再完成復健紀錄。');
      if (locale === 'en') await checkEnglish('#trainingResultForm');
      await page.locator('#tx-ocular-diff').fill('0'); await completeTraining(page);
      if (locale === 'en') await checkEnglish('#tx-summary-ocular');
      await page.locator('#s-subj').fill('Synthetic problem source');
      await page.locator('#useSubjectiveProblem').click();
      if (locale === 'en') await checkEnglish('#clinicalLinks');
      await page.evaluate(() => {
        editing = collectSession(); const link = editing.clinicalLinks.at(-1);
        link.evidence.push('historical_missing_assessment'); link.interventions.push('ocular_sol'); renderEditor();
      });
      const sourceLink = page.locator('[data-clinical-link]').last();
      for (const details of await sourceLink.locator(':scope > details').all()) await details.locator('summary').click();
      const performedEvidence = await page.evaluate(() => assessmentItems(cur(), collectSession()).find(item => collectSession().assess?.[item.id]?.done)?.id);
      assert.ok(performedEvidence, 'The bilingual fixture has a performed assessment');
      assert.equal(await sourceLink.locator(`[data-clinical="evidence"][value="${performedEvidence}"]`).locator('..').locator('[data-evidence-state]').innerText(), locale === 'en' ? '✓ Assessed this visit' : '✓ 本次已施測');
      assert.equal(await sourceLink.locator('[data-clinical="evidence"][value="npc"]').locator('..').locator('[data-evidence-state]').count(), 1);
      const unperformedMarkers = await page.evaluate(() => [...document.querySelectorAll('[data-clinical="evidence"]')].filter(input => !collectSession().assess?.[input.value]?.done && input.parentElement.querySelector('[data-evidence-state]')).length);
      assert.equal(unperformedMarkers, 0);
      assert.equal(await sourceLink.locator('[data-legacy="interventions"] h4').innerText(), locale === 'en' ? 'Items from previous records' : '先前紀錄的項目');
      if (locale === 'en') await checkEnglish('#clinicalLinks');
      await sourceLink.locator('[data-clinical="interventions"][value="rehab:periph"]').check();
      assert.equal(await page.locator('#trainingResultForm').count(), 0);
      assert.equal(await page.locator('#tx-summary-periph .assessment-empty').innerText(), locale === 'en' ? 'No results recorded. Choose Edit to fill them in.' : '尚未填寫結果，可選擇「編輯」補填。');
      await page.locator('#tx-periph-on').click();
      if (locale === 'en') await checkEnglish('.modal');
      assert.equal(await page.locator('.modal [data-linked-problem]').count(), 1); await page.locator('.modal [data-linked-problem]').click();
      await action('cancel-edit').click();
      if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
      await page.waitForSelector('#soapForm', { state: 'detached' });
    }
    console.log('PASS: Workflow navigation, source references, source-linked problem, context-reuse dialog and its empty-selection state are bilingual');

    for (const locale of ['en', 'zh-TW']) {
      await choose(locale);
      await page.locator('#exportMenuButton').click();
      if (locale === 'en') await checkEnglish('#exportMenu');
      await action('export-encrypted').click();
      await page.waitForSelector('#backupPasswordForm');
      if (locale === 'en') await checkEnglish('.modal');
      await page.locator('#backupPasswordForm [type="submit"]').click();
      assert.equal(await page.locator('#backupPasswordError').innerText(), locale === 'en' ? 'Enter the backup password.' : '請輸入備份密碼。');
      await page.locator('#backupPassword').fill('short');
      await page.locator('#backupPasswordForm [type="submit"]').click();
      if (locale === 'en') await checkEnglish('.modal');
      await page.locator('#backupPasswordCancel').click(); await page.waitForFunction(() => !savingSession);
      await page.evaluate(() => {
        window.languageBackupRequest = importAll({ name: 'synthetic-language.json', text: async () => JSON.stringify({ clients: [{ ...clone(cur()), sessions: [] }] }) }, true);
      });
      await page.waitForSelector('#restoreBackupForm');
      if (locale === 'en') await checkEnglish('.modal');
      assert.equal(await page.locator('#restoreBackupConfirm').isDisabled(), true);
      await page.locator('#restoreBackupOverwrite').check();
      assert.equal(await page.locator('#restoreBackupConfirm').isEnabled(), true);
      await page.locator('#restoreBackupCancel').click(); await page.evaluate(() => languageBackupRequest);
      await page.evaluate(() => {
        window.languageBackupRequest = importAll({ name: 'synthetic-empty.json', text: async () => JSON.stringify({ clients: [] }) }, true);
      });
      await page.waitForSelector('#restoreBackupForm');
      if (locale === 'en') await checkEnglish('.modal');
      assert.equal(await page.locator('#restoreBackupConfirm').isDisabled(), true);
      await page.keyboard.press('Escape'); await page.evaluate(() => languageBackupRequest);
      await page.locator('#tab-sessions').click();
      if (locale === 'en') await checkEnglish('.filters');
      await page.locator('#filter-text').fill('no synthetic record matches this query');
      if (locale === 'en') await checkEnglish('#tabBody');
      assert.equal(await page.locator('.sess').count(), 0);
      await page.locator('[data-action="clear-filters"]').first().click();
    }
    console.log('PASS: Record search, encrypted backup menu/password/validation and restore count/conflict/empty states are bilingual');

    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      await page.locator('#clientSearch').fill(''); await page.locator('#clientSearch').focus();
      assert.equal(await page.locator('#clientSearchStatus').innerText(), locale === 'en' ? 'Recently opened' : '最近開啟');
      if (locale === 'en') await checkEnglish('#clientSearchStatus');
      await page.keyboard.press('Escape');
      await action('new-session').click(); await page.locator('#s-subj').fill('Synthetic language recovery');
      await page.evaluate(async () => { keepDraftNow(); await finishBoot(); });
      assert.equal(await page.locator('.modal h3').innerText(), locale === 'en' ? 'Found an unsaved record from last time' : '找到上次沒有儲存的紀錄');
      if (locale === 'en') { await checkEnglish('.modal h3'); await checkEnglish('.modal .note'); await checkEnglish('.modal .row'); }
      await page.locator('#draftResume').click();
      assert.match(await page.locator('#workflowDirty').innerText(), locale === 'en' ? /Unsaved changes.*Safety copy kept/ : /未儲存變更.*已自動暫存/);
      assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic language recovery');
      await page.evaluate(() => showFailure(new DOMException('Synthetic internal support message', 'NotAllowedError'), ui('病歷儲存失敗'), { recordSave: true }));
      const alert = page.locator('.failure-message');
      assert.equal(await alert.getAttribute('role'), 'alert');
      if (locale === 'en') await checkEnglish('.failure-message');
      assert.equal((await alert.innerText()).includes('Synthetic internal support message'), false);
      await alert.locator('summary').click();
      if (locale === 'en') await checkEnglish('.failure-message');
      await alert.locator('[data-failure-dismiss]').click();
      await action('cancel-edit').click(); await page.locator('#askYes').click();
      await page.waitForSelector('#soapForm', { state: 'detached' });
    }
    console.log('PASS: Draft recovery, safety-copy status, persistent alert/guidance/details/reconnect/dismiss and recent clients are bilingual');

    for (const locale of ['en', 'zh-TW']) {
      await choose(locale);
      for (const width of [320, 360, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} at ${width}px`);
      }
      await page.screenshot({ path: path.join(output, `language-${locale}.png`), fullPage: true });
    }
    await page.evaluate(async () => {
      store = localStore();
      await store.saveClient({ id: 'language-browser-client', name: 'Synthetic browser client', ref: 'TEST-BROWSER-REMINDER', plan: newClientPlan(), trainingPlan: clone(TRAIN) });
      await store.saveSession('language-browser-client', { id: 'language-browser-session', date: '2026-11-12', visit: 'treatment', num: 1, sym: [], assess: {}, training: {}, subjective: 'Synthetic browser reminder record' });
      await finishBoot();
    });
    for (const locale of ['zh-TW', 'en']) {
      await choose(locale);
      const en = locale === 'en';
      await page.evaluate(() => { localStorage.removeItem(BACKUP_STATUS_KEY); renderMain(); });
      await page.waitForSelector('#backupReminder');
      assert.equal(await page.locator('#backupReminder p').innerText(), en ? "Records are kept in this browser's storage and are deleted if browser data is cleared. No full backup has been saved yet. Download a backup file." : '病歷暫存在此瀏覽器，清除瀏覽器資料會一併刪除。尚未另存完整備份，請下載一份備份檔。');
      if (en) await checkEnglish('#backupReminder');
      await page.evaluate(() => { updateDeviceBackupStatus({ startedAt: new Date(Date.now() - 15 * BACKUP_DAY).toISOString() }); renderMain(); });
      assert.equal(await page.locator('#backupReminder p').innerText(), en ? "Records are kept in this browser's storage and are deleted if browser data is cleared. The last full backup is more than 14 days old. Download a new backup file." : '病歷暫存在此瀏覽器，清除瀏覽器資料會一併刪除。上次完整備份已超過 14 天，請再下載一份備份檔。');
      if (en) await checkEnglish('#backupReminder');
    }
    console.log('PASS: Folder reminders name the record folder and browser-storage reminders explain data clearing, with both backup states bilingual');
    assert.deepEqual(errors, []);
    console.log('PASS: Both languages fit 320/360/768/1280px without browser errors');

    const blocked = await browser.newContext();
    await blocked.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
    await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new DOMException('Blocked', 'SecurityError'); }; });
    const blockedPage = await blocked.newPage();
    await blockedPage.goto(url); await blockedPage.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    await blockedPage.locator('#languageSelect').selectOption('en');
    assert.equal(await blockedPage.locator('html').getAttribute('lang'), 'en');
    assert.doesNotMatch(await blockedPage.locator('.failure-message').innerText(), /\p{Script=Han}/u);
    await blockedPage.locator('#clientSearch').fill('no matching patient');
    assert.equal(await blockedPage.locator('#clientSearchPopup').isVisible(), true);
    assert.doesNotMatch(await blockedPage.locator('#clientSearchPopup').innerText(), /\p{Script=Han}/u);
    await blockedPage.keyboard.press('Escape');
    assert.equal(await blockedPage.locator('#clientSearchPopup').isHidden(), true);
    await blocked.close();
    console.log('PASS: Language switching and patient search work when browser preference storage is blocked');
  } finally {
    await browser.close(); await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
