/* ============================================================
   Duran Decorations — APP (orchestrator)
   Language / theme / burger / data load / init order.
   ============================================================ */
(function () {
  window.DD_LANG = localStorage.getItem('dd_lang') || 'en';
  const cfg = window.DD_CONFIG;

  function contactReady() {
    return cfg.CONTACT_VERIFIED === true && /^\d{10,15}$/.test(cfg.WA_NUMBER || '');
  }

  /* ---------- language ---------- */
  function applyLang() {
    const d = window.I18N || {};
    const L = d[window.DD_LANG] || d.en || {};
    document.documentElement.lang = window.DD_LANG;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n');
      el.innerHTML = L[k] != null ? L[k] : k;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const k = el.getAttribute('data-i18n-ph');
      el.placeholder = L[k] != null ? L[k] : k;
    });
    document.getElementById('langBtn').textContent = window.DD_LANG === 'en' ? 'ES' : 'EN';
    /* re-render data-driven sections */
    if (window.DD) { window.DD.renderCatalog(); window.DD.renderPricing(); window.DD.renderTestimonials(); }
    /* re-render estimator UI if open */
    const modal = document.getElementById('quoteModal');
    if (modal && modal.classList.contains('open')) {
      const sel = document.getElementById('qPackage');
      const ev = new Event('change');
      sel.dispatchEvent(ev);
      sel.dispatchEvent(new Event('input'));
      document.getElementById('qAddons').innerHTML = '';
      const data = window.DD.getData();
      /* simplest robust path: rebuild addons via estimator's internal render — re-open */
      window.dispatchEvent(new CustomEvent('dd:openquote', { detail: {} }));
    }
  }

  /* ---------- data load (fail gracefully) ---------- */
  function loadData() {
    const fetchJson = u => fetch(u).then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }).catch(() => null);
    Promise.all([fetchJson('catalog.json'), fetchJson('pricing.json'), fetchJson('testimonials.json')]).then(([c, p, ts]) => {
      const pricing = (p && p.packages) || (Array.isArray(p) ? p : []);
      window.DD.setData({
        catalog: c || [],
        pricing,
        testimonials: ts || [],
        addons: (p && p.addons) || []
      });
      window.DD.renderCatalog();
      window.DD.renderPricing();
      window.DD.renderTestimonials();
      /* after data in place, start motion (so cards exist for triggers) */
      window.DD.motion.initLenis();
      window.DD.motion.initMotion();
      window.DD.motion.initMagnetic();
      window.DD.motion.initPreloader();
    });
  }

  /* ---------- theme ---------- */
  function initTheme() {
    const btn = document.getElementById('themeBtn');
    if (localStorage.getItem('dd_theme') === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('dd_theme', cur);
    });
  }

  /* ---------- burger ---------- */
  function initBurger() {
    const burger = document.getElementById('burger');
    const links = document.getElementById('navLinks');

    function setOpen(isOpen, moveFocus) {
      links.classList.toggle('open', isOpen);
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      if (isOpen && moveFocus) {
        const firstLink = links.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    }

    burger.addEventListener('click', event => {
      const isOpen = burger.getAttribute('aria-expanded') !== 'true';
      setOpen(isOpen, event.detail === 0);
    });
    links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false, false)));
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || burger.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false, false);
      burger.focus();
    });
  }

  /* ---------- misc ---------- */
  function initMisc() {
    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('langBtn').addEventListener('click', () => {
      window.DD_LANG = window.DD_LANG === 'en' ? 'es' : 'en';
      localStorage.setItem('dd_lang', window.DD_LANG);
      applyLang();
    });
    /* contact section direct WhatsApp link */
    const wa = document.getElementById('waLink');
    const contactStatus = document.getElementById('contactStatus');
    if (wa && contactReady()) {
      wa.href = 'https://wa.me/' + cfg.WA_NUMBER + '?text=' + encodeURIComponent(cfg.WA_MSG);
      wa.hidden = false;
      if (contactStatus) contactStatus.hidden = true;
    } else if (wa) {
      wa.removeAttribute('href');
      wa.hidden = true;
      if (contactStatus) contactStatus.hidden = false;
    }
    /* IG note */
    const ig = document.getElementById('igNote');
    if (ig && cfg.CONTACT_VERIFIED) {
      ig.textContent = 'Instagram: ' + cfg.IG_HANDLE + ' · ' + cfg.AREA;
      ig.hidden = false;
    } else if (ig) {
      ig.textContent = '';
      ig.hidden = true;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initTheme(); initBurger(); initMisc(); applyLang(); loadData();
  });
})();
