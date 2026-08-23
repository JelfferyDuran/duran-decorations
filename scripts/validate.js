#!/usr/bin/env node
/* ============================================================
   Duran Decorations — DATA VALIDATOR (runs in CI + locally)
   Usage: node scripts/validate.js
   Exits non-zero on any problem so bad data never deploys.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warn = [];
const ok = msg => console.log('  ✓ ' + msg);

function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, name), 'utf8'));
  } catch (e) {
    errors.push(name + ': invalid JSON — ' + e.message);
    return null;
  }
}

/* ---------- 1. i18n key parity ---------- */
console.log('\n[i18n parity]');
try {
  const { en, es } = require(path.join(ROOT, 'js', 'i18n.js'));
  const ek = Object.keys(en).sort();
  const sk = Object.keys(es).sort();
  const missingInEs = ek.filter(k => !(k in es));
  const missingInEn = sk.filter(k => !(k in en));
  if (missingInEs.length) errors.push('i18n: keys missing in ES: ' + missingInEs.join(', '));
  if (missingInEn.length) errors.push('i18n: keys missing in EN: ' + missingInEn.join(', '));
  if (!missingInEs.length && !missingInEn.length) ok('EN/ES key sets identical (' + ek.length + ' keys)');
} catch (e) {
  errors.push('i18n.js could not be loaded: ' + e.message);
}

/* ---------- 2. catalog ---------- */
console.log('\n[catalog]');
const catalog = readJson('catalog.json');
if (catalog) {
  const required = ['id', 'name', 'name_es', 'cat', 'cat_es', 'img', 'desc', 'desc_es'];
  catalog.forEach((p, i) => {
    required.forEach(f => { if (p[f] === undefined) errors.push('catalog[' + i + ']: missing "' + f + '"'); });
    if (p.img && !fs.existsSync(path.join(ROOT, p.img))) errors.push('catalog[' + i + ']: image not found → ' + p.img);
  });
  ok(catalog.length + ' items, images checked');
}

/* ---------- 3. pricing ---------- */
console.log('\n[pricing]');
const pricing = readJson('pricing.json');
if (pricing) {
  const pkgs = (pricing.packages || pricing);
  if (!Array.isArray(pkgs)) errors.push('pricing: expected array or { packages: [...] }');
  pkgs.forEach((p, i) => {
    ['id', 'name', 'name_es', 'market', 'duran'].forEach(f => { if (p[f] === undefined) errors.push('pricing[' + i + ']: missing "' + f + '"'); });
    if (typeof p.market === 'number' && p.market <= 0) errors.push('pricing[' + i + ']: market must be > 0');
    if (typeof p.duran === 'number' && p.duran <= 0) errors.push('pricing[' + i + ']: duran must be > 0');
    if (typeof p.market === 'number' && typeof p.duran === 'number' && p.duran >= p.market)
      errors.push('pricing[' + i + '] "' + p.name + '": duran ($' + p.duran + ') must be BELOW market ($' + p.market + ')');
  });
  ok(pkgs.length + ' packages');
  const addons = pricing.addons || [];
  addons.forEach((a, i) => {
    ['id', 'name', 'name_es', 'unit'].forEach(f => { if (a[f] === undefined) errors.push('addons[' + i + ']: missing "' + f + '"'); });
    if (a.price != null && (typeof a.price !== 'number' || a.price < 0)) errors.push('addons[' + i + ']: price must be a positive number or null');
    if (a.unit !== 'flat' && a.unit !== 'ft') errors.push('addons[' + i + ']: unit must be "flat" or "ft"');
  });
  ok(addons.length + ' add-ons');
}

/* ---------- 4. testimonials ---------- */
console.log('\n[testimonials]');
const testi = readJson('testimonials.json');
if (testi) {
  testi.forEach((x, i) => {
    ['name', 'text', 'event', 'date'].forEach(f => { if (x[f] === undefined) errors.push('testimonials[' + i + ']: missing "' + f + '"'); });
    if (x.stars != null && (x.stars < 1 || x.stars > 5)) errors.push('testimonials[' + i + ']: stars must be 1–5');
  });
  ok(testi.length + ' entries (empty = section hidden)');
}

/* ---------- 5. asset size sanity ---------- */
console.log('\n[assets]');
if (fs.existsSync(path.join(ROOT, 'assets'))) {
  const big = fs.readdirSync(path.join(ROOT, 'assets'))
    .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
    .map(f => ({ f, s: fs.statSync(path.join(ROOT, 'assets', f)).size }))
    .filter(x => x.s > 600 * 1024);
  big.forEach(b => warn.push('assets/' + b.f + ' is ' + Math.round(b.s / 1024) + 'KB — consider compressing'));
  ok('scanned for oversized images');
}

/* ---------- report ---------- */
console.log('\n════════════════════════════');
if (errors.length) {
  console.log('✗ FAIL — ' + errors.length + ' error(s):');
  errors.forEach(e => console.log('  ✗ ' + e));
  process.exit(1);
}
warn.forEach(w => console.log('  ⚠ ' + w));
console.log('✓ ALL CHECKS PASSED');
