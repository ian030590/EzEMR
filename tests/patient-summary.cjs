const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '../.tmp/verification/patient-summary');
(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [], requests = [];
    page.on('pageerror', error => errors.push(error.message));
    await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
    await page.goto(pathToFileURL(appPath).href);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    await page.evaluate(async () => { store = localStore(); await finishBoot(); });
    await page.locator('[data-action="example"]:visible').click();
    await page.locator('.toast').evaluate(node => node.remove());
    await page.evaluate(() => { Object.assign(cur(), { sex: 'male', medicalHistory: 'Synthetic clinical history' }); renderMain(); });
    assert.equal(await page.locator('.client-head .client-demographics dt').count(), 2, 'Birth date and sex belong beside the patient name');
    const original = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
    const inspect = () => page.locator('.client-summary').evaluate(panel => {
      const origin = panel.getBoundingClientRect();
      const box = node => {
        const r = node.getBoundingClientRect();
        return { x: r.x - origin.x, y: r.y - origin.y, bottom: r.bottom - origin.y, right: r.right - origin.x, height: r.height, width: r.width };
      };
      const style = node => {
        const css = getComputedStyle(node);
        return { node: node.className || node.tagName, font: css.fontFamily, size: css.fontSize, weight: css.fontWeight, color: css.color, lineHeight: css.lineHeight };
      };
      const nodes = selector => [...panel.querySelectorAll(selector)].filter(node => node.checkVisibility());
      const rgb = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const lum = color => rgb(color).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
      const background = lum(getComputedStyle(panel).backgroundColor);
      const labels = nodes('.client-diagnosis .eyebrow, .client-demographics dt, .client-stats dt, .patient-details summary, .medical-history .body b, .profile-facts dt');
      const text = nodes('.client-diagnosis, .client-ref, .client-demographics dt, .client-demographics dd, .client-stats dt, .client-stats dd, .patient-details summary, .facts, .patient-details .body, .patient-details .body p, .patient-details dt, .patient-details dd');
      return {
        width: origin.width, stats: box(panel.querySelector('.client-stats')), identity: box(panel.querySelector('.client-identity')), demographics: box(panel.querySelector('.client-demographics')),
        details: [...panel.querySelectorAll('.patient-details > details')].map(node => ({ ...box(node), summary: box(node.querySelector('summary')) })),
        labels: labels.map(style), text: text.map(style),
        paragraphs: nodes('.patient-details .body > p').map(node => ({ ...box(node), topMargin: getComputedStyle(node).marginTop, bottomMargin: getComputedStyle(node).marginBottom })),
        contrast: text.map(node => { const ink = lum(getComputedStyle(node).color); return (Math.max(ink, background) + .05) / (Math.min(ink, background) + .05); }),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    for (const locale of ['zh-TW', 'en']) {
      await page.locator('#languageSelect').selectOption(locale);
      assert.deepEqual(await page.locator('.patient-details > details > summary').allTextContents(), locale === 'en'
        ? ['History and details', 'Medical history'] : ['病史與基本資料', '醫療史']);
      assert.deepEqual(await page.locator('.client-demographics dt').allTextContents(), locale === 'en' ? ['Date of birth', 'Sex'] : ['出生日期', '性別']);
      assert.equal(await page.locator('.client-demographics dd').last().innerText(), locale === 'en' ? 'Male' : '男性');
      assert.equal(await page.locator('.patient-details').getByText(locale === 'en' ? 'Date of birth' : '出生日期', { exact: true }).count(), 0);
      for (const theme of ['light', 'dark']) {
        await page.evaluate(theme => { document.documentElement.dataset.theme = theme; renderTheme(); }, theme);
        for (const width of [1920, 1280, 768, 640, 360, 320]) {
          await page.setViewportSize({ width, height: 1000 });
          let baseline;
          for (const state of [[false, false], [true, false], [false, true], [true, true]]) {
            for (const [index, open] of state.entries()) {
              const detail = page.locator('.patient-details > details').nth(index);
              if (await detail.evaluate(node => node.open) !== open) await detail.locator('summary').click();
            }
            const tag = `${locale}-${theme}-${width}-${state.map(Number).join('')}`;
            if ([1920, 1280, 320].includes(width) && state[0] === state[1]) await page.locator('.client-summary').screenshot({ path: path.join(output, `${tag}.png`) });
            const layout = await inspect();
            if (width >= 1280) {
              assert.ok(Math.abs(layout.identity.y - layout.demographics.y) < 1, `${tag}: demographics align with the name`);
              assert.ok(layout.demographics.x >= layout.identity.right, `${tag}: demographics use the space beside the name`);
            }
            baseline ||= layout;
            assert.ok(layout.stats.bottom <= layout.details[0].summary.y, `${tag}: history starts below the statistics`);
            for (const [index, detail] of layout.details.entries()) {
              assert.ok(Math.abs(detail.summary.x - layout.stats.x) < 1, `${tag}: every disclosure shares the statistics' left edge`);
              assert.ok(detail.summary.height >= 44, `${tag}: disclosures retain a usable target`);
              assert.ok(detail.right <= layout.width, `${tag}: expanded content stays inside the panel`);
              if (index) assert.ok(detail.summary.y >= layout.details[index - 1].bottom - 1, `${tag}: medical history follows the background vertically`);
            }
            assert.ok(Math.abs(layout.stats.y - baseline.stats.y) < 1, `${tag}: opening history does not move the statistics`);
            assert.ok(Math.abs(layout.details[0].summary.y - baseline.details[0].summary.y) < 1, `${tag}: the first disclosure stays in place`);
            assert.ok(layout.text.every(text => text.font === layout.text[0].font && text.size === layout.text[0].size && text.lineHeight === layout.text[0].lineHeight), `${tag}: diagnosis, facts and medical history share one body type style: ${JSON.stringify(layout.text)}`);
            assert.ok(layout.labels.every(label => label.color === layout.labels[0].color && label.weight === layout.labels[0].weight), `${tag}: field and disclosure labels share one color and weight`);
            assert.ok(layout.paragraphs.every(p => p.topMargin === '0px' && p.bottomMargin === '0px' && Math.abs(p.x - layout.stats.x) < 1), `${tag}: medical paragraphs use the same left edge and controlled spacing`);
            assert.ok(layout.contrast.every(ratio => ratio >= 4.5), `${tag}: all summary text passes AA contrast`);
            assert.equal(layout.overflow, false, `${tag}: no horizontal overflow`);
          }
          const summary = page.locator('.medical-history > summary');
          await page.keyboard.press('Tab');
          await summary.focus();
          assert.ok(await summary.evaluate(node => getComputedStyle(node).outlineStyle !== 'none'), 'Keyboard focus remains visible');
          await page.keyboard.press('Enter');
          assert.equal(await page.locator('.medical-history').evaluate(node => node.open), false);
          await page.keyboard.press('Space');
          assert.equal(await page.locator('.medical-history').evaluate(node => node.open), true);
          assert.equal(await page.locator('.medical-history .body > p > b').last().innerText(), locale === 'en' ? 'Medical history' : '醫療史');
          assert.equal(await page.locator('.medical-history .body > p').last().innerText(), `${locale === 'en' ? 'Medical history' : '醫療史'}\nSynthetic clinical history`);
          assert.equal(await page.locator('.medical-history .body').getByText('Post-concussion visual symptoms; return-to-work', { exact: true }).count(), 0, 'The header diagnosis is not repeated in medical history');
        }
      }
      assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), original, 'Layout and language changes preserve the clinical data');
    }
    await page.evaluate(() => {
      appSettings.requiredFields = ['name', 'ref', 'dob', 'occupation'];
      Object.assign(cur(), { occupation: 'Synthetic 職業', medicalHistory: 'Synthetic 病史\nSecond line', sourceRoster: [{ file: 'Synthetic 來源.xlsx', sheet: 'Original 工作表', fields: { 'Original 欄位': 'Synthetic 原始值' } }] });
      renderMain();
    });
    const extended = await page.evaluate(() => JSON.stringify({ client: cur(), sessions }));
    for (const locale of ['zh-TW', 'en']) {
      await page.locator('#languageSelect').selectOption(locale);
      for (const width of [1280, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        for (const summary of await page.locator('.patient-details > details > summary').all()) await summary.click();
        const layout = await inspect();
        assert.equal(layout.details.length, 2, 'Raw roster metadata does not create a disclosure');
        assert.ok(layout.text.every(text => text.size === layout.text[0].size && text.font === layout.text[0].font), 'Clinical profile fields share the summary body style');
        assert.ok(layout.details.every((detail, i, all) => Math.abs(detail.x - layout.stats.x) < 1 && (!i || detail.y >= all[i - 1].bottom - 1)), 'Clinical disclosures form one aligned vertical stack');
        assert.equal(layout.overflow, false);
        assert.equal(await page.locator('.profile-facts dd').last().innerText(), 'Synthetic 職業');
        assert.equal(await page.locator('.client-summary').getByText('Synthetic 原始值', { exact: true }).count(), 0);
        for (const summary of await page.locator('.patient-details > details > summary').all()) await summary.click();
      }
      assert.equal(await page.evaluate(() => JSON.stringify({ client: cur(), sessions })), extended);
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(requests, []);
    await context.close();
    console.log('PASS: Bilingual patient summary: stable vertical alignment, consistent type, all disclosure states, keyboard, light/dark contrast and offline data preservation at 320–1920px, including a 640px zoom-equivalent viewport');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
