/**
 * Patch helper to add meta tags, JSON-LD, SW registration and small a11y touches
 * This runs safely even if some parts already exist.
 */
(function(){
  const d = document;

  function ensureMeta(name, content, attrs = {}){
    let m = d.querySelector(`meta[name="${name}"]`);
    if (!m){
      m = d.createElement('meta');
      m.setAttribute('name', name);
      d.head.appendChild(m);
    }
    m.setAttribute('content', content);
    Object.entries(attrs).forEach(([k,v])=> m.setAttribute(k,String(v)));
  }

  function ensureMetaThemeColor(media, color){
    let m = d.querySelector(`meta[name="theme-color"][media="${media}"]`);
    if (!m){
      m = d.createElement('meta');
      m.setAttribute('name','theme-color');
      m.setAttribute('media', media);
      d.head.appendChild(m);
    }
    m.setAttribute('content', color);
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

  function ensureJsonLdWebsite(){
    if (d.querySelector('script[type="application/ld+json"][data-ld="website"]')) return;
    const s = d.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-ld','website');
    s.textContent = JSON.stringify({
      "@context":"https://schema.org",
      "@type":"WebSite",
      "name":"LivreTo.be",
      "url":"https://livreto.be/",
      "publisher":{"@type":"Organization","name":"LivreTo.be"}
    });
    d.head.appendChild(s);
  }

  function ensureA11y(){
    // Search input
    const search = d.getElementById('search');
    if (search && !d.querySelector('label[for="search"]')){
      const lbl = d.createElement('label');
      lbl.setAttribute('for','search');
      lbl.className = 'sr-only';
      lbl.textContent = 'Buscar na tabela';
      search.parentNode.insertBefore(lbl, search);
    }
    // Tempo/forma selects
    const selIds = ['tempo','forma'];
    selIds.forEach(id => {
      const el = d.getElementById(id);
      if (el && !d.querySelector(`label[for="${id}"]`)){
        const lbl = d.createElement('label');
        lbl.setAttribute('for', id);
        lbl.textContent = id === 'tempo' ? 'Tempo' : 'Forma';
        el.parentNode.insertBefore(lbl, el);
      }
    });
    // Live region for results count
    if (!d.getElementById('results-count')){
      const p = d.createElement('p');
      p.id = 'results-count';
      p.setAttribute('role','status');
      p.setAttribute('aria-live','polite');
      d.body.appendChild(p);
    }
  }

  function ensureSW(){
    if ('serviceWorker' in navigator){
      navigator.serviceWorker.register('/sw.js').catch(()=>{});
    }
  }

  function run(){
    // Color scheme
    ensureMeta('color-scheme','light dark');
    ensureMetaThemeColor('(prefers-color-scheme: light)', '#ffffff');
    ensureMetaThemeColor('(prefers-color-scheme: dark)',  '#0b0b10');

    // Canonical (safe default to apex)
    if (!document.querySelector('link[rel="canonical"]')){
      ensureLink('canonical','https://livreto.be/');
    }

    // Manifest (keep existing if already different path)
    if (!document.querySelector('link[rel="manifest"]')){
      ensureLink('manifest','/manifest.json');
    }

    ensureJsonLdWebsite();
    ensureA11y();
    ensureSW();
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
