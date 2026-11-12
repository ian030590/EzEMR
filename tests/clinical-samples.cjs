const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { appPath } = require('./lib/app.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'clinical-samples', process.env.EZEMR_REVIEW_LABEL || 'after');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const html = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(html); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
  const page = await context.newPage(); page.setDefaultTimeout(10000);
  const errors = [], outbound = [], evidence = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!/^(http:\/\/127\.0\.0\.1:|data:|blob:)/.test(request.url())) outbound.push(request.url()); });
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const choose = locale => page.locator('#languageSelect').selectOption(locale);
  const screenshot = async (name, target = null) => {
    await page.evaluate(() => { document.activeElement?.blur(); document.querySelectorAll('.toast').forEach(node => node.remove()); });
    if (target) await target.evaluate(node => window.scrollTo(0, scrollY + node.getBoundingClientRect().top - document.querySelector('#applicationBar').getBoundingClientRect().height - 16));
    else await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: path.join(output, name + '.png'), fullPage: false });
  };
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    await page.evaluate(async () => { window.sampleRoot = await (await navigator.storage.getDirectory()).getDirectoryHandle('synthetic-clinical-cases', { create: true }); store = folderStore(sampleRoot); await finishBoot(); });
    await action('new-client').click(); await page.locator('#cf-name').fill('假個案01｜中風偏癱'); await page.locator('#cf-ref').fill('SAMPLE-STROKE');
    await page.locator('#cf-dx').fill('合成測試資料：中風後左側偏癱及左側注意困難');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
    const samples = await page.evaluate(async () => {
      const wheel = { id: 'sample_transfers', category: 'functional', domain: '一般復健（自訂假資料）', name: '輪椅推行／移位任務（自訂假資料）', timing: 'session',
        outcome: '此為假資料中的自訂任務表現紀錄，並非標準化量表。固定路線、移位條件、輔具與協助程度。',
        fields: shortFields([numField('time_s', 'Completion time (s)', { min: 0 }), { id: 'assistance', label: '協助程度（自訂）', type: 'text' }, numField('distance_m', '距離（m，自訂）', { min: 0 })]) };
      const definitions = [
        { key: 'stroke', ref: 'SAMPLE-STROKE', name: '假個案01｜中風偏癱', dx: '合成測試資料：中風後左側偏癱及左側注意困難',
          problem: '室內行走需手杖及旁站；左手取放物品較慢，偶爾忽略左側物品。', task: '居家移動與雙手準備餐點', acts: ['起立與轉位', '手杖步行', '左手取放', '視覺搜尋'],
          metrics: { st_tug: { time_s: [32, 29] }, st_10mwt: { speed_ms: [0.42, 0.47] }, st_bbt: { blocks: [18, 21], hand: ['左手', '左手'] }, st_search: { time_s: [96, 84], omissions: [9, 6], accuracy: [77.5, 85] }, st_neglect: { left: [7, 4], right: [2, 2], bisection_mm: [-14, -10] } }, symptoms: true },
        { key: 'tbi', ref: 'SAMPLE-TBI', name: '假個案02｜腦傷復健', dx: '合成測試資料：腦傷後注意力、上肢協調及社區活動困難',
          problem: '多步驟作業容易遺漏，操作速度慢；忙碌環境中偶有暈眩。', task: '整理工作物品與社區購物', acts: ['多步驟物品整理', '眼手目標點按', '上肢精細操作', '分段休息'],
          metrics: { st_coordination: { time_s: [75, 69], hit_rate: [72, 80], rt_ms: [720, 650], error: [8, 5] }, st_9hpt: { time_s: [48, 44], hand: ['右手', '右手'] }, st_load: { before_load: [1, 2], after_load: [4, 3] } }, symptoms: true },
        { key: 'sci', ref: 'SAMPLE-SCI', name: '假個案03｜脊髓損傷', dx: '合成測試資料：胸髓損傷後截癱，以輪椅移動',
          problem: '使用輪椅，移位板轉位需少量協助；長距離推行後肩部疼痛增加。未施測步行測試。', task: '輪椅到床與馬桶的移位及社區推行', acts: ['移位板轉位', '輪椅推行', '坐姿平衡', '減壓動作練習'],
          metrics: { sample_transfers: { time_s: [85, 76], assistance: ['少量協助', '少量協助'], distance_m: [20, 20] } }, symptoms: false },
        { key: 'reading', ref: 'SAMPLE-READING', name: '假個案04｜低視能閱讀', dx: '合成測試資料：低視能及持續閱讀困難',
          problem: '閱讀帳單與藥袋需較長時間；字級與照明調整後可完成短文。', task: '閱讀帳單及藥袋資訊', acts: ['等難度短文閱讀', '放大工具操作', '照明調整'],
          metrics: { st_reading: { speed: [55, 64], errors: [6, 4], error_rate: [12, 8], comprehension: [70, 80] } }, symptoms: true },
        { key: 'binocular', ref: 'SAMPLE-BINOCULAR', name: '假個案05｜雙眼視覺', dx: '合成測試資料：近距離作業時眼部不適與集合功能問題',
          problem: '電腦近距離作業時出現眼睛疲勞，需分段休息。', task: '電腦文件處理與持續近距離作業', acts: ['集合相關訓練', '近距離作業與休息安排'],
          metrics: { st_npc: { break_cm: [14, 11], recovery_cm: [19, 16], trials: ['14 / 15 / 13 cm', '11 / 12 / 10 cm'] }, st_pfv: { blur: [6, 8], break: [10, 14], recovery: [5, 8] } }, symptoms: true },
        { key: 'orthopedic', ref: 'SAMPLE-MOBILITY', name: '假個案06｜一般步行復健', dx: '合成測試資料：髖部術後步行與日常活動復健',
          problem: '使用助行器步行，起立時動作較慢；活動後疼痛暫增。', task: '室內行走、起立與日常穿衣', acts: ['助行器步行', '起立與轉位', '穿衣活動練習'],
          metrics: { st_tug: { time_s: [38, 35] }, st_10mwt: { speed_ms: [0.36, 0.4] } }, symptoms: false }
      ];
      const result = [];
      for (const [index, def] of definitions.entries()) {
        const first = index === 0 ? clone(cur()) : { id: 'sample_' + def.key, dob: '', doi: '', eyeSurgery: null, created: '2026-10-01' };
        const c = { ...first, name: def.name, ref: def.ref, dx: def.dx, referral: '完全虛構，供操作與畫面檢查；不得用於真實診療。', plan: clone(DEFAULT_PLAN),
          trainingPlan: [{ k: 'sample_rehab', label: def.task + '（假資料訓練）', acts: def.acts, fields: [] }] };
        if (def.key === 'sci') c.plan.push(clone(wheel));
        const selected = ['copm', 'daily_task', 'st_tolerance', ...Object.keys(def.metrics)];
        if (!def.symptoms) c.plan.find(p => p.id === 'st_tolerance').category = 'functional';
        c.plan.forEach(p => { p.initial = selected.includes(p.id); p.active = selected.includes(p.id); });
        await store.saveClient(c);
        const recordIds = [];
        for (let visitIndex = 0; visitIndex < 3; visitIndex++) {
          const visit = ['baseline', 'treatment', 'post'][visitIndex], date = ['2026-10-05', '2026-10-12', '2026-10-19'][visitIndex];
          const s = { ...blankSession(), id: 'sample_' + def.key + '_' + visitIndex, date, visit, num: visitIndex + 1, clinician: '假資料治療師', duration: 40,
            subjective: def.problem, objective: '假資料：輔具、協助程度、環境與測試條件均記錄於各項結果；未施測項目保留空白。',
            assessment: '僅描述此次任務前後表現；需考量練習效應與波動，功能成效及耐受性分別觀察。',
            plan: '依個案目標追蹤日常活動與任務表現。此內容為虛構操作情境。', nextDate: visitIndex < 2 ? ['2026-10-12', '2026-10-19'][visitIndex] : '',
            assess: {}, training: { sample_rehab: { on: true, acts: def.acts, dur: 25, diff: 4, program: '一般復健（假資料）', notes: '依任務需求安排休息，紀錄輔具與協助程度。', actScores: {} } },
            sym: shapeSym([], visit), peo: { person: def.problem, environment: '固定明亮安靜環境與原使用輔具。', occupation: def.task },
            clinicalLinks: [{ id: 'link_' + def.key, category: 'functional', symptom: def.problem, reasoning: '依目前任務結果與日常活動需求設定目標；沒有將單次分數差直接當作療效證明。',
              peo: ['person', 'environment', 'occupation'], evidence: Object.keys(def.metrics), evidenceNotes: '假資料，非標準化研究或醫囑。', interventions: [], interventionNotes: def.acts.join('、') }] };
          if (def.symptoms) {
            s.sym.find(r => r.kind === 'pre').scores = { ef: 2, bv: 1, dz: def.key === 'tbi' ? 2 : 0, ha: 0, na: 0 };
            s.sym.find(r => r.kind === 'end').scores = { ef: 3, bv: 1, dz: def.key === 'tbi' ? 3 : 0, ha: 0, na: 0 };
          }
          s.assess.daily_task = { done: true, values: { task: def.task, performance: visitIndex ? '假資料：以原輔具完成，所需提示較前次少。' : '假資料：需要提示與協助。' }, notes: '未採用額外標準化量表分數。' };
          if (visit !== 'treatment') s.assess.copm = { done: true, copm: [{ occ: def.task, perf: visitIndex ? 6 : 3, sat: visitIndex ? 6 : 3 }], notes: '虛構個案自評分數，基準與療程後比較。' };
          for (const [id, metrics] of Object.entries(def.metrics)) {
            const primary = fieldsFor(c.plan.find(p => p.id === id)).find(f => f.id === 'pre_' + Object.keys(metrics)[0]);
            const values = { pre_context: '09:00，等值題型 A', post_context: '09:45，結束後 5 分鐘；等值題型 B', protocol: '固定輔具、測試距離與協助條件；僅為虛構示例。', primary: labelText(primary.label) };
            if (id === 'st_coordination') values.protocol = '假資料：25 次目標點按；完成時間用秒、反應時間用 ms、命中率用 %、點按位置誤差用 mm。固定設備與位置。';
            if (id === 'st_reading') values.protocol = '假資料：等難度的 50 字中文短文，原始閱讀速度為字／分；錯誤率分母 50 字，理解題 10 題。固定字級、對比與照明，非 MNREAD 量表。';
            if (id === 'sample_transfers') values.protocol = '假資料：固定 20 m 輪椅路線後接移位板到床，完成時間涵蓋整段任務；固定座高、輔具及少量協助。自訂任務，非標準化量表。';
            for (const [key, [pre, post]] of Object.entries(metrics)) {
              const field = fieldsFor(c.plan.find(p => p.id === id)).find(f => f.id === 'pre_' + key);
              const scaled = pre;
              values['pre_' + key] = typeof scaled === 'number' ? field?.step === 1 ? Math.round(scaled) : Math.round(scaled * 100) / 100 : scaled;
              values['post_' + key] = post;
            }
            if (id === 'st_search') { values.pre_time_s = [96, 90, 86][visitIndex]; values.post_time_s = [84, 80, 76][visitIndex]; values.post_errors = 0; values.followup_context = date.replace(/\d{2}$/, day => String(Number(day) + 2).padStart(2, '0')) + ' 09:00，48 小時'; values.followup_time_s = 88 - visitIndex * 4; }
            s.assess[id] = { done: true, values, notes: '假資料；改善方向與重要性需由臨床另行判斷。' };
          }
          s.assess.st_tolerance = { done: true, values: def.symptoms ? { pre_symptom_0: 2, post_symptom_0: 3, post_symptom_1: 0, recovery_symptom_0: 2, recovery_context: '10:00，結束後 20 分鐘', recovery_min: 20 } : { pre_symptom_5: 3, post_symptom_5: 4, recovery_symptom_5: 3, recovery_min: 20 }, notes: '症狀屬耐受性結果，與功能成效分開。' };
          s.assessmentPlan = clone(c.plan.filter(p => s.assess[p.id]?.done)); s.trainingPlan = clone(c.trainingPlan);
          validateRecord(c, s); await store.saveSession(c.id, s); recordIds.push(s.id);
        }
        if (def.key === 'tbi') {
          const s = { ...blankSession(), id: 'sample_tbi_absent', date: '2026-10-26', num: 4, visit: 'absent', sym: [], assess: {}, training: {}, subjective: '', objective: '', assessment: '', plan: '', absence: { reason: '事先請假', notified: '是，事先通知', contact: '假資料：已聯絡改約。' }, nextDate: '2026-11-02' };
          validateRecord(c, s); await store.saveSession(c.id, s); recordIds.push(s.id);
        }
        result.push({ key: def.key, id: c.id, name: c.name, ref: c.ref, records: recordIds.length });
      }
      await finishBoot(); return result;
    });
    assert.equal(samples.length, 6); assert.equal(samples.reduce((sum, c) => sum + c.records, 0), 19);
    await fs.writeFile(path.join(output, 'cases.json'), JSON.stringify(samples, null, 2));
    const backupPromise = page.waitForEvent('download');
    await page.locator('#exportMenuButton').click(); await action('export-all').click();
    await (await backupPromise).saveAs(path.join(output, 'synthetic-records.json'));
    for (const sample of samples) {
      await page.locator('#clientSearch').fill(sample.ref); await page.locator(`.client-btn[data-id="${sample.id}"]`).click();
      await page.waitForSelector('#patientDashboard');
      if (['sci', 'orthopedic'].includes(sample.key)) {
        const summary = page.locator('#dashboardTolerability');
        assert.match(await summary.innerText(), /疼痛/);
        assert.match(await summary.innerText(), /3/); assert.match(await summary.innerText(), /4/);
        assert.doesNotMatch(await page.locator('#patientDashboard').innerText(), /尚未填寫症狀評分/);
        await choose('en');
        assert.equal(await page.locator('.dashboard-score-head h4').evaluate(node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; }), 'Symptoms and tolerability');
        assert.match(await summary.innerText(), /Pain/);
      }
      await choose('zh-TW'); await screenshot(sample.key + '-dashboard-zh-1440');
      assert.doesNotMatch(await page.locator('#clinicalMap').innerText(), /工具／流程／計分規則／測試條件/);
      assert.ok(await page.locator('#clinicalMap').innerText().then(text => text.length) < 1600, 'Dashboard evidence summarises measurements without repeating the full protocol');
      await page.locator('#tab-sessions').click(); assert.equal(await page.locator('.sess').count(), sample.records);
      await page.locator('#tab-outcomes').click();
      const panels = await page.locator('#tabBody > .panel').evaluateAll(nodes => nodes.map(node => ({ title: node.querySelector('h3')?.textContent, columns: Math.max(0, ...[...node.querySelectorAll('thead')].map(head => head.querySelectorAll('th').length)),
        viewportWidth: node.querySelector('.scroll')?.clientWidth, tableWidth: node.querySelector('table')?.scrollWidth, text: node.textContent.slice(0, 200) })));
      evidence.push({ key: sample.key, panels });
      await fs.writeFile(path.join(output, 'observations.json'), JSON.stringify(evidence, null, 2));
      const symptomPanel = page.locator('#tabBody > .panel').filter({ has: page.getByRole('heading', { name: '症狀評分（0 至 10）', exact: true }) });
      if (['sci', 'orthopedic'].includes(sample.key)) assert.equal(await symptomPanel.count(), 0, 'Unrated vision symptoms must not produce an empty table');
      else assert.deepEqual(await symptomPanel.locator('thead th').allTextContents(), ['日期', '眼睛疲勞', '視線模糊', '頭暈', '頭痛', '噁心', '總分', '恢復時間']);
      const compact = page.locator('.short-outcomes');
      assert.ok(await compact.count());
      for (const panel of await compact.all()) {
        assert.equal(await panel.locator('.short-record').count(), 3);
        for (const table of await panel.locator('table').all()) {
          assert.ok(await table.locator('thead th').count() <= 7, 'Stages must be rows rather than dozens of columns');
          assert.ok(await table.locator('tbody tr').count() >= 2);
          assert.doesNotMatch((await table.locator('thead th').allTextContents()).join(' '), /訓練前 2|24–72/);
        }
      }
      assert.match((await page.locator('#tabBody > .section-heading h3').allTextContents()).join(' '), /功能表現/);
      if (sample.key === 'stroke') {
        const search = page.locator('[data-item-id="st_search"]').first();
        assert.match(await search.locator('tbody').first().innerText(), /2026-10-07/);
        assert.match(await search.locator('tbody').first().innerText(), /\b0\b/);
        await search.locator('.short-notes > summary').first().focus(); await page.keyboard.press('Enter');
        assert.equal(await search.locator('.short-notes').first().getAttribute('open'), '');
        assert.match(await search.locator('.short-facts').first().innerText(), /固定輔具/);
      }
      await screenshot(sample.key + '-outcomes-zh-1440');
      await screenshot(sample.key + '-comparison-zh-1440', compact.first());
      if (sample.key === 'sci') assert.equal(await page.locator('#tabBody').getByRole('heading', { name: /TUG|10MWT/ }).count(), 0);
      for (const locale of ['zh-TW', 'en']) {
        await choose(locale);
        assert.equal(await compact.first().locator('thead th').first().evaluate(node => { const label = node.cloneNode(true); label.querySelectorAll('.help').forEach(help => help.remove()); return label.textContent; }), locale === 'en' ? 'Measurement stage' : '測量時點');
        assert.equal(await compact.first().locator('.short-notes > summary').first().innerText(), locale === 'en' ? 'Test conditions and notes' : '測驗條件與備註');
        assert.match((await page.locator('#tabBody > .section-heading h3').allTextContents()).join(' '), locale === 'en' ? /Functional performance/ : /功能表現/);
        const symptomHeading = locale === 'en' ? 'Symptom rating (0 to 10)' : '症狀評分（0 至 10）';
        const symptom = page.locator('#tabBody > .panel').filter({ has: page.getByRole('heading', { name: symptomHeading, exact: true }) });
        if (await symptom.count()) assert.deepEqual((await symptom.locator('thead th').allTextContents()).slice(1, 6), locale === 'en' ? ['Eye fatigue', 'Blurred vision', 'Dizziness', 'Headache', 'Nausea'] : ['眼睛疲勞', '視線模糊', '頭暈', '頭痛', '噁心']);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
          for (const width of [360, 1280]) {
            await page.setViewportSize({ width, height: 900 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${sample.key} ${locale} ${theme} ${width}px`);
            if (width === 360 && sample.key === 'stroke') {
              const comparison = compact.first();
              const scrollHint = await page.evaluate(() => ui('可左右捲動查看更多指標與測量時間。'));
              const scrollTip = comparison.locator('.help-tooltip').filter({ hasText: scrollHint }).first();
              const scrollTrigger = comparison.locator(`[aria-describedby="${await scrollTip.getAttribute('id')}"]`);
              await page.locator('#tab-outcomes').focus(); await scrollTrigger.focus(); assert.equal(await scrollTip.isVisible(), true); await page.keyboard.press('Escape');
              const visibleValue = await comparison.locator('tbody tr').first().locator('td').first().evaluate(node => ({ text: node.textContent, right: node.getBoundingClientRect().right, viewport: innerWidth }));
              assert.equal(visibleValue.text, '96');
              assert.ok(visibleValue.right <= visibleValue.viewport, 'The first outcome value is visible on a phone before horizontal scrolling');
            }
            if ((sample.key === 'stroke' || sample.key === 'sci') && ((locale === 'zh-TW' && theme === 'light') || (locale === 'en' && theme === 'dark'))) await screenshot(`${sample.key}-outcomes-${locale}-${theme}-${width}`, compact.first());
          }
        }
      }
      await page.setViewportSize({ width: 1440, height: 1000 }); await page.evaluate(() => document.documentElement.dataset.theme = 'light'); await choose('zh-TW');
      await page.locator('#tab-sessions').click(); await action('open-session').click();
      assert.equal(await page.locator('#s-subj').inputValue(), await page.evaluate(() => editing.subjective));
      await screenshot(sample.key + '-editor-zh-1440');
      if (['sci', 'orthopedic'].includes(sample.key)) {
        assert.equal(await page.locator('#optionalVisualSymptoms').getAttribute('open'), null);
        assert.equal(await page.locator('#symWrap').isVisible(), false);
        await page.locator('#optionalVisualSymptoms > summary').focus(); await page.keyboard.press('Enter');
        assert.equal(await page.locator('#symWrap').isVisible(), true);
        await page.keyboard.press('Enter');
        await choose('en');
        assert.equal(await page.locator('#optionalVisualSymptoms > summary').innerText(), 'Vision-related symptom self-ratings (optional)');
        assert.equal(await page.locator('#assess-short #optionalVisualSymptoms').count(), 0);
        assert.equal(await page.locator('.soap-sec').nth(1).locator('#optionalVisualSymptoms').count(), 1, 'Optional symptoms are at the O entry');
        await choose('zh-TW');
      }
      assert.equal(await page.locator('#soapForm').evaluate(form => form.checkValidity()), true, `${sample.key}: generated sample respects field constraints`);
      await action('save-session').click();
      try { await page.waitForSelector('.sess', { timeout: 30000 }); }
      catch (error) {
        await fs.writeFile(path.join(output, 'save-failure.json'), JSON.stringify({ sample: sample.key, errors, outbound, state: await page.evaluate(() => ({ view, savingSession, savingItems, patientReady, dirty, client: cur()?.ref, toasts: [...document.querySelectorAll('.toast')].map(node => node.textContent), dialog: document.querySelector('.modal')?.innerText, stored: sessions.map(session => session.id) })) }, null, 2));
        await page.screenshot({ path: path.join(output, 'save-failure.png'), fullPage: true });
        throw error;
      }
    }
    await fs.writeFile(path.join(output, 'observations.json'), JSON.stringify(evidence, null, 2));
    // Copy the browser's isolated folder to an inspectable collection, including the generated PDF/TXT files.
    const files = await page.evaluate(async () => {
      const files = [];
      const walk = async (dir, prefix = '') => { for await (const [name, handle] of dir.entries()) {
        if (handle.kind === 'directory') await walk(handle, prefix + name + '/');
        else { const bytes = new Uint8Array(await (await handle.getFile()).arrayBuffer()); let text = ''; for (const byte of bytes) text += String.fromCharCode(byte); files.push({ name: prefix + name, base64: btoa(text) }); }
      } };
      await walk(sampleRoot); return files;
    });
    const recordsDir = path.join(output, 'records'); await fs.mkdir(recordsDir, { recursive: true });
    for (const file of files) {
      const target = path.resolve(recordsDir, file.name); assert.ok(target.startsWith(recordsDir + path.sep));
      await fs.mkdir(path.dirname(target), { recursive: true }); await fs.writeFile(target, Buffer.from(file.base64, 'base64'));
    }
    const backup = JSON.parse(await fs.readFile(path.join(output, 'synthetic-records.json'), 'utf8'));
    assert.equal(backup.clients.length, 6); assert.ok(files.some(f => f.name.endsWith('.pdf')));
    await fs.writeFile(path.join(output, 'README.md'), '# Synthetic rehabilitation records\n\nSix fictional patients and 19 records: stroke/hemiparesis, traumatic brain injury, spinal cord injury/wheelchair transfers, low-vision reading, binocular vision, and postoperative mobility. All names and notes are synthetic.\n\nImport `synthetic-records.json` using the application Import button, or use File > Open a record folder and choose `records/`. Keep this collection separate from real records. The folder contains clients.csv and each visit\'s CSV/PDF/TXT files.\n\nPNG files show actual Playwright browser views in both languages and themes. `observations.json` records table widths and headings.\n');
    // Saving an untouched translated seed must retain its canonical labels for later language changes.
    await page.locator('#tab-plan').click(); await action('plan-add').click();
    const seed = await page.evaluate(() => DEFAULT_PLAN.filter(p => !p.copm).findIndex(p => p.id === 'st_tug'));
    await page.locator('#item-base').selectOption(String(seed));
    await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' });
    const added = await page.evaluate(() => cur().plan.at(-1));
    assert.equal(added.name, 'Timed Up and Go (short-term TUG)');
    assert.equal(added.fields[1].label, 'Completion time (s)');
    await choose('en'); assert.equal(await page.locator(`[data-item-id="${added.id}"] h4`).innerText(), 'Mobility (TUG)');
    await page.locator(`[data-action="item-edit"][data-id="${added.id}"]`).click();
    await page.locator('#item-name').fill('自訂移位測試');
    await page.locator('#itemForm [type="submit"]').click(); await page.waitForSelector('#itemForm', { state: 'detached' });
    await choose('zh-TW'); await choose('en');
    assert.equal(await page.evaluate(() => cur().plan.at(-1).name), '自訂移位測試');
    assert.deepEqual(errors, []); assert.deepEqual(outbound, []);
    console.log('PASS: Six synthetic cases (stroke, TBI, spinal cord injury, low vision, binocular vision and mobility), 19 records, browser save/reopen, bilingual light/dark layouts and local backup/CSV/PDF/TXT collection');
  } finally { await context.close(); await browser.close(); await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
