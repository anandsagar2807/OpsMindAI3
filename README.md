# OpsMind AI

OpsMind AI turns internal PDFs (SOPs, policies, runbooks, manuals) into a **searchable knowledge base** and a **chat assistant** that answers questions using **only the uploaded documents** (RAG: Retrieval-Augmented Generation).

**High-level flow:** Upload PDFs → extract text → chunk → generate embeddings → store in MongoDB (vector search) → retrieve relevant chunks → send context to the LLM → return an answer with citations.

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
- **Groq LLM integration** with **streaming responses (SSE)**
- **Source citations** (document/page/chunk metadata when available)
- **Chat history** stored for later review
- **Admin-friendly UI**: React dashboard for documents + chat

> Note: The repository also includes backend support for **JWT-based auth** (see `backend/README.md`).
> If you enable auth, ensure documents and chats are isolated per user or tenant.

---

## Project Structure

```text
ZaalimaOpsMind-Ai/
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
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── README.md
└── README.md                # (this file)
```

---

## How It Works (RAG Flow)

```text
PDF Upload
   ↓
Extract text (PDF parsing)
   ↓
Chunk text (smaller pieces)
   ↓
Generate embeddings (vector representation)
   ↓
Store in MongoDB (vector store + metadata)
   ↓
User question → similarity search (Top-K + threshold)
   ↓
Build prompt using retrieved chunks (+ citations)
   ↓
Groq LLM generates answer (optionally streamed via SSE)
```

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- PDF parsing: `pdf-parse`
- Embeddings + vector storage
- Groq API / Groq SDK (LLM responses, streaming)
- Optional security/auth: JWT, middleware, rate limiting, headers

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router
- Zustand
- Axios

---

## API Endpoints (Quick Reference)

> Endpoints may vary depending on backend version. For exact details, check `backend/src/routes`.

### Chat (RAG)
- `POST /api/groq-chat/ask` — generate answer (non-streaming)
- `POST /api/groq-chat/ask/stream` — generate answer (streaming via SSE)
- `GET /api/groq-chat/history` — list chat history
- `GET /api/groq-chat/:chatId` — get a chat by id
- `DELETE /api/groq-chat/:chatId` — delete a chat

### Documents
- `POST /api/documents/upload` — upload a PDF
- `GET /api/documents` — list uploaded documents
- `DELETE /api/documents/:id` — delete a document

### Search (Vector only)
- `POST /api/chat/search` — vector search only (no LLM)

---

## Environment Variables

### Backend (`backend/.env`)

Create from the template:

```bash
cd backend
cp .env.example .env
```

Common variables:

```env
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://...

# If auth is enabled
JWT_SECRET=change_me

# Optional / depending on your configuration
EMBEDDING_PROVIDER=simple
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env
```

Common variables:

```env
VITE_API_URL=http://localhost:5000

# If auth is enabled
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Local Setup

### 1) Clone

```bash
git clone https://github.com/anandsagar2807/ZaalimaOpsMind-Ai.git
cd ZaalimaOpsMind-Ai
```

### 2) Start the backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

### 3) Start the frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

---

## Usage

1. Open the frontend (Vite prints the URL in your terminal, often `http://localhost:5173`)
2. Upload one or more PDF documents
3. Go to the **Chat** page
4. Ask questions based on the uploaded documents

---

## Hallucination Control (Context-only Policy)

OpsMind AI is designed to answer **only from retrieved document context**.

Example system policy:

```text
You are OpsMind AI, a corporate knowledge assistant.

CRITICAL RULES:
1. You must ONLY answer using the provided SOP context.
2. If the answer is NOT in the context, respond EXACTLY with:
   "I don't know based on available company SOPs."
3. Do NOT make up information.
4. Include source citations in the answer when possible.
5. Be concise and professional.
```

Recommended inference settings:
- Temperature: `0.1`
- Model: `llama3-70b-8192`

---

## Security Notes

If you deploy this in a real organization:

- Require authentication before upload/chat
- Enforce authorization (documents/chats per user/tenant)
- Add rate limiting on inference endpoints
- Validate inputs (especially file uploads)
- Never commit `.env` files; use a secrets manager in production

---

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd ../frontend
npm test
```

If `TEST_INSTRUCTIONS.md` exists in the repo root, follow it for additional testing guidance.

---

## Production Deployment

### Backend

```bash
cd backend
npm run build
NODE_ENV=production npm start
```

### Frontend

```bash
cd frontend
npm run build
# Deploy dist/ to your hosting provider
```

Production checklist:
- Use a production MongoDB cluster
- Enable HTTPS
- Lock down CORS
- Use a strong `JWT_SECRET`

---

## Troubleshooting

### Frontend can’t reach backend
- Check `VITE_API_URL` in `frontend/.env`
- Confirm backend port and API base path (e.g., `/api`)

### Uploads failing
- Check upload size limits and storage config
- Confirm PDF parsing dependencies are installed

### Answers are often “I don’t know…”
- Increase Top-K
- Improve chunk size/overlap strategy
- Confirm embeddings are being generated and stored correctly

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to your branch
5. Open a pull request

---

## License

MIT
