// Checks web/ before it is deployed, so a broken commit never replaces the live site.
// Run locally with: node .github/scripts/check-site.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import vm from 'node:vm';

const WEB = 'web';
const errors = [];
const read = (path) => readFileSync(join(WEB, path), 'utf8');

// 1. Every script parses
const scripts = readdirSync(join(WEB, 'assets/js')).filter((f) => f.endsWith('.js'));
for (const file of scripts) {
  try {
    new vm.Script(read(`assets/js/${file}`), { filename: file });
  } catch (e) {
    errors.push(`${file}: ${e.message}`);
  }
}

// 2. Config and translations load, and every language has the same keys as German
const context = { window: {} };
vm.createContext(context);
vm.runInContext(read('assets/js/config.js'), context);
vm.runInContext(read('assets/js/i18n.js'), context);
const { SITE, I18N } = context.window;

const appLangs = read('assets/js/app.js').match(/const LANGS = \[([^\]]+)\]/)[1]
  .split(',').map((l) => l.trim().replace(/'/g, ''));
const deKeys = Object.keys(I18N.de);
for (const lang of appLangs) {
  if (!I18N[lang]) {
    errors.push(`i18n: language "${lang}" is listed in app.js but has no strings`);
    continue;
  }
  const missing = deKeys.filter((k) => !(k in I18N[lang]));
  const extra = Object.keys(I18N[lang]).filter((k) => !(k in I18N.de));
  if (missing.length) errors.push(`i18n ${lang}: missing ${missing.join(', ')}`);
  if (extra.length) errors.push(`i18n ${lang}: not in German ${extra.join(', ')}`);
}
if (!/: 'de';/.test(read('assets/js/app.js'))) errors.push('app.js: German is no longer the default language');

// 3. Keys used in the pages exist, and local links point to real files
const pages = readdirSync(WEB).filter((f) => f.endsWith('.html'));
const isLocal = (url) => url && !/^(https?:|mailto:|tel:|#|data:|\$\{)/.test(url);
const checkPath = (from, url) => {
  const path = decodeURI(url.split(/[?#]/)[0]);
  if (path && !existsSync(join(WEB, dirname(from), path))) errors.push(`${from}: missing file ${path}`);
};

for (const page of pages) {
  const html = read(page);
  for (const [, key] of html.matchAll(/data-i18n(?:-html|-aria)?="([^"]+)"/g)) {
    if (!(key in I18N.de)) errors.push(`${page}: unknown i18n key "${key}"`);
  }
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (isLocal(url)) checkPath(page, url);
  }
}
for (const url of [SITE.photo, SITE.cv, ...SITE.pages.map((p) => p.href)]) {
  if (isLocal(url)) checkPath('index.html', url);
}
for (const p of SITE.pages) {
  if (!(p.label in I18N.de)) errors.push(`config.js: unknown i18n key "${p.label}"`);
}

if (errors.length) {
  console.error(`Site check failed (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log(`Site check passed: ${pages.length} pages, ${scripts.length} scripts, ${appLangs.length} languages.`);
