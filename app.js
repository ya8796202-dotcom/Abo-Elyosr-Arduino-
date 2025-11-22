// app.js
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// استماع لحدث beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("✅ حدث beforeinstallprompt اتفعل");
  e.preventDefault(); // منع البانر التلقائي
  deferredPrompt = e;
  installBtn.style.display = "inline-block"; // إظهار الزر
});

// عند الضغط على الزر
installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // عرض نافذة التثبيت
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("✅ تم تثبيت التطبيق");
      } else {
        console.log("❌ رفض المستخدم التثبيت");
      }
      deferredPrompt = null;
      installBtn.style.display = "none"; // إخفاء الزر بعد المحاولة
    });
  } else {
    // لو الحدث مش متفعل (مثلاً التطبيق مثبت بالفعل)
    alert("📲 يمكنك تثبيت التطبيق من خيارات المتصفح مباشرة");
  }
});
