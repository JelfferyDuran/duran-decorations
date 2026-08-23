/* ============================================================
   Duran Decorations — PARAMETRIC ARCH STUDIO
   Canvas arch generated from params (count, fullness, palette).
   Pointer Events (mouse + touch), preset themes, idle sway.
   ============================================================ */
(function () {
  const cv = document.getElementById('archCanvas');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const PALETTES = [
    ['#E8A0BF', '#F4C7A1', '#C9A24B', '#D8C8EC', '#A8D8D0', '#F0E6D2'],
    ['#B0576E', '#8E3F52', '#F3D9D4', '#C9A24B', '#F0E6D2', '#D8C8EC'],
    ['#5B8DEF', '#7FB3E8', '#F4C7A1', '#F0E6D2', '#D8C8EC', '#C9A24B'],
    ['#2FBF9F', '#A8D8D0', '#F4C7A1', '#F0E6D2', '#D8C8EC', '#B0576E']
  ];
  const PRESETS = {
    kids:    { count: 42, fullness: 1.0, palette: 0 },
    wedding: { count: 24, fullness: 0.7, palette: 2 },
    quince:  { count: 34, fullness: 0.9, palette: 1 },
    baby:    { count: 30, fullness: 0.8, palette: 3 }
  };
  const params = { count: 28, fullness: .85, palette: PALETTES[0], paletteIdx: 0 };
  let sway = { x: 0, target: 0 };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize(); window.addEventListener('resize', resize);

  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, Math.min(255, (n >> 16) + pct));
    const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + pct));
    const b = Math.max(0, Math.min(255, (n & 255) + pct));
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }

  function draw() {
    const w = cv.offsetWidth, h = cv.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, baseY = h * .9, halfW = Math.min(w * .4, 250);
    const topY = h * .3;
    const cpx = cx + sway.x * 46;
    const cpy = topY - params.fullness * 110;
    const P = t => { const u = 1 - t; return { x: u*u*cx + 2*u*t*cpx + t*t*(cx+halfW), y: u*u*baseY + 2*u*t*cpy + t*t*baseY }; };
    const T = t => { const u = 1 - t; return { x: 2*u*(cpx-cx) + 2*t*((cx+halfW)-cpx), y: 2*u*(cpy-baseY) + 2*t*(baseY-cpy) }; };
    const now = performance.now() / 1000;
    const n = params.count;
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const p = P(t), tg = T(t);
      const len = Math.hypot(tg.x, tg.y) || 1;
      const px = -tg.y / len, py = tg.x / len;
      const jitter = Math.sin(i * 2.7 + now * .5) * 5;
      const off = Math.abs(Math.sin(t * Math.PI * 1.4)) * 14 + jitter;
      const x = p.x + px * off;
      const y = p.y + py * off - Math.sin(now * .8 + i * .35) * 3;
      const r = 9 + 14 * Math.abs(Math.sin(t * Math.PI * 1.35 + i * .55)) + 4 * Math.sin(i * 1.3);
      const col = params.palette[i % params.palette.length];
      ctx.strokeStyle = 'rgba(120,110,120,.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y + r * .7); ctx.lineTo(x + Math.sin(i * 1.7) * 4, y + r * 2.1); ctx.stroke();
      const g = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .15, x, y, r);
      g.addColorStop(0, 'rgba(255,255,255,.9)');
      g.addColorStop(.4, col);
      g.addColorStop(1, shade(col, -26));
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x - r * .09, y + r * .72); ctx.lineTo(x + r * .09, y + r * .72); ctx.lineTo(x, y + r * 1.1);
      ctx.closePath(); ctx.fillStyle = shade(col, -34); ctx.fill();
    }
    for (let i = 0; i < 10; i++) {
      const sx = cx + Math.sin(i * 3.1 + now * .6) * (halfW * .8);
      const sy = topY - 60 + Math.sin(i * 2.3 + now * .9) * 50 + params.fullness * 30;
      const sa = .25 + .3 * Math.sin(now * 1.4 + i);
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,220,150,' + Math.max(0, sa) + ')'; ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) requestAnimationFrame(draw); else draw();

  /* ---------- sway: pointer events (mouse + touch) ---------- */
  const stage = document.querySelector('.arch-stage');
  function pointer(e) {
    const r = stage.getBoundingClientRect();
    const cx = (e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0].clientX)) - r.left;
    sway.target = (cx / r.width - .5) * 2;
  }
  function pointerEnd() { sway.target = 0; }
  stage.addEventListener('pointermove', pointer);
  stage.addEventListener('pointerdown', pointer);
  stage.addEventListener('pointerleave', pointerEnd);
  stage.addEventListener('pointerup', pointerEnd);
  (function swayLoop() { sway.x += (sway.target - sway.x) * .06; requestAnimationFrame(swayLoop); })();

  /* ---------- controls ---------- */
  const balloonRange = document.getElementById('balloonRange');
  const fullRange = document.getElementById('fullRange');
  balloonRange.addEventListener('input', () => { params.count = +balloonRange.value; document.getElementById('balloonOut').textContent = balloonRange.value; });
  fullRange.addEventListener('input', () => { params.fullness = +fullRange.value; document.getElementById('fullOut').textContent = fullRange.value; });
  document.getElementById('shuffleBtn').addEventListener('click', () => {
    params.paletteIdx = (params.paletteIdx + 1) % PALETTES.length;
    params.palette = PALETTES[params.paletteIdx];
  });
  document.querySelectorAll('.preset-btn').forEach(btn => btn.addEventListener('click', () => {
    const p = PRESETS[btn.dataset.preset];
    if (!p) return;
    params.count = p.count; params.fullness = p.fullness; params.paletteIdx = p.paletteIdx; params.palette = PALETTES[p.paletteIdx];
    balloonRange.value = p.count; fullRange.value = p.fullness;
    document.getElementById('balloonOut').textContent = p.count;
    document.getElementById('fullOut').textContent = p.fullness;
  }));
})();
