const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const root = path.resolve(__dirname, '..');
const indexPath = path.join(root, 'src', 'index.html');
const publishedPath = path.join(root, 'EzEMR.html');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const normalize = source => source.replace(/\r\n?/g, '\n');

function verifyFiles(directory) {
  const provenance = JSON.parse(fs.readFileSync(path.join(directory, 'provenance.json'), 'utf8'));
  for (const [name, digest] of Object.entries(provenance.files)) {
    const file = path.resolve(directory, name);
    if (!file.startsWith(path.resolve(directory) + path.sep) || !/^[a-f0-9]{64}$/.test(digest)) throw new Error(`Invalid vendor checksum entry: ${name}`);
    if (hash(fs.readFileSync(file)) !== digest) throw new Error(`Vendor checksum failed: ${name}`);
  }
  return provenance;
}

function verifyVendor(directory = path.join(root, 'vendor', 'metroui')) {
  const provenance = verifyFiles(directory);
  if (provenance.name !== '@olton/metroui' || provenance.version !== '5.1.20' || provenance.license !== 'MIT' ||
      provenance.entryPoints.script !== 'lib/metro.js' || provenance.entryPoints.style !== 'lib/metro.all.css') throw new Error('Unexpected Metro UI package or entry points');
  const pkg = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  if (pkg.name !== provenance.name || pkg.version !== provenance.version || pkg.license !== provenance.license || !provenance.files.LICENSE) throw new Error('Metro UI package or license is missing');
  for (const name of [provenance.entryPoints.script, provenance.entryPoints.style, 'package.json']) if (!provenance.files[name]) throw new Error(`Vendor checksum is missing: ${name}`);
  return provenance;
}

function localPath(url, base, project) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(url) || /[?#]/.test(url)) throw new Error(`External build resource is forbidden: ${url}`);
  const file = path.resolve(base, url);
  if (!['src', 'vendor'].some(directory => file.startsWith(path.join(project, directory) + path.sep))) throw new Error(`Build resource leaves source/vendor directories: ${url}`);
  return file;
}

function inlineCSS(file, project = root) {
  const css = normalize(fs.readFileSync(file, 'utf8'));
  if (/@import\b/i.test(css)) throw new Error('CSS imports must be bundled locally before building');
  const mime = { '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.eot': 'application/vnd.ms-fontobject', '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
  return css.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (match, quote, url) => {
    if (/^(?:data:|#)/i.test(url)) return match;
    const asset = localPath(url, path.dirname(file), project), type = mime[path.extname(asset).toLowerCase()];
    if (!type) throw new Error(`Unknown asset type: ${url}`);
    return `url("data:${type};base64,${fs.readFileSync(asset).toString('base64')}")`;
  }).replace(/\/\*[#@]\s*sourceMappingURL=[\s\S]*?\*\//g, '');
}

const attribute = (attributes, name) => attributes.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2];

function buildHTML(template = fs.readFileSync(indexPath, 'utf8'), project = root) {
  const metro = path.join(project, 'vendor', 'metroui');
  verifyVendor(metro);
  for (const [directory, file, pin] of [
    ['xlsx-reader', 'xlsx.core.min.js', '19d35a5c9abf6a4bead732e7c50fd4856bee273b567cd977e0dc9d26363aaaea'],
    ['xlsx-style', 'xlsx.bundle.js', '0c796fb94a895613dd6d34289ea25df17531f47bd2f89e0f809a829b0459aa67']
  ]) {
    const folder = path.join(project, 'vendor', directory), provenance = verifyFiles(folder);
    if (!provenance.files[file] || hash(normalize(fs.readFileSync(path.join(folder, file), 'utf8')).trim()) !== pin) throw new Error(`Pinned Excel library changed: ${directory}`);
  }
  const notice = directory => {
    const license = path.join(directory, 'LICENSE');
    return fs.existsSync(license) ? `<!-- ${normalize(fs.readFileSync(license, 'utf8')).trim().replaceAll('--', '- -')} -->\n` : '';
  };
  let html = normalize(template);
  if (/<style\b/i.test(html)) throw new Error('Development styles must use local stylesheet files without inline CSS');
  html = html.replace(/(<meta\b[^>]*http-equiv="Content-Security-Policy"[^>]*content=")([^"]*)(")/i, (match, begin, policy, end) => begin + policy.replace(/script-src[^;]*/, "script-src 'unsafe-inline'").replace(/style-src[^;]*/, "style-src 'unsafe-inline'").replace(/img-src[^;]*/, 'img-src data: blob:').replace(/font-src[^;]*/, 'font-src data:') + end);
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>|<link\b([^>]*)>/gi, (match, scriptAttributes, body, linkAttributes) => {
    if (scriptAttributes !== undefined) {
      const src = attribute(scriptAttributes, 'src');
      if (!src || body.trim()) throw new Error('Development scripts must use local src files without inline code');
      const file = localPath(src, path.join(project, 'src'), project), id = attribute(scriptAttributes, 'id');
      const source = normalize(fs.readFileSync(file, 'utf8'));
      const javascript = (file.includes(path.join('vendor', 'xlsx-')) ? source : source.replace(/^[ \t]*\/\/[#@][ \t]*sourceMappingURL=.*(?:\n|$)/gm, '')).replace(/<\/script/gi, '<\\/script').trim();
      const prefix = file.startsWith(path.join(project, 'vendor') + path.sep) ? notice(path.join(project, 'vendor', path.relative(path.join(project, 'vendor'), file).split(path.sep)[0])) : '';
      return `${prefix}<script${id ? ` id="${id}"` : ''}>\n${javascript}\n</script>`;
    }
    if (attribute(linkAttributes, 'rel') !== 'stylesheet') return match;
    const href = attribute(linkAttributes, 'href');
    if (!href) throw new Error('Stylesheets need a local href');
    const file = localPath(href, path.join(project, 'src'), project), id = attribute(linkAttributes, 'id');
    return `<style${id ? ` id="${id}"` : ''}>\n${inlineCSS(file, project).replace(/<\/style/gi, '<\\/style').trim()}\n</style>`;
  });
  return html.replace(/<!doctype html>/i, '<!doctype html>\n<!-- Generated from src/. Edit development sources and run node scripts/build.cjs. -->');
}

function main(args) {
  if (args.length && !(args.length === 1 && args[0] === '--check') && !(args.length === 2 && args[0] === '--output' && args[1])) throw new Error('Usage: node scripts/build.cjs [--check | --output .tmp/path/EzEMR.html]');
  const output = buildHTML();
  if (args[0] === '--check') {
    if (!fs.existsSync(publishedPath) || normalize(fs.readFileSync(publishedPath, 'utf8')) !== output) throw new Error('Published EzEMR.html is out of sync. Run node scripts/build.cjs.');
    console.log('PASS: Published HTML matches the local development sources and pinned vendors.');
    return;
  }
  const destination = args[0] === '--output' ? path.resolve(root, args[1]) : publishedPath;
  if (args[0] === '--output' && !destination.startsWith(path.join(root, '.tmp') + path.sep)) throw new Error('Build preview output must stay under .tmp/.');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, output);
  console.log(`Built ${path.relative(root, destination)} from local source files (offline).`);
}

module.exports = { buildHTML, verifyVendor, inlineCSS };
if (require.main === module) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
