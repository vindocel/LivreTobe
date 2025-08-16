// js/sw-register.js
(function() {
  if (!('serviceWorker' in navigator)) return;
  const v = (window.APP_VERSION || Date.now().toString(36));
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=' + encodeURIComponent(v))
      .catch(err => console.error('SW register failed:', err));
  });
})();