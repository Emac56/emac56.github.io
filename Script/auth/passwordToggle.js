// Script/passwordToggle.js (accessible + robust)
// - click or Enter/Space toggles
// - Escape hides
// - supports comma-separated data-target
// - optional data-duration (ms) auto-hide
// - optional data-autohide-on-blur="true"
// - ensures button.type="button" defensively
// - preserves per-button timers to avoid overlap

(function () {
  // helper: set button type safely
  function ensureButtonType(btn) {
    try { if (!btn.type) btn.type = 'button'; } catch (e) { try { btn.setAttribute('type', 'button'); } catch (err) {} }
  }

  // helper: get target ids array from button
  function getTargetIds(btn) {
    const raw = (btn.dataset.target || '').trim();
    if (!raw) return [];
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  // toggle function (show = true => set inputs to text; show = false => password)
  function toggleForButton(btn, show) {
    const ids = getTargetIds(btn);
    if (!ids.length) return;

    ids.forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      if (show && input.type === 'password') {
        input.type = 'text';
        input.setAttribute('data-password-visible', 'true');
      } else if (!show && input.type === 'text') {
        input.type = 'password';
        input.setAttribute('data-password-visible', 'false');
      }
    });

    if (show) {
      btn.textContent = btn.dataset.hideText || 'Hide';
      btn.setAttribute('aria-pressed', 'true');
      btn.setAttribute('aria-label', btn.dataset.hideLabel || 'Hide password');
      // focus first input and move cursor to end
      const first = document.getElementById(ids[0]);
      try {
        if (first) {
          first.focus();
          const len = first.value?.length || 0;
          first.setSelectionRange && first.setSelectionRange(len, len);
        }
      } catch (e) {}
    } else {
      btn.textContent = btn.dataset.showText || 'Show';
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', btn.dataset.showLabel || 'Show password');
    }
  }

  // set up auto-hide timer for a button (clears existing)
  function setAutoHide(btn, duration) {
    if (btn._hideTimer) {
      clearTimeout(btn._hideTimer);
      btn._hideTimer = null;
    }
    if (duration > 0) {
      btn._hideTimer = setTimeout(() => {
        toggleForButton(btn, false);
        btn._hideTimer = null;
      }, duration);
    }
  }

  // hide on Escape if any input visible for this button
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const btn = document.activeElement.closest?.('.toggle-password') || null;
      // if a toggle button is focused, hide its targets
      if (btn) {
        toggleForButton(btn, false);
        if (btn._hideTimer) { clearTimeout(btn._hideTimer); btn._hideTimer = null; }
      } else {
        // otherwise hide any visible password inputs globally (best-effort)
        document.querySelectorAll('[data-password-visible="true"]').forEach(inp => {
          try { inp.type = 'password'; inp.setAttribute('data-password-visible', 'false'); } catch (e) {}
        });
        document.querySelectorAll('.toggle-password').forEach(b => {
          try { b.textContent = b.dataset.showText || 'Show'; b.setAttribute('aria-pressed', 'false'); } catch (e) {}
        });
      }
    }
  });

  // click handler (delegation)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.toggle-password');
    if (!btn) return;
    ensureButtonType(btn);

    const ids = getTargetIds(btn);
    if (!ids.length) return;

    const first = document.getElementById(ids[0]);
    if (!first) return;

    const shouldShow = first.type === 'password';
    toggleForButton(btn, shouldShow);

    // handle auto-hide duration
    const duration = parseInt(btn.dataset.duration, 10) || 0;
    if (shouldShow && duration > 0) setAutoHide(btn, duration);

    e.preventDefault();
  });

  // keyboard activation (Enter / Space) on focused button
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (!active) return;
    const btn = active.classList && active.classList.contains('toggle-password') ? active : null;
    if (!btn) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      ensureButtonType(btn);
      const ids = getTargetIds(btn);
      if (!ids.length) return;
      const first = document.getElementById(ids[0]);
      if (!first) return;
      const shouldShow = first.type === 'password';
      toggleForButton(btn, shouldShow);
      const duration = parseInt(btn.dataset.duration, 10) || 0;
      if (shouldShow && duration > 0) setAutoHide(btn, duration);
    }
  });

  // optional: hide when input loses focus if button has data-autohide-on-blur="true"
  document.addEventListener('focusout', (e) => {
    const related = e.relatedTarget;
    const input = e.target;
    if (!input || !(input instanceof HTMLElement)) return;
    // find any toggle button that targets this input and has autohide set
    const buttons = Array.from(document.querySelectorAll('.toggle-password')).filter(b => {
      const ids = getTargetIds(b);
      return ids.includes(input.id) && b.dataset.autohideOnBlur === 'true';
    });
    if (!buttons.length) return;
    // if focus moved outside all related targets and button, then hide
    const movedTo = related;
    const stayedInside = buttons.some(b => b.contains(movedTo) || getTargetIds(b).some(id => document.getElementById(id) === movedTo));
    if (!stayedInside) {
      buttons.forEach(b => {
        toggleForButton(b, false);
        if (b._hideTimer) { clearTimeout(b._hideTimer); b._hideTimer = null; }
      });
    }
  });

  // mutation observer: ensure any dynamically added toggle buttons get type="button" quickly
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        if (node.matches && node.matches('.toggle-password')) ensureButtonType(node);
        node.querySelectorAll && node.querySelectorAll('.toggle-password').forEach(ensureButtonType);
      });
    });
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
})();