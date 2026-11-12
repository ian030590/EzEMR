const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');
const { openTraining } = require('./training-modal.cjs');
const { openAssessment } = require('./lib/assessments.cjs');

async function assertHelpPlacement(page, selector) {
  const result = await page.locator(selector).evaluate(root => {
    const help = [...root.querySelectorAll('.help')].filter(node => node.querySelector('button').getClientRects().length);
    const placements = help.map(node => {
      const button = node.querySelector('button'), r = button.getBoundingClientRect(), hit = getComputedStyle(button, '::before');
      const anchor = node.parentElement.closest('h1, h2, h3, h4, h5, h6, label, th, legend, summary, .field-label, .pick-label') || node.parentElement;
      const walker = document.createTreeWalker(anchor, NodeFilter.SHOW_TEXT);
      let text, preceding;
      while ((text = walker.nextNode())) if (text.textContent.trim() && !text.parentElement.closest('.help') && (text.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_FOLLOWING)) preceding = text;
      if (!preceding) return { name: button.getAttribute('aria-label'), missingLabel: true };
      const last = preceding.textContent.search(/\S\s*$/), range = document.createRange();
      range.setStart(preceding, last); range.setEnd(preceding, last + 1);
      const label = range.getBoundingClientRect();
      return { name: button.getAttribute('aria-label'), sameLine: r.top + r.height / 2 >= label.top - 1 && r.top + r.height / 2 <= label.bottom + 1,
        adjacent: r.left >= label.right - 1 && r.left - label.right <= parseFloat(getComputedStyle(anchor).fontSize),
        compact: r.height <= label.height && r.width <= label.height,
        target: parseFloat(hit.width) >= 44 && parseFloat(hit.height) >= 44 };
    });
    const controls = [...root.querySelectorAll('input, select, textarea, button:not(.help-trigger), .scroll, .pick-group')].filter(node => node.getClientRects().length);
    const positions = () => controls.map(node => node.getBoundingClientRect().top - root.getBoundingClientRect().top);
    const before = positions(), style = document.createElement('style');
    style.textContent = '.help { display: none !important; }'; document.head.append(style);
    const without = positions(); style.remove();
    return { placements, shifts: before.flatMap((top, i) => Math.abs(top - without[i]) > 1 ? [{ id: controls[i].id || controls[i].className, shift: top - without[i] }] : []) };
  });
  assert.ok(result.placements.length, `${selector}: expected help triggers`);
  for (const placement of result.placements) {
    assert.equal(placement.missingLabel, undefined, `${placement.name}: help must sit beside its heading or label`);
    assert.equal(placement.sameLine, true, `${placement.name}: help must share the preceding text's line box`);
    assert.equal(placement.adjacent, true, `${placement.name}: help immediately follows its heading or label`);
    assert.equal(placement.compact, true, `${placement.name}: visual footprint fits the text line`);
    assert.equal(placement.target, true, `${placement.name}: invisible pointer target is at least 44px`);
  }
  assert.deepEqual(result.shifts, [], `${selector}: help must not move the described controls vertically`);
}

(async () => {
  const output = path.resolve(__dirname, '../.tmp/verification/help-tooltips'); await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, hasTouch: true });
      const page = await context.newPage(), errors = [], requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
      try {
        await page.goto(pathToFileURL(appPath).href); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          store = localStore(); const c = { id: 'help_fixture', ref: 'TEST-HELP', name: 'Synthetic help client', plan: newClientPlan(), trainingPlan: clone(TRAIN) };
          await store.saveClient(c); clients = [c]; curId = c.id; sessions = []; patientReady = true;
          editing = blankSession(); editing.assess.npc = { done: true }; editing.contextSource = { sessionId: 'synthetic_previous', date: '2026-10-01', parts: [] };
          view = 'edit'; dirty = false; renderMain();
        });
        const trigger = page.locator('#remediation > .spread h4 [data-help]');
        const id = await trigger.getAttribute('aria-describedby'), tip = page.locator('#' + id);
        assert.equal(await tip.getAttribute('role'), 'tooltip'); assert.equal(await trigger.getAttribute('type'), 'button');
        assert.match(await trigger.getAttribute('aria-label'), locale === 'en' ? /Help: Remediation/ : /說明：復能/);
        assert.equal(await trigger.getAttribute('title'), null); assert.equal(await tip.isVisible(), false);
        await page.locator('#s-subj').focus(); await trigger.hover(); assert.equal(await tip.isVisible(), true);
        await tip.hover(); await page.waitForTimeout(200); assert.equal(await tip.isVisible(), true, 'Pointer can enter the tooltip');
        await page.mouse.move(1, 1); await page.waitForTimeout(200); assert.equal(await tip.isVisible(), false);
        await trigger.focus(); assert.equal(await tip.isVisible(), true); await page.keyboard.press('Escape'); assert.equal(await tip.isVisible(), false);
        await trigger.tap(); assert.equal(await tip.isVisible(), true); await trigger.tap(); assert.equal(await tip.isVisible(), false);
        await page.locator('#s-subj').focus();
        const before = await page.evaluate(() => noteText(cur(), collectSession()));
        for (const theme of ['light', 'dark']) for (const width of [320, 768, 1280]) {
          await page.setViewportSize({ width, height: 900 }); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await assertHelpPlacement(page, '#soapForm');
          await trigger.hover();
          const tip = page.locator('#' + await trigger.getAttribute('aria-describedby'));
          const bounds = await tip.boundingBox(); assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= 900);
          const contrast = await tip.evaluate(node => {
            const rgb = text => text.match(/\d+/g).slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
            const lum = text => rgb(text).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
            const style = getComputedStyle(node), a = lum(style.color), b = lum(style.backgroundColor); return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
          });
          assert.ok(contrast >= 4.5); await page.keyboard.press('Escape');
          await openTraining(page, 'ocular');
          await assertHelpPlacement(page, '#trainingResultForm');
          await page.mouse.move(1, 1);
          const inside = page.locator('#trainingResultForm [data-help]:visible').first(); await inside.focus();
          const insideTip = page.locator('#' + await inside.getAttribute('aria-describedby'));
          assert.equal(await insideTip.isVisible(), true);
          assert.equal(await insideTip.evaluate(node => { const r = node.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight && document.elementFromPoint(r.left + 8, r.top + 8) === node; }), true, 'Tooltip is in the viewport above the dialog');
          await page.screenshot({ path: path.join(output, `${locale}-${theme}-${width}.png`) });
          await page.keyboard.press('Escape'); assert.equal(await insideTip.isVisible(), false); assert.equal(await page.locator('#trainingResultForm').isVisible(), true);
          await page.locator('#training-cancel').click();
          await openAssessment(page, 'npc'); await assertHelpPlacement(page, '#assessmentResultForm'); await page.locator('#assessment-cancel').click();
        }
        assert.equal(await page.evaluate(() => noteText(cur(), collectSession())), before, 'Help does not change exported report content');
        assert.equal(await page.locator('.save-hint').isVisible(), true);
        assert.equal(await page.locator('#as-npc .assessment-empty').isVisible(), true);
        assert.equal(await page.locator('#main p.note').filter({ hasText: locale === 'en' ? /Reused from/ : /沿用來源/ }).isVisible(), true);
        assert.equal(await page.locator('#syc-' + await page.evaluate(() => editing.sym[0].id)).isVisible(), true);
        assert.deepEqual(await page.locator('#soapForm p.note, #soapForm span.note').evaluateAll(nodes => nodes.filter(node => node.getClientRects().length && /勾選後|各症狀分別評估|難度自評使用|逐項記錄表現|Select an item to open|Rate each symptom/.test(node.textContent)).map(node => node.textContent)), []);
        await page.evaluate(() => { void backupPasswordDialog(true); });
        assert.equal(await page.locator('#backupPasswordHint').isVisible(), true); assert.match(await page.locator('#backupPasswordForm').innerText(), locale === 'en' ? /unencrypted/ : /未加密/);
        await page.locator('#backupPasswordCancel').click();
        await page.evaluate(() => { void backupPasswordDialog(false); });
        await assertHelpPlacement(page, '#backupPasswordForm');
        const decryptHelp = page.locator('#backupPasswordHint [data-help]'); await decryptHelp.focus(); assert.equal(await page.locator('#' + await decryptHelp.getAttribute('aria-describedby')).isVisible(), true);
        await page.keyboard.press('Escape'); assert.equal(await page.locator('#backupPasswordForm').isVisible(), true); await page.locator('#backupPasswordCancel').click();
        const checkWidths = async selector => {
          for (const theme of ['light', 'dark']) for (const width of [320, 768, 1280]) {
            await page.setViewportSize({ width, height: 900 }); await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
            await assertHelpPlacement(page, selector);
          }
        };
        await page.evaluate(() => { window.helpEditing = collectSession(); view = 'plan'; renderMain(); }); await checkWidths('#tabBody');
        for (const kind of ['training', 'assessment']) {
          await page.evaluate(kind => itemForm(kind, kind === 'training' ? 'ocular' : cur().plan.find(item => item.copm).id), kind);
          await checkWidths('#itemForm'); await page.evaluate(() => closeModal());
        }
        await page.evaluate(() => clientForm(null)); await checkWidths('.modal'); await page.locator('#cCancel').click();
        await page.evaluate(() => { void scorePreview(cur(), [{ item: 'fixation', date: '2026-11-12', file: 'synthetic.json', dest: 'assess', score: '80%', subject: 'TEST-HELP' }], []); });
        await checkWidths('.modal'); await page.locator('#scoreCancel').click();
        await page.evaluate(async () => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Synthetic clipboard unavailable'); } } }); await copyText('Synthetic clipboard text'); });
        await checkWidths('.modal'); await page.locator('#cClose').click();
        await page.evaluate(() => {
          const s = clone(helpEditing); s.id = 'help_record'; s.visit = 'initial'; s.sym[0].scores.headache = 1;
          s.assess.st_npc = { done: true, values: Object.fromEntries(fieldsFor(cur().plan.find(item => item.id === 'st_npc')).filter(f => f.phase === 'pre' && f.type === 'number').map(f => [f.id, 0])) };
          s.training.ocular = { on: true, acts: ['Fixation'], actScores: { Fixation: '60%' }, eyedot: [{ id: 'help_eye', mode: 'Saccade', speed: 'Slow', dur: '30 seconds' }], runs: [{ id: 'help_run', item: 'fixation', values: {} }] };
          sessions = [s]; editing = null; view = 'dashboard'; renderMain();
        });
        await checkWidths('#tabBody');
        const dashboardHelp = page.locator('.dashboard-findings summary [data-help]').first();
        await dashboardHelp.click(); assert.equal(await dashboardHelp.evaluate(node => node.closest('details').open), false, 'Help does not also toggle its surrounding summary'); await page.keyboard.press('Escape');
        await page.evaluate(() => { view = 'sessions'; renderMain(); }); await checkWidths('#tabBody');
        await page.evaluate(() => { view = 'outcomes'; renderMain(); }); await checkWidths('#tabBody');
        await page.evaluate(() => { editing = clone(sessions[0]); view = 'edit'; renderMain(); });
        await page.locator('#s-subj').fill('Synthetic source problem'); await page.locator('#useSubjectiveProblem').click(); await checkWidths('#soapForm');
        await page.locator('#s-obj').focus(); assert.equal(await page.locator('#workflowPath').innerText(), locale === 'en' ? 'O Assessment' : 'O 評估', 'Inline help does not leak into the workflow path');
        await openTraining(page, 'ocular'); await checkWidths('#trainingResultForm'); await page.locator('#training-cancel').click();
        await openAssessment(page, 'vf'); await checkWidths('#assessmentResultForm'); await page.locator('#assessment-cancel').click();
        await page.locator('#s-visit').selectOption('absent'); await checkWidths('#soapForm');
        await page.evaluate(() => { editing = helpEditing; view = 'edit'; renderMain(); });
        await page.locator('#languageSelect').selectOption(locale === 'en' ? 'zh-TW' : 'en');
        assert.match(await trigger.getAttribute('aria-label'), locale === 'en' ? /說明：復能/ : /Help: Remediation/);
        assert.deepEqual(errors, []); assert.deepEqual(requests, []);
        console.log(`PASS: ${locale}: inline help placement without control shifts across editor/dialogs/settings/client/import/dashboard/progress, compact visuals and 44px targets, hover/focus/tap, Escape isolation, viewport/stacking/contrast, kept-visible notes and unchanged exports`);
      } finally { await context.close(); }
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
