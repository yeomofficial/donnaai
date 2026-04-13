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

  addMessage(message, "user");
  input.value = "";

  addMessage("Typing...", "bot");

  try {
    const res = await fetch("https://donnaserver.onrender.com/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    // replace typing
    chat.lastChild.innerText = data.reply;

  } catch (err) {
    chat.lastChild.innerText = "Donna is not responding... try again.";
  }
}
