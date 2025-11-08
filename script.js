// بيانات درس مدمجة (تقدر تبدل لاحقاً بتحميل lessons.json)
const lesson = {
  id: 'intro',
  title: 'مقدمة الأردوينو',
  steps: [
    { type: 'bot', text: 'أهلاً! جاهز نولّع الأردوينو؟ دي دردشة تعليمية خطوة بخطوة.' },
    { type: 'bot', text: 'السؤال الأول: إيه وظيفة الدالة setup()؟' },
    { type: 'quiz', text: 'اختر الإجابة الصحيحة:', options: [
      { text: 'تتنفذ مرة واحدة مع بداية التشغيل', correct: true },
      { text: 'تكرر إلى مالا نهاية', correct: false },
      { text: 'تتعامل مع الشبكة', correct: false }
    ], correctMsg: 'تمام! setup() مرة واحدة.', wrongMsg: 'غلط، صحّح إجابتك.' },
    { type: 'bot', text: 'دلوقتي جرّب تكتب كود يستخدم Serial.println للطباعة.' }
  ],
  starterCode:
`void setup(){
  Serial.begin(9600);
  Serial.println("مرحبا من ياسر!");
}
void loop(){
  // أضف منطقك هنا
}`
};

const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const codeArea = document.getElementById('codeArea');
const serialOut = document.getElementById('serialOut');
const loadStarter = document.getElementById('loadStarter');
const saveCodeBtn = document.getElementById('saveCode');
const runBtn = document.getElementById('runCode');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

let stepIndex = 0;
let score = 0;

// عرض رسالة في الدردشة
function pushMsg(text, who='bot'){
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.innerHTML = text;
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// عرض سؤال اختيار من متعدد
function pushQuiz(step){
  const wrap = document.createElement('div');
  wrap.className = 'msg bot';
  const title = document.createElement('div');
  title.innerHTML = `<strong>${step.text}</strong>`;
  wrap.appendChild(title);

  step.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.style.marginRight = '6px';
    btn.textContent = opt.text;
    btn.onclick = () => {
      pushMsg(opt.text, 'user');
      if(opt.correct){
        pushMsg(step.correctMsg, 'bot');
        score++;
        nextStep();
      }else{
        pushMsg(step.wrongMsg, 'bot');
      }
      updateProgress();
    };
    wrap.appendChild(btn);
  });

  chatWindow.appendChild(wrap);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// الخطوة التالية
function nextStep(){
  if(stepIndex >= lesson.steps.length){ pushMsg('انتهت المقدمة! جرّب التمرين العملي في المحرر.', 'bot'); return; }
  const step = lesson.steps[stepIndex++];
  if(step.type === 'bot'){ pushMsg(step.text, 'bot'); }
  else if(step.type === 'quiz'){ pushQuiz(step); }
  updateProgress();
}

// تقدّم الطالب
function updateProgress(){
  const total = lesson.steps.length;
  const completed = Math.min(stepIndex, total);
  const pct = Math.round((completed / total) * 100);
  progressFill.style.width = pct + '%';
  progressText.textContent = `${pct}% مكتمل — نقاط: ${score}`;
  localStorage.setItem('lesson-progress', JSON.stringify({ stepIndex, score }));
}

// حفظ واستعادة
function loadProgress(){
  const data = localStorage.getItem('lesson-progress');
  if(!data) return;
  try{
    const obj = JSON.parse(data);
    stepIndex = obj.stepIndex || 0;
    score = obj.score || 0;
  }catch(e){}
}
function loadCode(){
  const saved = localStorage.getItem('user-code');
  codeArea.value = saved || lesson.starterCode;
}

// محرّك محاكاة بسيط للكود (لا يشغّل أردوينو فعليًا)
function simulateRun(code){
  serialOut.textContent = '';
  const lines = code.split('\n');

  // محاكاة أوامر معروفة
  lines.forEach((ln) => {
    const t = ln.trim();
    // Serial.println("...")
    const m = t.match(/^Serial\.println\((.*)\)\s*;$/);
    if(m){
      const content = m[1].trim();
      // إزالة علامات "إن وُجدت"
      const printed = content.replace(/^"(.*)"$/, '$1');
      appendSerial(printed);
    }
    if(t.startsWith('digitalWrite(')){
      appendSerial('digitalWrite تم تنفيذها (محاكاة).');
    }
    if(t.startsWith('delay(')){
      appendSerial('delay (محاكاة زمن).');
    }
    if(t.startsWith('pinMode(')){
      appendSerial('pinMode مضبوط (محاكاة).');
    }
  });

  // لو مفيش أي إخراج
  if(!serialOut.textContent.trim()){
    appendSerial('لا يوجد إخراج. هل استخدمت Serial.println؟');
  }
}

function appendSerial(text){
  serialOut.textContent += text + '\n';
}

// أحداث
sendBtn.addEventListener('click', ()=>{
  const txt = userInput.value.trim();
  if(!txt) return;
  pushMsg(txt, 'user');

  // ردود مرشد بسيطة
  if(/setup/.test(txt)){ pushMsg('عاش! setup فعلاً بتشتغل مرة واحدة.', 'bot'); }
  else if(/Serial/.test(txt)){ pushMsg('تمام، استخدم begin و println للطباعة.', 'bot'); }
  else{ pushMsg('شكراً لردك! كمل للخطوة التالية.', 'bot'); }

  userInput.value = '';
});
loadStarter.addEventListener('click', loadCode);
saveCodeBtn.addEventListener('click', ()=>{ localStorage.setItem('user-code', codeArea.value); pushMsg('تم حفظ الكود محلياً.', 'bot'); });
runBtn.addEventListener('click', ()=> simulateRun(codeArea.value));

// بداية
document.addEventListener('DOMContentLoaded', ()=>{
  loadProgress();
  loadCode();
  // بدء الدرس
  if(stepIndex === 0){ nextStep(); }
  else{
    // إعادة عرض موجزة
    pushMsg('واصلنا من حيث توقفت. كمل الدرس!', 'bot');
    updateProgress();
  }
});
