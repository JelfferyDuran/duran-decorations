#!/usr/bin/env node
// Static contracts for optional decorative canvas behavior.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const hero = read('js/hero-webgl.js');
const studio = read('js/arch-studio.js');
const ambient = read('js/gen-canvas.js');
const html = read('index.html');
assert.match(hero, /getContext\('webgl2'\)/, 'WebGL must be probed before renderer construction');
assert.match(hero, /if \(!context\) \{ canvas\.remove\(\); return; \}/, 'No GPU must use static hero');
assert.match(hero, /webglcontextlost/, 'Context loss must be handled');
assert.match(hero, /cancelAnimationFrame\(frameId\)/, 'Stopped GPU animation must not loop');
assert.match(hero, /catch \(_\) \{ stop\(\); return; \}/, 'Render failures must stop');
assert.match(studio, /cv\.getContext\('2d'\)/, 'Studio must use Canvas 2D');
assert.match(studio, /if \(!ctx\)/, 'Studio needs 2D fallback');
assert.match(studio, /role', 'status'/, 'Fallback must announce its status');
assert.match(studio, /controls\.hidden = true/, 'Unavailable controls must be hidden');
assert.match(ambient, /if \(!ctx\) \{ cv\.remove\(\); return; \}/, 'Ambient canvas must fail closed');
assert.match(html, /class="hero-img"[^>]*src="assets\/organic-arch-sequin\.jpg"/, 'Real portfolio image must remain');
console.log('✓ Canvas fallback contracts verified');
