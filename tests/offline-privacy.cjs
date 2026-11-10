const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const zlib = require('node:zlib');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const { appPath } = require('./lib/app.cjs');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'offline-privacy');
const outbound = /^(?:https?|wss?):/i;
const sentinel = 'SYNTHETIC-PRIVATE-CI-0';

function zipEntries(bytes) {
  const end = bytes.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
  assert.ok(end >= 0, 'The download is a ZIP archive');
  const entries = new Map();
  let offset = bytes.readUInt32LE(end + 16);
  for (let index = 0; index < bytes.readUInt16LE(end + 10); index++) {
    assert.equal(bytes.readUInt32LE(offset), 0x02014b50);
    const method = bytes.readUInt16LE(offset + 10), size = bytes.readUInt32LE(offset + 20);
    const nameLength = bytes.readUInt16LE(offset + 28), extraLength = bytes.readUInt16LE(offset + 30), commentLength = bytes.readUInt16LE(offset + 32);
    const name = bytes.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    const local = bytes.readUInt32LE(offset + 42);
    assert.equal(bytes.readUInt32LE(local), 0x04034b50);
    const start = local + 30 + bytes.readUInt16LE(local + 26) + bytes.readUInt16LE(local + 28);
    const payload = bytes.subarray(start, start + size);
    assert.ok([0, 8].includes(method), 'The archive uses a supported ZIP method');
    entries.set(name, method === 8 ? zlib.inflateRawSync(payload) : payload);
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

(async () => {
  await fs.mkdir(output, { recursive: true });
  const metroPackage = JSON.parse(await fs.readFile(path.join(root, 'vendor', 'metroui', 'package.json'), 'utf8'));
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  const evidence = [];
  const check = message => { evidence.push(message); console.log('PASS: ' + message); };
  const start = async captureNative => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, reducedMotion: 'reduce' });
    const network = { routed: [], requests: [], failed: [], sockets: [], socketRoutes: [] };
    await context.route(/^https?:/i, route => { network.routed.push(route.request().url()); return route.abort('blockedbyclient'); });
    context.on('request', request => { if (outbound.test(request.url())) network.requests.push(request.url()); });
    context.on('requestfailed', request => { if (outbound.test(request.url())) network.failed.push({ url: request.url(), error: request.failure()?.errorText }); });
    await context.addInitScript(capture => {
      window.__privacyViolations = [];
      document.addEventListener('securitypolicyviolation', event => window.__privacyViolations.push({ directive: event.effectiveDirective, blocked: event.blockedURI }));
      if (capture) {
        window.__privacyNative = {
          fetch: window.fetch.bind(window), XHR: window.XMLHttpRequest,
          xhrOpen: XMLHttpRequest.prototype.open, xhrSend: XMLHttpRequest.prototype.send,
          beacon: navigator.sendBeacon?.bind(navigator), formSubmit: HTMLFormElement.prototype.submit,
          rtc: window.RTCPeerConnection, webkitRtc: window.webkitRTCPeerConnection
        };
      }
    }, captureNative);
    const page = await context.newPage(); page.setDefaultTimeout(15000);
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    page.on('websocket', socket => network.sockets.push(socket.url()));
    if (page.routeWebSocket) await page.routeWebSocket(/.*/, socket => { network.socketRoutes.push(socket.url()); socket.close(); });
    await page.goto(pathToFileURL(appPath).href);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    return { context, page, network, errors };
  };
  try {
    const app = await start(false), { page, network } = app;
    const action = name => page.locator(`[data-action="${name}"]:visible`).first();
    const menuAction = async (menu, name) => { await page.locator(`#${menu}MenuButton`).click(); await action(name).click(); };
    const download = async run => { const pending = page.waitForEvent('download'); await run(); const item = await pending; return { name: item.suggestedFilename(), bytes: await fs.readFile(await item.path()) }; };
    try {
      const policy = await page.evaluate(() => {
        const meta = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
        const directives = Object.fromEntries(meta[0].content.split(';').map(value => value.trim().split(/\s+/)).filter(parts => parts[0]).map(([name, ...values]) => [name, values]));
        return { count: meta.length, directives, referrer: document.querySelector('meta[name="referrer"]')?.content,
          firstScript: document.querySelector('script')?.id, metroVersion: window.Metro?.version };
      });
      assert.equal(policy.count, 1);
      for (const directive of ['default-src', 'connect-src', 'object-src', 'frame-src', 'worker-src', 'base-uri', 'form-action']) assert.deepEqual(policy.directives[directive], ["'none'"], directive);
      assert.deepEqual(policy.directives['script-src'], ["'unsafe-inline'"]);
      assert.deepEqual(policy.directives['style-src'], ["'unsafe-inline'"]);
      assert.deepEqual(policy.directives['font-src'], ['data:']);
      assert.deepEqual(policy.directives['img-src'], ['data:', 'blob:']);
      assert.equal(policy.referrer, 'no-referrer');
      assert.equal(policy.firstScript, 'offlinePrivacyGuard', 'No vendor code executes before the transport guard');
      assert.equal(policy.metroVersion, metroPackage.version, 'The actual vendored Metro UI runs from the standalone HTML');
      const parser = await page.evaluate(() => {
        const fixture = document.createElement('div'); fixture.id = 'privacyParserFixture'; document.body.append(fixture);
        const single = Dom.parseHTML(' <input/> '), table = Dom.parseHTML('<tr>');
        const selector = Dom.parseHTML('#privacyParserFixture');
        const mixed = Dom.parseHTML('  before <b>bold</b> <!--comment--> after  ');
        const host = document.createElement('div'); document.body.append(host); window.__privacyParserScript = 0;
        const script = Dom.parseHTML('<script>window.__privacyParserScript++</script><span>inert</span>');
        host.append(...script);
        const result = { single: single.map(node => node.nodeName), table: table.map(node => node.nodeName),
          selector: selector.length === 1 && selector[0] === fixture,
          mixed: mixed.map(node => ({ type: node.nodeType, text: node.textContent })),
          scripts: script.map(node => node.nodeName), executions: __privacyParserScript,
          nonstrings: [null, [], fixture].map(value => Dom.parseHTML(value).length) };
        host.remove(); fixture.remove(); delete window.__privacyParserScript;
        return result;
      });
      assert.deepEqual(parser, { single: ['INPUT'], table: ['TR'], selector: true,
        mixed: [{ type: 3, text: 'before ' }, { type: 1, text: 'bold' }, { type: 3, text: ' ' }, { type: 8, text: 'comment' }, { type: 3, text: ' after' }],
        scripts: ['SCRIPT', 'SPAN'], executions: 0, nonstrings: [0, 0, 0] }, 'The Metro adapter preserves single tags, table tags, selectors, mixed nodes and inert scripts');
      const assets = await page.evaluate(() => {
        const resourceAttrs = [...document.querySelectorAll('script[src], link[rel="stylesheet"][href], img[src], source[src], video[src], audio[src], iframe[src]')]
          .map(node => node.getAttribute('src') || node.getAttribute('href')).filter(Boolean);
        const css = [...document.querySelectorAll('style')].map(node => node.textContent.replace(/\/\*[\s\S]*?\*\//g, '')).join('\n');
        return { resources: resourceAttrs, cssUrls: [...css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gs)].map(match => match[2]), imports: /@import\b/i.test(css),
          externalLinks: [...document.querySelectorAll('a[href^="https:"], a[href^="http:"]')].map(node => node.href) };
      });
      assert.ok(assets.resources.every(url => /^(?:data:|blob:|#)/i.test(url)), `No runtime resource paths: ${JSON.stringify(assets.resources)}`);
      assert.ok(assets.cssUrls.every(url => /^(?:data:|blob:|#)/i.test(url)), 'All Metro/CSS asset references are embedded');
      assert.equal(assets.imports, false); assert.deepEqual(assets.externalLinks, []);
      check('Standalone Metro UI loads under an early restrictive CSP with embedded assets, no referrer and no CDN/resource paths');

      await page.locator('#languageSelect').selectOption('en');
      await page.evaluate(() => { window.__privacyHostCalls = []; window.claude = { use: async name => { __privacyHostCalls.push(name); throw new Error('Host bridge must not receive patient data'); } }; });
      await page.evaluate(async () => { store = localStore(); await finishBoot(); });
      await menuAction('view', 'global-settings');
      await page.locator('#appSettingsForm [name="requiredField"][value="nationalId"]').check();
      await page.locator('#settingsSave').click(); await page.waitForSelector('#appSettingsForm', { state: 'detached' });
      await action('new-client').click();
      await page.locator('#cf-name').fill('Synthetic private patient'); await page.locator('#cf-ref').fill('PRIVATE-CI');
      await page.locator('#cf-nationalId').fill(sentinel); await page.locator('#cf-history').fill('Synthetic private history ' + sentinel);
      await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
      await action('edit-client').click(); await page.locator('#cf-name').fill('Synthetic private patient edited');
      await page.locator('#cForm [type="submit"]').click(); await page.waitForSelector('#cForm', { state: 'detached' });
      await action('new-session').click(); await page.locator('#s-subj').fill('Synthetic private clinical note ' + sentinel);
      await page.locator('#tx-ocular-on').check(); await action('eye-help').click();
      assert.equal(await page.locator('#modeDocURL').inputValue(), 'https://eyedottrainer.com/#modes');
      assert.equal(await page.locator('#modeDocURL').evaluate(node => node.readOnly), true);
      assert.equal(await page.locator('.modal').getByRole('button', { name: /copy/i }).isVisible(), true);
      assert.equal(await page.locator('.modal a[href^="https:"], .modal a[href^="http:"]').count(), 0, 'Documentation is local text, not an external navigation');
      await page.keyboard.press('Escape'); await page.waitForSelector('#modeDocURL', { state: 'detached' });
      await page.locator('#tx-ocular-on').uncheck();
      const zip = await download(() => action('save-session').click()); await page.waitForSelector('.sess');
      assert.match(zip.name, /\.zip$/); const entries = zipEntries(zip.bytes);
      const csv = [...entries].find(([name]) => name.endsWith('.csv')), pdf = [...entries].find(([name]) => name.endsWith('.pdf'));
      assert.ok(csv && pdf, 'The offline save downloads CSV and PDF');
      assert.ok(csv[1].toString('utf8').includes(sentinel)); assert.match(pdf[1].subarray(0, 8).toString('ascii'), /^%PDF-/);
      await page.locator('.sess [data-action="open-session"]').first().click();
      assert.equal(await page.locator('#s-subj').inputValue(), 'Synthetic private clinical note ' + sentinel);
      await action('cancel-edit').click(); await page.waitForSelector('#soapForm', { state: 'detached' });
      const roster = await download(() => menuAction('export', 'export-roster'));
      assert.equal(roster.name, 'clients.csv'); assert.ok(roster.bytes.toString('utf8').includes(sentinel));
      const backup = await download(() => menuAction('export', 'export-all'));
      assert.match(backup.name, /\.json$/); const saved = JSON.parse(backup.bytes.toString('utf8'));
      assert.equal(saved.clients[0].nationalId, sentinel); assert.ok(saved.clients[0].sessions[0].subjective.includes(sentinel));
      await page.evaluate(() => document.querySelectorAll('.toast').forEach(node => node.remove()));
      await page.locator('#importFile').setInputFiles({ name: 'clients.csv', mimeType: 'text/csv', buffer: roster.bytes });
      await page.waitForFunction(() => [...document.querySelectorAll('.toast')].some(node => node.textContent.includes(ui('已匯入'))));
      await page.evaluate(() => document.querySelectorAll('.toast').forEach(node => node.remove()));
      await page.locator('#importFile').setInputFiles({ name: 'backup.json', mimeType: 'application/json', buffer: backup.bytes });
      await page.waitForFunction(() => [...document.querySelectorAll('.toast')].some(node => node.textContent.includes(ui('已還原'))));
      const workbook = await page.evaluate(() => {
        const wb = XLSX.utils.book_new();
        const add = (index, rows) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), SOURCE_WORKBOOK.sheets[index]);
        add(0, [['復能編號', '姓名', '生日', '收案日期', '職災日期', '眼科診斷', '視覺主訴', '年齡'], ['PRIVATE-XLSX', 'Synthetic private Excel', '', '', '', 'Synthetic finding', '', '']]);
        add(1, [['patient_no', 'name', 'visit_date', 'visit_time', 'va_ou', 'ufov_ps', '治療師'], ['PRIVATE-XLSX', 'Synthetic private Excel', '2026-11-02', 1, 1, 0, 'Synthetic clinician']]);
        add(2, [['個案編號', '姓名', '看診日期', '看診次數', 'subject', 'objective', 'assessment', 'plan', '治療師']]);
        return Array.from(new Uint8Array(XLSX.write(wb, { bookType: 'xlsx', type: 'array' })));
      });
      await page.locator('#importFile').setInputFiles({ name: 'private.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(workbook) });
      await page.waitForFunction(() => !savingSession && clients.some(client => client.ref === 'PRIVATE-XLSX'));
      if (await page.locator('#importReportClose').isVisible()) await page.locator('#importReportClose').click();
      assert.equal(await page.evaluate(() => clients.some(client => client.ref === 'PRIVATE-XLSX')), true);
      assert.equal(await page.evaluate(async token => (await store.listClients()).some(client => client.nationalId === token), sentinel), true);
      await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      assert.deepEqual(network, { routed: [], requests: [], failed: [], sockets: [], socketRoutes: [] }, 'Real patient workflows make zero outbound requests, including blocked attempts');
      const workflowPolicy = await page.evaluate(() => ({ violations: __privacyViolations, bases: document.querySelectorAll('base').length, hostCalls: __privacyHostCalls }));
      assert.deepEqual(workflowPolicy.violations, [], 'Working local workflows cause no CSP violations');
      assert.equal(workflowPolicy.bases, 0); assert.deepEqual(workflowPolicy.hostCalls, [], 'Patient downloads never leave through an app host bridge');
      assert.deepEqual(app.errors, []);
      await page.screenshot({ path: path.join(output, 'offline-workflow.png'), fullPage: true });
      check('Settings, profile create/edit, note save/reopen, CSV/PDF/JSON exports and CSV/JSON/Excel imports work locally with zero outbound attempts');
    } catch (error) {
      await fs.writeFile(path.join(output, 'workflow-failure.json'), JSON.stringify({ error: error.message, network, errors: app.errors,
        page: await page.evaluate(() => ({ toasts: [...document.querySelectorAll('.toast')].map(node => node.textContent), violations: __privacyViolations, main: document.querySelector('#main')?.innerText })) }, null, 2));
      await page.screenshot({ path: path.join(output, 'workflow-failure.png'), fullPage: true });
      throw error;
    } finally { await app.context.close(); }

    const probes = await start(true);
    try {
      const guard = await probes.page.evaluate(async token => {
        const url = 'https://privacy.invalid/probe?record=' + encodeURIComponent(token), result = {};
        const attempt = async (name, run) => { try { await run(); result[name] = 'allowed'; } catch (error) { result[name] = error.name; } };
        await attempt('fetch', () => fetch(url, { method: 'POST', body: token }));
        await attempt('XMLHttpRequest', () => { const xhr = new XMLHttpRequest(); xhr.open('POST', url); xhr.send(token); });
        if (navigator.sendBeacon) await attempt('sendBeacon', () => navigator.sendBeacon(url, token));
        for (const name of ['WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'WebTransport']) {
          if (name in window) await attempt(name, () => new window[name](name === 'WebSocket' ? url.replace('https:', 'wss:') : url));
        }
        for (const [name, native] of [['RTCPeerConnection', __privacyNative.rtc], ['webkitRTCPeerConnection', __privacyNative.webkitRtc]]) {
          if (!native) continue;
          if (window[name] === native || !Function.prototype.toString.call(window[name]).includes('SecurityError')) result[name] = 'unguarded';
          else await attempt(name, () => new window[name]({ iceServers: [{ urls: 'stun:privacy.invalid:3478' }] }));
        }
        if (navigator.serviceWorker) await attempt('serviceWorker', () => navigator.serviceWorker.register(url));
        const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch');
        result.fetchLocked = descriptor.writable === false && descriptor.configurable === false;
        result.xhrLocked = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'open').writable === false;
        result.nativeFetchReplaceable = Reflect.set(window, 'fetch', __privacyNative.fetch);
        return result;
      }, sentinel);
      assert.equal(guard.fetchLocked, true); assert.equal(guard.xhrLocked, true); assert.equal(guard.nativeFetchReplaceable, false);
      const transportResults = Object.entries(guard).filter(([, value]) => typeof value === 'string');
      for (const [name, result] of transportResults) assert.equal(result, 'SecurityError', `${name} blocks before sending patient values`);
      assert.ok(transportResults.some(([name]) => name === 'RTCPeerConnection'), 'The tested browser exposes WebRTC and the app blocks it');
      assert.deepEqual(probes.network, { routed: [], requests: [], failed: [], sockets: [], socketRoutes: [] });
      assert.deepEqual(await probes.page.evaluate(() => __privacyViolations), [], 'Transport guards reject before triggering a browser policy violation');
      check('Locked network/worker/WebRTC APIs reject patient-bearing attempts before any request is created');

      const native = await probes.page.evaluate(async token => {
        const base = 'https://privacy.invalid/native?record=' + encodeURIComponent(token), result = {};
        try { await __privacyNative.fetch(base, { method: 'POST', body: token }); result.fetch = 'allowed'; } catch (error) { result.fetch = error.name; }
        result.xhr = await new Promise(resolve => {
          const xhr = new __privacyNative.XHR(); xhr.onload = () => resolve('allowed'); xhr.onerror = () => resolve('blocked');
          try { __privacyNative.xhrOpen.call(xhr, 'POST', base); __privacyNative.xhrSend.call(xhr, token); } catch (error) { resolve(error.name); }
        });
        if (__privacyNative.beacon) { try { result.beacon = __privacyNative.beacon(base, token); } catch (error) { result.beacon = error.name; } }
        const resource = tag => new Promise(resolve => {
          const element = document.createElement(tag); element.onload = () => resolve('allowed'); element.onerror = () => resolve('blocked');
          element.src = base + '&type=' + tag; document.body.append(element);
        });
        result.image = await resource('img'); result.script = await resource('script');
        const form = document.createElement('form'); form.action = base; form.method = 'POST';
        const field = document.createElement('input'); field.name = 'clinicalNote'; field.value = token; form.append(field); document.body.append(form);
        __privacyNative.formSubmit.call(form);
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return { result, violations: __privacyViolations };
      }, sentinel);
      assert.notEqual(native.result.fetch, 'allowed'); assert.notEqual(native.result.xhr, 'allowed');
      assert.equal(native.result.image, 'blocked'); assert.equal(native.result.script, 'blocked');
      for (const directive of ['connect-src', 'img-src', 'script-src-elem', 'form-action']) assert.ok(native.violations.some(violation => violation.directive === directive), `${directive} is independently enforced by the browser`);
      assert.ok(native.violations.every(violation => new URL(violation.blocked).origin === 'https://privacy.invalid'));
      assert.deepEqual(probes.network.routed, [], 'CSP prevents dispatch even when test-only captured native transports bypass the JS guard');
      assert.deepEqual(probes.network.socketRoutes, []); assert.deepEqual(probes.network.sockets, []);
      assert.ok(probes.network.requests.every(url => new URL(url).origin === 'https://privacy.invalid'), 'Only deliberate probe URLs enter the browser request event stream');
      assert.ok(probes.network.failed.every(request => request.error && native.violations.some(violation => new URL(violation.blocked).origin === new URL(request.url).origin)), 'Each failed native probe has a corresponding browser CSP violation and no dispatched route');
      assert.deepEqual(probes.errors, []);
      await fs.writeFile(path.join(output, 'probes.json'), JSON.stringify({ guard, native, network: probes.network }, null, 2));
      check('Browser CSP independently blocks native fetch/XHR/beacon, remote images/scripts and form submission without an outbound route');
    } finally { await probes.context.close(); }
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(evidence, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
