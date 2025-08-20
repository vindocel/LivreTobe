(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  const dropdown = document.querySelector('.menu-dropdown');
  const dropdownBtn = document.querySelector('.menu-button');
  const dropdownMenu = document.querySelector('#menu-tabelas');

  // Mobile nav toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  
  // Dropdown: open on hover (desktop) and click (mobile/keyboard)
  function openDropdown(open) {
    if (!dropdown) return;
    dropdown.classList.toggle('open', !!open);
    dropdownBtn.setAttribute('aria-expanded', !!open ? 'true' : 'false');
  }

  if (dropdown && dropdownBtn) {
    // Click toggles
    dropdownBtn.addEventListener('click', (e) => {
      const small = window.matchMedia('(max-width: 900px)').matches;
      if (small) { e.preventDefault(); openDropdown(!dropdown.classList.contains('open')); }
    });

    // Hover (desktop)
    dropdown.addEventListener('mouseenter', () => openDropdown(true));
    // removed mouseleave close to avoid accidental closing while moving cursor

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') openDropdown(false);
    });

    // Click outside closes
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) openDropdown(false);
    });
  }

  // Active link highlight
  const path = location.pathname.replace(/\/$/, '');
  document.querySelectorAll('[data-link]').forEach(a => {
    const key = a.getAttribute('data-link');
    if ((key === 'home' && (path === '' || path === '/')) ||
        (key === 'to-be' && path.includes('/Tabelas/to-be')) ||
        (key === 'faq' && path.endsWith('/faq.html')) ||
        (key === 'sobre' && path.endsWith('/sobre.html')) ||
        (key === 'tabelas' && path.startsWith('/Tabelas')) ) {
      a.setAttribute('aria-current', 'page');
      a.style.textDecoration = 'underline';
    }
  });

})();

// ----- To Be page extras -----
(function(){
  const voiceSel = document.querySelector('#voice');
  const rateInput = document.querySelector('#rate');
  const rateV = document.querySelector('#ratev');
  const rows = Array.from(document.querySelectorAll('tbody tr'));
  const fTense = document.querySelector('#f-tense');
  const fForm = document.querySelector('#f-form');
  const fSearch = document.querySelector('#search');

  // Controls may not exist on all pages
  if (!fTense || !rows.length) return;

  // Populate voices
  const synth = window.speechSynthesis;
  function loadVoices(){
    const voices = synth.getVoices().filter(v => /en-/.test(v.lang));
    voiceSel.innerHTML = voices.map(v => `<option value="${v.name}">${v.name} (${v.lang})</option>`).join('');
  }
  loadVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  // Speak helper
  function speak(text){
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    const v = Array.from(speechSynthesis.getVoices()).find(v => v.name === voiceSel.value);
    if (v) u.voice = v;
    const rate = parseFloat(rateInput.value || '1');
    u.rate = rate;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.speak');
    if (btn) {
      e.preventDefault();
      speak(btn.dataset.text);
    }
  });
  rateInput?.addEventListener('input', () => rateV.textContent = (parseFloat(rateInput.value)).toFixed(2)+'x');

  // Filtering
  function applyFilters(){
    const t = fTense.value;
    const fm = fForm.value;
    const q = (fSearch.value || '').toLowerCase();
    rows.forEach(r => {
      const matchT = (t === 'Todos') || (r.dataset.tense === t);
      const matchF = (fm === 'Todas') || (r.dataset.form === fm);
      const txt = r.textContent.toLowerCase();
      const matchQ = !q || txt.includes(q);
      r.style.display = (matchT && matchF && matchQ) ? '' : 'none';
    });
  }
  fTense.addEventListener('change', applyFilters);
  fForm.addEventListener('change', applyFilters);
  fSearch.addEventListener('input', applyFilters);
  applyFilters();
})();
