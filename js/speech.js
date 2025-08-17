// js/speech.js — TTS simples e robusto (sem mexer no layout dos controles)
(() => {
  const synth = window.speechSynthesis;
  const VOICE_KEY = 'tts.voiceURI';

  const select = document.getElementById('voice');
  const rateInput = document.getElementById('rate');
  const rateLabel = document.getElementById('rateLabel');

  function setRateLabel(v){
    if (rateLabel) rateLabel.textContent = (Number(v)||1).toFixed(2) + 'x';
  }
  rateInput && rateInput.addEventListener('input', () => setRateLabel(rateInput.value));

  function populateVoices(){
    if (!select) return;
    const voices = synth.getVoices().filter(v => v.lang && v.lang.startsWith('en'));
    const saved = localStorage.getItem(VOICE_KEY);
    const frag = document.createDocumentFragment();
    voices.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v.voiceURI;
      opt.textContent = v.name + ' - ' + v.lang;
      if (saved && saved === v.voiceURI) opt.selected = true;
      frag.appendChild(opt);
    });
    select.innerHTML = '';
    select.appendChild(frag);
    if (!select.value && voices[0]) select.value = voices[0].voiceURI;
  }

  if (speechSynthesis.onvoiceschanged !== undefined){
    speechSynthesis.addEventListener('voiceschanged', populateVoices);
  }
  populateVoices();
  setRateLabel(rateInput ? rateInput.value : 1);

  window.playTTS = function(text){
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const chosen = select ? voices.find(x => x.voiceURI === select.value) : null;
    if (chosen) u.voice = chosen;
    u.lang = 'en-US';
    u.rate = rateInput ? Number(rateInput.value || 1) : 1;
    synth.cancel();
    synth.speak(u);
    if (chosen) localStorage.setItem(VOICE_KEY, chosen.voiceURI);
  };

  // Delegação: qualquer [data-tts] toca
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tts]');
    if (!btn) return;
    const text = btn.getAttribute('data-tts');
    window.playTTS(text);
  });
})();
