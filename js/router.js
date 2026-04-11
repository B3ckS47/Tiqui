/* ============================================================
   TIQUI — router.js
   Bottom-Navigation einbinden + einfaches Client-Routing
   ============================================================ */

/* ---- Basis-URL ermitteln ---- */
function getBase() {
  const path = window.location.pathname;
  const match = path.match(/^(.*?\/(?:Tiqui\/))/i);
  return match ? match[1] : '/';
}

/* ---- Bottom-Nav HTML ---- */
function buildNav() {
  const b = getBase();
  return `
<nav class="bottom-nav" role="navigation" aria-label="Hauptnavigation">

  <a href="${b}pages/dashboard.html" class="nav-item" data-page="dashboard">
    <div class="nav-icon-wrap">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
          <path d="M9 21V12h6v9"/>
        </svg>
      </div>
    </div>
    <span class="nav-label">Start</span>
  </a>

  <a href="${b}pages/tips.html" class="nav-item" data-page="tips">
    <div class="nav-icon-wrap" style="position:relative">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          <path d="M2 12h20"/>
        </svg>
      </div>
      <span class="nav-badge hidden" id="badge-tips"></span>
    </div>
    <span class="nav-label">Tipps</span>
  </a>

  <a href="${b}pages/quiz.html" class="nav-item" data-page="quiz">
    <div class="nav-icon-wrap" style="position:relative">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <span class="nav-badge hidden" id="badge-quiz"></span>
    </div>
    <span class="nav-label">Quiz</span>
  </a>

  <a href="${b}pages/leaderboard.html" class="nav-item" data-page="leaderboard">
    <div class="nav-icon-wrap">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="18" y="3" width="4" height="18" rx="1"/>
          <rect x="10" y="8" width="4" height="13" rx="1"/>
          <rect x="2"  y="13" width="4" height="8"  rx="1"/>
        </svg>
      </div>
    </div>
    <span class="nav-label">Rangliste</span>
  </a>

  <a href="${b}pages/profile.html" class="nav-item" data-page="profile">
    <div class="nav-icon-wrap">
      <div class="nav-icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
    </div>
    <span class="nav-label">Profil</span>
  </a>

</nav>

<style>
  .nav-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e53e3e;
    border: 1.5px solid #ffffff;
  }
</style>
`;}

const NAV_HTML = buildNav();

/* ---- Nav einbinden & aktives Element markieren ---- */
export function initNav() {
  document.body.insertAdjacentHTML('beforeend', NAV_HTML);

  // Aktuelle Seite aus URL ermitteln
  const path     = window.location.pathname;
  const filename = path.split('/').pop().replace('.html', '');

  // Passendes Nav-Item aktivieren
  document.querySelectorAll('.nav-item[data-page]').forEach(item => {
    if (item.dataset.page === filename) {
      item.classList.add('active');
    }
  });
}

/* ---- Badge anzeigen ---- */
export function showNavBadge(page) {
  const badge = document.getElementById(`badge-${page}`);
  if (badge) badge.classList.remove('hidden');
}

export function hideNavBadge(page) {
  const badge = document.getElementById(`badge-${page}`);
  if (badge) badge.classList.add('hidden');
}

/* ---- Hilfsfunktion: Avatar-Initialen ---- */
export function getInitials(username = '') {
  return username
    .split(/[\s_-]/)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';
}
