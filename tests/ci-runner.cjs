const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { runTests } = require('./run-ci.cjs');

const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ezemr-ci-'));
const marker = path.join(directory, 'steps.txt');
const step = (name, code) => ({ name, command: process.execPath, args: ['-e', code, marker] });
try {
  const before = step('runner self-check: first step', "require('node:fs').appendFileSync(process.argv[1], 'before\\n')");
  const failure = step('runner self-check: deliberate failure', 'process.exit(7)');
  const after = step('runner self-check: later step', "require('node:fs').appendFileSync(process.argv[1], 'after\\n')");
  assert.throws(() => runTests([before, failure, after]), error => error.exitCode === 7);
  assert.equal(fs.readFileSync(marker, 'utf8'), 'before\n');
  runTests([after]);
  assert.equal(fs.readFileSync(marker, 'utf8'), 'before\nafter\n');
  assert.throws(() => runTests([{ name: 'runner self-check: missing command', command: path.join(directory, 'missing-executable'), args: [] }]));
  const hook = spawnSync('git', ['-c', 'core.hooksPath=.githooks', 'hook', 'run', 'pre-push'], {
    cwd: path.resolve(__dirname, '..'),
    env: { ...process.env, PYTHON: path.join(directory, 'missing-python') },
    encoding: 'utf8'
  });
  assert.ifError(hook.error);
  assert.equal(hook.status, 1, hook.stdout + hook.stderr);
  assert.match(hook.stdout + hook.stderr, /CI: Python export dependencies/);
  console.log('PASS: Actual pre-push hook rejects a failed CI dependency check');
  console.log('PASS: CI runner preserves failure status, stops later steps and rejects missing executables');
} finally {
  fs.rmSync(marker, { force: true });
  fs.rmdirSync(directory);
}
