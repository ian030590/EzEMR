const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const checks = [];
const check = text => { checks.push(text); console.log('PASS: ' + text); };

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
      const page = await context.newPage(); page.setDefaultTimeout(15000);
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      const action = name => page.locator(`[data-action="${name}"]:visible`).first();
      const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      const connect = () => page.evaluate(async () => {
        const disk = await navigator.storage.getDirectory();
        window.vfRoot = await disk.getDirectoryHandle('vf-entry-records', { create: true });
        store = folderStore(vfRoot); await finishBoot();
      });
      try {
        await page.goto(`http://127.0.0.1:${server.address().port}/`); await ready(); await connect();
        await page.locator('#languageSelect').selectOption(locale);
        await action('new-client').click(); await page.locator('#cf-name').fill('Synthetic VF'); await page.locator('#cf-ref').fill('TEST-VF');
        await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
        const plan = await page.evaluate(async () => {
          const item = cur().plan.find(p => p.id === 'vf');
          item.fields.push({ id: 'custom_context', label: 'Custom clinical context', type: 'textarea' });
          cur().plan.push(clone(SOURCE_ASSESSMENTS.find(p => p.id === 'src_vf')));
          await store.saveClient(cur());
          const original = JSON.stringify(item);
          const fields = fieldsFor(item);
          if (JSON.stringify(item) !== original) throw new Error('fieldsFor mutated the stored template');
          const custom = { ...clone(item), id: 'custom_vf' };
          if (fieldsFor(custom).length !== custom.fields.length || fieldInputs(custom, 'custom').includes('vf-entry')) throw new Error('Custom assessments must retain their layout');
          return { item: clone(item), fields, source: clone(cur().plan.find(p => p.id === 'src_vf')) };
        });
        assert.equal(plan.item.fields.length, 5);
        assert.equal(plan.fields.length, 17);
        assert.equal(new Set(plan.fields.map(f => f.id)).size, 17);
        const directional = plan.fields.filter(f => /^(od|os|ou)_/.test(f.id));
        assert.equal(directional.length, 12);
        assert.ok(directional.every(f => /^[a-z_]+$/.test(f.id) && f.type === 'text'));
        await action('new-session').click(); await page.locator('#ac-vf').check(); await page.locator('#ac-src_vf').check();
        const field = (id, item = plan.item, fields = plan.fields) => page.locator(`#af-${item.id}-${fields.findIndex(f => f.id === id)}`);
        assert.equal(await page.locator('#as-vf .vf-entry input').count(), 12);
        assert.equal(await page.locator('#as-src_vf .vf-entry input').count(), 12);
        assert.equal(await field('method').isVisible(), true);
        assert.equal(await field('od').isVisible(), true);
        assert.equal(await field('os').isVisible(), true);
        assert.equal(await field('summary').isVisible(), true);
        assert.equal(await field('custom_context').isVisible(), true);
        assert.equal(await page.locator('#as-vf .vf-entry input').evaluateAll(nodes => nodes.every(n => n.value === '')), true);
        const expected = { method: 'Confrontation', od: 'Legacy OD', os: 'Legacy OS', summary: 'Clinical summary', custom_context: 'Custom note' };
        for (let i = 0; i < directional.length; i++) expected[directional[i].id] = i === 0 ? '0' : i === 1 ? 'Blind spot, "observed" < > &' : `${40 + i}°`;
        for (const [id, value] of Object.entries(expected)) await field(id).fill(value);
        const sourceExpected = {};
        for (let i = 0; i < plan.source.fields.length; i++) {
          const f = plan.source.fields[i], value = i ? `source ${i}` : '0';
          sourceExpected[f.id] = value; await field(f.id, plan.source, plan.source.fields).fill(value);
        }
        await page.locator('#ac-vf').uncheck(); assert.equal(await field('od_superior').isDisabled(), true);
        await page.locator('#ac-vf').check(); assert.equal(await field('od_superior').inputValue(), '0');
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.equal(await field('od_inferior').inputValue(), expected.od_inferior);
        await page.locator('#languageSelect').selectOption(locale);
        const cross = page.locator('#as-vf .vf-entry');
        assert.deepEqual(await cross.locator('legend').allTextContents(), locale === 'en' ? ['Right eye (OD)', 'Left eye (OS)', 'Both eyes (OU)'] : ['右眼（OD）', '左眼（OS）', '雙眼（OU）']);
        if (locale === 'en') {
          const han = await cross.evaluate(el => {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), found = [];
            while (walker.nextNode()) if (/\p{Script=Han}/u.test(walker.currentNode.nodeValue)) found.push(walker.currentNode.nodeValue);
            for (const node of el.querySelectorAll('[aria-label], [title], [placeholder]')) for (const attr of ['aria-label', 'title', 'placeholder']) if (/\p{Script=Han}/u.test(node.getAttribute(attr) || '')) found.push(node.getAttribute(attr));
            return found;
          });
          assert.deepEqual(han, []);
        }
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [320, 390, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} at ${width}px`);
            const bounds = await cross.locator('input').evaluateAll(nodes => nodes.map(n => ({ width: n.getBoundingClientRect().width, height: n.getBoundingClientRect().height, labels: n.labels.length })));
            assert.ok(bounds.every(b => b.width >= 44 && b.height >= 44 && b.labels === 1));
            for (const [left, right] of [['od_temporal', 'od_nasal'], ['os_nasal', 'os_temporal'], ['ou_right', 'ou_left']]) {
              assert.ok((await field(left).boundingBox()).x < (await field(right).boundingBox()).x, 'Patient-facing orientation must remain consistent');
            }
            if ([390, 1280].includes(width)) await cross.screenshot({ path: path.join(output, `vf-${locale}-${theme}-${width}.png`) });
          }
        }
        await field('od_superior').focus(); await page.keyboard.press('Tab');
        assert.equal(await field('od_temporal').evaluate(el => el === document.activeElement), true);
        assert.notEqual(await field('od_temporal').evaluate(el => getComputedStyle(el).outlineStyle), 'none');
        check(`${locale}: twelve labelled cross entries, patient-facing directions, bilingual labels, zero/text, keyboard focus, 320–1280px light/dark layouts and unmodified custom/legacy fields`);
        await action('save-session').click();
        try { await page.waitForSelector('#soapForm', { state: 'detached' }); }
        catch (error) {
          console.error(await page.evaluate(() => ({ invalid: [...document.querySelectorAll(':invalid')].map(el => ({ id: el.id, message: el.validationMessage })), toast: document.querySelector('#toast')?.textContent, errors: document.querySelector('[role="alert"]')?.textContent })));
          throw error;
        }
        const saved = await page.evaluate(async () => {
          const session = (await store.listSessions(curId))[0];
          return { session, restored: readRecordCSV(sessionCSV(cur(), session)), note: noteText(cur(), session), item: cur().plan.find(p => p.id === 'vf') };
        });
        assert.deepEqual(saved.session.assess.vf.values, expected);
        assert.deepEqual(saved.session.assess.src_vf.values, sourceExpected);
        assert.deepEqual(saved.restored.session.assess, saved.session.assess);
        assert.deepEqual(saved.item, plan.item);
        for (const value of Object.values(expected)) assert.ok(saved.note.includes(value));
        await page.reload(); await ready(); await connect();
        await page.locator('#clientSearch').fill('TEST-VF');
        await action('pick').click();
        await page.locator(`[data-action="open-session"][data-id="${saved.session.id}"]`).click();
        assert.equal(await field('od_superior').inputValue(), '0');
        assert.equal(await field('od_inferior').inputValue(), expected.od_inferior);
        assert.equal(await field('custom_context').inputValue(), expected.custom_context);
        // Imported numeric zero stays numeric when the displayed entry is unchanged.
        const numeric = await page.evaluate(() => {
          const item = SOURCE_ASSESSMENTS.find(p => p.id === 'src_vf');
          return readFields(item, 'af-src_vf', { ...editing.assess.src_vf.values, vf_ou_up: 0 });
        });
        assert.equal(numeric.vf_ou_up, 0);
        assert.deepEqual(errors, []);
        check(`${locale}: saved reload, clinical note and CSV roundtrip retain all directions, legacy/custom text and imported numeric zero`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'vf-entry-results.json'), JSON.stringify({ checks }, null, 2));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
