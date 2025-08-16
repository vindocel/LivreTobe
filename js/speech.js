/**
 * Web Speech API helpers
 * Usage:
 *   speak("Hello world", "Microsoft Maria Online (Natural) - Portuguese (Brazil)", 1.0)
 * or add onClick to buttons: <button class="audio-btn" data-say="texto">...</button>
 */
(function(){
  function getVoicesReady(){
    return new Promise(resolve => {
      const done = (voices)=> resolve(voices || []);
      let attempts = 0;
      const timer = setInterval(()=>{
        const voices = window.speechSynthesis?.getVoices?.() || [];
        attempts++;
        if (voices.length || attempts > 40){ // ~2s
          clearInterval(timer);
          done(voices);
        }
      }, 50);
      try{
        window.speechSynthesis?.addEventListener?.('voiceschanged', ()=>{
          const voices = window.speechSynthesis.getVoices();
          if (voices.length){
            clearInterval(timer); done(voices);
          }
        });
      }catch(_e){/* ignore */}
      setTimeout(()=>{
        const voices = window.speechSynthesis?.getVoices?.() || [];
        clearInterval(timer); done(voices);
      }, 2500);
    });
  }

  async function speak(text, voiceName, rate){
    if (!('speechSynthesis' in window)){
      console.warn('Speech Synthesis not supported.');
      return;
    }
    const utter = new SpeechSynthesisUtterance(String(text||''));
    const voices = await getVoicesReady();
    const voice = (voiceName && voices.find(v => v.name === voiceName)) || voices[0];
    if (voice) utter.voice = voice;
    utter.rate = (rate && Number(rate)) || 1.0;
    try{ speechSynthesis.cancel(); }catch(_e){}
    speechSynthesis.speak(utter);
  }

  // Expose globally
  window.getVoicesReady = getVoicesReady;
  window.speak = speak;

  // Optional: auto-bind .audio-btn
  document.addEventListener('click', (ev)=>{
    const el = ev.target.closest('.audio-btn[data-say]');
    if (!el) return;
    const text = el.getAttribute('data-say') || el.textContent;
    const v = el.getAttribute('data-voice');
    const r = el.getAttribute('data-rate');
    speak(text, v, r);
  });
})();
