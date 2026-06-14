# OpsMind AI
--
OpsMind AI turns internal PDFs (SOPs, policies, runbooks, manuals) into a **searchable knowledge base** and an **enterprise chat assistant** that answers questions **grounded in your uploaded documents** (Retrieval-Augmented Generation / RAG).
**High-level flow:** Upload PDFs → extract text → chunk → generate embeddings → store in MongoDB → similarity search (Top‑K + threshold) → build a grounded prompt → LLM generates an answer (+ citations) → optionally stream via SSE.
---

## Table of Contents

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [How It Works (RAG Flow)](#how-it-works-rag-flow)
- [Tech Stack](#tech-stack)
- [API Endpoints (Quick Reference)](#api-endpoints-quick-reference)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Usage](#usage)
- [Hallucination Control (Context-only Policy)](#hallucination-control-context-only-policy)
- [Security Notes](#security-notes)
- [Testing](#testing)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Key Features

- **RAG pipeline** for grounded, document-based answers
- **PDF ingestion**: upload PDFs, extract text, and chunk content
- **Embeddings + vector search** using **MongoDB** as the vector store
- **LLM via OpenRouter** (chat completions) with **streaming responses (SSE)**
- **Source citations** (document/page/section/chunk metadata when available)
- **Chat history** stored for later review (messages include retrieval metadata)
- **Admin-friendly UI**: React dashboard for documents + chat
- **Auth-ready**: Clerk integration (production) + **dev-mode auth bypass** for local development

---

## Project Structure

```text
OpsMindAI3/
├── backend/                 # Express backend (RAG, ingestion, APIs)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.js
│   └── README.md
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── README.md
├── ARCHITECTURE.md          # System architecture (kept in sync with code)
└── README.md                # (this file)
```

---

## How It Works (RAG Flow)

```text
PDF Upload
   ↓
Extract text (pdf-parse)
   ↓
Chunk text (chunk size + overlap)
   ↓
Generate embeddings (OpenRouter /embeddings)
   ↓
Store chunks + embeddings in MongoDB
   ↓
User question → embedding → similarity search (Top-K + threshold)
   ↓
Build grounded prompt using retrieved chunks (+ citations)
   ↓
OpenRouter chat completions generates answer
   ↓
Return answer (optionally streamed via SSE)
```

---

## Tech Stack
### Backend

- Node.js + Express
- MongoDB + Mongoose
- File uploads: Multer
- PDF parsing: `pdf-parse`
- LLM + embeddings: **OpenRouter**
  - `POST https://openrouter.ai/api/v1/chat/completions`
  - `POST https://openrouter.ai/api/v1/embeddings`
- Streaming: **SSE** (`text/event-stream`)
- Security: Helmet, CORS allowlist, rate limiting
- Auth: Clerk (`@clerk/express`) + dev-mode JWT decode bypass when keys are placeholders

### Frontend

- React 18 + Vite
- TailwindCSS
- React Router v6
- TanStack React Query
- Zustand
- Axios (request interceptor attaches Bearer token)
- react-dropzone
- react-hot-toast
- Clerk (`@clerk/react`) + dev-mode auth bypass when publishable key is placeholder

---

## API Endpoints (Quick Reference)

> For exact details, check `backend/src/routes`.

### Public

- `GET /api/public/*` — public endpoints (see `backend/src/server.js` routing)

### Documents

- `POST /api/documents/upload` — upload a PDF
- `GET /api/documents` — list uploaded documents
- `GET /api/documents/:id` — get document metadata
- `GET /api/documents/:id/status` — get upload/processing status
- `DELETE /api/documents/:id` — delete a document

### RAG (Chat)

- `POST /api/rag/ask` — generate answer (non-streaming)
- `POST /api/rag/stream` — generate answer (streaming via SSE)
- `GET /api/rag/search` — vector search only (no LLM; query via `?query=...`)

### Conversations / Messages

- `POST /api/chat` — create conversation
- `GET /api/chat` — list conversations
- `GET /api/chat/:id` — get a conversation
- `PATCH /api/chat/:id` — update conversation title
- `DELETE /api/chat/:id` — delete a conversation

### Dashboard / Analytics

- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-activity`
- `GET /api/dashboard/documents-overview`

---

## Environment Variables

### Backend (`backend/.env`)

Create from the template:

```bash
cd backend
cp .env.example .env
```

Common variables (based on current code):

```env
# Server
PORT=5002
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://...

# OpenRouter (LLM + embeddings)
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=google/gemini-2.0-flash-001
OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-small

# Clerk (prod). If these are placeholders/missing, backend runs dev auth bypass.
CLERK_SECRET_KEY=sk_live_...

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=500
```

### Frontend (`frontend/.env`)

```bash
cd frontend
# if you have .env.example in repo, copy it; otherwise create .env manually
```

Common variables:

```env
VITE_API_URL=http://localhost:5002
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

Notes:
- In **development**, the frontend Axios client may use Vite proxy (empty `baseURL`) depending on setup.
- If `VITE_CLERK_PUBLISHABLE_KEY` is a placeholder/missing, the frontend uses the **dev auth provider**.

---

## Local Setup

### 1) Clone

```bash
git clone https://github.com/anandsagar2807/OpsMindAI3.git
cd OpsMindAI3
```

### 2) Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
# or: npm start
```

Backend runs on `http://localhost:5002` by default.

### 3) Start the frontend

```bash
cd ../frontend
npm install
npm run dev
```

Vite prints the URL in your terminal (often `http://localhost:5173`).

---

## Usage

1. Open the frontend (Vite URL)
2. Log in (Clerk) — or use dev-mode auth if running with placeholder keys
3. Upload one or more PDF documents
4. Go to the Chat / RAG area
5. Ask questions based on the uploaded documents

---

## Hallucination Control (Context-only Policy)

When relevant chunks are retrieved, the backend uses a strict **context-only** system prompt:
- Answer only using provided context chunks
- If the answer is not in context, respond with:
  - `"I don't know based on the uploaded SOP documents."`
- Provide citations when possible

### Fallback mode

If embeddings/vector search fail (for example, missing OpenRouter credits or `OPENROUTER_API_KEY` not configured), the backend can fall back to a **non-RAG** answer mode:
- It will still call the LLM, but **without document context**
- Metadata includes `fallbackMode: true`

---

## Security Notes

If you deploy this in a real organization:

- Require authentication before upload/chat
- Enforce authorization (documents/chats per user/tenant)
- Lock down CORS (`FRONTEND_URL` allowlist)
- Add rate limiting on inference endpoints
- Validate inputs (especially file uploads)
- Never commit `.env` files; use a secrets manager in production

---

## Testing

Testing commands may vary by project configuration.

```bash
# Backend
cd backend
npm test

# Frontend
cd ../frontend
npm test
```

---

## Production Deployment

### Backend

```bash
cd backend
NODE_ENV=production npm start
```

Checklist:
- Use a production MongoDB cluster
- Set real Clerk keys
- Set OpenRouter API key + model(s)
- Enable HTTPS
- Tighten CORS origins

### Frontend

```bash
cd frontend
npm run build
# Deploy dist/ to your hosting provider
```

---

## Troubleshooting

### Frontend can’t reach backend

- Check `VITE_API_URL` in `frontend/.env`
- Confirm backend is running on port `5002`
- Confirm CORS includes your frontend origin (`FRONTEND_URL`)

### Uploads failing

- Check upload size limits (Multer)
- Confirm PDFs are supported (current implementation is PDF-focused)
- Confirm `pdf-parse` dependencies are installed

### Answers are often “I don’t know…”

- Upload more relevant documents
- Adjust chunking parameters (chunk size / overlap)
- Increase Top‑K retrieval
- Confirm embeddings are being generated and stored

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a pull request

---

## License

MIT (see `LICENSE` if present)
