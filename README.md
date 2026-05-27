# OpsMind AI

> Enterprise-grade conversational AI agent for corporate knowledge search with **RAG**, **Groq streaming**, and **context-only / no-hallucination** responses.

OpsMind AI turns internal PDFs (SOPs, policies, runbooks, manuals) into a searchable knowledge base. Users upload documents, the backend extracts + chunks text, generates embeddings, stores them in MongoDB, and answers questions by retrieving the most relevant chunks and sending them to an LLM.

---

## Table of Contents

- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Architecture (RAG Flow)](#architecture-rag-flow)
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

- **RAG Pipeline**: retrieval-augmented generation for grounded answers
- **Document Ingestion**: upload PDFs, extract text, chunk, and embed
- **MongoDB Vector Store**: store embeddings + chunk metadata for similarity search
- **Groq LLM Integration**: fast inference + **streaming** responses (SSE)
- **Source Citations**: responses can include document references (doc/page/chunk)
- **Chat History**: persist conversations for later review
- **Admin-friendly UI**: modern React dashboard for document & chat workflows

> Note: The repository also contains backend support for **JWT-based auth** (see `backend/README.md`). If you enable/extend auth, ensure document access is isolated per user/tenant.

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
└── README.md                # (You are here)
```

---

## Architecture (RAG Flow)

```text
┌─────────────┐
│  PDF Upload │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Extract +  │
│  Chunk Text │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Embeddings  │  (embedding provider)
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ MongoDB Vector Store │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Similarity Search     │ (Top-K + threshold)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Context Builder       │ (prompt + citations)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Groq LLM (Streaming)  │ (SSE)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Answer + Citations    │
└──────────────────────┘
```

---

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- PDF parsing (`pdf-parse`)
- Embeddings + vector storage
- Groq SDK / Groq API for LLM responses
- Auth & security (JWT, middleware, rate limiting, headers) *(see backend docs)*

### Frontend
- React 18 + Vite
- TailwindCSS
- React Router
- Zustand
- Axios

---

## API Endpoints (Quick Reference)

> Endpoints may vary by backend version. For full details, check backend routes and any API documentation in the repo.

### Chat (RAG)
- `POST /api/groq-chat/ask` — non-streaming answer
- `POST /api/groq-chat/ask/stream` — streaming (SSE)
- `GET /api/groq-chat/history` — chat history
- `GET /api/groq-chat/:chatId` — get chat by id
- `DELETE /api/groq-chat/:chatId` — delete chat

### Documents
- `POST /api/documents/upload` — upload PDF
- `GET /api/documents` — list documents
- `DELETE /api/documents/:id` — delete document

### Search
- `POST /api/chat/search` — vector search only (no LLM)

---

## Environment Variables

### Backend (`backend/.env`)

Create from the template:

```bash
cd backend
cp .env.example .env
```

Typical variables (examples):

```env
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://...
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

Typical variables:

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

### 2) Start backend

```bash
cd backend
cp .env.example .env
npm install
npm start
```

### 3) Start frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

---

## Usage

1. Open the frontend (default Vite URL shown in your terminal, often `http://localhost:5173`)
2. Upload one or more PDF documents
3. Go to the Chat page
4. Ask questions grounded in the uploaded documents

---

## Hallucination Control (Context-only Policy)

OpsMind AI is designed to answer **only from retrieved document context**.

A typical system-policy used in the project is:

```text
You are OpsMind AI, a corporate knowledge assistant.

CRITICAL RULES:
1. You must ONLY answer using the provided SOP context
2. If the answer is NOT in the context, respond EXACTLY with:
   "I don't know based on available company SOPs."
3. Do NOT make up information or hallucinate facts
4. ALWAYS include source citations: (Source: Document Name, Page Number)
5. Be concise and professional
```

Recommended inference parameters (typical):
- Temperature: `0.1`
- Model: `llama3-70b-8192`

---

## Security Notes

If you run OpsMind AI in a real organization:

- **Authentication**: enforce login before document upload/chat
- **Authorization**: isolate documents/chats per user or tenant
- **Rate limiting**: protect inference endpoints
- **Input validation**: especially around uploads
- **Secrets**: never commit `.env` files; use a secrets manager in production

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

**Frontend can’t reach backend**
- Check `VITE_API_URL` in `frontend/.env`
- Confirm backend port and base path (`/api` vs no prefix)

**Uploads failing**
- Check backend upload limits and storage config
- Confirm PDF parsing dependencies installed

**No relevant answers / “I don’t know…” too often**
- Increase Top-K
- Improve chunking strategy
- Verify embeddings are generated and stored correctly

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
