// sw.js — LivreTo.be (rotas novas em /Tabelas)
const VERSION = new URL(self.location).searchParams.get('v') || String(Date.now());
const CACHE_NAME = `livreto-${VERSION}`;

// Páginas principais + assets críticos
const CORE = [
  '/', '/index.html',
  '/faq.html', '/sobre.html',
  '/Tabelas/', '/Tabelas/index.html', '/Tabelas/to-be.html',
  '/css/main.css', '/css/theme.css',
  '/js/main.js', '/js/patches.js',
  // mantenha speech com versionamento (o SW já recebe ?v=VERSION)
  `/js/speech.js?v=${VERSION}`,
  // favicons (tema claro/escuro)
  '/assets/favicon-light.svg', '/assets/favicon-dark.svg'
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
    await Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())
    );
    await clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const accept = req.headers.get('accept') || '';

  // HTML: network-first, cache como fallback (navegação offline)
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        // tenta rota específica; se falhar, volta pra home
        return (await caches.match(req)) ||
               (await caches.match('/Tabelas/index.html')) ||
               (await caches.match('/'));
      }
    })());
    return;
  }

  // Demais requisições: cache-first com atualização em segundo plano
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const network = fetch(req).then(res => {
      caches.open(CACHE_NAME).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || network;
  })());
});
