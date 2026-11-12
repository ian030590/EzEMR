const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openAssessment, completeAssessment } = require('./lib/assessments.cjs');

(async () => {
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const measure = id => page.locator(`[data-action="measure-add"][data-id="${id}"]`);
      const addMeasure = async (id, name, type = 'text', unit = '') => {
        await openAssessment(page, id);
        await measure(id).click();
        await page.locator('#measure-name').fill(name);
        await page.locator('#measure-type').selectOption(type);
        await page.locator('#measure-unit').fill(unit);
        await page.locator('#measureForm [type="submit"]').click();
        await page.waitForSelector('#measureForm', { state: 'detached' });
        return page.evaluate(id => assessmentDialog.items.find(item => item.id === id).fields.at(-1), id);
      };
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          const disk = await navigator.storage.getDirectory();
          store = folderStore(await disk.getDirectoryHandle('indicators', { create: true })); await finishBoot();
        });
        await action('new-client').click();
        await page.locator('#cf-name').fill('Synthetic measure client'); await page.locator('#cf-ref').fill('TEST-MEASURES');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        const clientPlan = await page.evaluate(async () => {
          cur().plan.push({ id: 'func', name: 'Custom functional assessment', category: 'functional', timing: 'milestone', fields: ['Task / measure', 'Result'] });
          await store.saveClient(cur()); return clone(cur().plan);
        });
        await action('new-session').click();
        await page.locator('#s-subj').fill('Draft retained');
        await openAssessment(page, 'func');
        await page.locator('#af-func-0').fill('Work task');
        await page.locator('#af-func-1').fill('Original result');
        assert.equal(await measure('func').innerText(), locale === 'en' ? 'Add measure' : '新增指標');
        await measure('func').click();
        assert.match(await page.locator('#measureForm').innerText(), locale === 'en' ? /This measure is added to this record only/ : /此指標只加入本次紀錄/);
        await page.locator('#measure-name').fill('Cancelled field'); await page.keyboard.press('Escape');
        assert.equal(await page.locator('#measureForm').count(), 0);
        assert.equal(await page.evaluate(() => assessmentItems(cur(), editing).find(item => item.id === 'func').fields.length), 2);
        const functional = await addMeasure('func', '自訂指標 Custom measure', 'number', '%');
        const functionalIndex = await page.evaluate(() => fieldsFor(assessmentDialog.items.find(item => item.id === 'func')).length - 1);
        await page.locator(`#af-func-${functionalIndex}`).fill('0');
        await openAssessment(page, 'npc'); await page.locator('#af-npc-0').fill('8');
        const visual = await addMeasure('npc', 'Second task result');
        const visualIndex = await page.evaluate(() => fieldsFor(assessmentDialog.items.find(item => item.id === 'npc')).length - 1);
        await page.locator(`#af-npc-${visualIndex}`).fill('Repeated task');
        assert.equal(await page.locator('#s-subj').inputValue(), 'Draft retained');
        assert.equal(await page.locator('#af-npc-0').inputValue(), '8');
        await openAssessment(page, 'func');
        assert.equal(await page.locator('#af-func-1').inputValue(), 'Original result');
        assert.deepEqual(await page.evaluate(() => cur().plan), clientPlan, 'Adding an indicator does not rewrite the client template');
        await measure('func').click();
        await page.locator('#measure-name').fill(functional.label); await page.locator('#measure-unit').fill('%');
        await page.locator('#measureForm [type="submit"]').click();
        assert.equal(await page.locator('.failure-message pre').last().textContent(), locale === 'en' ? 'Field names and units must be unique.' : '欄位名稱與單位不可重複。');
        assert.equal(await page.locator('#measure-error').isVisible(), true);
        await page.locator('#measure-cancel').click();
        await completeAssessment(page);
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        await openAssessment(page, 'func');
        assert.equal(await page.locator(`#af-func-${functionalIndex}`).inputValue(), '0');
        assert.match(await page.locator(`.modal label[for="af-func-${functionalIndex}"]`).innerText(), /自訂指標 Custom measure/);
        await completeAssessment(page);
        await page.locator('#languageSelect').selectOption(locale);
        await action('save-session').click(); await page.waitForSelector('.sess');
        const saved = await page.evaluate(async () => {
          const session = (await store.listSessions(curId))[0];
          return { session, restored: readRecordCSV(sessionCSV(cur(), session)).session, note: noteText(cur(), session), workbook: buildWorkbook([{ c: cur(), ss: [session] }]) };
        });
        assert.equal(saved.session.assess.func.values[functional.id], 0);
        assert.equal(saved.session.assess.npc.values[visual.id], 'Repeated task');
        assert.deepEqual(saved.restored, saved.session, 'Custom fields and values survive CSV import');
        assert.match(saved.note, /自訂指標 Custom measure[（(]%[）)][:：]\s*0/);
        assert.match(saved.note, /Second task result[:：]\s*Repeated task/);
        assert.ok(JSON.stringify(saved.workbook).includes('自訂指標 Custom measure'));
        await action('open-session').click();
        await openAssessment(page, 'func');
        assert.equal(await page.locator(`#af-func-${functionalIndex}`).inputValue(), '0');
        await openAssessment(page, 'npc');
        assert.equal(await page.locator(`#af-npc-${visualIndex}`).inputValue(), 'Repeated task');
        await completeAssessment(page);
        await action('cancel-edit').click();
        if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
        await page.locator('#tab-outcomes').click();
        assert.match(await page.locator('#tabBody').innerText(), /自訂指標 Custom measure/);
        assert.deepEqual(errors, []);
        console.log(`PASS: ${locale} visual and functional indicators: cancel, duplicates, zero, draft/language retention, CSV/TXT/Excel, save/reopen and unchanged templates`);
      } finally { await context.close(); }
    }
  } finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
