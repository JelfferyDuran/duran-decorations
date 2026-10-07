/* ============================================================
   Duran Decorations — ACCESSIBILITY HELPERS
   Shared dialog state, focus trapping, and focus restoration.
   ============================================================ */
(function () {
  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function focusables(dialog) {
    return Array.from(dialog.querySelectorAll(focusableSelector)).filter(el =>
      !el.hidden && el.getAttribute('aria-hidden') !== 'true' && (el.offsetWidth || el.offsetHeight)
    );
  }

  function setDialogOpen(dialog, isOpen) {
    dialog.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) dialog.removeAttribute('inert');
    else dialog.setAttribute('inert', '');
  }

  function trapFocus(dialog, event) {
    if (event.key !== 'Tab') return;
    const items = focusables(dialog);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;

    if (event.shiftKey && (current === first || !dialog.contains(current))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || !dialog.contains(current))) {
      event.preventDefault();
      first.focus();
    }
  }

  function restoreFocus(trigger) {
    if (!trigger || typeof trigger.focus !== 'function') return;
    requestAnimationFrame(() => {
      if (trigger.isConnected) trigger.focus();
    });
  }

  window.DD_A11Y = { setDialogOpen, trapFocus, restoreFocus };
})();
