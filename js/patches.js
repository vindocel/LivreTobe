/**
 * patches.js — uses a single source of truth: window/worker APP_VERSION (from /version.js)
 * - Ensures <meta name="app-version">
 * - Busts theme.css with ?v=APP_VERSION
 * - Triggers cache clear + reload on version change
 * - Adds essential meta tags if missing
 */
(function(){
  const d = document;
  const V = (typeof self !== 'undefined' && self.APP_VERSION) ? String(self.APP_VERSION) : '';

  function ensureMeta(name, content, attrs = {}){
    let m = d.querySelector(`meta[name="${name}"]`);
    if (!m){
      m = d.createElement('meta');
      m.setAttribute('name', name);
      d.head.appendChild(m);
    }
    m.setAttribute('content', content);
    Object.entries(attrs).forEach(([k,v])=> m.setAttribute(k,String(v)));
    return m;
  }

  function ensureLink(rel, href){
    let l = d.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (!l){
      l = d.createElement('link');
      l.setAttribute('rel', rel);
      l.setAttribute('href', href);
      d.head.appendChild(l);
    }
    return l;
  }

  function bust(url, v){
    try{
      const u = new URL(url, location.origin);
      u.searchParams.set('v', v);
      return u.pathname + u.search + u.hash;
    } catch(_e){
      // fallback if URL constructor fails for relative-only paths
      const [path, hash=''] = url.split('#');
      const base = path.split('?')[0];
      return `${base}?v=${encodeURIComponent(v)}${hash ? '#'+hash : ''}`;
    }
  }

  function versionCheck(){
    if (!V) return;
    const key = 'appVersion';
    const previous = localStorage.getItem(key);
    if (previous !== V){
      // If there's a SW, ask it to clear caches and reload once
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller){
        navigator.serviceWorker.controller.postMessage({type:'CLEAR_CACHE'});
        setTimeout(()=>{
          localStorage.setItem(key, V);
          location.reload();
        }, 120);
      } else {
        localStorage.setItem(key, V);
      }
    }
  }

  function run(){
    // Meta tags
    ensureMeta('color-scheme','light dark');
    ensureMeta('app-version', V || '');
    if (!document.querySelector('link[rel="canonical"]'))
      ensureLink('canonical','https://livreto.be/');
    if (!document.querySelector('link[rel="manifest"]'))
      ensureLink('manifest','/manifest.json');

    // Bust theme.css (if present). If not present, nothing happens.
    const themeLink = d.querySelector('link[rel="stylesheet"][href*="theme.css"]');
    if (themeLink && V){
      const href = themeLink.getAttribute('href');
      const newHref = bust(href, V);
      if (href !== newHref) themeLink.setAttribute('href', newHref);
    }

    versionCheck();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
