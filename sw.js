/* ============================================================
   TIQUI — Service Worker v39
   Strategie: Cache-first für Assets, Network-first für API
   ============================================================ */

const CACHE_NAME = 'tiqui-v39';

const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './css/base.css',
  './css/layout.css',
  './js/supabase.js',
  './js/auth.js',
  './js/router.js',
  './js/ui.js',
  './pages/login.html',
  './pages/register.html',
  './pages/dashboard.html',
  './pages/tips.html',
  './pages/quiz.html',
  './pages/leaderboard.html',
  './pages/profile.html',
  './icons/tile-stadium.png',
  './icons/tile-tipps.png',
  './icons/tile-prognose.png',
  './icons/tile-quiz.png',
  './icons/tile-rangliste.png',
  './icons/bg-hexagon.png',
];

/* ---- Install ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

/* ---- Activate: Alte Caches löschen ---- */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* ---- Fetch: Cache-first für Assets, Network-first für Supabase ---- */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API → immer Network
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Alles andere → Cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
