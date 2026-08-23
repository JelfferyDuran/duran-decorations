/* ============================================================
   Duran Decorations — DATA
   Fetches catalog.json / pricing.json / testimonials.json,
   renders sections, powers the lightbox.
   ============================================================ */
(function () {
  const state = { catalog: [], pricing: [], testimonials: [], addons: [] };

  function t(key) { const d = window.I18N || {}; const L = d[window.DD_LANG] || d.en || {}; return L[key] || (d.en && d.en[key]) || key; }

  /* ---------- tags ---------- */
  function tagLabel(tag) {
    if (!tag) return '';
    const map = { best: t('tag_best') || 'Bestseller', new: t('tag_new') || 'New', premium: 'Premium', popular: t('tag_popular') || 'Popular' };
    return '<span class="tag ' + tag + '">' + map[tag] + '</span>';
  }
  /* add the few extra keys at runtime defaults (parity-safe) */
  function initTagKeys() {
    const d = window.I18N || {};
    if (!d.en.tag_best) { d.en.tag_best = 'Bestseller'; d.en.tag_new = 'New'; d.en.tag_popular = 'Popular'; }
    if (!d.es.tag_best) { d.es.tag_best = 'Favorito'; d.es.tag_new = 'Nuevo'; d.es.tag_popular = 'Popular'; }
  }
  initTagKeys();

  /* ---------- render catalog ---------- */
  function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    if (!state.catalog.length) { grid.innerHTML = errBlock(); return; }
    grid.innerHTML = state.catalog.map((p, i) =>
      '<article class="card" data-idx="' + i + '" tabindex="0" role="button" aria-label="' + (window.DD_LANG === 'es' ? p.name_es : p.name) + '">' +
        '<img src="' + p.img + '" alt="' + (window.DD_LANG === 'es' ? p.name_es : p.name) + '" loading="lazy" decoding="async">' +
        '<div class="card-body">' +
          '<div class="card-tags">' + tagLabel(p.tag) + '</div>' +
          '<div class="cat">' + (window.DD_LANG === 'es' ? p.cat_es : p.cat) + '</div>' +
          '<h3>' + (window.DD_LANG === 'es' ? p.name_es : p.name) + '</h3>' +
          '<p>' + (window.DD_LANG === 'es' ? p.desc_es : p.desc) + '</p>' +
          '<span class="cta">' + t('view_details') + ' →</span>' +
        '</div>' +
      '</article>').join('');
    grid.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => openLightbox(+c.dataset.idx)));
  }

  /* ---------- render pricing ---------- */
  function renderPricing() {
    const grid = document.getElementById('pricingGrid');
    if (!grid) return;
    if (!state.pricing.length) { grid.innerHTML = errBlock(); return; }
    grid.innerHTML = state.pricing.map((p, i) => {
      const save = p.market - p.duran;
      const feats = (window.DD_LANG === 'es' ? p.feats_es : p.feats || []).map(f => '<li>' + f + '</li>').join('');
      return '<article class="price-card" data-idx="' + i + '">' +
        '<div class="save-badge">' + t('pricing_save') + save + '</div>' +
        '<div class="cat">' + (window.DD_LANG === 'es' ? p.cat_es : p.cat || '') + '</div>' +
        '<h3>' + (window.DD_LANG === 'es' ? p.name_es : p.name) + '</h3>' +
        '<div class="market"><span>' + t('pricing_market') + ':</span> <s>$' + p.market + '+</s></div>' +
        '<div class="duran">$' + p.duran + '<span>' + t('pricing_travel') + '</span></div>' +
        '<ul class="price-feats">' + feats + '</ul>' +
        '<button class="btn btn-primary book-btn" data-pkg="' + p.id + '">' + t('pricing_book') + '</button>' +
      '</article>';
    }).join('');
    grid.querySelectorAll('.book-btn').forEach(b => b.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('dd:openquote', { detail: { packageId: b.dataset.pkg } }));
    }));
  }

  /* ---------- testimonials ---------- */
  function renderTestimonials() {
    const sec = document.getElementById('testimonials');
    const grid = document.getElementById('testiGrid');
    if (!sec || !grid) return;
    if (!state.testimonials.length) { sec.style.display = 'none'; return; }
    sec.style.display = '';
    grid.innerHTML = state.testimonials.map(x =>
      '<figure class="testi">' +
        '<div class="stars">' + '★'.repeat(x.stars || 5) + '</div>' +
        '<blockquote>' + (window.DD_LANG === 'es' && x.text_es ? x.text_es : x.text) + '</blockquote>' +
        '<figcaption><b>' + x.name + '</b><span>' + x.event + ' · ' + x.date + '</span></figcaption>' +
      '</figure>').join('');
  }

  /* ---------- lightbox ---------- */
  function openLightbox(idx) {
    if (!state.catalog.length) return;
    let cur = idx;
    const overlay = document.getElementById('lightbox');
    const img = document.getElementById('lbImg');
    const cap = document.getElementById('lbCaption');
    function show() {
      const p = state.catalog[cur];
      img.src = p.img; img.alt = window.DD_LANG === 'es' ? p.name_es : p.name;
      cap.innerHTML = '<div class="cat">' + (window.DD_LANG === 'es' ? p.cat_es : p.cat) + '</div><h3>' + (window.DD_LANG === 'es' ? p.name_es : p.name) + '</h3><p>' + (window.DD_LANG === 'es' ? p.desc_es : p.desc) + '</p>' +
        '<button class="btn btn-primary" id="lbQuote">' + t('lb_quote') + '</button>';
      document.getElementById('lbQuote').addEventListener('click', () => {
        close(); window.dispatchEvent(new CustomEvent('dd:openquote', { detail: { image: p.img, label: window.DD_LANG === 'es' ? p.name_es : p.name } }));
      });
      document.getElementById('lbCount').textContent = (cur + 1) + ' / ' + state.catalog.length;
    }
    function next() { cur = (cur + 1) % state.catalog.length; show(); }
    function prev() { cur = (cur - 1 + state.catalog.length) % state.catalog.length; show(); }
    function onKey(e) { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); }
    function close() { overlay.classList.remove('open'); document.removeEventListener('keydown', onKey); }
    document.getElementById('lbClose').onclick = close;
    document.getElementById('lbPrev').onclick = prev;
    document.getElementById('lbNext').onclick = next;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
    show();
    overlay.classList.add('open');
    document.getElementById('lbClose').focus();
  }
  window.__ddLightbox = { open: openLightbox };

  /* ---------- error block ---------- */
  function errBlock() {
    return '<div class="note-box">' + t('err_data') + '</div>';
  }

  /* ---------- public API ---------- */
  window.DD = Object.assign(window.DD || {}, {
    renderCatalog, renderPricing, renderTestimonials,
    setData(d) { Object.assign(state, d); },
    getData: () => state,
    t
  });
})();
