const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createHash } = require('node:crypto');
const root = path.resolve(__dirname, '..');
const { parse } = require(require.resolve('acorn', { paths: [__dirname, path.join(root, '.tmp', 'test-tools')] }));

const canonical = new Set(['SYMS', 'TP_LABEL', 'SUBTESTS', 'ABSENCE_REASONS', 'NOTIFIED', 'TIMING', 'VISITS', 'FIELD_TYPES', 'EYES']);
const builtins = new Set(['DEFAULT_PLAN', 'TRAIN', 'EYE_PROCS', 'ED_MODES', 'ED_DUR', 'ED_DOT']);
const shared = new Set(['CSV + PDF', 'CSV', 'PDF', 'JSON', 'HTML', 'Excel', 'Data', 'SOAP', 'COPM', 'UFOV', 'NPC', 'NRS', 'OU', 'OD', 'OS', 'EyeDot Trainer', 'EyeDot ×', 'English', 'EzEMR', 'Ctrl+S', 'Ctrl+O', 'Ctrl+C', 'S', 'O', 'A', 'P']);
const han = /\p{Script=Han}/u;
const uiAttributes = new Set(['title', 'aria-label', 'placeholder']);

function walk(node, visit, parent = null, owner = '') {
  if (!node || typeof node !== 'object') return;
  if (node.type === 'VariableDeclarator') owner = node.id.name || owner;
  if (node.type) visit(node, parent, owner);
  if (owner === 'UI_EN' || owner === 'LABELS' || owner === 'SOURCE_WORKBOOK') return;
  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach(child => walk(child, visit, node, owner));
    else if (value && typeof value === 'object') walk(value, visit, node, owner);
  }
}

function validate(html) {
  const scripts = [];
  for (const [, attributes, source] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const type = attributes.match(/(?:^|\s)type\s*=\s*(?:["']([^"']*)["']|([^\s>]+))/i);
    if (type && ['application/json', 'application/ld+json', 'importmap', 'speculationrules'].includes((type[1] ?? type[2]).trim().toLowerCase())) continue;
    if (/\bid\s*=\s*["']excelLibrary["']/i.test(attributes)) {
      // Only the pinned third-party bundle is exempt from application UI rules.
      assert.equal(createHash('sha256').update(source.trim().replace(/\r\n?/g, '\n')).digest('hex'), '0c796fb94a895613dd6d34289ea25df17531f47bd2f89e0f809a829b0459aa67', 'Embedded Excel library changed; review its source and update the pinned hash');
      continue;
    }
    scripts.push({ source, ast: parse(source, { ecmaVersion: 'latest', locations: true }) });
  }
  const definitions = new Map();
  for (const { source, ast } of scripts) {
    for (const statement of ast.body) {
      if (statement.type === 'VariableDeclaration') {
        for (const declaration of statement.declarations) definitions.set(declaration.id.name, { declaration, text: `const ${source.slice(declaration.start, declaration.end)};` });
      } else if (statement.type === 'FunctionDeclaration' && statement.id.name === 'ui') definitions.set('ui', { text: source.slice(statement.start, statement.end) });
    }
  }
  const translations = JSON.parse(definitions.get('UI_EN').text.replace(/^const UI_EN = /, '').replace(/;$/, ''));
  for (const [key, value] of Object.entries(translations)) {
    assert.equal(typeof value, 'string', `Non-string English translation: ${key}`);
    assert.ok(value.trim() && !han.test(value), `Missing English translation: ${key}`);
  }
  const labels = vm.runInNewContext(`(${definitions.get('LABELS').text.replace(/^const LABELS = /, '').replace(/;$/, '')})`);
  for (const [english, chinese] of Object.entries(labels)) assert.ok(!han.test(english) && han.test(chinese), `Incomplete built-in label pair: ${english}`);
  const sourceItems = vm.runInNewContext(`${definitions.get('SOURCE_ASSESSMENTS').text}\nSOURCE_ASSESSMENTS`);
  for (const item of sourceItems) for (const label of [item.name, item.domain, ...item.fields.map(field => field.label)]) {
    assert.ok(Object.hasOwn(labels, label) || shared.has(label), `Source assessment needs a Chinese LABELS entry: ${label}`);
  }
  const translatorSource = ['UI_EN', 'uiPattern', 'ui'].map(key => definitions.get(key).text).join('\n');
  const translate = vm.runInNewContext(`${translatorSource}\nui`, { language: 'en' });
  assert.equal(translate('第 {0} 次', '姓名 {0}'), 'Session 姓名 {0}', 'Translation must preserve interpolated client content');
  let checked = 0;
  const coverage = (text, location) => {
    assert.ok(!han.test(translate(text)), `${location}: missing English translation: ${text}`);
    checked++;
  };
  const sharedText = (text, location) => {
    const clean = text.trim();
    if (!han.test(clean) && /[A-Za-z]/.test(clean)) assert.ok(shared.has(clean), `${location}: English-only UI label; use a Chinese ui literal and add its English translation: ${clean}`);
  };
  const markup = (text, location) => {
    for (const match of text.matchAll(/>([^<>]*)</g)) sharedText(match[1], location);
    for (const match of text.matchAll(/\b(?:title|aria-label|placeholder)\s*=\s*(["'])(.*?)\1/g)) sharedText(match[2], location);
  };
  const uiSink = (node, parent) => parent?.type === 'AssignmentExpression' && ['textContent', 'innerText', 'innerHTML', 'outerHTML', 'title', 'placeholder'].includes(parent.left.property?.name) ||
    parent?.type === 'CallExpression' && (['toast', 'ask', 'modal'].includes(parent.callee.name) && parent.arguments[0] === node ||
      parent.callee.property?.name === 'setAttribute' && uiAttributes.has(parent.arguments[0]?.value) && parent.arguments[1] === node ||
      parent.callee.property?.name === 'insertAdjacentHTML' && parent.arguments[1] === node) ||
    parent?.type === 'NewExpression' && parent.callee.name === 'Error';
  for (const { ast } of scripts) {
    walk(ast, (node, parent, owner) => {
      const location = `inline script line ${node.loc.start.line}`;
      if (node.type === 'Property' && canonical.has(owner)) {
        const label = ['TIMING', 'TP_LABEL', 'FIELD_TYPES'].includes(owner) ||
          owner === 'VISITS' && node.key.name === 'label' ||
          owner === 'SYMS' && ['zh', 'q'].includes(node.key.name) || owner === 'SUBTESTS' && node.key.name === 'zh';
        if (label) assert.ok(node.value.type === 'Literal' && typeof node.value.value === 'string' && han.test(node.value.value), `${location}: ${owner} display labels need canonical Chinese text and its English translation`);
      }
      if (node.type === 'ObjectExpression' && ['SYMS', 'SUBTESTS'].includes(owner)) {
        const fields = new Map(node.properties.map(property => [property.key.name, property.value]));
        assert.ok(fields.get('en')?.value && !han.test(fields.get('en').value) && fields.get('zh')?.value && han.test(fields.get('zh').value), `${location}: ${owner} needs both en and zh labels`);
      }
      if (node.type === 'Literal' && typeof node.value === 'string') {
        const key = parent?.type === 'Property' && parent.key === node || parent?.type === 'MemberExpression' && parent.property === node;
        const localized = parent?.type === 'CallExpression' && parent.callee.name === 'ui' && parent.arguments[0] === node;
        if (han.test(node.value) && !key) {
          assert.ok(localized || canonical.has(owner), `${location}: raw Chinese UI string must use ui(): ${node.value}`);
          coverage(node.value, location);
        }
        if (['ABSENCE_REASONS', 'NOTIFIED'].includes(owner) || owner === 'EYES' && parent?.type === 'ArrayExpression' && parent.elements[1] === node) {
          assert.ok(han.test(node.value), `${location}: ${owner} display choices need canonical Chinese text and its English translation`);
        }
        if (builtins.has(owner) && !key && !['id', 'k', 'timing', 'type'].includes(parent?.key?.name) && /[A-Za-z]/.test(node.value)) {
          assert.ok(Object.hasOwn(labels, node.value) || shared.has(node.value), `${location}: built-in item needs a Chinese LABELS entry: ${node.value}`);
        }
        if ((localized || uiSink(node, parent)) && !node.value.includes('<')) sharedText(node.value, location);
        if (node.value.includes('<')) markup(node.value, location);
      }
      if (node.type === 'TemplateLiteral') {
        const localized = parent?.type === 'TaggedTemplateExpression' && parent.tag.name === 'ui';
        for (const part of node.quasis) if (han.test(part.value.cooked)) {
          assert.ok(localized, `${location}: Chinese template must use the ui tag`);
          coverage(part.value.cooked, location);
        }
        const text = node.quasis.map(part => part.value.cooked).join('');
        if (!text.includes('<') && (localized || uiSink(node, parent))) node.quasis.forEach(part => sharedText(part.value.cooked, location));
        markup(text, location);
      }
    });
  }
  const staticHTML = html.replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>|<style>[\s\S]*?<\/style>|<!--[^]*?-->|<select[^>]*data-language-names[^>]*>[\s\S]*?<\/select>/g, '');
  coverage(staticHTML, 'static HTML');
  markup(staticHTML, 'static HTML');
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), han, 'English README must contain no Chinese characters');
  return checked;
}

const html = fs.readFileSync(path.join(root, 'EzEMR.html'), 'utf8');
const count = validate(html);
const lfHTML = html.replace(/\r\n?/g, '\n');
assert.equal(validate(lfHTML), count, 'LF checkouts must accept the pinned library');
assert.equal(validate(lfHTML.replace(/\n/g, '\r\n')), count, 'CRLF checkouts must accept the pinned library');
const inject = (html, probe) => html.replace(/<\/script>(\s*<\/body>\s*<\/html>\s*)$/, `${probe}\n</script>$1`);
assert.equal(validate(inject(html, "document.title = ui('新增個案');")), count + 1, 'Regression probes must reach the application script');
for (const probe of [
  "document.title = '新增個案';",
  "document.title = 'English-only feature';",
  "ui('未提供翻譯的全新測試功能');",
  'document.title = `English-only feature`;',
  'toast(ui`English-only feature`);',
  `document.body.innerHTML = '<button aria-label="English-only feature">+</button>';`,
  `document.body.innerHTML = '<input placeholder="English-only feature">';`,
  `document.body.innerHTML = '<button>English-only feature</button>';`
]) {
  assert.throws(() => validate(inject(html, probe)), undefined, `Localization gate accepted ${probe}`);
}
assert.equal(validate(html.replace(/<\/body>(\s*<\/html>\s*)$/, '<script type="application/json">{"label":"來源資料"}</script></body>$1')), count, 'JSON data must not be parsed as executable UI');
assert.throws(() => validate(html.replace(/<\/body>(\s*<\/html>\s*)$/, '<script type="text/javascript">document.title = "新增個案";</script></body>$1')), undefined, 'Typed JavaScript must still be checked');
assert.throws(() => validate(html.replace(/<\/body>(\s*<\/html>\s*)$/, '<script data-type="application/json">document.title = "新增個案";</script></body>$1')), undefined, 'Data attributes must not exempt executable scripts');
assert.throws(() => validate(html.replace('<script id="excelLibrary">', '<script id="excelLibrary">document.title = "新增個案";')), undefined, 'Modified vendor scripts must not bypass the gate');
assert.throws(() => validate(html.replace("session: '每次復健'", "session: 'English-only timing'")), undefined, 'Localization gate accepted an English-only canonical label');
console.log(`PASS: ${count} localization fragments, built-in label pairs and English README; gate rejects missing translations and raw one-language UI`);
