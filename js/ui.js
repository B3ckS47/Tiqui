/* ============================================================
   TIQUI — ui.js
   Toast-Benachrichtigungen, Modal, Loader, Helpers
   ============================================================ */

/* ---- Toast ---- */
let toastContainer = null;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 3500) {
  const container = getToastContainer();

  const icons = {
    success: '✓',
    warning: '⚠',
    danger:  '✕',
    info:    'ℹ',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span style="font-size:1.1rem">${icons[type] ?? icons.info}</span> ${message}`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s ease reverse';
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

/* ---- Loader (Button während Async-Operationen) ---- */
export function setLoading(button, loading, originalText) {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<span class="loader-spinner"></span>';
  } else {
    button.disabled = false;
    button.textContent = originalText ?? button.dataset.originalText;
  }
}

/* ---- Seiten-Loader (Vollbild) ---- */
export function showPageLoader() {
  const existing = document.getElementById('page-loader');
  if (existing) return;

  const loader = document.createElement('div');
  loader.id = 'page-loader';
  loader.style.cssText = `
    position: fixed; inset: 0; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999; flex-direction: column; gap: 16px;
  `;
  loader.innerHTML = `
    <div style="
      width: 48px; height: 48px; border-radius: 50%;
      box-shadow: var(--neu-raised);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem;
    ">⚽</div>
    <p style="color: var(--text-muted); font-size: 0.875rem;">Laden…</p>
  `;
  document.body.appendChild(loader);
}

export function hidePageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.2s ease';
    setTimeout(() => loader.remove(), 200);
  }
}

/* ---- Einfaches Confirm-Modal ---- */
export function showConfirm(message) {
  return new Promise((resolve) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.innerHTML = `
      <div class="modal" style="max-width: 340px; text-align: center;">
        <p style="margin-bottom: 24px; color: var(--text-primary); font-weight: 500;">${message}</p>
        <div class="flex gap-md justify-center">
          <button class="btn btn-secondary btn-sm" id="confirm-cancel">Abbrechen</button>
          <button class="btn btn-primary btn-sm" id="confirm-ok">Bestätigen</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    backdrop.querySelector('#confirm-ok').addEventListener('click', () => {
      backdrop.remove();
      resolve(true);
    });
    backdrop.querySelector('#confirm-cancel').addEventListener('click', () => {
      backdrop.remove();
      resolve(false);
    });
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) { backdrop.remove(); resolve(false); }
    });
  });
}

/* ---- Formular-Fehler anzeigen / löschen ---- */
export function setFieldError(inputEl, message) {
  clearFieldError(inputEl);
  inputEl.style.boxShadow = 'var(--neu-inset), 0 0 0 3px rgba(192,57,43,0.25)';
  const error = document.createElement('p');
  error.className = 'field-error text-xs mt-sm';
  error.style.color = 'var(--danger)';
  error.textContent = message;
  inputEl.parentNode.appendChild(error);
}

export function clearFieldError(inputEl) {
  inputEl.style.boxShadow = '';
  const existing = inputEl.parentNode.querySelector('.field-error');
  if (existing) existing.remove();
}

/* ---- Datum formatieren ---- */
export function formatDate(iso, options = {}) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day:   '2-digit',
    month: '2-digit',
    year:  'numeric',
    ...options,
  });
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('de-DE', {
    day:    '2-digit',
    month:  '2-digit',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/* ---- Countdown bis Kickoff ---- */
export function getCountdown(kickoffIso) {
  const diff = new Date(kickoffIso) - new Date();
  if (diff <= 0) return null;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);

  if (h > 48) {
    const d = Math.floor(h / 24);
    return `${d} Tag${d !== 1 ? 'e' : ''}`;
  }
  if (h > 0) return `${h}h ${m}m`;
  return `${m} Min.`;
}
