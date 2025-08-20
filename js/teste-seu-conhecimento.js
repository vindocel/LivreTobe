
// ===== Teste seu conhecimento (cartões) =====
(function(){
  const $ = (s) => document.querySelector(s);
  const msg = $('#msg');
  const btnPlay = $('#btnPlay');
  const btnNext = $('#btnNext');
  const btnReveal = $('#btnReveal');
  const enText = $('#enText');
  const pronText = $('#pronText');
  const ptChip = $('#ptChip');

  let CURRENT = { text: '', pron: '', pt: '' };

  function dataset(){
    // Seu arquivo /js/to-be-data.js expõe window.DATA = [...]
    if (Array.isArray(window.DATA)) return window.DATA;
    // Fallbacks (só por segurança)
    const d = (window.toBeData || window.TO_BE_DATA || window.to_be_data || []);
    return Array.isArray(d) ? d : [];
  }

  function cleanHint(h){ return (typeof h === 'string' ? h.replace(/\bex\s*:\s*/i, '').trim() : ''); }
  const rnd = (n) => Math.floor(Math.random()*n);

  function pickVariant(item){
    const p1 = (item.play1||'').trim();
    const p2 = (item.play2||'').trim();
    const r1 = (item.pron1||'').trim();
    const r2 = (item.pron2||'').trim();
    const opts = [];
    if (p1) opts.push({ play:p1, pron:r1 });
    if (p2) opts.push({ play:p2, pron:r2 });
    if (!opts.length) return null;
    return opts[rnd(opts.length)];
  }

  function speak(text){
    if (!('speechSynthesis' in window)) { if (msg){ msg.hidden=false; msg.textContent='Seu navegador não suporta TTS.'; } return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US';
    const v = window.speechSynthesis.getVoices().find(v => /en[-_]US|English/.test(v.lang||v.name));
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }

  function loadCard(){
    const data = dataset();
    if (!data.length){
      if (msg){ msg.hidden=false; msg.textContent='Nenhum dado encontrado. Verifique /js/to-be-data.js (window.DATA = [...]).'; }
      enText.textContent='—'; pronText.textContent='—'; ptChip.textContent='—'; ptChip.classList.remove('show');
      return;
    }

    let entry, variant, tries=0;
    do { entry = data[rnd(data.length)]; variant = pickVariant(entry); tries++; } while(!variant && tries < 10);
    if (!variant){ if (msg){ msg.hidden=false; msg.textContent='Dados insuficientes (play/pron vazios).'; } return; }

    const { play, pron } = variant; const pt = cleanHint(entry.hint);
    CURRENT = { text: play, pron, pt };
    enText.textContent = play;
    pronText.textContent = pron || ''; pronText.style.display = pron ? '' : 'none';
    ptChip.textContent = pt || '(sem tradução)'; ptChip.classList.remove('show');

    if (btnReveal){
      btnReveal.setAttribute('aria-pressed','false');
      btnReveal.setAttribute('aria-label','Mostrar tradução em português');
      btnReveal.title = 'Mostrar tradução (PT)';
      btnReveal.querySelector('span').textContent = 'PT';
    }
    if (msg) msg.hidden = true;
  }

  btnPlay?.addEventListener('click', () => { if (CURRENT.text) speak(CURRENT.text); });
  btnNext?.addEventListener('click', loadCard);
  btnReveal?.addEventListener('click', () => {
    const showing = ptChip.classList.toggle('show');
    btnReveal.setAttribute('aria-pressed', showing ? 'true' : 'false');
    btnReveal.setAttribute('aria-label', showing ? 'Ocultar tradução em português' : 'Mostrar tradução em português');
    btnReveal.title = showing ? 'Ocultar tradução (PT)' : 'Mostrar tradução (PT)';
    btnReveal.querySelector('span').textContent = showing ? 'PT ✓' : 'PT';
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') loadCard();
    if (ev.key.toLowerCase() === 'r') ptChip.classList.toggle('show');
    if (ev.key === ' ') { ev.preventDefault(); if (CURRENT.text) speak(CURRENT.text); }
  });

  document.addEventListener('DOMContentLoaded', loadCard);
})();
