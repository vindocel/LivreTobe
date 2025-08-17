(function(){
  'use strict';
  const elCards = document.getElementById('cards');
  const q = document.getElementById('q');
  const tense = document.getElementById('tense');
  const form = document.getElementById('form');
  if (!elCards) return;

  const L = {Present:'Presente', Past:'Passado', Future:'Futuro', Perfect:'Perfeito',
             Affirmative:'Afirmativa', Negative:'Negativa', Question:'Pergunta', 'Negative Question':'Pergunta negativa'};
  const label = s => L[s] || s || '';
  const esc = s => String(s ?? '').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  const escA = s => String(s ?? '').replace(/"/g,'&quot;');

  function card(row){
    const art = document.createElement('article');
    art.className = 'card';
    art.innerHTML = `
      <div class="card-title">${label(row.tense)} | ${label(row.form)}</div>

      <div class="pair">
        <span class="badge">${esc(row.subject)}</span>
        <span class="badge">${esc(row.verb)}</span>
      </div>

      <div class="actions">
        <div class="speak">
          <span class="speak__label">completo</span>
          <div class="speak__row">
            <button class="btn" data-tts="${escA(row.play1)}" aria-label="Reproduzir: ${esc(row.play1)}"></button>
            <span class="phrase">${esc(row.play1)}</span>
          </div>
          ${row.pron1 ? `<div class="pron">${esc(row.pron1)}</div>` : ''}
        </div>

        ${row.play2 ? `
        <div class="speak">
          <span class="speak__label">contraído</span>
          <div class="speak__row">
            <button class="btn" data-tts="${escA(row.play2)}" aria-label="Reproduzir: ${esc(row.play2)}"></button>
            <span class="phrase">${esc(row.play2)}</span>
          </div>
          ${row.pron2 ? `<div class="pron">${esc(row.pron2)}</div>` : ''}
        </div>` : ''}
      </div>

      ${row.hint ? `<div class="hint">${esc(row.hint)}</div>` : ''}
    `;
    return art;
  }

  function apply(){
    const list = Array.isArray(window.DATA) ? window.DATA : [];
    const term = (q && q.value || '').trim().toLowerCase();
    elCards.innerHTML = '';
    list
      .filter(r => (tense && tense.value && tense.value !== 'all') ? r.tense === tense.value : true)
      .filter(r => (form && form.value && form.value !== 'all') ? r.form === form.value : true)
      .filter(r => !term || ((r.subject||'')+(r.verb||'')+(r.play1||'')+(r.play2||'')+(r.hint||'')).toLowerCase().includes(term))
      .forEach(r => elCards.appendChild(card(r)));
  }

  q && q.addEventListener('input', apply);
  tense && tense.addEventListener('change', apply);
  form  && form.addEventListener('change', apply);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();
