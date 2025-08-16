const CACHE = 'livretobe-v20250816003732';
const ASSETS = [
  '/', '/index.html', '/faq.html', '/sobre.html',
  '/to-be/index.html',
  '/css/main.css', '/js/main.js',
  '/icons/icon-192.png','/icons/icon-512.png',
  '/manifest.json'
];
self.addEventListener('install', e => { self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('activate', e => { self.clients && clients.claim();
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
