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

