const CACHE_NAME = "my-cache-v1";
const urlsToCache = [
  "/",              // الصفحة الرئيسية
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// أثناء التثبيت: نخزن الملفات في الكاش
self.addEventListener("install", (event) => {
  console.log("Service Worker installed ✅");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// أثناء التفعيل: نمسح أي كاش قديم
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated ✅");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// أثناء الطلبات: نرد من الكاش أو من الشبكة
self.addEventListener("fetch", (event) => {
  console.log("Fetching:", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
