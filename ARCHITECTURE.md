# OpsMind AI — System Architecture
---
## Overview
OpsMind AI is an enterprise-grade Retrieval-Augmented Generation (RAG) platform for corporate knowledge management. Users upload SOP documents (currently PDF), the backend extracts and chunks text, generates embeddings, stores them in MongoDB, and serves grounded answers via an LLM.

The system combines:
- AI-powered conversational workflows + conversation persistence
- MongoDB-based vector retrieval (embeddings stored per chunk)
- Real-time streaming responses (Server-Sent Events)
- Secure authentication (Clerk in prod, dev-mode bypass available)
- Modular frontend/backend architecture

---

## Repository Layout (current)

- `frontend/` — React + Vite enterprise dashboard UI
- `backend/` — Node.js + Express API server
- `ARCHITECTURE.md` — this document

---

## Core Workflow

### 1) Authentication & User Isolation

**Frontend**
- Uses **Clerk** via `@clerk/react` (wrapped in `ClerkProvider`).
- Includes a **dev auth bypass** (`frontend/src/lib/devAuth.jsx`) when the publishable key is missing/placeholder.

**Backend**
- Protects API routes with `clerkAuthMiddleware` (`backend/src/middleware/clerkAuth.js`).
- In production: `@clerk/express` middleware verifies sessions.
- In development (placeholder/missing secret): a **JWT decode bypass** (`devClerkAuth`) populates `req.auth` from the Bearer token payload (signature not verified).

**Isolation**
- All document chunks are associated with a `userId`, and vector retrieval filters by `userId`.

---

### 2) Document Upload & Processing

**API surface**
- Upload endpoint: `POST /api/documents/upload` (see `backend/src/routes/documentRoutes.js`).
- Status endpoint: `GET /api/documents/:id/status`.

**Processing (high level)**
1. User uploads a PDF from the frontend.
2. Backend receives the file (multipart upload handled via Multer config in backend).
3. PDF text is extracted using `pdf-parse` (`backend/src/services/pdfProcessor.js`).
4. Text is chunked with overlap (`chunkText`) and enriched with page/section heuristics.
5. Embeddings are generated via OpenRouter embeddings API (`backend/src/services/embeddingService.js`).
6. Chunks + embeddings are stored in MongoDB (see `SOPChunk` model usage in `vectorSearchService`).

**Notes on PDF paging**
- `pdf-parse` does not return page-level text; OpsMind uses a heuristic split to estimate page boundaries and page numbers.

---

### 3) Retrieval-Augmented Generation (RAG)

OpsMind follows a strict **context-grounded** answering approach when relevant chunks are available.

**Query workflow**
1. User submits a question.
2. Backend generates a query embedding (`embeddingService.generateEmbedding`).
3. MongoDB aggregation computes cosine similarity over stored embeddings (`backend/src/services/vectorSearchService.js`).
4. Top-K chunks above a similarity threshold are selected.
5. A context string is built with explicit source headers (document name, page, section, similarity).
6. The context + question is sent to the LLM via OpenRouter (`backend/src/services/ragService.js`).
7. A citation service generates structured citations for the response (`generateCitations`).

**Models / Providers (current)**
- **Chat completions**: OpenRouter `OPENROUTER_MODEL` (default: `google/gemini-2.0-flash-001`).
- **Embeddings**: OpenRouter `OPENROUTER_EMBEDDING_MODEL` (default: `openai/text-embedding-3-small`).

---

## Vector Search System (MongoDB)

Vector search is implemented directly in MongoDB using an aggregation pipeline:
- Matches only the current user’s chunks (`userId` filter)
- Computes cosine similarity between stored vectors and query vector (dot product + norms)
- Applies a similarity threshold (default `0.3`)
- Sorts and returns Top-K results (default `5`)

This approach keeps the system self-contained (no external vector DB), at the cost of heavier DB-side compute.

---

## Hallucination Prevention Strategy

### Strict “context-only” mode
- System prompt enforces **no guessing** and **no fabrication**.
- If no relevant chunks are retrieved, the assistant replies:
  - `"I don't know based on the uploaded SOP documents."`

### Fallback mode (no embeddings)
If embeddings fail (commonly due to missing OpenRouter credits / embedding availability), the backend enters a **fallback mode**:
- Answers are generated directly from the LLM **without document context**
- Response metadata includes `fallbackMode: true`

This is explicitly documented in `backend/src/services/ragService.js`.

---

## Streaming Response System

OpsMind supports real-time streaming via **Server-Sent Events (SSE)**:
- Endpoint: `POST /api/rag/stream`
- Controller: `streamQuestion` in `backend/src/controllers/ragController.js`

**SSE event types** (JSON payloads in `data:` lines)
- `metadata` — retrieval stats and model info
- `content` — incremental token/content chunks
- `generation_complete` — full answer + citations + timing
- `done` — stream end marker
- `error` — error message

This provides a ChatGPT-style “typing” experience.

---

## Conversation & Chat Persistence

The backend persists conversations/messages (MongoDB):
- Messages include citations and retrieval metadata (`backend/src/models/Message.js`).
- Chat routes are exposed under `/api/chat`.

---

## Security Architecture

### Authentication
- Clerk-based auth in production (frontend + backend)
- Dev-mode bypass available for local development with placeholder keys

### API security controls
- `helmet` for secure headers (with certain policies disabled to avoid breaking CORS/uploads)
- `express-rate-limit` for throttling (`/api/`), with explicit skips for long-running endpoints (uploads/skills)
- `cors` configured with allowlist origins + credentials

---

## Database Architecture (MongoDB)

MongoDB is used for:
- Document metadata
- Chunked text + vector embeddings (`SOPChunk`)
- Conversation history and messages (including citations + retrieval metadata)

User isolation is enforced by filtering chunk retrieval by `userId`.

---

## Frontend Architecture

### Technologies (current)
- React 18 + Vite
- TailwindCSS
- React Router v6
- TanStack React Query (query/mutation + global error handling)
- Zustand (state)
- Axios (API client)
- react-dropzone (uploads)
- react-hot-toast (notifications)

### Responsibilities
- Authentication UI (Clerk in prod; dev-mode auth bypass supported)
- Dashboard layout + pages (documents, upload, settings, analysis)
- Calling backend APIs (Axios client with token injection)

### Environment
- `VITE_API_URL` for backend base URL (prod)
- Dev mode can use Vite proxy by using empty `baseURL` in the API client

---

## Backend Architecture

### Technologies (current)
- Node.js + Express.js
- MongoDB + Mongoose
- Multer for uploads
- pdf-parse for PDF extraction
- OpenRouter APIs
  - `/chat/completions` for responses
  - `/embeddings` for vector generation
- Security: Helmet, CORS, express-rate-limit

### Key modules
- `middleware/clerkAuth.js` — auth (prod) + dev bypass
- `services/pdfProcessor.js` — PDF extraction + chunking
- `services/embeddingService.js` — embedding generation via OpenRouter
- `services/vectorSearchService.js` — MongoDB similarity search
- `services/ragService.js` — prompt + LLM calls + streaming
- `controllers/ragController.js` — standard and streaming endpoints

---

## Configuration & Deployment Notes

### Ports
- Backend default: `PORT=5002`
- Frontend dev server: Vite (typically `5173`/`5174`)

### Important environment variables (backend)
- `OPENROUTER_API_KEY`
- `OPENROUTER_MODEL` (default `google/gemini-2.0-flash-001`)
- `OPENROUTER_EMBEDDING_MODEL` (default `openai/text-embedding-3-small`)
- `CLERK_SECRET_KEY` (prod)
- `FRONTEND_URL` (CORS allowlist)

---

## ✅ System Status (as implemented in repo)

| Component | Status |
|-----------|--------|
| Frontend (React + Vite dashboard) | ✅ Implemented |
| Backend APIs (Express + MongoDB) | ✅ Implemented |
| Authentication (Clerk + dev bypass) | ✅ Implemented |
| Document processing (PDF extract + chunk) | ✅ Implemented |
| Embeddings (OpenRouter embeddings) | ✅ Implemented |
| Vector search (MongoDB aggregation cosine similarity) | ✅ Implemented |
| RAG responses (OpenRouter chat completions) | ✅ Implemented |
| Streaming chat (SSE) | ✅ Implemented |
| Citation metadata persistence | ✅ Implemented |
| Documentation | ✅ Maintained |

---
