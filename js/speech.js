
/**
 * speech.js — robust TTS defaulting to en-US (prefers Microsoft Ava Online/Natural)
 * Persists user's choice; graceful on Edge/Android.
 */
(function(){
  const STORAGE_KEY = 'tts.voiceName';
  const DEFAULT_LANG = 'en-US';
  const PREFERRED = [
    { lang: 'en-US', substr: ['Ava','Microsoft','Natural'] },
    { lang: 'en-US', substr: ['Aria','Microsoft','Natural'] },
    { lang: 'en-US', substr: ['Jenny','Microsoft','Natural'] },
    { lang: 'en-US', substr: [] },
    { langPrefix: 'en-', substr: [] },
  ];

  const sleep = (ms)=> new Promise(r=> setTimeout(r, ms));

  async function getVoicesReady(maxWait = 3000){
    let voices = window.speechSynthesis?.getVoices?.() || [];
    if (voices.length) return voices;
    let resolved = false;
    const p = new Promise(resolve => {
      try{
        window.speechSynthesis?.addEventListener?.('voiceschanged', () => {
          const v = window.speechSynthesis.getVoices();
          if (v && v.length && !resolved){ resolved = true; resolve(v); }
        });
      }catch(_e){}
      (async ()=>{
        const start = Date.now();
        while ((Date.now()-start) < maxWait){
          const v = window.speechSynthesis?.getVoices?.() || [];
          if (v.length){ resolved = true; resolve(v); return; }
          await sleep(50);
        }
        resolve(window.speechSynthesis?.getVoices?.() || []);
      })();
    });
    return p;
  }

  function storeVoiceName(name){
    try{ localStorage.setItem(STORAGE_KEY, name || ''); }catch(_e){}
  }
  function readStoredVoiceName(){
    try{ return localStorage.getItem(STORAGE_KEY) || ''; }catch(_e){ return ''; }
  }

  function matches(voice, pref){
    const name = (voice.name || '') + ' ' + (voice.voiceURI || '');
    const lang = (voice.lang || '').toLowerCase();
    const hasAll = (pref.substr || []).every(s => name.toLowerCase().includes(String(s).toLowerCase()));
    if (pref.lang && lang === pref.lang.toLowerCase()) return hasAll;
    if (pref.langPrefix && lang.startsWith(pref.langPrefix.toLowerCase())) return hasAll;
    return false;
  }

  function chooseVoice(voices){
    const stored = readStoredVoiceName();
    if (stored){
      const v = voices.find(v => v.name === stored || v.voiceURI === stored);
      if (v) return v;
    }
    for (const pref of PREFERRED){
      const v = voices.find(v => matches(v, pref));
      if (v) return v;
    }
    return voices[0] || null;
  }

  async function ensureVoice(){
    const voices = await getVoicesReady();
    const choice = chooseVoice(voices);
    return { voices, choice };
  }

  async function speak(text, opts = {}){
    if (!('speechSynthesis' in window)){
      alert('Seu navegador não suporta síntese de voz (TTS).');
      return;
    }
    const { choice } = await ensureVoice();
    const u = new SpeechSynthesisUtterance(String(text || ''));
    u.lang = opts.lang || (choice && choice.lang) || DEFAULT_LANG;
    if (choice) u.voice = choice;
    if (opts.rate) u.rate = Number(opts.rate);
    if (opts.pitch) u.pitch = Number(opts.pitch);
    if (opts.volume) u.volume = Number(opts.volume);
    try{ speechSynthesis.cancel(); }catch(_e){}
    speechSynthesis.speak(u);
  }

  async function bindSelect(selector){
    const el = document.querySelector(selector);
    if (!el) return;
    const { voices, choice } = await ensureVoice();
    const english = voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
    const list = english.length ? english : voices;
    el.innerHTML = '';
    for (const v of list){
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} — ${v.lang}`;
      if (choice && v.name === choice.name) opt.selected = true;
      el.appendChild(opt);
    }
    el.disabled = list.length <= 1;
    el.addEventListener('change', () => storeVoiceName(el.value));
  }

  // Auto-bind click on .audio-btn[data-say] and [data-tts]
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.audio-btn[data-say], [data-tts]');
    if (!btn) return;
    const text = btn.getAttribute('data-say') || btn.getAttribute('data-tts') || btn.textContent;
    const rate = btn.getAttribute('data-rate');
    const pitch = btn.getAttribute('data-pitch');
    const volume = btn.getAttribute('data-volume');
    speak(text, { rate, pitch, volume, lang: 'en-US' });
  });

  // Expose compatible API
  window.TTS = { getVoicesReady, speak, bindSelect, chooseVoice };
  window.speak = window.speak || speak; // if site calls speak(), we provide it

  getVoicesReady(); // warm-up
})();
