let deferredPrompt;
const installBtn = document.getElementById("installBtn");

// استماع لحدث beforeinstallprompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // منع ظهور البانر التلقائي
  deferredPrompt = e;
  installBtn.style.display = "inline-block"; // إظهار الزر
});

// لما المستخدم يضغط على زر التثبيت
installBtn.addEventListener("click", () => {
  if (deferredPrompt) {
    deferredPrompt.prompt(); // عرض نافذة التثبيت
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("تم تثبيت التطبيق ✅");
      } else {
        console.log("رفض المستخدم التثبيت ❌");
      }
      deferredPrompt = null;
      installBtn.style.display = "none"; // إخفاء الزر بعد المحاولة
    });
  }
});
