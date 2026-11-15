const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const output = path.resolve(__dirname, '..', '.tmp', 'verification', 'editor-compact');
const evidence = [];

async function settleLayout(page) {
  await page.evaluate(async () => {
    let last = '', stable = 0;
    for (let frame = 0; frame < 120; frame++) {
      await new Promise(requestAnimationFrame);
      const sample = JSON.stringify([scrollY, ...[...document.querySelectorAll('.app-chrome, #editorWorkflow, #soapForm, #backupReminder')].map(node => {
        const r = node.getBoundingClientRect(); return [r.x, r.y, r.width, r.height];
      })]);
      stable = sample === last ? stable + 1 : 0; last = sample;
      if (stable >= 2) return;
    }
    throw new Error('Editor layout did not settle');
  });
}

async function scrollTo(page, top) {
  await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
  await settleLayout(page);
}

async function targetVisible(page, selector) {
  await settleLayout(page);
  const bounds = await page.locator(selector).evaluate(node => {
    const r = node.getBoundingClientRect(), bar = document.getElementById('editorWorkflow').getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, bar: bar.bottom, viewport: innerHeight };
  });
  assert.ok(bounds.top >= bounds.bar + 10, `${selector}: target starts below the current workflow bar: ${JSON.stringify(bounds)}`);
  assert.ok(bounds.top < bounds.viewport - 44, `${selector}: target is on screen`);
}

async function stepsFit(page) {
  await settleLayout(page);
  const result = await page.locator('#editorWorkflow').evaluate(bar => {
    const r = bar.getBoundingClientRect(), steps = bar.querySelector('.workflow-steps');
    return { scroll: steps.scrollWidth, width: steps.clientWidth, buttons: [...steps.querySelectorAll('button')].map(button => {
      const b = button.getBoundingClientRect(); return b.left >= r.left && b.right <= r.right && b.top >= r.top && b.bottom <= r.bottom;
    }) };
  });
  assert.ok(result.buttons.length >= 7 && result.buttons.every(Boolean), 'Every expanded step is visible inside the workflow bar');
  assert.ok(result.scroll <= result.width, 'The expanded step strip wraps without horizontal scrolling');
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
    for (const locale of ['zh-TW', 'en']) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
      const page = await context.newPage(), errors = [], outbound = [];
      page.setDefaultTimeout(10000);
      page.on('pageerror', error => errors.push(error.message));
      const url = `http://127.0.0.1:${server.address().port}/`;
      await context.route('**/*', route => {
        if (route.request().url().startsWith(url) || route.request().url().startsWith('data:')) return route.continue();
        outbound.push(route.request().url()); return route.abort();
      });
      try {
        await page.goto(url); await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
        await page.locator('#languageSelect').selectOption(locale);
        await page.evaluate(async () => {
          const root = await (await navigator.storage.getDirectory()).getDirectoryHandle('compact-editor-records', { create: true });
          store = folderStore(root); await finishBoot();
        });
        await page.locator('[data-action="example"]:visible').click();
        await page.waitForFunction(() => sessions.length === 4);
        await page.waitForSelector('#backupReminder');
        await page.evaluate(() => document.querySelectorAll('.toast').forEach(node => node.remove()));
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await scrollTo(page, 0);
          const dashboard = await page.evaluate(() => {
            const panel = document.querySelector('#tabBody .panel'), reminder = document.getElementById('backupReminder');
            const r = reminder.getBoundingClientRect(), p = reminder.querySelector('p').getBoundingClientRect(), buttons = reminder.querySelector('.row').getBoundingClientRect();
            return { contentTop: panel.getBoundingClientRect().top, reminderHeight: r.height, singleRow: Math.abs(p.top + p.height / 2 - buttons.top - buttons.height / 2) < 2,
              disclosures: [...document.querySelectorAll('.patient-details > details')].map(node => { const b = node.getBoundingClientRect(); return { top: b.top, width: b.width, summaryHeight: node.querySelector('summary').getBoundingClientRect().height }; }) };
          });
          assert.ok(dashboard.contentTop <= 470, `${locale}: dashboard begins at ${dashboard.contentTop}px`);
          assert.ok(dashboard.reminderHeight <= 60 && dashboard.singleRow, 'Backup reminder is one slim row');
          assert.equal(dashboard.disclosures.length, 2);
          assert.ok(Math.abs(dashboard.disclosures[0].top - dashboard.disclosures[1].top) < 1);
          assert.ok(Math.abs(dashboard.disclosures[0].width - dashboard.disclosures[1].width) < 1);
          assert.ok(dashboard.disclosures.every(d => d.summaryHeight >= 44));
          evidence.push({ locale, theme, dashboard });
          await page.screenshot({ path: path.join(output, `${locale}-${theme}-dashboard.png`) });
        }
        await page.evaluate(() => {
          editing = clone(sessions.find(session => session.visit === 'baseline'));
          editing.sym = shapeSym(editing.sym, editing.visit); editorWorkflow = null; dirty = false; view = 'edit'; renderMain(); window.scrollTo(0, 0);
        });
        const recordId = await page.evaluate(() => editing.id);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          await page.setViewportSize({ width: 1440, height: 900 }); await scrollTo(page, 0);
          await page.locator('#s-date').focus(); await settleLayout(page);
          assert.equal(await page.locator('#editorWorkflow').evaluate(node => node.classList.contains('is-compact')), false);
          await stepsFit(page);
          assert.equal(await page.locator('#workflowSave').isVisible(), false, 'Desktop has one Save action in the application bar');
          const natural = await page.locator('#editorWorkflow').evaluate(node => ({ top: node.getBoundingClientRect().top + scrollY, inset: parseFloat(getComputedStyle(node).top), form: document.getElementById('soapForm').getBoundingClientRect().top + scrollY }));
          const threshold = natural.top - natural.inset;
          for (const direction of [1, -1]) {
            const states = [];
            for (let offset = -30; offset <= 30; offset += 2) {
              const requested = Math.round(threshold + offset * direction);
              await scrollTo(page, requested);
              const state = await page.evaluate(() => ({ y: scrollY, compact: document.getElementById('editorWorkflow').classList.contains('is-compact'), form: document.getElementById('soapForm').getBoundingClientRect().top + scrollY }));
              assert.ok(Math.abs(state.y - requested) <= 1, `Compacting does not change the requested scroll position: ${requested} -> ${JSON.stringify(state)}`);
              assert.ok(Math.abs(state.form - natural.form) <= 1, 'Compacting reserves the expanded bar space');
              states.push(state.compact);
            }
            assert.equal(states.filter((state, index) => index && state !== states[index - 1]).length, 1, 'Slow threshold crossing changes state once in each direction');
          }
          await scrollTo(page, threshold + 250);
          assert.equal(await page.locator('#editorWorkflow').evaluate(node => node.classList.contains('is-compact')), true);
          const compact = await page.locator('#editorWorkflow').boundingBox();
          assert.ok(compact.height <= 64, `${locale}: desktop compact height ${compact.height}`);
          assert.equal(await page.locator('.workflow-identity').evaluate(node => node.scrollWidth <= node.clientWidth), true, `${locale}: the full demo identity fits at 1440px`);
          assert.equal(await page.locator('#workflowSections').getAttribute('aria-expanded'), 'false');
          await page.locator('#workflowSections').click(); await stepsFit(page);
          assert.equal(await page.locator('#workflowSections').getAttribute('aria-expanded'), 'true');
          await page.locator('#workflowSections').click();
          await page.locator('[data-workflow-go="interview"]').focus(); await stepsFit(page);
          assert.equal(await page.locator('#workflowSections').getAttribute('aria-expanded'), 'true', 'Keyboard focus reveals the steps');
          await page.locator('[data-workflow-go="reasoning"]').click();
          await targetVisible(page, '#clinicalLinks');
          await page.locator('#workflowAssessment').selectOption('pursuit');
          await targetVisible(page, '#as-pursuit');
          const title = await page.locator('.workflow-identity').getAttribute('title');
          assert.ok(title.includes('DEMO') && title.includes(await page.evaluate(() => fmtDate(editing.date))));
          evidence.push({ locale, theme, desktopCompact: compact.height });
          await page.screenshot({ path: path.join(output, `${locale}-${theme}-desktop-compact.png`) });
          for (const width of [900, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 844 }); await settleLayout(page);
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${locale} ${theme} ${width}: no page overflow`);
            if (width === 900) {
              const row = await page.locator('#editorWorkflow').evaluate(bar => {
                const r = bar.getBoundingClientRect();
                return { height: r.height, rows: getComputedStyle(bar).gridTemplateRows.split(/\s+/).length,
                  fits: [...bar.querySelectorAll('.workflow-identity, #workflowPath, #workflowDirty, #workflowSections, .workflow-picker, #workflowBack')].every(node => { const b = node.getBoundingClientRect(); return b.left >= r.left && b.right <= r.right && b.top >= r.top && b.bottom <= r.bottom; }) };
              });
              assert.ok(row.height <= 64 && row.rows === 1 && row.fits, 'The 900px desktop workflow stays in one row inside its bar');
              await page.locator('.workflow-identity').evaluate(node => { const summary = node.querySelector('.workflow-summary'); node.originalIdentity = summary.textContent; summary.textContent = node.title = 'Synthetic long client name '.repeat(8) + node.originalIdentity; });
              await settleLayout(page);
              assert.equal(await page.locator('.workflow-identity').evaluate(node => node.scrollWidth > node.clientWidth && node.title === node.querySelector('.workflow-summary').textContent && getComputedStyle(node).textOverflow === 'ellipsis'), true, 'Long desktop identities keep ellipsis and the complete title');
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'Long desktop identities do not overflow the page');
              await page.locator('.workflow-identity').evaluate(node => { node.querySelector('.workflow-summary').textContent = node.title = node.originalIdentity; delete node.originalIdentity; });
              await settleLayout(page);
            }
            if (width === 390) {
              await scrollTo(page, 1200);
              const phone = await page.evaluate(() => {
                const bar = document.getElementById('editorWorkflow').getBoundingClientRect(), chrome = document.getElementById('applicationBar').getBoundingClientRect();
                return { height: bar.height, top: bar.top, chromeBottom: chrome.bottom, chromePosition: getComputedStyle(document.getElementById('applicationBar')).position, state: document.getElementById('editorWorkflow').className, focus: document.activeElement.id };
              });
              assert.equal(phone.chromePosition, 'static'); assert.ok(phone.chromeBottom < 0);
              assert.ok(phone.height + Math.max(phone.top, 0) <= 112, `${locale}: phone sticky height ${JSON.stringify(phone)}`);
              assert.equal(await page.locator('#workflowSave').isVisible(), true);
              assert.equal(await page.locator('#workflowSave').isDisabled(), await page.locator('#toolbarSave').isDisabled());
              assert.equal(await page.locator('#workflowSave').getAttribute('data-action'), 'save-session');
              assert.equal(await page.locator('#workflowSave').getAttribute('data-needs'), 'draft');
              evidence.push({ locale, theme, phoneCompact: phone });
              await page.screenshot({ path: path.join(output, `${locale}-${theme}-phone-compact.png`) });
            }
          }
        }
        await page.setViewportSize({ width: 390, height: 844 });
        await page.evaluate(() => { window.attendedDraft = collectSession(); editing = { ...clone(editing), visit: 'absent' }; renderEditor(); window.scrollTo(0, 0); });
        await settleLayout(page);
        const absenceGeometry = () => page.locator('#soapForm').evaluate(node => {
          const bar = document.getElementById('editorWorkflow'), style = getComputedStyle(bar);
          return { form: node.getBoundingClientRect().top + scrollY, height: bar.getBoundingClientRect().height, expanded: style.getPropertyValue('--workflow-expanded-height'), margin: style.marginBottom, state: bar.className, y: scrollY };
        });
        const absenceBefore = await absenceGeometry();
        await scrollTo(page, 1200);
        assert.equal(await page.locator('#editorWorkflow').evaluate(node => node.classList.contains('is-compact')), true);
        const absenceAfter = await absenceGeometry();
        assert.ok(Math.abs(absenceAfter.form - absenceBefore.form) <= 1, `The smaller absence editor also reserves its form position: ${JSON.stringify({ absenceBefore, absenceAfter })}`);
        assert.ok((await page.locator('#editorWorkflow').boundingBox()).height <= 112);
        await page.evaluate(() => { editing = attendedDraft; renderEditor(); });
        await page.evaluate(() => {
          const field = document.getElementById('s-subj'); field.value = 'Compact workflow save proof'; field.dispatchEvent(new Event('input', { bubbles: true }));
          const save = store.saveSession.bind(store);
          window.compactSaveGate = new Promise(resolve => { window.finishCompactSave = resolve; });
          store.saveSession = async (...args) => { await compactSaveGate; return save(...args); };
        });
        await scrollTo(page, 1200);
        await page.locator('#workflowSave').click();
        await page.waitForFunction(() => savingSession);
        assert.equal(await page.locator('#workflowSave').isDisabled(), true);
        assert.equal(await page.locator('#toolbarSave').isDisabled(), true, 'Both Save controls are disabled during the same write');
        await page.evaluate(() => finishCompactSave());
        await page.waitForFunction(() => !savingSession && view !== 'edit');
        assert.equal(await page.evaluate(async id => (await store.listSessions(curId)).find(session => session.id === id).subjective, recordId), 'Compact workflow save proof', 'Compact Save persists the edited record to the OPFS folder');
        assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
        console.log(`PASS: ${locale}: expanded/compact workflow, hysteresis, jumps, phone Save, dashboard, themes and overflow`);
      } finally { await context.close(); }
    }
    await fs.writeFile(path.join(output, 'evidence.json'), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence));
  } finally { if (browser) await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
