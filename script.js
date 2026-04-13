const chat = document.getElementById("chat");

// Memory for conversation history
let history = [];

// Add message to UI
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

  // Show user message immediately
  addMessage(message, "user");
  input.value = "";

  // Save to memory
  history.push({ role: "user", content: message });

  // Keep only last 10 messages (prevents token overflow)
  if (history.length > 10) {
    history = history.slice(-10);
  }

  // Show typing indicator (keep reference to it)
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot";
  typingDiv.innerText = "Typing...";
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://donnaserver.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message,
        history: history
      })
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    // Replace typing with real reply
    typingDiv.innerText = data.reply || "No reply received";

    // Save assistant reply to memory
    history.push({ role: "assistant", content: data.reply || "" });

  } catch (err) {
    console.error(err);
    typingDiv.innerText = "Donna is not responding... try again (server may be waking up)";
  }

  chat.scrollTop = chat.scrollHeight;
}

// Connect the Send button reliably
const sendBtn = document.getElementById("sendBtn");
if (sendBtn) {
  sendBtn.addEventListener("click", send);
  sendBtn.style.backgroundColor = "#4CAF50"; // turns green when ready
} else {
  alert("Send button not found! Make sure id='sendBtn' in HTML");
}
