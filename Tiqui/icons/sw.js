/* ============================================================
   TIQUI — Service Worker v1
   Strategie: Cache-first für Assets, Network-first für API
   ============================================================ */

const CACHE_NAME = 'tiqui-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/base.css',
  '/css/components.css',
  '/css/layout.css',
  '/js/supabase.js',
  '/js/auth.js',
  '/js/router.js',
  '/js/ui.js',
  '/pages/login.html',
  '/pages/register.html',
  '/pages/dashboard.html',
  '/pages/tips.html',
  '/pages/special.html',
  '/pages/quiz.html',
  '/pages/leaderboard.html',
  '/pages/profile.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

/* ---- Install: Statische Assets cachen ---- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* ---- Activate: Alte Caches aufräumen ---- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ---- Fetch: Routing-Strategie ---- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Supabase API-Calls → immer Network-first, kein Caching */
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(request));
    return;
  }

  /* Chrome Extensions ignorieren */
  if (url.protocol === 'chrome-extension:') return;

  /* Statische Assets → Cache-first */
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          /* Nur gültige Responses cachen */
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => {
          /* Offline-Fallback für HTML-Seiten */
          if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/pages/dashboard.html');
          }
        });
    })
  );
});
