/* ============================================================
   Duran Decorations — ESTIMATOR / QUOTE MODAL
   Package + add-ons → live total → prefilled WhatsApp message.
   All prices come from pricing.json (never hardcoded).
   ============================================================ */
(function () {
  const cfg = window.DD_CONFIG;
  function t(key) { return window.DD.t(key); }
  const fmt = n => '$' + n.toLocaleString('en-US');

  function contactReady() {
    return cfg.CONTACT_VERIFIED === true && /^\d{10,15}$/.test(cfg.WA_NUMBER || '');
  }

  function syncContactState() {
    const submit = document.getElementById('qSubmit');
    const status = document.getElementById('qContactStatus');
    const ready = contactReady();
    if (submit) {
      submit.disabled = !ready;
      submit.setAttribute('aria-disabled', String(!ready));
    }
    if (status) status.hidden = ready;
  }

  /* ---------- helpers ---------- */
  function addonsOf() {
    const d = window.DD.getData();
    return d.addons || [];
  }
  function pkgById(id) {
    const d = window.DD.getData();
    return (d.pricing || []).find(p => p.id === id) || null;
  }
  function setVal(id, v) {
    const el = document.getElementById(id);
    if (el) el.value = v;
  }
  function setTotal() {
    const pkg = pkgById(document.getElementById('qPackage').value);
    const est = document.getElementById('qEst');
    const save = document.getElementById('qSave');
    const travel = document.getElementById('qTravel');
    const askNote = document.getElementById('qAskNote');
    let total = pkg ? pkg.duran : 0;
    let savings = pkg ? (pkg.market - pkg.duran) : 0;
    let askList = [];
    addonsOf().forEach(a => {
      const box = document.getElementById('addon_' + a.id);
      if (!box || !box.checked) return;
      if (a.price == null) { askList.push(a); return; }
      if (a.unit === 'ft') {
        const qty = Math.max(1, parseFloat(document.getElementById('qty_' + a.id).value) || 1);
        total += a.price * qty;
      } else {
        total += a.price;
      }
    });
    est.textContent = fmt(total);
    save.textContent = fmt(savings);
    travel.textContent = pkg ? t('modal_travel') : '';
    askNote.hidden = askList.length === 0;
  }

  /* ---------- build WhatsApp message ---------- */
  function buildMessage(pkgId) {
    const pkg = pkgById(pkgId);
    const lines = [cfg.WA_MSG, ''];
    if (pkg) lines.push('— ' + t('modal_package') + ': ' + (window.DD_LANG === 'es' ? pkg.name_es : pkg.name) + ' (' + fmt(pkg.duran) + ')');
    const date = document.getElementById('qDate').value;
    const city = document.getElementById('qCity').value.trim();
    if (date) lines.push('— ' + t('modal_date') + ': ' + date);
    if (city) lines.push('— ' + t('modal_city') + ': ' + city);
    const addons = addonsOf().filter(a => document.getElementById('addon_' + a.id) && document.getElementById('addon_' + a.id).checked);
    if (addons.length) {
      lines.push('— ' + t('modal_addons') + ':');
      addons.forEach(a => {
        const label = window.DD_LANG === 'es' ? a.name_es : a.name;
        if (a.price == null) { lines.push('  • ' + label + ' (' + t('modal_ask') + ')'); return; }
        if (a.unit === 'ft') {
          const qty = Math.max(1, parseFloat(document.getElementById('qty_' + a.id).value) || 1);
          lines.push('  • ' + label + ' — ' + qty + 'ft (' + fmt(a.price * qty) + ')');
        } else {
          lines.push('  • ' + label + ' (' + fmt(a.price) + ')');
        }
      });
    }
    const notes = document.getElementById('qNotes').value.trim();
    if (notes) lines.push('— ' + t('modal_notes') + ': ' + notes);
    const phone = document.getElementById('qPhone').value.trim();
    if (phone) lines.push('— ' + t('modal_phone') + ': ' + phone);
    return lines.join('\n');
  }

  /* ---------- render add-ons ---------- */
  function renderAddons() {
    const wrap = document.getElementById('qAddons');
    wrap.innerHTML = addonsOf().map(a => {
      const label = window.DD_LANG === 'es' ? a.name_es : a.name;
      const priceTxt = a.price == null ? '<em>(' + t('modal_ask') + ')</em>' : fmt(a.price) + (a.unit === 'ft' ? t('modal_per_ft') : '');
      const qty = a.unit === 'ft'
        ? '<input type="number" id="qty_' + a.id + '" class="addon-qty" value="10" min="1" max="100" step="1" aria-label="' + label + ' ' + t('modal_qty') + '">'
        : '';
      return '<label class="addon"><input type="checkbox" id="addon_' + a.id + '" data-id="' + a.id + '"><span>' + label + '</span><b>' + priceTxt + '</b>' + qty + '</label>';
    }).join('');
    wrap.querySelectorAll('input[type=checkbox], input.addon-qty').forEach(el => el.addEventListener('input', setTotal));
  }

  /* ---------- open / close ---------- */
  function open(pkgId) {
    renderAddons();
    const select = document.getElementById('qPackage');
    const data = window.DD.getData();
    select.innerHTML = (data.pricing || []).map(p =>
      '<option value="' + p.id + '">' + (window.DD_LANG === 'es' ? p.name_es : p.name) + ' — ' + fmt(p.duran) + '</option>').join('');
    if (pkgId) select.value = pkgId;
    setTotal();
    syncContactState();
    const overlay = document.getElementById('quoteModal');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('qName').focus();
    document.addEventListener('keydown', onKey);
    select.addEventListener('change', setTotal);
  }
  function close() {
    document.getElementById('quoteModal').classList.remove('open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) { if (e.key === 'Escape') close(); }

  window.addEventListener('dd:openquote', e => { open(e.detail && e.detail.packageId); });

  /* ---------- wire up on DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    syncContactState();
    document.getElementById('qCancel').addEventListener('click', close);
    document.getElementById('quoteModal').addEventListener('click', e => { if (e.target.id === 'quoteModal') close(); });
    document.getElementById('qSubmit').addEventListener('click', () => {
      if (!contactReady()) { alert(t('modal_contact_pending')); return; }
      const name = document.getElementById('qName').value.trim();
      const date = document.getElementById('qDate').value;
      const city = document.getElementById('qCity').value.trim();
      if (!name || !date || !city) { alert(t('modal_required')); return; }
      const packageId = document.getElementById('qPackage').value;
      const addonCount = addonsOf().filter(a => {
        const checkbox = document.getElementById('addon_' + a.id);
        return checkbox && checkbox.checked;
      }).length;
      const msg = buildMessage(packageId);
      window.dispatchEvent(new CustomEvent('dd:quotehandoff', {
        detail: { packageId, addonCount }
      }));
      window.open('https://wa.me/' + cfg.WA_NUMBER + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    });
    /* hero + nav CTAs open the modal instead of jumping */
    document.querySelectorAll('[data-open-quote]').forEach(b => b.addEventListener('click', e => {
      e.preventDefault();
      const source = b.closest('nav') ? 'navigation' : b.closest('.hero') ? 'hero' : 'site_cta';
      window.dispatchEvent(new CustomEvent('dd:openquote', { detail: { source } }));
    }));
  });
})();
