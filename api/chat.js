export default async function handler(req, res) {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "No message received" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.MODEL,
        messages: [
          {
            role: "system",
            content: "You are Donna. Emotionally intelligent, confident, witty, slightly sarcastic, loyal to Sanjay."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || "No response"
    });

  } catch (err) {
    return res.status(500).json({
      reply: "Error: " + err.message
    });
  }
}
