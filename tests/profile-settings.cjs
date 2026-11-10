const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'profile-settings');
const fields = ['name', 'ref', 'nationalId', 'dob', 'sex', 'smoking', 'alcohol', 'betel', 'occupation', 'religion', 'chronicConditions', 'phone', 'address', 'allergies'];

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const evidence = [];
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce', acceptDownloads: true });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage(); page.setDefaultTimeout(10000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const check = message => { const text = `${locale}: ${message}`; evidence.push(text); console.log('PASS: ' + text); };
      const english = async selector => {
        if (locale !== 'en') return;
        const untranslated = await page.locator(selector).evaluate(node => {
          const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT), found = [];
          while (walker.nextNode()) {
            const text = walker.currentNode;
            if (!text.parentElement.closest('textarea, script, style, [data-language-names]') && /\p{Script=Han}/u.test(text.nodeValue)) found.push(text.nodeValue.trim());
          }
          for (const element of node.querySelectorAll('[title], [aria-label], [placeholder]')) {
            for (const attr of ['title', 'aria-label', 'placeholder']) {
              const value = element.getAttribute(attr);
              if (value && /\p{Script=Han}/u.test(value)) found.push(`${attr}: ${value}`);
            }
          }
          return [...new Set(found)];
        });
        assert.deepEqual(untranslated, [], `Built-in ${selector} content is translated`);
      };
      const openSettings = async () => {
        await page.locator('#viewMenuButton').click(); await action('global-settings').click();
        await page.waitForSelector('#appSettingsForm'); await english('.modal');
      };
      const chooseFields = async selected => {
        const chosen = new Set(selected);
        for (const key of fields) await page.locator(`#appSettingsForm [name="requiredField"][value="${key}"]`).setChecked(chosen.has(key));
      };
      const saveSettings = async () => { await page.locator('#settingsSave').click(); await page.waitForSelector('#appSettingsForm', { state: 'detached' }); };
      const saveClient = async () => { await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' }); };
      try {
        await page.goto(pathToFileURL(appPath).href); await ready();
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        assert.deepEqual(await page.evaluate(() => appSettings.requiredFields), ['name', 'ref']);
        await page.locator('#viewMenuButton').focus(); await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter');
        await page.waitForSelector('#appSettingsForm'); await english('.modal');
        assert.deepEqual(await page.locator('#appSettingsForm [name="requiredField"]').evaluateAll(nodes => nodes.map(node => node.value)), fields);
        assert.equal(await page.locator('#appSettingsForm [name="requiredField"]:checked').count(), 2);
        assert.equal(await page.locator('#languageSelect').isDisabled(), true);
        await page.keyboard.press('Escape'); await page.waitForSelector('#appSettingsForm', { state: 'detached' });
        await action('new-client').click();
        await page.locator('#cf-name').fill('Profile fixture 原文'); await page.locator('#cf-ref').fill('PROFILE-001');
        assert.equal(await page.locator('#cf-name').getAttribute('required') !== null, true);
        assert.equal(await page.locator('#cf-dob').count(), 0, 'Unselected basic fields are not required or shown');
        await saveClient();
        const firstId = await page.evaluate(() => curId);
        check('default fields preserve the prior name/record-number workflow; settings and required names are bilingual');

        await openSettings(); await chooseFields(fields);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [320, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}px settings fit`);
            assert.equal(await page.locator('.modal').evaluate(node => node.scrollWidth <= node.clientWidth), true);
            const sizes = await page.locator('#appSettingsForm .pick, #appSettingsForm button').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
            assert.ok(sizes.every(size => size.width >= 44 && size.height >= 44), 'Settings retain touch targets');
            if ([320, 1280].includes(width)) await page.locator('.modal').screenshot({ path: path.join(output, `${locale}-settings-${theme}-${width}.png`) });
          }
        }
        await page.setViewportSize({ width: 1280, height: 900 });
        await saveSettings();
        assert.deepEqual(await page.evaluate(() => appSettings.requiredFields), fields);
        assert.equal(await page.locator('#profileIncomplete').isVisible(), true, 'Existing patients are marked incomplete, not backfilled');
        assert.equal(await page.evaluate(() => cur().nationalId), undefined);
        const recordCount = await page.evaluate(async () => (await store.listSessions(curId)).length);
        const newRecord = page.locator('.client-head [data-action="new-session"]');
        if (await newRecord.isEnabled()) { await newRecord.click(); await page.waitForSelector('#cForm'); }
        else await page.locator('#profileIncomplete [data-action="edit-client"]').click();
        assert.equal(await page.locator('#soapForm').count(), 0, 'Required profile gaps cannot create a SOAP draft');
        await english('.modal');
        for (const key of fields) assert.equal(await page.locator(`#cf-${key}`).getAttribute('required') !== null, true, `${key} is required for every patient`);
        const beforeIncomplete = await page.evaluate(async () => JSON.stringify(await store.listClients()));
        await page.locator('#cForm [type="submit"]').click();
        assert.equal(await page.locator('#cForm').isVisible(), true);
        const missingMessage = await page.locator('#cf-nationalId').evaluate(control => control.validationMessage);
        assert.equal(missingMessage, locale === 'en' ? 'Enter National ID number' : '請填寫身分證字號', 'Required-field validation follows the application language');
        assert.equal(await page.evaluate(async () => JSON.stringify(await store.listClients())), beforeIncomplete, 'Incomplete profile submission writes nothing');
        const values = { name: 'Profile fixture 原文', ref: 'PROFILE-001', nationalId: 'ID-原文-0', dob: '1984-04-12', sex: 'unknown', smoking: 'never', alcohol: 'former', betel: 'unknown', occupation: '0', religion: '原文信仰', chronicConditions: '0', phone: '+886 02 1234', address: '<img src=x> 原文地址', allergies: '無已知過敏 / original' };
        for (const key of fields) {
          const input = page.locator(`#cf-${key}`);
          if (['sex', 'smoking', 'alcohol', 'betel'].includes(key)) await input.selectOption(values[key]); else await input.fill(values[key]);
        }
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [320, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}px profile form fits`);
            const controlFonts = await page.locator('#cForm button, #cForm input:not([type="checkbox"]), #cForm select, #cForm textarea').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length).map(node => parseFloat(getComputedStyle(node).fontSize)));
            assert.ok(controlFonts.every(size => size < 16), 'All profile control text is smaller than body text');
            await page.locator('.modal').screenshot({ path: path.join(output, `${locale}-profile-${theme}-${width}.png`) });
          }
        }
        await page.setViewportSize({ width: 1280, height: 900 }); await saveClient();
        const savedProfile = await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), fields);
        assert.deepEqual(savedProfile, values);
        assert.equal(await page.locator('#profileIncomplete').isVisible(), false);
        assert.equal(await page.locator('#main img').count(), 0, 'Clinical text stays text');
        assert.equal(await page.evaluate(async () => (await store.listSessions(curId)).length), recordCount);
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), fields), values, 'Language changes preserve canonical choices and original profile text');
        await page.locator('#languageSelect').selectOption(locale);
        check('global selections apply to existing patients; incomplete submissions write nothing, original text/zero/unknown values remain valid');

        await openSettings(); await chooseFields(['name', 'ref']); await saveSettings();
        await action('edit-client').click();
        for (const key of fields.slice(2)) assert.equal(await page.locator(`#cf-${key}`).count(), 0);
        await saveClient();
        assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(key => [key, cur()[key]])), fields), values, 'Unchecking fields preserves existing patient data');
        await openSettings(); await chooseFields(['name', 'ref', 'occupation']);
        await page.evaluate(() => { window.realProfileSettingsSave = store.saveSettings; store.saveSettings = async () => { throw new Error('Settings write fixture'); }; });
        await page.locator('#settingsSave').click();
        await page.waitForFunction(() => document.querySelector('#settingsError')?.textContent.includes('Settings write fixture'));
        assert.equal(await page.locator('#appSettingsForm').isVisible(), true);
        assert.deepEqual(await page.evaluate(() => appSettings.requiredFields), ['name', 'ref'], 'A failed write does not change the active policy');
        await page.evaluate(() => { store.saveSettings = realProfileSettingsSave; delete window.realProfileSettingsSave; });
        await page.keyboard.press('Escape'); await page.waitForSelector('#appSettingsForm', { state: 'detached' });
        check('deselection retains stored values and a failed settings write retains both the old policy and the editable dialog');

        await action('new-client').click();
        await page.locator('#cf-name').fill('Legacy profile gap'); await page.locator('#cf-ref').fill('PROFILE-LEGACY'); await saveClient();
        await action('new-session').click(); await page.locator('#s-subj').fill('SOAP draft 原文 retained');
        await openSettings(); await chooseFields(['name', 'ref', 'nationalId']); await saveSettings();
        assert.equal(await page.locator('#s-subj').inputValue(), 'SOAP draft 原文 retained', 'Changing global settings keeps the current SOAP draft');
        const beforeProfileSave = await page.evaluate(async () => (await store.listSessions(curId)).length);
        await action('save-session').click(); await page.waitForSelector('#cForm');
        assert.equal(await page.evaluate(async () => (await store.listSessions(curId)).length), beforeProfileSave, 'A missing global requirement blocks session writes');
        await page.locator('#cf-nationalId').fill('ID-修訂-0'); await saveClient();
        assert.equal(await page.locator('#s-subj').inputValue(), 'SOAP draft 原文 retained', 'Completing profile data keeps the current SOAP draft');
        assert.equal(await page.evaluate(() => cur().nationalId), 'ID-修訂-0');
        await action('cancel-edit').click(); await page.waitForSelector('#askYes'); await page.locator('#askYes').click();
        await page.waitForSelector('#soapForm', { state: 'detached' });
        check('settings and profile editing preserve the active SOAP draft');

        await openSettings(); await chooseFields([]); await saveSettings();
        await action('new-client').click();
        assert.equal(await page.locator('#cf-name, #cf-ref').count(), 0);
        await saveClient();
        const anonymous = await page.evaluate(() => ({ id: curId, name: cur().name, ref: cur().ref }));
        assert.notEqual(anonymous.id, firstId); assert.equal(anonymous.name, ''); assert.equal(anonymous.ref, '');
        assert.ok((await page.locator('.client-head h2').innerText()).trim(), 'An unnamed client has an informative UI-only fallback');
        await page.reload(); await ready(); await page.evaluate(async () => { store = localStore(); await finishBoot(); });
        assert.deepEqual(await page.evaluate(() => appSettings.requiredFields), [], 'Global selection survives reload');
        assert.equal(await page.evaluate(async id => (await store.listClients()).find(client => client.id === id).name, anonymous.id), '');
        assert.deepEqual(errors, []);
        check('unchecked name/reference fields allow anonymous clients without storing a translated placeholder; preferences and patient data survive reload');
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
