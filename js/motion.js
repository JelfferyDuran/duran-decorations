/* ============================================================
   Duran Decorations — MOTION
   GSAP + ScrollTrigger, Lenis scroll physics, preloader,
   magnetic buttons, parallax. Everything feature-detected
   (site stays fully usable if CDNs fail).
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const hasLenis = typeof window.Lenis !== 'undefined';

  let lenis = null;

  function initLenis() {
    if (reduceMotion || !hasLenis || !hasGSAP) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', () => { if (window.ScrollTrigger) window.ScrollTrigger.update(); });
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); const el = document.querySelector(id); if (el) lenis.scrollTo(el, { offset: -72 }); }
    }));
  }

  function initMotion() {
    if (reduceMotion || !hasGSAP) return;
    if (window.ScrollTrigger) gsap.registerPlugin(window.ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .kicker', { y: 30, opacity: 0, duration: .8, delay: .15 })
      .from('.hero h1', { y: 60, opacity: 0, duration: 1.1 }, '-=.45')
      .from('.hero .sub', { y: 40, opacity: 0, duration: .9 }, '-=.7')
      .from('.hero-ctas .btn', { y: 26, opacity: 0, duration: .7, stagger: .1 }, '-=.6')
      .from('.hero-badges .hb', { y: 20, opacity: 0, duration: .7, stagger: .1 }, '-=.5')
      .from('.hero-img', { y: 70, opacity: 0, duration: 1.2, ease: 'power2.out' }, '-=.6');

    if (window.ScrollTrigger) {
      gsap.utils.toArray('section').forEach(sec => {
        const heads = sec.querySelectorAll('.sec-head > *');
        if (heads.length) gsap.from(heads, { scrollTrigger: { trigger: sec, start: 'top 78%' }, y: 40, opacity: 0, duration: .85, stagger: .12, ease: 'power2.out' });
      });
      gsap.utils.toArray('.card, .price-card, .step, .testi').forEach(el => {
        gsap.from(el, { scrollTrigger: { trigger: el, start: 'top 88%' }, y: 50, opacity: 0, duration: .75, ease: 'power2.out' });
      });
      gsap.to('.hero-img', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to('.about-img', { yPercent: -12, ease: 'none', scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }

  /* ---------- magnetic CTAs (fine pointers only) ---------- */
  function initMagnetic() {
    if (reduceMotion || !hasGSAP || !window.matchMedia('(pointer: fine)').matches) return;
    document.querySelectorAll('.btn, .shuffle-btn').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .18;
        const y = (e.clientY - r.top - r.height / 2) * .18;
        gsap.to(btn, { x, y, duration: .3, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: .4, ease: 'power2.out' }));
    });
  }

  /* ---------- preloader ---------- */
  function initPreloader() {
    const el = document.getElementById('preloader');
    if (!el) return;
    const hide = () => {
      el.classList.add('done');
      setTimeout(() => el.remove(), 600);
    };
    if (reduceMotion || !hasGSAP) { hide(); return; }
    window.addEventListener('load', () => setTimeout(hide, 450));
    setTimeout(hide, 3500); // safety
  }

  window.DD = Object.assign(window.DD || {}, {
    motion: { initLenis, initMotion, initMagnetic, initPreloader, getLenis: () => lenis }
  });
})();
