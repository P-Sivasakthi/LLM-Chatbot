// import "dotenv/config";
// import express from "express";
// import cors from "cors";

// const app = express();
// const PORT = process.env.PORT || 3001;
// const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
// const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2";

// app.use(cors({
//   origin: "https://vercel.com/sivasakthi-paramasivam-s-projects/llm-chatbot",
// }));
// app.use(express.json());

// app.get("/api/health", (_req, res) => {
//   res.json({ status: "ok", model: OLLAMA_MODEL });
// });

// app.post("/api/chat", async (req, res) => {
//   const { message, history = [] } = req.body;

//   if (!message || typeof message !== "string" || !message.trim()) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   const messages = [
//     ...history.map((m) => ({
//       role: m.role === "assistant" ? "assistant" : "user",
//       content: m.content,
//     })),
//     { role: "user", content: message.trim() },
//   ];
//   console.log(messages);
//   try {
//     const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         model: OLLAMA_MODEL,
//         messages,
//         stream: false,
//       }),
//     });

//     if (!ollamaResponse.ok) {
//       const errText = await ollamaResponse.text();
//       console.error("Ollama error:", errText);
//       return res.status(502).json({
//         error:
//           "Could not reach the LLM. Make sure Ollama is running and the model is pulled.",
//         details: errText,
//       });
//     }

//     const data = await ollamaResponse.json();
//     const reply = data.message?.content ?? "";

//     res.json({ reply });
//   } catch (err) {
//     console.error("Chat error:", err.message);
//     res.status(503).json({
//       error:
//         "LLM service unavailable. Install Ollama from https://ollama.com and run: ollama pull " +
//         OLLAMA_MODEL,
//     });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
//   console.log(`Using Ollama model: ${OLLAMA_MODEL}`);
// });


import "dotenv/config";
import express from "express";
import cors from "cors";
import Groq from "groq-sdk";

const app = express();

const PORT = process.env.PORT || 3001;

const GROQ_MODEL =
  process.env.GROQ_MODEL;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://your-frontend.vercel.app",
    ],
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    model: GROQ_MODEL,
  });
});

app.post("/api/chat", async (req, res) => {
  const { message, history = [] } = req.body;

  if (
    !message ||
    typeof message !== "string" ||
    !message.trim()
  ) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  try {
    const messages = [
      ...history.map((m) => ({
        role:
          m.role === "assistant"
            ? "assistant"
            : "user",
        content: m.content,
      })),
      {
        role: "user",
        content: message.trim(),
      },
    ];

    const completion =
      await groq.chat.completions.create({
        model: GROQ_MODEL,
        temperature: 0.7,
        messages,
      });

    const reply =
      completion.choices[0].message.content ||
      "";

    res.json({
      reply,
    });
  } catch (error) {
    console.error(
      "Groq Error:",
      error?.message
    );

    res.status(500).json({
      error: "Failed to generate response",
      details: error?.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
  console.log(
    `Using Groq model: ${GROQ_MODEL}`
  );
});