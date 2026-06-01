# LLM Chatbot

A full-stack AI chatbot using **React**, **Node.js**, and **Ollama** (open-source local LLM).

## Architecture

```
User enters message
        ↓
React sends API request  →  POST /api/chat
        ↓
Node.js receives request
        ↓
Node.js calls Ollama API  →  http://localhost:11434/api/chat
        ↓
LLM generates response
        ↓
Node.js returns JSON  →  { reply: "..." }
        ↓
React displays response
```

## Prerequisites

1. **Node.js** 18+ — [nodejs.org](https://nodejs.org)
2. **Ollama** — [ollama.com](https://ollama.com) (runs open-source models locally)

After installing Ollama, pull a model:

```bash
ollama pull llama3.2
```

Other open models you can use: `mistral`, `phi3`, `gemma2`, `qwen2.5`.

## Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Server runs at `http://localhost:3001`.

### 2. Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Configuration

Edit `backend/.env`:

| Variable         | Default                    | Description              |
|------------------|----------------------------|--------------------------|
| `PORT`           | `3001`                     | API server port          |
| `OLLAMA_BASE_URL`| `http://localhost:11434`   | Ollama API URL           |
| `OLLAMA_MODEL`   | `llama3.2`                 | Model name in Ollama     |

## API

**POST** `/api/chat`

Request body:

```json
{
  "message": "Hello!",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

Response:

```json
{
  "reply": "Assistant response text"
}
```

## Troubleshooting

- **"LLM service unavailable"** — Start Ollama (it usually runs in the system tray after install).
- **"Could not reach the LLM"** — Run `ollama pull llama3.2` (or your chosen model).
- **CORS errors** — Use the Vite dev server (`npm run dev` in `frontend`); it proxies `/api` to the backend.
