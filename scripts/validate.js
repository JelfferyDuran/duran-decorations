#!/usr/bin/env node
/* ============================================================
   Duran Decorations — DATA VALIDATOR (runs in CI + locally)
   Usage: node scripts/validate.js
   Exits non-zero on any problem so bad data never deploys.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

/* ---------- 1b. verified contact boundary ---------- */
console.log('\n[contact configuration]');
try {
  const sandbox = { window: {} };
  const source = fs.readFileSync(path.join(ROOT, 'js', 'config.js'), 'utf8');
  vm.runInNewContext(source, sandbox, { filename: 'js/config.js' });
  const cfg = sandbox.window.DD_CONFIG || {};
  const publicFields = ['WA_NUMBER', 'IG_HANDLE', 'AREA', 'TRAVEL_LABEL'];
  if (typeof cfg.CONTACT_VERIFIED !== 'boolean') errors.push('config: CONTACT_VERIFIED must be true or false');
  if (cfg.CONTACT_VERIFIED) {
    if (!/^\d{10,15}$/.test(cfg.WA_NUMBER || '')) errors.push('config: verified WA_NUMBER must contain 10–15 digits');
    if (!/^@[A-Za-z0-9._]{1,30}$/.test(cfg.IG_HANDLE || '')) errors.push('config: verified IG_HANDLE must be a valid @handle');
    ['AREA', 'TRAVEL_LABEL'].forEach(key => {
      if (typeof cfg[key] !== 'string' || !cfg[key].trim()) errors.push('config: verified ' + key + ' must be non-empty');
    });
    ok('owner-verified contact and policy fields are populated');
  } else {
    publicFields.forEach(key => {
      if (cfg[key]) errors.push('config: ' + key + ' must stay empty while CONTACT_VERIFIED is false');
    });
    ok('unverified contact and policy fields fail closed');
  }
} catch (e) {
  errors.push('config.js could not be validated: ' + e.message);
}

/* ---------- 1c. static DOM/runtime contract ---------- */
console.log('\n[DOM runtime references]');
try {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const producedIds = new Set(Array.from(html.matchAll(/\sid=["']([^"']+)["']/g), match => match[1]));
  const jsDir = path.join(ROOT, 'js');
  const missing = [];
  const scripts = fs.readdirSync(jsDir).filter(file => file.endsWith('.js')).map(file => ({
    file,
    source: fs.readFileSync(path.join(jsDir, file), 'utf8')
  }));
  scripts.forEach(({ source }) => {
    for (const match of source.matchAll(/\sid=[\\"']([^\\"']+)[\\"']/g)) producedIds.add(match[1]);
  });
  scripts.forEach(({ file, source }) => {
    const exactIdPattern = /getElementById\(\s*(["'])([^"']+)\1\s*\)/g;
    for (const match of source.matchAll(exactIdPattern)) {
      if (!producedIds.has(match[2])) missing.push(file + ' → #' + match[2]);
    }
  });
  if (missing.length) errors.push('DOM: static getElementById references missing from index.html: ' + missing.join(', '));
  else ok('static getElementById references resolve to index.html');
} catch (e) {
  errors.push('DOM runtime references could not be validated: ' + e.message);
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

/* ---------- 5. media provenance ---------- */
console.log('\n[media provenance]');
const media = readJson('media/manifests/assets.json');
if (media) {
  const allowedClasses = new Set(['REAL_PORTFOLIO', 'BRAND_CANONICAL', 'GENERATED_CONCEPT', 'MARKETING_DERIVATIVE', 'ARCHIVE']);
  const allowedApprovals = new Set(['draft', 'review', 'approved', 'published', 'rejected', 'archived']);
  const records = Array.isArray(media.assets) ? media.assets : [];
  if (!Array.isArray(media.assets)) errors.push('media manifest: expected { assets: [...] }');

  const byAsset = new Map();
  records.forEach((m, i) => {
    ['asset', 'class', 'approval', 'verification', 'evidence'].forEach(f => {
      if (m[f] === undefined || m[f] === null || m[f] === '') errors.push('media[' + i + ']: missing "' + f + '"');
    });
    if (m.class && !allowedClasses.has(m.class)) errors.push('media[' + i + ']: invalid class "' + m.class + '"');
    if (m.approval && !allowedApprovals.has(m.approval)) errors.push('media[' + i + ']: invalid approval "' + m.approval + '"');
    if (m.asset) {
      if (byAsset.has(m.asset)) errors.push('media manifest: duplicate asset → ' + m.asset);
      byAsset.set(m.asset, m);
      if (!fs.existsSync(path.join(ROOT, m.asset))) errors.push('media[' + i + ']: asset not found → ' + m.asset);
    }
  });

  if (catalog) {
    catalog.forEach((p, i) => {
      if (!p.img) return;
      const record = byAsset.get(p.img);
      if (!record) {
        errors.push('catalog[' + i + ']: portfolio image missing from media manifest → ' + p.img);
      } else if (record.class !== 'REAL_PORTFOLIO') {
        errors.push('catalog[' + i + ']: public portfolio may only use REAL_PORTFOLIO assets → ' + p.img + ' is ' + record.class);
      } else if (record.approval !== 'published' && record.approval !== 'approved') {
        errors.push('catalog[' + i + ']: public portfolio asset is not approved/published → ' + p.img);
      }
    });
  }

  ok(records.length + ' media records checked; public catalog provenance enforced');
}

/* ---------- 6. asset size sanity ---------- */
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
