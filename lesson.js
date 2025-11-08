import { simulateArduino } from './editor.js';

// عرض محادثة + كود + محرر
function showMessages(seq){
  const chat = document.querySelector('#chatWindow');
  let i = 0;
  function step() {
    if(i>=seq.length) return;
    const m = seq[i++];
    const div = document.createElement('div');
    div.className = `msg ${m.speaker} incoming`;
    div.textContent = m.text;
    chat.appendChild(div);
    requestAnimationFrame(()=>div.classList.add('show'));
    if(m.code){
      const codeBlock = document.querySelector('#codeBlock');
      codeBlock.textContent = m.code;
      const editor = document.querySelector('#codeArea');
      if(editor && !editor.dataset.loaded){
        editor.value = m.code;
        editor.dataset.loaded = '1';
      }
    }
  }
  step();
  document.querySelector('#nextBtn').addEventListener('click', step);
}

function wireEditor(){
  const runBtn = document.querySelector('#runBtn');
  const codeArea = document.querySelector('#codeArea');
  const serialOut = document.querySelector('#serialOut');
  const pinsOut = document.querySelector('#pinsOut');
  const lcdOut = document.querySelector('#lcdOut');

  runBtn.addEventListener('click', ()=>{
    const res = simulateArduino(codeArea.value);
    serialOut.textContent = res.serial;
    pinsOut.textContent = res.pins;
    lcdOut.textContent = res.lcd;
  });
}

export function initLesson(sequence){
  showMessages(sequence);
  wireEditor();
}

