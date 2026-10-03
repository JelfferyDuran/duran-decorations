#!/usr/bin/env node
/* ============================================================
   Duran Decorations — REPOSITORY OPERATING-SYSTEM PREFLIGHT
   Verifies that future automated/manual runs have the durable
   repository context required before selecting a work lane.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const errors = [];
const warnings = [];
const ok = message => console.log('  ✓ ' + message);

function read(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    errors.push('missing required file: ' + relativePath);
    return '';
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function readJson(relativePath) {
  const source = read(relativePath);
  if (!source) return null;
  try {
    return JSON.parse(source);
  } catch (error) {
    errors.push(relativePath + ': invalid JSON — ' + error.message);
    return null;
  }
}

function requireText(relativePath, source, expected) {
  if (!source.includes(expected)) {
    errors.push(relativePath + ': missing required contract text → ' + expected);
  }
}

console.log('\n[repository operating system]');
const requiredDocs = [
  'README.md',
  'docs/CURRENT_STATE.md',
  'docs/ORCHESTRATION.md',
  'docs/AGENT_HANDOFF.md',
  'docs/AUTOMATION_RUNBOOK.md',
  'docs/MEDIA_PIPELINE.md',
  'docs/GROWTH_BASELINE.md',
  'docs/ROADMAP.md'
];
const docs = Object.fromEntries(requiredDocs.map(file => [file, read(file)]));
if (!errors.length) ok(requiredDocs.length + ' required operating-system files found');

requireText('docs/CURRENT_STATE.md', docs['docs/CURRENT_STATE.md'], '## Next Step to Build');
requireText('docs/ORCHESTRATION.md', docs['docs/ORCHESTRATION.md'], '## Start-of-run protocol');
requireText('docs/ORCHESTRATION.md', docs['docs/ORCHESTRATION.md'], '## End-of-run protocol');
requireText('docs/ORCHESTRATION.md', docs['docs/ORCHESTRATION.md'], '## Merge protocol');
requireText('docs/AGENT_HANDOFF.md', docs['docs/AGENT_HANDOFF.md'], '## Business-data boundary');
requireText('docs/AGENT_HANDOFF.md', docs['docs/AGENT_HANDOFF.md'], '## Media boundary');
requireText('docs/AUTOMATION_RUNBOOK.md', docs['docs/AUTOMATION_RUNBOOK.md'], '## Start-of-run checklist');
requireText('docs/AUTOMATION_RUNBOOK.md', docs['docs/AUTOMATION_RUNBOOK.md'], '## Durable handoff template');
requiredDocs.slice(1).forEach(file => requireText('README.md', docs['README.md'], file));
if (!errors.length) ok('run, safety, merge, and handoff contracts are linked');

console.log('\n[bounded state snapshot]');
const catalog = readJson('catalog.json');
const pricing = readJson('pricing.json');
const media = readJson('media/manifests/assets.json');
if (catalog) ok(catalog.length + ' public catalog items');
if (pricing) ok((pricing.packages || []).length + ' packages and ' + (pricing.addons || []).length + ' add-ons');
if (media) {
  const counts = (media.assets || []).reduce((result, asset) => {
    result[asset.class] = (result[asset.class] || 0) + 1;
    return result;
  }, {});
  ok((media.assets || []).length + ' provenance records (' + Object.entries(counts).map(([key, value]) => key + ': ' + value).join(', ') + ')');
}

try {
  const sandbox = { window: {} };
  vm.runInNewContext(read('js/config.js'), sandbox, { filename: 'js/config.js' });
  const verified = sandbox.window.DD_CONFIG && sandbox.window.DD_CONFIG.CONTACT_VERIFIED === true;
  console.log('  • owner contact/policy verification: ' + (verified ? 'verified' : 'blocked/pending'));
  if (!verified) warnings.push('owner-confirmed contact and policy facts are still required before outbound contact can be enabled');
} catch (error) {
  errors.push('js/config.js could not be inspected: ' + error.message);
}

warnings.push('refresh GitHub issues/PRs and Vercel state through their connected tools; offline preflight cannot prove external state');

console.log('\n[external checks still required]');
warnings.forEach(message => console.log('  ⚠ ' + message));

console.log('\n════════════════════════════');
if (errors.length) {
  console.log('✗ PREFLIGHT FAILED — ' + errors.length + ' error(s):');
  errors.forEach(error => console.log('  ✗ ' + error));
  process.exit(1);
}
console.log('✓ REPOSITORY PREFLIGHT PASSED');
