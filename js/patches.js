
(function(){
  const d = document;
  const V = (typeof self !== 'undefined' && self.APP_VERSION) ? String(self.APP_VERSION) : '';

  function ensureMeta(name, content){
    let m = d.querySelector(`meta[name="${name}"]`);
    if (!m){ m = d.createElement('meta'); m.setAttribute('name', name); d.head.appendChild(m); }
    m.setAttribute('content', content);
    return m;
  }
  function ensureLink(rel, href){
    let l = d.querySelector(`link[rel="${rel}"][href="${href}"]`);
    if (!l){ l = d.createElement('link'); l.setAttribute('rel', rel); l.setAttribute('href', href); d.head.appendChild(l); }
    return l;
  }
  function bust(url, v){
    try{
      const u = new URL(url, location.origin);
      u.searchParams.set('v', v);
      return u.pathname + u.search + u.hash;
    } catch(_e){
      const [path, hash=''] = url.split('#');
      const base = path.split('?')[0];
      return `${base}?v=${encodeURIComponent(v)}${hash ? '#'+hash : ''}`;
    }
  }
  function versionCheck(){
    if (!V) return;
    const key = 'appVersion';
    const prev = localStorage.getItem(key);
    if (prev !== V){
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller){
        navigator.serviceWorker.controller.postMessage({type:'CLEAR_CACHE'});
        setTimeout(()=>{ localStorage.setItem(key, V); location.reload(); }, 120);
      } else {
        localStorage.setItem(key, V);
      }
    }
  }
  function ensureSpeechScript(){
    if (d.querySelector('script[src*="speech.js"]')) return;
    const s = d.createElement('script');
    s.defer = true;
    s.src = '/js/speech.js' + (V ? `?v=${encodeURIComponent(V)}` : '');
    d.head.appendChild(s);
  }

  function run(){
    ensureMeta('color-scheme', 'light dark');
    ensureMeta('app-version', V || '');
    if (!d.querySelector('link[rel="canonical"]')) ensureLink('canonical','https://livreto.be/');
    if (!d.querySelector('link[rel="manifest"]')) ensureLink('manifest','/manifest.json');

    // Bust theme.css if present
    const themeLink = d.querySelector('link[rel="stylesheet"][href*="theme.css"]');
    if (themeLink && V){
      const href = themeLink.getAttribute('href');
      const newHref = bust(href, V);
      if (href !== newHref) themeLink.setAttribute('href', newHref);
    }

    ensureSpeechScript();
    versionCheck();
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', run); else run();
})();
