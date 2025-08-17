
const TTS = (() => {
  const select = document.getElementById('voice');
  const rate = document.getElementById('rate');
  const rateLabel = document.getElementById('rateLabel');

  function listVoices() {
    const voices = speechSynthesis.getVoices() || [];
    select.innerHTML = '';
    voices.sort((a,b)=> (a.lang||'').localeCompare(b.lang||''));
    for (const v of voices) {
      const opt = document.createElement('option');
      opt.value = v.name;
      opt.textContent = `${v.name} - ${v.lang}`;
      opt.dataset.lang = v.lang;
      select.appendChild(opt);
    }
    const prefer = voices.find(v => /Microsoft Ava Online.*Natural/i.test(v.name) && /^en-US/i.test(v.lang))
      || voices.find(v => /^en-US/i.test(v.lang))
      || voices.find(v => /^en-/i.test(v.lang))
      || voices[0];
    if (prefer) select.value = prefer.name;
  }

  function speak(text) {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    const voice = speechSynthesis.getVoices().find(v => v.name === select.value);
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = parseFloat(rate.value) || 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }

  rate.addEventListener('input', () => rateLabel.textContent = `${parseFloat(rate.value).toFixed(2)}x`);
  window.speak = speak;

  window.addEventListener('load', () => {
    listVoices();
    speechSynthesis.onvoiceschanged = listVoices;
  });
})();
