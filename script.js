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
  console.log("Send function started");   // for debugging

  const input = document.getElementById("msg");
  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  // Create typing indicator with reference
  const typingDiv = document.createElement("div");
  typingDiv.className = "msg bot";
  typingDiv.innerText = "Typing...";
  chat.appendChild(typingDiv);
  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://donnaserver.onrender.com/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    typingDiv.innerText = data.reply || "No reply from Donna";

  } catch (err) {
    console.error(err);
    typingDiv.innerText = "Donna is not responding... try again.";
  }

  chat.scrollTop = chat.scrollHeight;
}

    const data = await res.json();

    // replace typing
    chat.lastChild.innerText = data.reply;

  } catch (err) {
    chat.lastChild.innerText = "Donna is not responding... try again.";
  }
}
