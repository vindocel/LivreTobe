const STATIC_CACHE = 'static-v1';
const ASSETS = [
  '/', '/index.html', '/css/style.css', '/css/theme.css', '/js/app.js', '/js/speech.js', '/js/patches.js',
  '/icons/icon-192.png', '/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== STATIC_CACHE).map(k => caches.delete(k)))
    )
  );
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
