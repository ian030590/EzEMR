// Score files from OcuTrain (JSON and CSV) and the UFOV-style peripheral field training program (statistics CSV).
// Every file here is synthetic and only follows each program's export format.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification');
const evidence = [];
const check = name => { evidence.push(name); console.log('PASS: ' + name); };

// OcuTrain CSV: "# Key: Value" report lines, then the gaze sample table.
const otCSV = meta => '﻿' + ['# -- Oculomotor Rehabilitation Training System Test Report --', ...Object.entries(meta).map(([k, v]) => `# ${k}: ${v}`),
  '# ------------------------------------------------------------', 'sample_index,trial_time_ms,phase', '0,0,center', '1,16.7,outward'].join('\r\n') + '\r\n';
const otJSON = data => JSON.stringify({ subject_id: 'TEST-SCORES', calibration: { screenWidthCm: 53, screenHeightCm: 30, viewingDistanceCm: 60 },
  eye_tracking: { source: 'tobii', enabled: true }, gaze_path: '[]', blink_sec: null, ...data }, null, 2);
// Peripheral program statistics CSV: plain header, then fully quoted rows of name, code, value, unit and details.
const ufovCSV = (rows, subtest, mode) => '﻿' + ['參數項目,參數代碼,設定數值,單位,詳細說明', ...[
  ['測驗日期', 'test_date', '2026-11-03', 'YYYY-MM-DD', '測驗進行日期'],
  ['測驗時間', 'test_time', subtest === 2 ? '10:40:05' : '10:31:00', 'HH:mm:ss', '測驗完成時間'],
  ['受試者代號', 'subject_id', 'TEST-SCORES', '-', '受試者識別碼'],
  ['測驗項目代碼', 'subtest_code', `Subtest ${subtest}`, '-', 'UFOV 測驗核心項目'],
  ['測驗模式', 'test_mode', mode === 'formal' ? '正式紀錄 (Formal)' : '練習模式 (Practice)', '-', mode],
  ['終止條件設定', 'stop_condition', '80%信度自適應階梯 (Adaptive 80%)', '-', 'adaptive_80'],
  ...rows
].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\r\n');
const dirRow = (axis, name, percent, shown, correct) => [`8方向空間搜尋-${name} (${axis})`, `spatial_dir_${axis}_${name}`, percent == null ? '未測試' : `${percent}%`, percent == null ? '-' : '% (百分比)',
  `呈現 ${shown} 次, 答對 ${correct} 次, 平均作答耗時 ${shown ? '1500 ms' : 'N/A'}`];
const file = (name, text, mimeType = name.endsWith('.json') ? 'application/json' : 'text/csv') => ({ name, mimeType, buffer: Buffer.from(text) });

const pursuitJSON = file('TEST-SCORES_eye-training-pursuit-20261103-101530.json', otJSON({
  session_id: 'sess-pursuit-1', module: 'pursuit', mode: 'evaluation', end_reason: 'evaluation_complete', completed_targets: 16, actual_duration_ms: 45210,
  settings: { mode: 'evaluation', stimulusType: 'red_in_white', ballArcmin: 45, changeMs: 500, speedArcminSec: 240, totalSec: 45, directions: ['rightUp', 'leftMiddle'] },
  accuracy_rate: 76.4, in_threshold_sec: 30.5, valid_sec: 39.9, threshold_deg: 2.5, stimulus: { arcmin: 45, type: 'red_in_white', selected_directions: ['rightUp', 'leftMiddle'] },
  diplopia_questionnaire_status: 'completed', ended_at: '2026-11-03T02:15:30.000Z',
  diplopia_questionnaire: { source_session_id: 'sess-pursuit-1', source_module: 'pursuit', responses: [{ direction: 'rightUp', no_diplopia: false, onset_angle_deg: 12.34 }, { direction: 'leftMiddle', no_diplopia: true, onset_angle_deg: null }] }
}));
// The same pursuit run exported as CSV is listed once.
const pursuitCSV = file('TEST-SCORES_20261103_101530_PURSUIT_Tobii_gaze_record.csv', otCSV({ 'Subject ID': 'TEST-SCORES', 'Session ID': 'sess-pursuit-1', 'Test Date': '2026-11-03',
  'Test Time': '10:15:30', 'Training Module': 'Smooth Pursuit (PURSUIT)', 'Gaze Accuracy Rate': '76.4 %', 'Test Termination Reason': 'evaluation_complete' }));
const fixationCSV = file('TEST-SCORES_20261103_102241_FIXATION_WebGazer_gaze_record.csv', otCSV({
  'Subject ID': 'TEST-SCORES', 'Session ID': 'sess-fixation-1', 'Test Date': '2026-11-03', 'Test Time': '10:22:41', 'Training Module': 'Fixation (FIXATION)', 'Test Mode': 'Evaluation',
  'Module Settings': JSON.stringify({ mode: 'evaluation', stimulusType: 'white_dot', ballArcmin: 60, changeMs: 500, speedArcminSec: 300, holdSec: 3, totalSec: 60, directions: ['middleUp', 'middleDown'] }),
  'Display Physical Width': '53 cm', 'Viewing Distance': '55 cm', 'Stimulus Type': 'White dot', 'Stimulus Size': '60 arcmin (1.00 deg)', 'Movement Speed': '300 arcmin/s',
  'Hit Distance Threshold': '3 deg (180 arcmin / approx. 120.5 px screen radius)', 'Total Test Duration': '58.40 s', 'Valid Gaze Duration (Denominator)': '50.12 s',
  'On-Target Duration (Numerator)': '32.20 s', 'Gaze Accuracy Rate': '64.25 %', 'Accuracy Definition': 'On-target duration / valid gaze duration (not hardware calibration accuracy)',
  'Enabled Directions': 'Up, Down', 'Completed Targets': '16', 'Test Termination Reason': 'evaluation_complete', 'Eye Tracker Hardware': 'WebGazer (Webcam Eye Tracking)'
}));
const saccadeCSV = file('TEST-SCORES_20261104_140509_SACCADE_Tobii_gaze_record.csv', otCSV({
  'Subject ID': 'TEST-SCORES', 'Session ID': 'sess-saccade-1', 'Test Date': '2026-11-04', 'Test Time': '14:05:09', 'Training Module': 'Saccade (SACCADE)', 'Test Mode': 'Random',
  'Module Settings': JSON.stringify({ mode: 'random', stimulusType: 'numbers_dot', ballArcmin: 30, changeMs: 500, dwellMs: 800, totalSec: 45 }),
  'Viewing Distance': '60 cm', 'Stimulus Type': 'Numbers dot', 'Stimulus Size': '30 arcmin (0.50 deg)', 'Horizontal Target Span': '1200 arcmin (left-to-right target centers)',
  'Vertical Target Span': '700 arcmin (top-to-bottom target centers)', 'Movement Speed': 'N/A', 'Hit Distance Threshold': '2.5 deg (150 arcmin / approx. 100 px screen radius)',
  'Total Test Duration': '45.02 s', 'Valid Gaze Duration (Denominator)': '41.00 s', 'On-Target Duration (Numerator)': '23.99 s', 'Gaze Accuracy Rate': '58.5 %',
  'Mean Time To First Fixation (TFF)': '312 ms', 'TFF Detected Targets': '20 / 24', 'TFF Target 1': '290 ms; direction=rightUp; status=detected',
  'Enabled Directions': 'All', 'Completed Targets': '24', 'Test Termination Reason': 'duration_complete', 'Eye Tracker Hardware': 'Tobii Eye Tracker 5',
  'Diplopia Questionnaire Status': 'carried_forward', 'Diplopia Questionnaire': JSON.stringify({ source_session_id: 'older-session', responses: [{ direction: 'rightUp', no_diplopia: true, onset_angle_deg: null }] })
}));
const vorJSON = file('TEST-SCORES_eye-training-vor-20261104-143000.json', otJSON({
  session_id: 'sess-vor-1', module: 'vor', mode: 'continuous', end_reason: 'escape', completed_targets: 0, actual_duration_ms: 12000,
  settings: { vorGain: 1.5, vorAxis: 'vertical', ballArcmin: 60, changeMs: 500, totalSec: 30 }, accuracy_rate: 40, ended_at: '2026-11-04T06:30:00.000Z'
}));
const ufovDivided = file('20261103-104005-Subtest2-統計成績.csv', ufovCSV([
  ['處理速度反應門檻 (final_rt)', 'final_threshold_rt_ms', '133.33', 'ms (毫秒)', '階梯法自動收斂出信度80%之處理速度門檻'],
  ['最快正確呈現時間', 'fastest_correct_duration_ms', '100', 'ms (毫秒)', ''], ['正式題總題數', 'formal_trials_total', '40', '題', ''],
  ['正式題正確題數', 'formal_trials_correct', '31', '題', ''], ['正式題錯誤題數', 'formal_trials_incorrect', '9', '題', ''],
  ['整體正確率', 'accuracy_rate_percent', '78%', '% (百分比)', ''], ['中央目標正確率', 'central_accuracy_percent', '93%', '% (百分比)', ''],
  ['周邊目標正確率', 'peripheral_accuracy_percent', '80%', '% (百分比)', ''], ['平均作答反應時間', 'mean_response_time_ms', '1520', 'ms (毫秒)', ''],
  ['觀看距離', 'viewing_distance_cm', '60', 'cm (公分)', ''], ['螢幕像素解析度', 'screen_resolution_px', '1920 × 1080', 'px (像素)', ''],
  ['周邊偏心視角設定', 'target_visual_angle_deg', '10.0', 'deg (度 / °)', ''], ['車輛大小視角設定', 'vehicle_visual_angle_deg', '2.0', 'deg (度 / °)', ''],
  ['刺激對比度設定', 'contrast_percent', '100%', '% (百分比)', ''], ['啟用刺激方向數量', 'enabled_direction_count', '4', '個', ''],
  ['啟用刺激方向列表', 'enabled_direction_list', '上、右、下、左', '-', '0, 2, 4, 6'], ['螢幕即時更新率', 'refresh_rate_hz', '60', 'Hz (赫茲)', ''],
  ['測驗結束狀態', 'test_aborted', '正常完成 (Completed)', '-', '正常完成設定題數或收斂門檻'],
  dirRow(0, '上', 80, 10, 8), dirRow(1, '右上', null, 0, 0), dirRow(2, '右', 70, 10, 7), dirRow(3, '右下', null, 0, 0),
  dirRow(4, '下', 90, 10, 9), dirRow(5, '左下', null, 0, 0), dirRow(6, '左', 70, 10, 7), dirRow(7, '左上', null, 0, 0)
], 2, 'formal'));
const ufovPractice = file('20261103-103100-Subtest1-統計成績.csv', ufovCSV([['處理速度反應門檻 (final_rt)', 'final_threshold_rt_ms', '50', 'ms (毫秒)', ''], ['測驗結束狀態', 'test_aborted', '正常完成 (Completed)', '-', '']], 1, 'practice'));
const ufovRaw = file('20261103-104005-Subtest2-原始分數.csv', '﻿受試者代號,測驗日期,測驗時間,Subtest項目代碼,Subtest項目名稱,題次序號\r\n"TEST-SCORES","2026-11-03","10:40:05","Subtest 2","Divided Attention",1\r\n');
const diplopiaOnly = file('TEST-SCORES_manual-1.json', JSON.stringify({ record_type: 'diplopia_questionnaire', subject_id: 'TEST-SCORES', session_id: 'manual-1', diplopia_questionnaire: { responses: [] } }));

(async () => {
  await fs.mkdir(output, { recursive: true });
  const source = await fs.readFile(appPath, 'utf8');
  const server = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(source); });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const url = `http://127.0.0.1:${server.address().port}/`;
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', reducedMotion: 'reduce', timezoneId: 'Asia/Taipei' });
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ contentType: 'text/css', body: '' }));
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const ready = () => page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
  const action = name => page.locator(`[data-action="${name}"]:visible`).first();
  const connect = () => page.evaluate(async () => {
    const disk = await navigator.storage.getDirectory();
    window.testRoot = await disk.getDirectoryHandle('score-imports-records', { create: true });
    store = folderStore(testRoot); await finishBoot();
  });
  const checkEnglish = async selector => {
    const found = await page.locator(selector).evaluate(element => {
      const out = [], walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) if (/\p{Script=Han}/u.test(walker.currentNode.nodeValue)) out.push(walker.currentNode.nodeValue.trim());
      for (const node of element.querySelectorAll('[title], [aria-label], [placeholder]')) for (const name of ['title', 'aria-label', 'placeholder']) {
        const value = node.getAttribute(name); if (value && /\p{Script=Han}/u.test(value)) out.push(`${name}: ${value}`);
      }
      return [...new Set(out)];
    });
    assert.deepEqual(found, [], `Untranslated built-in UI in ${selector}`);
  };
  const importFiles = files => page.locator('#importFile').setInputFiles(files);
  const preview = () => page.waitForSelector('#scoreImport');
  const rows = () => page.locator('.import-row').evaluateAll(cards => cards.map(card => { const text = cls => card.querySelector(cls)?.innerText.trim() ?? '';
    return { when: text('.import-when'), name: text('.import-name'), mode: text('.import-mode'), score: text('.import-score'), file: text('.import-file'), status: text('.import-status'), dest: card.querySelector('select').value }; }));
  const toastText = () => page.locator('.toast').innerText();
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  const stored = () => page.evaluate(async () => (await store.listSessions(curId)).sort((a, b) => a.date.localeCompare(b.date)));

  try {
    await page.goto(url); await ready(); await connect();
    await action('new-client').click();
    await page.locator('#cf-name').fill('Score import fixture'); await page.locator('#cf-ref').fill('TEST-SCORES');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');

    // Separate items: pursuit and fixation each have their own settings; only fixation has a hold time.
    const items = await page.evaluate(() => Object.fromEntries(['pursuit', 'fixation', 'saccade', 'vor', 'ufov_speed', 'ufov_divided', 'ufov_selective'].map(id => [id, fieldsFor(cur().plan.find(p => p.id === id)).map(f => f.id)])));
    assert.ok(items.fixation.includes('holdSec') && !items.pursuit.includes('holdSec'));
    assert.ok(items.saccade.includes('dwellMs') && items.saccade.includes('tff_mean_ms') && !items.saccade.includes('speedArcminSec'));
    assert.ok(items.vor.includes('vorGain') && !items.vor.includes('mode'));
    assert.ok(items.ufov_divided.includes('peripheral_accuracy_percent') && !items.ufov_speed.includes('peripheral_accuracy_percent'));
    assert.equal(items.pursuit[0], 'accuracy_rate'); assert.equal(items.ufov_speed[0], 'final_threshold_rt_ms');
    assert.deepEqual(await page.evaluate(() => trainingPlan(cur()).find(t => t.k === 'ocular').acts.slice(0, 4)), ['Smooth pursuit tracking', 'Fixation', 'Saccades', 'Gaze stabilisation (VOR)']);
    check('OcuTrain pursuit, fixation, saccade and VOR and the three UFOV subtests are separate items, each with its own settings and its main score first');

    // Preview: every run listed once with its default destination; files without scores are explained.
    await importFiles([pursuitCSV, pursuitJSON, fixationCSV, saccadeCSV, vorJSON, ufovDivided, ufovPractice, ufovRaw, diplopiaOnly]);
    await preview();
    assert.match(await page.locator('.modal').innerText(), /匯入到 Score import fixture（TEST-SCORES）。檔案中的受試者代號：TEST-SCORES/);
    const listed = await rows();
    assert.deepEqual(listed.map(r => [r.when, r.name, r.mode, r.score, r.dest]), [
      ['2026-11-03 10:15:30', '平滑追視（OcuTrain PURSUIT）', '評估', '76.4%', 'assess'],
      ['2026-11-03 10:22:41', '凝視（OcuTrain FIXATION）', '評估', '64.25%', 'assess'],
      ['2026-11-03 10:31:00', 'UFOV 子測驗 1：處理速度', '', '50 ms', 'skip'],
      ['2026-11-03 10:40:05', 'UFOV 子測驗 2：分散注意力', '', '133.33 ms', 'training'],
      ['2026-11-04 14:05:09', '跳視（OcuTrain SACCADE）', '隨機', '58.5%', 'training'],
      ['2026-11-04 14:30:00', '前庭眼反射（OcuTrain VOR）', '', '40%', 'skip']
    ]);
    assert.equal(listed[0].file, pursuitJSON.name, 'The JSON copy of a run exported twice is listed');
    assert.equal(listed[2].status, '不是正式紀錄（practice），預設不匯入。');
    assert.equal(listed[5].status, '測驗未完成（escape），預設不匯入。');
    assert.equal(listed[0].status, '');
    assert.equal(await page.getByRole('combobox', { name: '匯入為 平滑追視（OcuTrain PURSUIT） 2026-11-03 10:15:30', exact: true }).count(), 1);
    const notes = await page.locator('.modal ul.note li').allInnerTexts();
    assert.equal(notes.length, 3);
    assert.match(notes.join('\n'), /PURSUIT_Tobii_gaze_record\.csv 與 .*pursuit.*\.json 是同一次測驗/);
    assert.match(notes.join('\n'), /原始分數檔只有逐題資料/); assert.match(notes.join('\n'), /只有複視問卷/);
    for (const width of [320, 360, 768]) { await page.setViewportSize({ width, height: 900 }); assert.equal(await noOverflow(), true, `Import preview overflows at ${width}px`); }
    await page.emulateMedia({ colorScheme: 'dark' }); await page.setViewportSize({ width: 360, height: 900 });
    await page.screenshot({ path: path.join(output, 'score-import-preview-dark-360.png'), fullPage: true });
    await page.emulateMedia({ colorScheme: 'light' }); await page.setViewportSize({ width: 1280, height: 900 });
    await page.screenshot({ path: path.join(output, 'score-import-preview-light-1280.png') });
    check('The preview lists each run once with date, test, main score and default destination; incomplete, practice, raw-data and duplicate files are explained; it fits 320 to 1280px');

    // Choose assessment for the UFOV run, then import.
    await page.locator('#score-dest-3').selectOption('assess');
    await page.locator('#scoreImport').click();
    await page.waitForSelector('#importReportClose');
    const report = await page.locator('.modal').innerText();
    assert.match(report, /已匯入 4 筆測驗分數。/);
    assert.match(report, /2026-11-03 10:15:30 · 平滑追視（OcuTrain PURSUIT） 76.4% → 評估/);
    assert.match(report, /2026-11-04 14:05:09 · 跳視（OcuTrain SACCADE） 58.5% → 復健訓練/);
    assert.match(report, /已新增 2026-11-03 的評估紀錄。/);
    await page.locator('#importReportClose').click();
    const [assessed, trained] = await stored();
    assert.equal(assessed.date, '2026-11-03'); assert.equal(assessed.visit, 'assessment');
    assert.deepEqual(assessed.assess.pursuit, { done: true, notes: '', values: {
      accuracy_rate: 76.4, in_threshold_sec: 30.5, valid_sec: 39.9, actual_duration_sec: 45.21, completed_targets: 16, diplopia: '↗ 12.3° · ← ×',
      mode: 'Evaluation', stimulusType: 'Red in White', ballArcmin: 45, speedArcminSec: 240, directions: '↗ ←', threshold_deg: 2.5, viewingDistanceCm: 60, eye_tracker: 'Tobii' } });
    assert.deepEqual(assessed.assess.fixation.values, { accuracy_rate: 64.25, in_threshold_sec: 32.2, valid_sec: 50.12, actual_duration_sec: 58.4, completed_targets: 16,
      mode: 'Evaluation', stimulusType: 'White dot', ballArcmin: 60, speedArcminSec: 300, holdSec: 3, directions: '↑ ↓', threshold_deg: 3, viewingDistanceCm: 55, eye_tracker: 'WebGazer' });
    assert.deepEqual(assessed.assess.ufov_divided.values, { final_threshold_rt_ms: 133.33, accuracy_rate_percent: 78, central_accuracy_percent: 93, peripheral_accuracy_percent: 80,
      mean_response_time_ms: 1520, formal_trials_total: 40, formal_trials_correct: 31, fastest_correct_duration_ms: 100,
      direction_accuracy: '↑ 80% (8/10) · → 70% (7/10) · ↓ 90% (9/10) · ← 70% (7/10)', stop_condition: 'Adaptive 80%', contrast_percent: 100,
      target_visual_angle_deg: 10, vehicle_visual_angle_deg: 2, viewing_distance_cm: 60, enabled_direction_list: '↑ → ↓ ←', refresh_rate_hz: 60 });
    assert.deepEqual(Object.keys(assessed.assess).sort(), ['fixation', 'pursuit', 'ufov_divided']);
    assert.equal(trained.date, '2026-11-04'); assert.equal(trained.visit, 'treatment');
    const ocular = trained.training.ocular;
    assert.deepEqual([ocular.on, ocular.acts, ocular.actScores, ocular.program], [true, ['Saccades'], { Saccades: '58.5%' }, 'OcuTrain']);
    assert.equal(ocular.runs.length, 1);
    assert.deepEqual({ ...ocular.runs[0], id: 'x' }, { id: 'x', item: 'saccade', time: '14:05:09', file: saccadeCSV.name, values: {
      accuracy_rate: 58.5, tff_mean_ms: 312, tff_detected_targets: 20, tff_total_targets: 24, completed_targets: 24, in_threshold_sec: 23.99, valid_sec: 41, actual_duration_sec: 45.02,
      mode: 'Random', stimulusType: 'Numbers dot', ballArcmin: 30, dwellMs: 800, horizontalSpanArcmin: 1200, verticalSpanArcmin: 700, threshold_deg: 2.5, viewingDistanceCm: 60, eye_tracker: 'Tobii' } });
    assert.deepEqual(assessed.sourceRecords.map(r => [r.file, r.sheet, r.fields.import_key, r.fields.imported_as]), [
      [pursuitJSON.name, 'OcuTrain', 'OcuTrain:sess-pursuit-1', 'assessment'], [fixationCSV.name, 'OcuTrain', 'OcuTrain:sess-fixation-1', 'assessment'],
      [ufovDivided.name, 'UFOV', 'UFOV:TEST-SCORES:2026-11-03:10:40:05:2', 'assessment']]);
    check('Assessment runs fill the matching items with their own settings; a training run becomes a test record plus its activity score; carried-forward diplopia and missing fields stay empty');

    // The record files carry the imported results.
    const files = await page.evaluate(async () => {
      const s = sessions.find(x => x.date === '2026-11-03'), t = sessions.find(x => x.date === '2026-11-04');
      return { note: noteText(cur(), s), training: noteText(cur(), t), restored: [readRecordCSV(sessionCSV(cur(), s)).session, readRecordCSV(sessionCSV(cur(), t)).session], s, t };
    });
    assert.deepEqual(files.restored, [files.s, files.t]);
    assert.match(files.note, /\[x\] 平滑追視（OcuTrain PURSUIT）：平滑追視控制\n\s+注視正確率（%）：76.4\n/);
    assert.match(files.note, /各方向複視起始角度（× 表示無複視）：↗ 12.3° · ← ×/);
    assert.match(files.note, /測驗設定：評估 · 白圈紅心 · 刺激大小（arcmin）：45 · 移動速度（arcmin\/s）：240/);
    assert.match(files.note, /測驗設定：評估 · 白點 · 刺激大小（arcmin）：60 · 移動速度（arcmin\/s）：300 · 邊緣停留時間（秒）：3/);
    assert.match(files.training, /活動：跳視：58.5%/);
    assert.match(files.training, /測驗紀錄：跳視（OcuTrain SACCADE） 14:05:09：注視正確率（%）：58.5；平均首次凝視時間（ms）：312/);
    check('Notes print results line by line with each item\'s settings on one line, training runs on their own line, and the CSV round trip keeps every imported value');

    // Editor: imported results appear in the same boxes clinicians fill by hand.
    await page.locator(`[data-action="open-session"][data-id="${assessed.id}"]`).click();
    assert.equal(await page.locator('#ac-pursuit').isChecked(), true);
    assert.equal(await page.locator('#af-pursuit-0').inputValue(), '76.4');
    assert.equal(await page.locator('#af-pursuit-settings summary').innerText(), '測驗設定（已填 8 項）');
    assert.equal(await page.locator('#af-pursuit-settings').evaluate(el => el.open), false);
    const fixationHold = await page.evaluate(() => fieldsFor(cur().plan.find(p => p.id === 'fixation')).findIndex(f => f.id === 'holdSec'));
    await page.locator('#af-fixation-settings summary').click();
    assert.equal(await page.locator(`#af-fixation-${fixationHold}`).inputValue(), '3');
    assert.match(await page.locator('label[for="af-fixation-' + fixationHold + '"]').innerText(), /^邊緣停留時間（秒）/);
    const stimulus = await page.evaluate(() => fieldsFor(cur().plan.find(p => p.id === 'pursuit')).findIndex(f => f.id === 'stimulusType'));
    assert.equal(await page.locator(`#af-pursuit-${stimulus}`).inputValue(), 'Red in White');
    assert.equal(await page.locator(`#af-pursuit-${stimulus} option:checked`).textContent(), '白圈紅心');
    await page.locator('#an-pursuit').fill('Catch-up saccades on return');
    await action('save-session').click(); await page.waitForSelector('.sess');
    const resaved = (await stored())[0];
    assert.deepEqual(resaved.assess.pursuit.values, assessed.assess.pursuit.values);
    assert.equal(resaved.assess.pursuit.notes, 'Catch-up saccades on return');
    check('Imported values open in the editor boxes with settings folded and translated select labels; saving the visit keeps every value');

    await page.locator(`[data-action="open-session"][data-id="${trained.id}"]`).click();
    const runId = trained.training.ocular.runs[0].id;
    assert.equal(await page.locator(`#rn-${runId}-h`).innerText(), `跳視（OcuTrain SACCADE） · 14:05:09\n來源：${saccadeCSV.name}`);
    assert.equal(await page.locator(`#rn-${runId}-0`).inputValue(), '58.5');
    const saccadeScore = (await page.locator('#tx-ocular-acts [data-act="Saccades"]').getAttribute('data-score')).replace(/-r(\d+)$/, '-s$1');
    assert.equal(await page.locator('#' + saccadeScore).inputValue(), '58.5%');
    await page.locator('#tx-ocular-run-item').selectOption('fixation'); await action('run-add').click();
    const added = await page.locator('#tx-ocular-runs .run').last().getAttribute('data-run');
    assert.equal(await page.locator(`#rn-${added}-0`).evaluate(el => el === document.activeElement), true);
    await page.locator(`#rn-${added}-0`).fill('70');
    await page.locator(`#rn-${added}-settings summary`).click();
    const holdIndex = await page.evaluate(() => fieldsFor(deviceItem('fixation')).findIndex(f => f.id === 'holdSec'));
    await page.locator(`#rn-${added}-${holdIndex}`).fill('4');
    await page.locator('#tx-ocular-run-item').selectOption('vor'); await action('run-add').click();
    const extra = await page.locator('#tx-ocular-runs .run').last().getAttribute('data-run');
    await page.locator(`[data-action="run-del"][data-id="${extra}"]`).click();
    assert.equal(await page.locator(`#rn-${added}-0`).inputValue(), '70', 'Removing a run keeps the other unsaved runs');
    for (const width of [320, 360, 768, 1280]) { await page.setViewportSize({ width, height: 900 }); assert.equal(await noOverflow(), true, `Editor overflows at ${width}px`); }
    await page.locator('#tx-ocular').scrollIntoViewIfNeeded();
    await page.setViewportSize({ width: 360, height: 900 }); await page.emulateMedia({ colorScheme: 'dark' });
    await page.locator('#tx-ocular').screenshot({ path: path.join(output, 'score-runs-dark-360.png') });
    await page.setViewportSize({ width: 1280, height: 900 }); await page.emulateMedia({ colorScheme: 'light' });
    await page.locator('#tx-ocular').screenshot({ path: path.join(output, 'score-runs-light-1280.png') });
    await action('save-session').click(); await page.waitForSelector('.sess');
    const runs = (await stored())[1].training.ocular.runs;
    assert.deepEqual(runs.map(r => [r.item, r.values]), [['saccade', trained.training.ocular.runs[0].values], ['fixation', { accuracy_rate: 70, holdSec: 4 }]]);
    check('Training test records show source and time, can be added by hand with their own settings or removed, and save with the visit');

    // Re-importing the same files changes nothing; a different result for the same item is not overwritten.
    await importFiles([pursuitJSON, fixationCSV]); await preview();
    assert.deepEqual((await rows()).map(r => r.dest), ['skip', 'skip']);
    assert.equal((await rows())[0].status, '已匯入過，預設不匯入。');
    await page.locator('#scoreCancel').click();
    const second = file('TEST-SCORES_eye-training-pursuit-20261103-111000.json', otJSON({ session_id: 'sess-pursuit-2', module: 'pursuit', mode: 'evaluation', end_reason: 'evaluation_complete',
      settings: { mode: 'evaluation', stimulusType: 'white_dot', ballArcmin: 60, speedArcminSec: 300 }, accuracy_rate: 80, ended_at: '2026-11-03T03:10:00.000Z' }));
    const before = await stored();
    await importFiles([second]); await preview(); await page.locator('#scoreImport').click();
    await page.waitForSelector('#importReportClose');
    assert.match(await page.locator('.modal').innerText(), /已匯入 0 筆測驗分數。[\s\S]*2026-11-03 平滑追視（OcuTrain PURSUIT）：已有不同的結果，未覆蓋/);
    await page.locator('#importReportClose').click();
    assert.deepEqual(await stored(), before);
    check('Re-importing marks runs as already imported; a second run with different results never overwrites recorded results');

    // Wrong client, mixed files and unreadable modules are stopped before anything is written.
    await action('new-client').click();
    await page.locator('#cf-name').fill('Other fixture'); await page.locator('#cf-ref').fill('OTHER-1');
    await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('.client-summary');
    await page.waitForSelector('#cForm', { state: 'detached' });
    await page.waitForFunction(() => cur()?.ref === 'OTHER-1' && patientReady);
    await page.locator('#clientSearch').fill('TEST-SCORES');
    await page.locator('.client-btn', { hasText: 'Score import fixture' }).click();
    await page.waitForFunction(() => cur()?.ref === 'TEST-SCORES');
    const untouched = await stored();
    const foreign = file('OTHER-1_20261105_090000_FIXATION_Tobii_gaze_record.csv', fixationCSV.buffer.toString().replace(/TEST-SCORES/g, 'OTHER-1').replace('sess-fixation-1', 'sess-other'));
    await importFiles([foreign]);
    await page.waitForFunction(() => /受試者代號 OTHER-1 屬於個案 Other fixture/.test(document.querySelector('.toast')?.textContent || ''));
    await importFiles([fixationCSV, file('notes.csv', 'schema_version,section,field,type,value\r\n')]);
    await page.waitForFunction(() => /測驗分數檔請與 EzEMR 的 CSV 或 JSON 備份分開匯入/.test(document.querySelector('.toast')?.textContent || ''));
    await importFiles([file('broken.csv', otCSV({ 'Session ID': 'x', 'Test Date': '2026-11-05', 'Training Module': 'Unknown (OTHER)' }))]);
    await page.waitForFunction(() => /broken\.csv: 無法辨識 OcuTrain 模組/.test(document.querySelector('.toast')?.textContent || ''));
    await importFiles([ufovRaw]);
    await page.waitForFunction(() => /原始分數檔只有逐題資料/.test(document.querySelector('.toast')?.textContent || ''));
    assert.equal(await page.locator('#scoreImport').count(), 0);
    assert.deepEqual(await stored(), untouched);
    check('Files for another client, score files mixed with EzEMR records, unknown modules and raw-only files are rejected with a message and nothing is written');

    // Progress tracking: one table per item with result columns and a settings column; a table for training runs.
    await page.locator('#tab-outcomes').click();
    const pursuitPanel = page.locator('#tabBody section.panel', { hasText: '平滑追視（OcuTrain PURSUIT）' }).first();
    const heads = await pursuitPanel.locator('thead th').allInnerTexts();
    assert.equal(heads[2], '注視正確率（%）'); assert.ok(heads.includes('測驗設定')); assert.ok(!heads.includes('刺激大小（arcmin）'));
    assert.match(await pursuitPanel.locator('tbody').innerText(), /76\.4[\s\S]*評估 · 白圈紅心/);
    const runPanel = page.locator('#tabBody section.panel', { hasText: '跳視（OcuTrain SACCADE）（復健測驗紀錄）' });
    assert.match(await runPanel.locator('tbody').innerText(), /14:05:09\s+58\.5\s+312/);
    check('Progress tracking shows result columns with one settings column per item, and a separate table of training test runs');

    // English interface: preview, editor, runs and progress tables.
    await page.locator('#languageSelect').selectOption('en');
    await checkEnglish('#tabBody');
    await importFiles([pursuitJSON, saccadeCSV]); await preview();
    await checkEnglish('.modal');
    assert.equal(await page.locator('#scoreImport').innerText(), 'Import');
    assert.match(await page.locator('.modal').innerText(), /Importing into Score import fixture \(TEST-SCORES\)\. Subject IDs in the files: TEST-SCORES/);
    assert.equal(await page.getByRole('combobox', { name: 'Import as Smooth pursuit (OcuTrain PURSUIT) 2026-11-03 10:15:30', exact: true }).count(), 1);
    assert.equal((await rows())[0].status, 'Already imported; set to not import.');
    assert.equal((await rows())[1].mode, 'Random');
    await page.locator('#scoreCancel').click();
    await page.locator('#tab-sessions').click();
    await page.locator(`[data-action="open-session"][data-id="${assessed.id}"]`).click();
    assert.equal(await page.locator('#af-pursuit-settings summary').innerText(), 'Test settings (8 filled)');
    assert.equal(await page.locator(`#af-pursuit-${stimulus} option:checked`).textContent(), 'Red in White');
    await checkEnglish('#assessList');
    await action('cancel-edit').click(); if (await page.locator('#askYes').count()) await page.locator('#askYes').click();
    await page.waitForSelector('#soapForm', { state: 'detached' });
    await page.locator(`[data-action="open-session"][data-id="${trained.id}"]`).click();
    assert.equal(await page.locator(`#rn-${runId}-h`).innerText(), `Saccade (OcuTrain SACCADE) · 14:05:09\nSource: ${saccadeCSV.name}`);
    await checkEnglish('#tx-ocular'); await checkEnglish('#tx-periph');
    assert.match(await page.evaluate(() => noteText(cur(), sessions.find(s => s.date === '2026-11-03'))), /Test settings: Evaluation · Red in White · Stimulus size \(arcmin\): 45/);
    await page.locator('#languageSelect').selectOption('zh-TW');
    check('English preview, report wording, settings, test records, notes and progress tables have no untranslated interface text');

    assert.deepEqual(errors, []);
    await fs.writeFile(path.join(output, 'score-imports-results.json'), JSON.stringify({ evidence }, null, 2));
  } finally {
    await browser.close(); server.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
