const STATIC_CACHE = 'static-v3-2025-08-15';
const ASSETS = [
  '/', '/index.html',
  '/css/style.css', '/css/theme.css?v=2025-08-15-2',
  '/js/app.js', '/js/speech.js?v=2025-08-15-2', '/js/patches.js?v=2025-08-15-2',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  // Ensure the new SW activates immediately
  self.skipWaiting();
  e.waitUntil(caches.open(STATIC_CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)));
  })());
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil((async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    })());
  }
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const isPage = e.request.mode === 'navigate';

  if (isPage) {
    // network-first for HTML (always try latest)
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone(); caches.open(STATIC_CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
    );
  } else {
    // cache-first for same-origin static assets
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        if (resp.ok && (url.origin === location.origin)) {
          const copy = resp.clone(); caches.open(STATIC_CACHE).then(c => c.put(e.request, copy));
        }
        return resp;
      }))
    );
  }
});
