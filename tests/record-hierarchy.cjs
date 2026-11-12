const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/record-hierarchy');
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
      await context.route(/^https?:/, route => route.abort());
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(appPath).href);
      await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
      await page.locator('#languageSelect').selectOption(locale);
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await page.locator('[data-action="new-client"]:visible').first().click();
      await page.locator('#cf-name').fill('Synthetic hierarchy patient');
      await page.locator('#cf-ref').fill('TEST-HIERARCHY');
      await page.locator('#cForm [type="submit"]').click();
      await page.waitForSelector('#cForm', { state: 'detached' });
      await page.evaluate(async () => {
        for (let num = 1; num <= 2; num++) await store.saveSession(curId, {
          id: 'hierarchy-' + num, date: '2026-11-0' + num, num, visit: 'treatment', mode: 'inperson',
          sym: [{ id: 'pre-' + num, kind: 'pre', scores: { ef: 2 } }, { id: 'end-' + num, kind: 'end', scores: { ef: 6 } }],
          assess: { npc: { done: true, values: { 'NPC break (cm)': 8 } } }, training: { ocular: { on: true, acts: ['Fixation'] } }, clinicalLinks: [{ id: 'link-' + num, category: 'visual', symptom: 'Synthetic key symptom',
            reasoning: 'Synthetic clinical reasoning', peo: ['person'], evidence: [], evidenceNotes: 'Synthetic observation', interventions: [], interventionNotes: 'Synthetic plan' }]
        });
        await loadSessions(); renderMain();
      });
      const original = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        await page.locator('#fileMenuButton').click();
        assert.equal(await page.locator('#fileMenu [data-action="import-records"]').innerText(), locale === 'en' ? 'Import data' : '匯入資料');
        assert.equal(await page.locator('#fileMenu [data-action="save-session"] [data-label]').innerText(), locale === 'en' ? 'Save record' : '儲存紀錄');
        assert.equal(await page.locator('[data-action="storage-settings"]').count(), 1, 'The storage command has one menu entry');
        const contrast = await page.locator('#fileMenu [data-action="save-session"]').evaluate(node => {
          const rgb = text => text.match(/[\d.]+/g).slice(0, 3).map(Number);
          const luminance = color => rgb(color).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
          const style = getComputedStyle(node), a = luminance(style.color), b = luminance(style.backgroundColor);
          return { ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05), opacity: Number(style.opacity) };
        });
        assert.equal(contrast.opacity, 1, 'Disabled text stays legible');
        assert.ok(contrast.ratio >= 4.5, `${locale} ${theme}: disabled menu contrast ${contrast.ratio}`);
        await page.keyboard.press('Escape');
        await page.locator('#tab-sessions').click();
        for (const width of [360, 1280]) {
          await page.setViewportSize({ width, height: 900 });
          const cards = await page.locator('.sess').evaluateAll(nodes => nodes.map(node => {
            const rect = node.getBoundingClientRect(), heading = getComputedStyle(node.querySelector('.when')), value = getComputedStyle(node.querySelector('.session-metrics dd'));
            const blocks = [...node.querySelector('.session-content').children].map(child => child.getBoundingClientRect());
            return { top: rect.top, bottom: rect.bottom, heading: parseFloat(heading.fontSize), value: parseFloat(value.fontSize), border: parseFloat(getComputedStyle(node).borderBottomWidth), gaps: blocks.slice(1).map((block, i) => block.top - blocks[i].bottom) };
          }));
          assert.ok(cards[1].top - cards[0].bottom >= 15, 'Separate cards leave a visible gap');
          assert.ok(cards.every(card => card.heading > card.value && card.border >= 1), 'Dates dominate compact values and every card is bounded');
          assert.ok(cards.every(card => card.gaps.length === 3 && card.gaps.every(gap => Math.abs(gap - 12) <= 1)), 'Heading, scores, assessment count and training use the same 12px gap');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
          await page.locator('.record-history').screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
        }
        await page.locator('#tab-dashboard').click();
        assert.equal(await page.locator('.clinical-evidence h5').first().innerText(), locale === 'en' ? 'Assessment evidence' : '評估依據');
        assert.ok(await page.locator('.clinical-symptom').first().evaluate(node => Number(getComputedStyle(node).fontWeight) >= 700), 'The key symptom has emphasis');
        assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), original, 'Visual review preserves clinical data');
      }
      assert.deepEqual(errors, []);
      await context.close();
      console.log(`PASS: ${locale}: readable menus, distinct record cards, date-first hierarchy and explicit clinical evidence in both themes`);
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
