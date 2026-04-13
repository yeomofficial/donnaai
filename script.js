const chat = document.getElementById("chat");

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

  // Add user message
  addMessage(message, "user");
  input.value = "";

  // Add typing indicator
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot";
  typingDiv.innerText = "Typing...";
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://donnaserver.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!res.ok) {
      throw new Error("Server error: " + res.status);
    }

    const data = await res.json();

    // Replace "Typing..." with real reply
    typingDiv.innerText = data.reply || "No reply from Donna";

  } catch (err) {
    console.error(err);   // This will show in browser console if possible
    typingDiv.innerText = "Donna is not responding... try again later.";
  }

  chat.scrollTop = chat.scrollHeight;
}

// ==================== CONNECT THE BUTTON ====================
// Add this at the very bottom of your <script> tag
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendBtn");
  
  if (sendBtn) {
    sendBtn.addEventListener("click", send);
    console.log("✅ Send button connected!");
  } else {
    console.error("❌ Button with id='sendBtn' not found!");
  }
});
