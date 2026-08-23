/* ============================================================
   Duran Decorations — WEBGL HERO (Three.js)
   Floating 3D balloons with strings, scroll parallax.
   Gated: skipped on reduced-motion, coarse pointers (mobile)
   or if the Three.js CDN failed to load.
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const canvas = document.getElementById('heroGL');
  if (!canvas || reduceMotion || coarse || typeof THREE === 'undefined') {
    if (canvas) canvas.remove(); // fall back to CSS gradient hero
    return;
  }
  const isMobile = innerWidth < 768;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, .1, 100);
  camera.position.z = 14;
  scene.add(new THREE.AmbientLight(0xffffff, .75));
  const dir = new THREE.DirectionalLight(0xffffff, 1.2); dir.position.set(4, 6, 5); scene.add(dir);
  const pnt = new THREE.PointLight(0xffd9b3, .9, 30); pnt.position.set(-6, -2, 6); scene.add(pnt);
  const palette = [0xE8A0BF, 0xF4C7A1, 0xC9A24B, 0xD8C8EC, 0xA8D8D0, 0xF0E6D2, 0xB0576E];
  const balloons = [];
  const count = isMobile ? 12 : 24;
  for (let i = 0; i < count; i++) {
    const r = .45 + Math.random() * .85;
    const mat = new THREE.MeshPhongMaterial({ color: palette[i % palette.length], shininess: 90, specular: 0xffffff, transparent: true, opacity: .9 });
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 22, 22), mat);
    m.position.set((Math.random() - .5) * 22, (Math.random() - .5) * 12, -3 + Math.random() * 4);
    const str = new THREE.Mesh(new THREE.CylinderGeometry(.012, .012, r * 2.8), new THREE.MeshBasicMaterial({ color: 0x999999 }));
    str.position.y = -r * 1.6;
    m.add(str);
    m.userData = { baseY: m.position.y, speed: .3 + Math.random() * .5, amp: .3 + Math.random() * .55, phase: Math.random() * Math.PI * 2 };
    scene.add(m); balloons.push(m);
  }
  let scY = 0;
  (function tick() {
    const t = performance.now() / 1000;
    balloons.forEach(b => {
      b.position.y = b.userData.baseY + Math.sin(t * b.userData.speed + b.userData.phase) * b.userData.amp;
      b.rotation.x = Math.sin(t * .4 + b.userData.phase) * .12;
      b.rotation.z = Math.cos(t * .35 + b.userData.phase) * .12;
    });
    const lenis = window.DD && window.DD.motion && window.DD.motion.getLenis();
    if (lenis) scY += ((lenis.scroll || 0) - scY) * .06; else scY = (window.scrollY || 0);
    camera.position.y = scY * .004;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  })();
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
})();
