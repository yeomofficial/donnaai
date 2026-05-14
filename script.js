import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getMessaging, getToken } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyAgRfWLv99iHzgjyBWdcmAD35uFV3FUhuk",
  authDomain: "donna-3f01e.firebaseapp.com",
  projectId: "donna-3f01e",
  messagingSenderId: "808817210443",
  appId: "1:808817210443:web:603638b669b8cc21cac9ce"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./firebase-messaging-sw.js")
    .then((reg) => {
      console.log("✅ Service Worker registered");
      return navigator.serviceWorker.ready;
    })
    .then(() => {
      console.log("✅ Service Worker is controlling the page");
      initNotifications();
    })
    .catch((err) => {
      console.error("❌ Service Worker registration failed:", err);
    });
}

// Initialize Push Notifications
async function initNotifications() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied");
      return;
    }

    const swReady = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: "BDbZPcyMwjI1rWYmaZ8ZiNmFPM_tw9lvwu65W98Ve-_7AocoPJKw-ea3WVSdy02D31o3JUqIXGr4NJdL5BH2SII",
      serviceWorkerRegistration: swReady
    });

    if (token) {
      console.log("FCM Token:", token);
      
      await fetch("https://donnaserver.onrender.com/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });
    }
  } catch (err) {
    console.error("Push notification setup failed:", err);
  }
}

// Chat Functionality
const chat = document.getElementById("chat");
let history = [];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const input = document.getElementById("msg");
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  input.style.height = "auto";

  history.push({ role: "user", content: message });
  if (history.length > 25) history = history.slice(-25);

  // Show typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot";
  typingDiv.innerText = "Typing...";
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://donnaserver.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();
    typingDiv.innerText = data.reply || "No reply received.";

    history.push({ role: "assistant", content: data.reply || "" });
    if (history.length > 15) history = history.slice(-15);

  } catch (err) {
    console.error(err);
    typingDiv.innerText = "Donna is not responding right now. Please try again.";
  }

  chat.scrollTop = chat.scrollHeight;
}

// Auto-resize textarea
const textarea = document.getElementById("msg");
textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

// Send only via button
document.getElementById("sendBtn").addEventListener("click", send);

// Initialize everything
document.addEventListener("DOMContentLoaded", () => {
  textarea.focus();
});
