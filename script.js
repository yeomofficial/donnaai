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
