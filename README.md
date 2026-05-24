# OpsMind AI — Enterprise SOP RAG Platform

AI-powered enterprise SOP (Standard Operating Procedure) assistant with Retrieval-Augmented Generation, hallucination prevention, source citations, and real-time streaming.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Vite + React 18)                             │
│  ├── /              → Enterprise Landing Page            │
│  ├── /agent         → AI Agent (Clerk Auth Required)     │
│  │   ├── Sidebar    → Chat history, search, rename       │
│  │   ├── Upload     → Drag-and-drop PDF upload           │
│  │   ├── Chat       → Streaming RAG chat with citations  │
│  │   ├── Sources    → Source inspector (Sheet panel)      │
│  │   └── Activity   → RAG pipeline visualization         │
│  └── Clerk Auth     → Sign-in, Sign-up, User Profile     │
├─────────────────────────────────────────────────────────┤
│  Backend (Express + MongoDB)                            │
│  ├── /api/public     → Health check, public stats        │
│  ├── /api/documents  → Upload, CRUD, status tracking     │
│  ├── /api/chat       → Conversation CRUD                 │
│  └── /api/rag        → Ask, Stream (SSE), Search         │
│       ├── PDF Parse   → pdf-parse + chunking              │
│       ├── Embeddings  → Gemini embedding-001              │
│       ├── Vector Search → MongoDB cosine similarity       │
│       ├── LLM         → Groq llama-3.3-70b-versatile     │
│       └── Citations   → Source snippets + similarity      │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vite 5, React 18, React Router v6, TailwindCSS, Framer Motion |
| **Auth** | Clerk (`@clerk/react` + `@clerk/express`) with dev-mode JWT bypass |
| **State** | Zustand (client), @tanstack/react-query (server) |
| **Backend** | Express.js, MongoDB + Mongoose, Multer (PDF upload) |
| **LLM** | Groq SDK (llama-3.3-70b-versatile) |
| **Embeddings** | Google Generative AI (embedding-001) |
| **Vector Search** | MongoDB aggregation pipeline (cosine similarity) |
| **Streaming** | SSE (Server-Sent Events) with async generators |
| **PDF Processing** | pdf-parse + custom chunking (1000 chars, 100 overlap) |

## Quick Start

### 1. Configure API Keys

Edit `backend/.env`:

```env
PORT=5002
MONGODB_URI=mongodb+srv://your-connection-string
CLERK_SECRET_KEY=your-clerk-secret-key
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=your-gemini-api-key
FRONTEND_URL=http://localhost:5173
```

Edit `frontend/.env.frontend`:

```env
VITE_API_URL=http://localhost:5173
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

### 2. Install Dependencies

```bash
cd backend && npm install
cd frontend && npm install
```

### 3. Start Development

**Backend:**
```bash
cd backend && npm run dev
```

**Frontend:**
```bash
cd frontend && npm run dev
```

Or use the convenience scripts:
```bash
# Windows
start.bat

# Linux/Mac
chmod +x start.sh && ./start.sh
```

### 4. Dev Mode (No Clerk Keys)

If `CLERK_SECRET_KEY` is a placeholder, the backend automatically switches to **development mode** with JWT decode bypass. Any Clerk token will be accepted without signature verification.

## API Endpoints

### Public
- `GET /api/public/health` — Server health + DB status
- `GET /api/public/stats` — Platform statistics

### Documents (Auth Required)
- `POST /api/documents/upload` — Upload PDF (background processing)
- `GET /api/documents` — List user's documents
- `GET /api/documents/:id` — Get document details
- `GET /api/documents/:id/status` — Processing progress
- `DELETE /api/documents/:id` — Delete document + chunks

### Chat (Auth Required)
- `POST /api/chat` — Create conversation
- `GET /api/chat` — List conversations
- `GET /api/chat/:id` — Get conversation + messages
- `PATCH /api/chat/:id` — Update title/archive
- `DELETE /api/chat/:id` — Delete conversation

### RAG (Auth Required)
- `POST /api/rag/ask` — Ask question (non-streaming)
- `POST /api/rag/stream` — Ask question (SSE streaming)
- `GET /api/rag/search` — Search documents

## RAG Pipeline

1. **Query** → User submits question
2. **Embed** → Gemini embedding-001 converts query to vector
3. **Search** → MongoDB aggregation computes cosine similarity against SOPChunk embeddings
4. **Rank** → Top-K results filtered by similarity threshold (≥0.3)
5. **Generate** → Groq LLM generates answer with strict context-only rule
6. **Cite** → Citation service extracts snippets with source metadata
7. **Stream** → SSE delivers metadata → content chunks → completion → done

## Hallucination Prevention

- LLM is instructed to **ONLY** answer from provided context chunks
- If context doesn't contain relevant info → "I don't know based on the uploaded SOP documents"
- Every answer includes source citations with document name, page, section
- Similarity scores displayed for each citation (High ≥0.8, Good ≥0.6, Moderate ≥0.4, Low ≥0.3)

## Project Structure

```
backend/
  src/
    server.js              # Express app + routes + middleware
    config/
      database.js          # MongoDB connection
      multer.js            # PDF upload config
    middleware/
      clerkAuth.js         # Clerk auth (dev-mode bypass)
      errorHandler.js      # Global error handler
      rbac.js              # Role-based access + user sync
    models/
      User.js              # Clerk user sync
      Organization.js      # Multi-tenant orgs
      Document.js          # Uploaded documents
      SOPChunk.js          # Text chunks + embeddings
      Conversation.js      # Chat conversations
      Message.js           # Chat messages + citations
      UploadLog.js         # Upload processing logs
    services/
      pdfProcessor.js      # PDF extraction + chunking
      embeddingService.js  # Gemini embeddings
      vectorSearchService.js # MongoDB cosine similarity
      ragService.js        # RAG orchestration + Groq LLM
      citationService.js   # Citation generation
      chatService.js       # Conversation CRUD
    controllers/
      documentController.js
      chatController.js
      ragController.js
    routes/
      documentRoutes.js
      chatRoutes.js
      ragRoutes.js
      publicRoutes.js

frontend/
  src/
    App.jsx                # Routes: / → Home, /agent → Agent
    main.jsx               # ClerkProvider + QueryClientProvider
    index.css              # Enterprise design system
    services/
      api.js               # Axios + SSE streaming client
    store/
      chatStore.js         # Chat state (Zustand)
      uploadStore.js       # Upload state (Zustand)
      uiStore.js           # UI state (Zustand)
    hooks/
      useChat.js           # React Query: conversations
      useDocuments.js      # React Query: documents + upload
      useRAG.js            # React Query: ask/stream/search
    components/
      Header.jsx           # Sticky navbar with Clerk auth
      PrivateRoute.jsx     # Auth guard wrapper
      ui/
        Button.jsx         # Enterprise button
        Card.jsx           # Enterprise card
        Sheet.jsx          # Slide-in panel (Framer Motion)
        ScrollArea.jsx     # Auto-scroll container
        Dialog.jsx         # Modal dialog
      agent/
        AgentSidebar.jsx   # Chat history sidebar
        UploadPanel.jsx    # Drag-and-drop PDF upload
        ChatPanel.jsx      # Streaming chat interface
        CitationDisplay.jsx # Citations with similarity scores
        SourceInspector.jsx # Source detail viewer (Sheet)
        RetrievalActivityPanel.jsx # RAG pipeline visualization
    pages/
      EnterpriseLandingPage.jsx # Home page (public)
      AgentPage.jsx        # AI Agent page (authenticated)
```

## Required API Keys

| Key | Source | Purpose |
|-----|--------|---------|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) | Chat completions (llama-3.3-70b) |
| `GEMINI_API_KEY` | [aistudio.google.com](https://aistudio.google.com) | Embeddings (embedding-001) |
| `CLERK_SECRET_KEY` | [clerk.com](https://dashboard.clerk.com) | Backend auth verification |
| `VITE_CLERK_PUBLISHABLE_KEY` | [clerk.com](https://dashboard.clerk.com) | Frontend auth components |
| `MONGODB_URI` | [mongodb.com](https://www.mongodb.com) | Database connection |

## License

Private — Enterprise Use Only
