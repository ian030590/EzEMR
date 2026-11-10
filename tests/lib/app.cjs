const fs = require('node:fs');
const path = require('node:path');
const { buildHTML } = require('../../scripts/build.cjs');

const root = path.resolve(__dirname, '..', '..');
const appPath = process.env.EZEMR_TEST_HTML ? path.resolve(process.env.EZEMR_TEST_HTML) : path.join(root, '.tmp', 'test-apps', String(process.pid), 'EzEMR.html');
if (!process.env.EZEMR_TEST_HTML) {
  fs.mkdirSync(path.dirname(appPath), { recursive: true });
  fs.writeFileSync(appPath, buildHTML());
}
if (!fs.existsSync(appPath)) throw new Error(`Test application does not exist: ${appPath}`);

module.exports = { appPath };
