importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAgRfWLv99iHzgjyBWdcmAD35uFV3FUhuk",
  projectId: "donna-3f01e",
  messagingSenderId: "808817210443",
  appId: "1:808817210443:web:603638b669b8cc21cac9ce"
});

const messaging = firebase.messaging();


// 🔥 ADD THIS (VERY IMPORTANT)
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});


// 🔥 HANDLE FIREBASE MESSAGES
messaging.onBackgroundMessage((payload) => {
  console.log("📩 Background message:", payload);

  self.registration.showNotification(
    payload.notification?.title || "Donna",
    {
      body: payload.notification?.body || "",
      icon: "/apple-touch-icon.png",
      badge: "/apple-touch-icon.png",
      vibrate: [200, 100, 200]
    }
  );
});
