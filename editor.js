// محاكاة تشغيل كود الأردوينو بشكل نصي (تعليمية)
export function simulateArduino(code, context = {}) {
  // سياق الأجهزة الافتراضي
  const state = {
    pins: {},
    serial: [],
    lcd: ["", ""],
    ...context
  };

  function Serial_begin(rate){ state.serial.push(`Serial.begin(${rate})`); }
  function Serial_println(x){ state.serial.push(String(x)); }
  function pinMode(pin, mode){ state.pins[pin] = {mode, value: 0}; }
  function digitalWrite(pin, val){ if(!state.pins[pin]) state.pins[pin]={}; state.pins[pin].value = val; state.serial.push(`digitalWrite(${pin}, ${val===1?'HIGH':'LOW'})`); }
  function analogRead(pin){ return 512; } // قيمة وسطية للتجربة
  function delay(ms){ state.serial.push(`delay(${ms})`); }
  function pulseIn(pin, level){ return 2000; } // محاكاة مسافة ~34 سم
  // LCD بسيط
  function lcdBegin(cols, rows){ state.lcd = ["".padEnd(cols), "".padEnd(cols)]; }
  function lcdPrint(txt){ state.lcd[0] = (state.lcd[0] + txt).slice(0,16); }

  // ترجمة سريعة للوظائف الشائعة داخل النص
  const sandbox = `
    const HIGH=1, LOW=0, OUTPUT='OUTPUT', INPUT='INPUT';
    const Serial={ begin: Serial_begin, println: Serial_println };
    (${function(){
      try { eval(code.replace(/LiquidCrystal\\s+lcd.*\\n/,'').replace(/lcd\\.begin\\((\\d+),(\\d+)\\)/,'lcdBegin($1,$2)').replace(/lcd\\.print\\((.+)\\)/,'lcdPrint($1)')); } catch(e){ state.serial.push('خطأ في المحاكاة: '+e.message); }
    }})();
  `;

  try { eval(sandbox); } catch(e){ state.serial.push('خطأ عام: '+e.message); }

  const pinsOut = Object.entries(state.pins).map(([p,v])=>`Pin ${p}: ${v.mode||'—'}=${v.value??'—'}`).join('\n');
  const lcdOut = state.lcd.join('\n').trim();
  return {
    serial: state.serial.join('\n') || 'لا يوجد إخراج — استخدم Serial.println أو إجراءات.',
    pins: pinsOut || 'لا تغييرات على المخارج.',
    lcd: lcdOut || 'LCD فارغ.'
  };
}
