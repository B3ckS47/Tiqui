/* ============================================================
   TIQUI — Service Worker v40
   Strategie: Network-first für HTML, Cache-first für Assets
   ============================================================ */

const CACHE_NAME = 'tiqui-v42';

/* ---- Install: Nur kritische Assets cachen ---- */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Einzeln cachen damit ein Fehler nicht alles blockiert
      const assets = [
        './css/base.css',
        './css/layout.css',
        './js/supabase.js',
        './js/auth.js',
        './js/router.js',
        './js/ui.js',
      ];
      return Promise.allSettled(
        assets.map(url => cache.add(url).catch(() => {}))
      );
    })
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

/* ---- Fetch ---- */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Supabase API → immer Network
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // HTML Seiten → Network-first (immer aktuelle Version)
  if (event.request.destination === 'document' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // CSS/JS/Icons → Cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
