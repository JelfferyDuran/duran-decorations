/* ============================================================
   Duran Decorations — CONVERSION EVENT BRIDGE
   Provider-neutral, privacy-safe events for future analytics.
   No network requests and no customer-entered data are emitted.
   ============================================================ */
(function () {
  const allowed = {
    quote_open: ['source', 'package_id', 'language'],
    whatsapp_handoff: ['source', 'package_id', 'addon_count', 'language'],
    whatsapp_click: ['source', 'language']
  };

  function cleanValue(key, value) {
    if (key === 'addon_count') {
      const count = Number(value);
      return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : undefined;
    }
    if (typeof value !== 'string') return undefined;
    const cleaned = value.trim().slice(0, 80);
    return cleaned || undefined;
  }

  function record(name, properties) {
    if (!allowed[name]) return;
    const payload = {
      event: 'dd_conversion',
      conversion_name: name
    };
    allowed[name].forEach(key => {
      const value = cleanValue(key, properties && properties[key]);
      if (value !== undefined) payload[key] = value;
    });
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    window.dispatchEvent(new CustomEvent('dd:conversion', { detail: payload }));
  }

  window.DD_ANALYTICS = { record };

  window.addEventListener('dd:openquote', event => {
    const detail = event.detail || {};
    const source = detail.source || (detail.packageId ? 'pricing' : detail.image ? 'portfolio' : 'site_cta');
    record('quote_open', {
      source,
      package_id: detail.packageId,
      language: window.DD_LANG || document.documentElement.lang || 'en'
    });
  });

  window.addEventListener('dd:quotehandoff', event => {
    const detail = event.detail || {};
    record('whatsapp_handoff', {
      source: 'quote_modal',
      package_id: detail.packageId,
      addon_count: detail.addonCount,
      language: window.DD_LANG || document.documentElement.lang || 'en'
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    const directWhatsApp = document.getElementById('waLink');
    if (!directWhatsApp) return;
    directWhatsApp.addEventListener('click', () => {
      record('whatsapp_click', {
        source: 'contact',
        language: window.DD_LANG || document.documentElement.lang || 'en'
      });
    });
  });
})();
