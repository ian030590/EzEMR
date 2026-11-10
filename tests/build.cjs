const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { pathToFileURL } = require('node:url');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { buildHTML, verifyVendor, inlineCSS } = require('../scripts/build.cjs');
const { appPath } = require('./lib/app.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'build');
const normalize = source => source.replace(/\r\n?/g, '\n');
const checksum = source => createHash('sha256').update(source).digest('hex');

(async () => {
  await fs.mkdir(output, { recursive: true });
  const template = await fs.readFile(path.join(root, 'src', 'index.html'), 'utf8');
  const compiled = buildHTML(template);
  assert.equal(checksum(buildHTML(template)), checksum(compiled), 'Repeated builds are deterministic');
  assert.equal(checksum(buildHTML(normalize(template).replace(/\n/g, '\r\n'))), checksum(compiled), 'LF and CRLF source checkouts produce the same published bytes');
  assert.doesNotMatch(template, /<style\b|<script\b[^>]*>\s*[^<\s]/i, 'Development markup has no inline primary styles or scripts');
  assert.throws(() => buildHTML(template.replace('src="privacy.js"', 'src="https://example.invalid/privacy.js"').replace('src="./privacy.js"', 'src="https://example.invalid/privacy.js"')), /External build resource/);
  assert.throws(() => buildHTML(template + '<script>window.test = true;</script>'), /without inline code/);
  assert.throws(() => buildHTML(template + '<style>body{color:red}</style>'), /without inline CSS/);
  const published = path.join(root, 'EzEMR.html'), before = checksum(await fs.readFile(published));
  const fixture = await fs.mkdtemp(path.join(output, 'project-'));
  try {
    for (const name of ['src', 'vendor']) await fs.cp(path.join(root, name), path.join(fixture, name), { recursive: true });
    await fs.mkdir(path.join(fixture, 'scripts'));
    const script = path.join(fixture, 'scripts', 'build.cjs');
    await fs.copyFile(path.join(root, 'scripts', 'build.cjs'), script);
    const run = args => spawnSync(process.execPath, [script, ...args], { cwd: fixture, encoding: 'utf8' });
    const initial = run([]);
    assert.equal(initial.status, 0, initial.stdout + initial.stderr);
    assert.equal(run(['--check']).status, 0);
    const artifact = path.join(fixture, 'EzEMR.html'), initialBytes = await fs.readFile(artifact, 'utf8');
    await fs.appendFile(path.join(fixture, 'src', 'styles.css'), '\n/* development change */\n');
    assert.notEqual(run(['--check']).status, 0, 'Check detects source changes without rewriting the published file');
    assert.equal(checksum(await fs.readFile(artifact)), checksum(initialBytes));
    const preview = run(['--output', '.tmp/preview/EzEMR.html']);
    assert.equal(preview.status, 0, preview.stdout + preview.stderr);
    const fresh = await fs.readFile(path.join(fixture, '.tmp', 'preview', 'EzEMR.html'), 'utf8');
    assert.ok(fresh.includes('/* development change */'));
    assert.equal(run([]).status, 0, 'Explicit publication rebuilds the root artifact');
    assert.equal(run(['--check']).status, 0);
    assert.equal(checksum(await fs.readFile(artifact)), checksum(fresh));
    assert.notEqual(run(['--output', 'src/index.html']).status, 0, 'Preview builds cannot overwrite source');
    assert.notEqual(run(['--unknown']).status, 0);
    const vendor = path.join(fixture, 'vendor', 'metroui'), metadata = verifyVendor(vendor);
    assert.equal(metadata.version, '5.1.20');
    assert.match(metadata.integrity, /^sha512-/);
    const javascript = path.join(vendor, 'lib', 'metro.js');
    await fs.appendFile(javascript, '\n/* integrity regression */');
    assert.throws(() => buildHTML(template, fixture), /Vendor checksum failed: lib\/metro.js/);
    await fs.copyFile(path.join(root, 'vendor', 'metroui', 'lib', 'metro.js'), javascript);
    await fs.rename(path.join(vendor, 'LICENSE'), path.join(vendor, 'LICENSE.saved'));
    assert.throws(() => buildHTML(template, fixture), /LICENSE|ENOENT/);
    await fs.rename(path.join(vendor, 'LICENSE.saved'), path.join(vendor, 'LICENSE'));
    const asset = path.join(fixture, 'src', 'sample.woff2'), css = path.join(fixture, 'src', 'sample.css');
    await fs.writeFile(asset, Buffer.from([0, 1, 2, 3]));
    await fs.writeFile(css, '@font-face{src:url("sample.woff2")}');
    assert.match(inlineCSS(css, fixture), /data:font\/woff2;base64,AAECAw==/);
    await fs.writeFile(css, '@font-face{src:url("https://example.invalid/font.woff2")}');
    assert.throws(() => inlineCSS(css, fixture), /External build resource/);
    await fs.writeFile(css, '@import "remote.css";');
    assert.throws(() => inlineCSS(css, fixture), /imports must be bundled locally/);
    // A literal resource tag inside JavaScript is data, not another build input.
    await fs.appendFile(path.join(fixture, 'src', 'app.js'), '\nwindow.literalTag = \'<link rel="stylesheet" href="https://example.invalid/data.css">\';\n');
    assert.ok(buildHTML(template, fixture).includes('https://example.invalid/data.css'));
    assert.equal(checksum(await fs.readFile(published)), before, 'Focused build checks never publish the working source');
  } finally {
    assert.ok(path.resolve(fixture).startsWith(output + path.sep));
    await fs.rm(fixture, { recursive: true, force: true });
  }
  console.log('PASS: Separate development sources build deterministically; explicit publication, readonly checks, isolated previews and source changes follow the intended lifecycle');
  console.log('PASS: Vendor tampering, missing licenses, remote resources and inline development code fail; generated JavaScript is never reparsed as build markup');

  const css = compiled.match(/<style id="metroLibraryStyles">([\s\S]*?)<\/style>/)[1];
  const urls = [...css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)].map(match => match[2]);
  assert.ok(urls.length >= 20 && urls.every(url => /^(?:data:|#)/i.test(url)), 'Metro fonts, icons and images are embedded');
  assert.match(compiled, /script-src 'unsafe-inline'; style-src 'unsafe-inline'/);
  assert.doesNotMatch(compiled.slice(0, compiled.indexOf('<script')), /script-src 'self'|file:/);
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}) });
  try {
    const context = await browser.newContext();
    const requests = [], errors = [];
    await context.route(/^https?:/, route => { requests.push(route.request().url()); return route.abort(); });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(pathToFileURL(appPath).href);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await page.evaluate(() => Metro.version), '5.1.20');
    assert.equal(await page.locator('script[src], link[rel="stylesheet"]').count(), 0);
    assert.deepEqual(requests, []);
    assert.deepEqual(errors, []);
    await page.goto(pathToFileURL(path.join(root, 'src', 'index.html')).href);
    await page.waitForSelector('html[data-ready="true"]', { state: 'attached' });
    assert.equal(await page.evaluate(() => Metro.version), '5.1.20');
    assert.ok(await page.locator('script[src]').count() >= 7, 'Development opens its separate local scripts directly');
    assert.deepEqual(requests, [], 'Direct development use makes no outbound web request');
    assert.deepEqual(errors, []);
    await context.close();
  } finally { await browser.close(); }
  console.log('PASS: Both the generated single file and separate development sources open directly with complete local assets and no outbound web requests');
})().catch(error => { console.error(error); process.exitCode = 1; });
