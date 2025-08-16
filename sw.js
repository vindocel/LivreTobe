// sw.js
const VERSION = new URL(self.location).searchParams.get('v') || 'dev';
const CACHE_NAME = `livreto-${VERSION}`;

const CORE = [
  '/', '/index.html',
  '/to-be/',
  '/css/main.css',
  '/css/theme.css',
  `/js/speech.js?v=${VERSION}`
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve()));
    await clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';

  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        return (await caches.match(req)) || (await caches.match('/'));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
