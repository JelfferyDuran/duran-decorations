#!/usr/bin/env node
/* ============================================================
   Duran Decorations — GALLERY/BRAND VALIDATOR (runs in CI + locally)
   Usage: node scripts/validate-gallery.js
   Checks brand-kit integrity and that every deposited generated
   image has a complete, honest manifest record.
   Exits non-zero on any problem so bad deposits never deploy.
   See docs/IMAGE_DEPOSIT.md for the deposit contract.
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warn = [];
const ok = msg => console.log('  ✓ ' + msg);

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  } catch (e) {
    errors.push(rel + ': invalid JSON — ' + e.message);
    return null;
  }
}

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const APPROVALS = new Set(['draft', 'review', 'approved', 'published', 'rejected', 'archived']);

/* ---------- 1. brand kit ---------- */
console.log('\n[brand kit]');
const brand = readJson('assets/brand/brand.json');
if (brand) {
  ['brand', 'status', 'colors', 'fonts', 'imagery'].forEach(k => {
    if (brand[k] === undefined) errors.push('brand.json: missing required key "' + k + '"');
  });
  if (brand.status !== 'draft' && brand.status !== 'final') {
    errors.push('brand.json: status must be "draft" or "final"');
  }
  if (brand.status === 'draft') {
    warn.push('brand.json: brand is DRAFT — logo not finalized; deposits must not present placeholder as final mark');
  }
  const logoPath = brand.logo || 'assets/brand/logo.svg';
  if (!fs.existsSync(path.join(ROOT, logoPath))) {
    errors.push('brand.json: logo file missing: ' + logoPath);
  } else ok('brand kit parses; logo file present (status: ' + brand.status + ')');
}

/* ---------- 2. manifests load ---------- */
console.log('\n[manifests]');
const manifests = [];
[['media/manifests/assets.json', false], ['media/manifests/brand.json', false]].forEach(([rel]) => {
  const m = readJson(rel);
  if (m) {
    if (!Array.isArray(m.assets)) errors.push(rel + ': "assets" must be an array');
    else { manifests.push({ rel, assets: m.assets }); ok(rel + ': ' + m.assets.length + ' records'); }
  }
});
const byAsset = new Map();
manifests.forEach(({ rel, assets }) => assets.forEach((a, i) => {
  if (!a.asset) { errors.push(rel + ' record #' + i + ': missing "asset" path'); return; }
  if (byAsset.has(a.asset)) warn.push('duplicate manifest record for ' + a.asset);
  byAsset.set(a.asset, { rel, rec: a });
}));

/* ---------- 3. generated deposits ---------- */
console.log('\n[generated deposits]');
const genDir = path.join(ROOT, 'assets', 'generated');
let files = [];
if (fs.existsSync(genDir)) {
  files = fs.readdirSync(genDir).filter(f => IMAGE_EXT.has(path.extname(f).toLowerCase()));
}
if (!files.length) {
  console.log('  … no deposits yet (assets/generated/ is empty — that is fine)');
} else {
  ok(files.length + ' deposited image(s) found');
}
files.forEach(f => {
  const rel = 'assets/generated/' + f;
  const hit = byAsset.get(rel);
  if (!hit) { errors.push(rel + ': no manifest record — add one to media/manifests/assets.json'); return; }
  const r = hit.rec;
  if (r.class !== 'GENERATED_CONCEPT') {
    errors.push(rel + ': deposited images must be class GENERATED_CONCEPT, found "' + r.class + '"');
  }
  if (!APPROVALS.has(r.approval)) {
    errors.push(rel + ': approval must be one of ' + [...APPROVALS].join('/') + ', found "' + r.approval + '"');
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.created || '')) {
    errors.push(rel + ': "created" must be YYYY-MM-DD');
  }
  if (!r.license && !r.tool) {
    errors.push(rel + ': royalty-free proof required — provide "license" {source,url,terms} or "tool"');
  }
  if (r.license && (!r.license.source || !r.license.url)) {
    errors.push(rel + ': license must include source and url');
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*\.(jpg|jpeg|png|webp)$/.test(f)) {
    warn.push(rel + ': filename should be kebab-case (see docs/IMAGE_DEPOSIT.md)');
  }
});

/* ---------- 4. no generated concept may claim real work ---------- */
console.log('\n[honesty guard]');
byAsset.forEach(({ rel, rec }, assetPath) => {
  if (rec.class === 'GENERATED_CONCEPT' && /real|portfolio|client work/i.test(rec.notes || '') && !/not|never|concept only/i.test(rec.notes || '')) {
    warn.push(assetPath + ' (' + rel + '): notes mention real/client work — confirm it is labeled concept-only');
  }
});

/* ---------- summary ---------- */
console.log('');
if (warn.length) warn.forEach(w => console.log('  ! WARN: ' + w));
if (errors.length) {
  console.log('\n✗ gallery validation failed with ' + errors.length + ' error(s):');
  errors.forEach(e => console.log('  ✗ ' + e));
  process.exit(1);
}
console.log('✓ gallery validation passed' + (warn.length ? ' with ' + warn.length + ' warning(s)' : ''));
