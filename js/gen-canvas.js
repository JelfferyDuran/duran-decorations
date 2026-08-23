/* ============================================================
   Duran Decorations — GENERATIVE CANVAS
   Ambient floating orbs across the whole page.
   Reacts to scroll velocity + dark mode. Skipped on coarse
   pointers (battery/GPU).
   ============================================================ */
(function () {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cv = document.getElementById('genCanvas');
  if (!cv || coarse) { if (cv) cv.remove(); return; }
  const ctx = cv.getContext('2d');
  let W, H, parts = [];
  function resize() {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const N = innerWidth < 768 ? 22 : 44;
    parts = [];
    for (let i = 0; i < N; i++) parts.push({ x: Math.random() * W, y: Math.random() * H, r: 6 + Math.random() * 26, vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16, hue: 315 + Math.random() * 85, sp: .3 + Math.random() * .6, ph: Math.random() * Math.PI * 2 });
  }
  resize(); window.addEventListener('resize', resize);
  let scrollVel = 0, lastY = 0;
  (function tick() {
    ctx.clearRect(0, 0, W, H);
    const sy = window.scrollY || 0;
    scrollVel += (sy - lastY) * .02; scrollVel *= .88; lastY = sy;
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const now = performance.now() / 1000;
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy + scrollVel;
      if (p.x < -p.r) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = H + p.r; if (p.y > H + p.r) p.y = -p.r;
      const a = .08 + .05 * Math.sin(now * p.sp + p.ph);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dark ? 'hsla(' + p.hue + ',45%,68%,' + a + ')' : 'hsla(' + p.hue + ',60%,74%,' + a + ')';
      ctx.fill();
      ctx.beginPath(); ctx.arc(p.x - p.r * .3, p.y - p.r * .3, p.r * .22, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill();
    });
    requestAnimationFrame(tick);
  })();
})();
