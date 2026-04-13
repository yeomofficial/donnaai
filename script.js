const chat = document.getElementById("chat");

// 🧠 Memory storage
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

    chat.lastChild.innerText = data.reply;

  } catch (err) {
    chat.lastChild.innerText = "Donna is not responding... try again.";
  }
}

    const data = await res.json();

    // Replace typing with real reply
    chat.lastChild.innerText = data.reply;

    // Save Donna reply to memory
    history.push({ role: "assistant", content: data.reply });

  } catch (err) {
    chat.lastChild.innerText = "Donna is not responding... try again.";
  }
}
