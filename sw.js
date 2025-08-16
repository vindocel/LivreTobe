
importScripts('/version.js');

const V = (typeof self !== 'undefined' && self.APP_VERSION) ? String(self.APP_VERSION) : (Date.now()+'');
const STATIC_CACHE = 'static-v' + V;
const ASSETS = [
  '/', '/index.html',
  '/css/main.css',
  '/css/theme.css?v=' + V,
  '/js/main.js',
  '/js/patches.js?v=' + V,
  '/js/speech.js?v=' + V,
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
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
    e.respondWith(
      fetch(e.request).then(r => {
        const copy = r.clone(); caches.open(STATIC_CACHE).then(c => c.put(e.request, copy));
        return r;
      }).catch(() => caches.match(e.request).then(r => r || caches.match('/index.html')))
    );
  } else {
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
