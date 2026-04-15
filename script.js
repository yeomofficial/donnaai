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

// 🔽 THEN SERVICE WORKER
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/firebase-messaging-sw-v2.js")
    .then((reg) => {
      console.log("✅ SW registered");

      return navigator.serviceWorker.ready;
    })
    .then(() => {
      alert("🔥 SW is controlling the page");
    })
    .catch((err) => {
      alert("❌ SW error:", err);
    });
}

// 🔥 ASK PERMISSION
async function initNotifications() {
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    const token = await getToken(messaging, {
      vapidKey: "BDbZPcyMwjI1rWYmaZ8ZiNmFPM_tw9lvwu65W98Ve-_7AocoPJKw-ea3WVSdy02D31o3JUqIXGr4NJdL5BH2SII"
    });

    console.log("🔥 TOKEN:", token);

    // 🔥 SEND TOKEN TO YOUR BACKEND
    await fetch("https://donnaserver.onrender.com/save-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token })
    });
  }
}

initNotifications();

const chat = document.getElementById("chat");
let history = [];   // local copy for this session

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
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

  history.push({ role: "user", content: message });

  if (history.length > 25) history = history.slice(-25);

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

    if (!res.ok) throw new Error();

    const data = await res.json();

    typingDiv.innerText = data.reply || "No reply";

    history.push({ role: "assistant", content: data.reply || "" });
    if (history.length > 10) {          // ← start with 10
  history = history.slice(-10);
    }

  } catch (err) {
    typingDiv.innerText = "Donna is not responding... try again.";
  }

  chat.scrollTop = chat.scrollHeight;
}

// Button connection
document.getElementById("sendBtn").addEventListener("click", send);


// TEXT AREA

const textarea = document.getElementById("msg");

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";              // reset
  textarea.style.height = textarea.scrollHeight + "px"; // grow
});

function sendMessage() {
  const textarea = document.getElementById("msg");
  const message = textarea.value.trim();

  if (!message) return;

  // your existing send logic here...

  // ✅ CLEAR TEXT
  textarea.value = "";

  // 🔥 RESET HEIGHT
  textarea.style.height = "auto";
}

textarea.addEventListener("input", () => {
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

function testNotification() {
  navigator.serviceWorker.ready.then(reg => {
    reg.showNotification("Donna", {
      body: "Manual test notification 🔥",
      icon: "/apple-touch-icon.png", // optional but good
      badge: "/apple-touch-icon.png"
    });
  });
}
