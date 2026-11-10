const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');
const { runTests, extractExcelScript } = require('./run-ci.cjs');
const { appPath } = require('./lib/app.cjs');

const root = path.resolve(__dirname, '..');
const output = path.join(root, '.tmp', 'verification', 'ci-runner');
fs.mkdirSync(output, { recursive: true });
const directory = fs.mkdtempSync(path.join(output, 'case-'));
const marker = path.join(directory, 'steps.txt');
const step = (name, code) => ({ name, command: process.execPath, args: ['-e', code, marker] });
const checksum = bytes => createHash('sha256').update(bytes).digest('hex');
try {
  const html = fs.readFileSync(appPath, 'utf8');
  const excel = extractExcelScript(html);
  assert.match(excel, /make_xlsx_lib/);
  assert.equal(extractExcelScript(html.replace(/\r\n?/g, '\n')), excel.replace(/\r\n?/g, '\n'));
  assert.throws(() => extractExcelScript('<html></html>'), /component is missing/);
  assert.throws(() => extractExcelScript(html.replace('<script id="excelLibrary">', '<script id="excelLibrary">/* checksum regression */')), /checksum failed/);
  console.log('PASS: Excel test component is extracted offline and missing or modified embedded code is rejected');
  const before = step('runner self-check: first step', "require('node:fs').appendFileSync(process.argv[1], 'before\\n')");
  const failure = step('runner self-check: deliberate failure', 'process.exit(7)');
  const after = step('runner self-check: later step', "require('node:fs').appendFileSync(process.argv[1], 'after\\n')");
  assert.throws(() => runTests([before, failure, after]), error => error.exitCode === 7);
  assert.equal(fs.readFileSync(marker, 'utf8'), 'before\n');
  runTests([after]);
  assert.equal(fs.readFileSync(marker, 'utf8'), 'before\nafter\n');
  assert.throws(() => runTests([{ name: 'runner self-check: missing command', command: path.join(directory, 'missing-executable'), args: [] }]));
  const project = path.join(directory, 'project');
  for (const name of ['src', 'vendor']) fs.cpSync(path.join(root, name), path.join(project, name), { recursive: true });
  for (const name of ['scripts/build.cjs', 'tests/run-ci.cjs', 'tests/check_i18n.cjs', 'tests/lib/app.cjs', 'README.md']) {
    const target = path.join(project, name); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.copyFileSync(path.join(root, name), target);
  }
  const initialized = spawnSync('git', ['init', '--quiet'], { cwd: project, encoding: 'utf8' });
  assert.equal(initialized.status, 0, initialized.stdout + initialized.stderr);
  const originalPublished = checksum(fs.readFileSync(path.join(root, 'EzEMR.html')));
  const hook = spawnSync('git', ['-c', `core.hooksPath=${path.join(root, '.githooks').replaceAll(path.sep, '/')}`, 'hook', 'run', 'pre-push'], {
    cwd: project,
    env: { ...process.env, PLAYWRIGHT_MODULE: process.env.PLAYWRIGHT_MODULE || path.join(root, '.tmp', 'test-tools', 'node_modules', 'playwright'), NODE_PATH: path.join(root, '.tmp', 'test-tools', 'node_modules'), PYTHON: path.join(directory, 'missing-python') },
    encoding: 'utf8'
  });
  assert.ifError(hook.error);
  assert.equal(hook.status, 1, hook.stdout + hook.stderr);
  assert.match(hook.stdout + hook.stderr, /CI: Python export dependencies/);
  assert.ok(fs.existsSync(path.join(project, 'EzEMR.html')), 'The actual hook builds the published file before testing');
  assert.equal(checksum(fs.readFileSync(path.join(root, 'EzEMR.html'))), originalPublished, 'The hook regression fixture does not publish the working application');
  console.log('PASS: Actual pre-push hook rejects a failed CI dependency check');
  console.log('PASS: CI runner preserves failure status, stops later steps and rejects missing executables');
} finally {
  assert.ok(path.resolve(directory).startsWith(output + path.sep));
  fs.rmSync(directory, { recursive: true, force: true });
}
