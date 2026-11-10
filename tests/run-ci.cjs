const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createHash } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const { buildHTML } = require('../scripts/build.cjs');

function runTests(steps, env = process.env) {
  for (const { name, command, args } of steps) {
    console.log(`\nCI: ${name}`);
    const result = spawnSync(command, args, { cwd: root, env, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) {
      const error = new Error(`${name} failed (exit ${result.status ?? result.signal}). Push blocked.`);
      error.exitCode = result.status || 1;
      throw error;
    }
  }
}

function extractExcelScript(html) {
  const embedded = html.match(/<script id="excelLibrary">([\s\S]*?)<\/script>/)?.[1];
  if (!embedded) throw new Error('Embedded Excel test component is missing');
  if (createHash('sha256').update(embedded.trim().replace(/\r\n?/g, '\n')).digest('hex') !== '0c796fb94a895613dd6d34289ea25df17531f47bd2f89e0f809a829b0459aa67') throw new Error('Embedded Excel test component checksum failed');
  return embedded;
}

async function main() {
  const paths = [root, path.join(root, '.tmp', 'test-tools')];
  const env = { ...process.env };
  const appPath = path.join(root, '.tmp', 'ci', 'EzEMR.html');
  fs.mkdirSync(path.dirname(appPath), { recursive: true });
  fs.writeFileSync(appPath, buildHTML());
  env.EZEMR_TEST_HTML = appPath;
  try {
    require.resolve('acorn', { paths });
    env.PLAYWRIGHT_MODULE ||= path.dirname(require.resolve('playwright/package.json', { paths }));
    require(env.PLAYWRIGHT_MODULE);
  } catch (error) {
    throw new Error('Test dependencies are missing. Run the setup commands in tests/VERIFICATION.md.', { cause: error });
  }

  const python = env.PYTHON || 'python';
  const nodeStep = name => ({ name, command: process.execPath, args: [path.join(__dirname, name)] });
  runTests([
    nodeStep('check_i18n.cjs'),
    { name: 'Python export dependencies', command: python, args: ['-c', 'import pypdf, pymupdf'] }
  ], env);

  const excel = env.XLSX_SCRIPT ? path.resolve(env.XLSX_SCRIPT) : path.join(root, '.tmp', 'xlsx.bundle.js');
  if (!fs.existsSync(excel)) {
    if (env.XLSX_SCRIPT) throw new Error(`Excel test component does not exist: ${excel}`);
    console.log('CI: Extracting pinned Excel test component from the offline HTML');
    const embedded = extractExcelScript(fs.readFileSync(appPath, 'utf8'));
    fs.mkdirSync(path.dirname(excel), { recursive: true });
    fs.writeFileSync(excel, embedded);
  }
  env.XLSX_SCRIPT = excel;

  const files = fs.readdirSync(__dirname).sort();
  const otherNodeTests = files.filter(name => name.endsWith('.cjs') && !['run-ci.cjs', 'check_i18n.cjs', 'rehab-note.cjs'].includes(name));
  const pythonTests = files.filter(name => name.endsWith('.py')).map(name => ({ name, command: python, args: [path.join(__dirname, name)] }));
  runTests([nodeStep('rehab-note.cjs'), ...pythonTests, ...otherNodeTests.map(nodeStep)], env);
  console.log('\nPASS: Full CI completed.');
}

module.exports = { runTests, extractExcelScript };
if (require.main === module) main().catch(error => { console.error(error.message); process.exitCode = error.exitCode || 1; });
