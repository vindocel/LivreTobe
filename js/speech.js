// js/speech.js
// Atualizado: seleção robusta de vozes com en-US como padrão (Edge/Android friendly).
// - Aguarda voiceschanged com fallback por timeout
// - "Destrava" vozes no Android com um speak/cancel silencioso
// - Força u.lang = 'en-US' e tenta voz en-US (preferencialmente Microsoft Ava/Aria)
// - Persiste a escolha do usuário em localStorage
(() => {
  const synth = window.speechSynthesis;
  const STORAGE_KEY = 'tts.voiceURI';
  const PREFERRED_NAMES = [
    'Microsoft Ava Online (Natural) - English (United States)',
    'Microsoft Aria Online (Natural) - English (United States)',
    'Google US English'
  ];

  function waitForVoices(timeout = 2000) {
    return new Promise(resolve => {
      let voices = synth.getVoices();
      if (voices && voices.length) return resolve(voices);

      const timer = setTimeout(() => {
        synth.onvoiceschanged = null;
        resolve(synth.getVoices());
      }, timeout);

      synth.onvoiceschanged = () => {
        clearTimeout(timer);
        resolve(synth.getVoices());
      };

      // Android quirk: "destravar" as vozes
      try {
        const u = new SpeechSynthesisUtterance(' ');
        u.volume = 0; // silêncio
        synth.speak(u);
        synth.cancel();
      } catch {}
    });
  }

  function pickVoice(voices) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const v = voices.find(x => x.voiceURI === saved);
      if (v) return v;
    }
    // Preferências por nome dentro de en-US
    let v = voices.find(x => (x.lang || '').toLowerCase() === 'en-us' && PREFERRED_NAMES.some(n => x.name.includes(n)));
    // Qualquer en-US
    v = v || voices.find(x => (x.lang || '').toLowerCase() === 'en-us');
    // Qualquer en-*
    v = v || voices.find(x => x.lang && x.lang.toLowerCase().startsWith('en-'));
    // Último recurso
    return v || voices[0];
  }

  function getVoiceSelect() {
    // Tenta por id #voiceSelect e depois por [data-voice-select]
    return document.querySelector('#voiceSelect') || document.querySelector('[data-voice-select]');
  }

  async function initTTS() {
    const select = getVoiceSelect();
    const voices = await waitForVoices();
    const defaultVoice = pickVoice(voices);

    // Popular o <select> listando primeiro en-*, depois o resto
    const byLang = (a, b) => ((a.lang || '') > (b.lang || '') ? 1 : -1);
    const sorted = [
      ...voices.filter(v => v.lang?.toLowerCase().startsWith('en-')).sort(byLang),
      ...voices.filter(v => !v.lang?.toLowerCase().startsWith('en-')).sort(byLang),
    ];

    if (select) {
      select.innerHTML = '';
      for (const v of sorted) {
        const opt = document.createElement('option');
        opt.value = v.voiceURI;
        opt.textContent = `${v.name} (${v.lang || 'unknown'})`;
        select.appendChild(opt);
      }
      if (defaultVoice) select.value = defaultVoice.voiceURI;
      select.addEventListener('change', () => {
        localStorage.setItem(STORAGE_KEY, select.value);
      });
    }

    // API pública simples para reproduzir (ligue seus botões a window.playTTS)
    window.playTTS = (text, rate = 1.0) => {
      if (!text) return;
      const u = new SpeechSynthesisUtterance(text);
      const chosen = (select && voices.find(x => x.voiceURI === select.value)) || defaultVoice;
      u.voice = chosen || defaultVoice;
      u.lang = 'en-US'; // força idioma
      u.rate = rate;

      // Limpa fila (especialmente no Edge/Windows)
      synth.cancel();
      synth.speak(u);

      if (chosen) localStorage.setItem(STORAGE_KEY, chosen.voiceURI);
    };
  }

  // inicializa
  try { initTTS(); } catch (e) { console.error('TTS init error', e); }
})();
