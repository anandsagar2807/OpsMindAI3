# OpsMind AI - Production RAG Chat System

> Enterprise-grade conversational AI agent with RAG, Groq API streaming, and strict no-hallucination policy

## 🎯 What is OpsMind AI?

OpsMind AI is a context-aware corporate knowledge brain that helps employees find information from company documents instantly. Upload your SOPs, policies, and manuals - then ask questions in natural language.

### Key Features

✅ **RAG Pipeline** - Retrieval-Augmented Generation for accurate answers
✅ **Groq API** - Lightning-fast LLM inference with streaming
✅ **No Hallucinations** - Strict context-only responses
✅ **Source Citations** - Every answer includes document references
✅ **Chat History** - Persistent conversations with full context
✅ **Real-time Streaming** - ChatGPT-style typing effect
✅ **Enterprise Auth** - Clerk authentication with user isolation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Groq API key ([Get one free](https://console.groq.com))
- Clerk account ([Get one free](https://clerk.com))

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd OpsMind-Ai

# Backend setup
cd backend
cp .env.example .env
# Edit .env with your API keys
npm install
npm start

# Frontend setup (new terminal)
cd frontend
cp .env.example .env
# Edit .env with your API keys
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
GROQ_API_KEY=gsk_your_key_here
MONGODB_URI=mongodb+srv://...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
JWT_SECRET=random_secret_string
EMBEDDING_PROVIDER=simple
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Usage

1. Open http://localhost:5173
2. Sign up / Log in
3. Upload PDF documents
4. Navigate to Chat page
5. Ask questions about your documents

## 📚 Documentation

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Complete setup instructions
- **[TEST_INSTRUCTIONS.md](TEST_INSTRUCTIONS.md)** - Testing guide
- **[GROQ_CHAT_IMPLEMENTATION.md](GROQ_CHAT_IMPLEMENTATION.md)** - Technical details
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Feature overview

## 🏗️ Architecture

```
┌─────────────┐
│  PDF Upload │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Chunking   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Embeddings  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ MongoDB Vector Store│
└──────────┬──────────┘
           │
    ┌──────▼──────┐
    │ User Query  │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │Vector Search│ (Top 5, similarity > 0.3)
    └──────┬──────┘
           │
           ▼
    ┌──────────────┐
    │Context Builder│
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │  Groq API    │ (llama3-70b-8192)
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │   Streaming  │
    │   Response   │
    │ + Citations  │
    └──────────────┘
```

## 🔌 API Endpoints

### Chat
- `POST /api/groq-chat/ask` - Non-streaming chat
- `POST /api/groq-chat/ask/stream` - Streaming chat (SSE)
- `GET /api/groq-chat/history` - Get chat history
- `GET /api/groq-chat/:chatId` - Get specific chat
- `DELETE /api/groq-chat/:chatId` - Delete chat

### Documents
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Search
- `POST /api/chat/search` - Vector search (no LLM)

## 🚫 Hallucination Control

OpsMind AI uses a strict system prompt to prevent hallucinations:

```
You are OpsMind AI, a corporate knowledge assistant.

CRITICAL RULES:
1. You must ONLY answer using the provided SOP context
2. If the answer is NOT in the context, respond EXACTLY with:
   "I don't know based on available company SOPs."
3. Do NOT make up information or hallucinate facts
4. ALWAYS include source citations: (Source: Document Name, Page Number)
5. Be concise and professional
```

**Parameters:**
- Temperature: 0.1 (low randomness)
- Model: llama3-70b-8192
- Top-p: 0.9
- Max tokens: 2048

## 📊 Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Groq SDK (LLM)
- Clerk (Auth)
- PDF-Parse (Document processing)

### Frontend
- React 18
- Vite
- TailwindCSS
- Axios
- React Router
- Lucide Icons

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

See [TEST_INSTRUCTIONS.md](TEST_INSTRUCTIONS.md) for detailed testing guide.

## 📈 Performance

- **Document Upload**: < 30s for 10-page PDF
- **First Response**: < 3s
- **Streaming**: Real-time (no lag)
- **Vector Search**: < 500ms
- **Chat History Load**: < 1s

## 🔒 Security

- ✅ Clerk authentication
- ✅ User data isolation
- ✅ Rate limiting
- ✅ Input validation
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ JWT tokens

## 🛠️ Development

```bash
# Backend dev mode (auto-reload)
cd backend
npm run dev

# Frontend dev mode (hot reload)
cd frontend
npm run dev
```

## 📦 Production Deployment

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
# Deploy dist/ folder to hosting service
```

### Environment
- Set `NODE_ENV=production`
- Use production MongoDB cluster
- Enable HTTPS
- Configure production CORS
- Use strong JWT_SECRET

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT License - see LICENSE file for details

## 🎉 Acknowledgments

- Groq for lightning-fast LLM inference
- Clerk for seamless authentication
- MongoDB Atlas for vector storage
- Anthropic Claude for development assistance
- ---


---

# 📌 Development Progress Timeline

## 🚀 Week 1 — Project Initialization & System Planning

- Established project architecture and overall development roadmap  
- Initialized frontend and backend repositories with modular folder structure  
- Conducted requirement analysis for enterprise-grade AI knowledge assistant  
- Reviewed RAG-based workflow implementation strategy  
- Planned authentication, vector search, and document-processing pipeline  
- Created collaborative GitHub workflow for team development  

---

## ⚙️ Week 2 — Backend & AI Workflow Foundation

- Implemented backend service structure using Node.js and Express.js  
- Configured API routing and middleware architecture  
- Initiated AI integration workflow using Groq API and LLM-based processing  
- Started Retrieval-Augmented Generation (RAG) pipeline implementation  
- Improved frontend-backend communication flow  
- Performed initial testing and validation of core modules  

---

## 🧠 Week 3 — RAG System Integration & Authentication

- Integrated Groq-powered streaming chat responses  
- Implemented vector-search-based contextual retrieval workflow  
- Added Clerk authentication and protected route handling  
- Enhanced document-processing and embedding pipeline  
- Optimized response generation flow with hallucination-control strategy  
- Conducted debugging, workflow verification, and integration testing  

---

## ✅ Week 4 — System Optimization & Finalization

- Completed end-to-end frontend and backend integration  
- Optimized overall application workflow and response handling  
- Improved platform stability, performance, and usability  
- Finalized AI chat workflow and document-query pipeline  
- Refined documentation and project structure for deployment readiness  
- Performed final system testing, verification, and review preparation  

---

# 🏗️ Team Contributions

### Anand
- Frontend development and UI implementation  
- System integration and workflow connectivity  
- Interface refinement and responsiveness improvements  

### Stephen
- Backend architecture and API development  
- Groq API integration and RAG workflow implementation  
- AI response pipeline and system logic management  

### Tanishka
- Technical documentation and README management  
- Workflow verification and system testing  
- Progress tracking, project coordination, and implementation review  
- Validation of frontend-backend-AI integration flow  

### Sudharshan
- Assisted in testing and general project support  

---

# 📈 Current Project Status

| Module | Status |
|--------|--------|
| Frontend Development | ✅ Completed |
| Backend APIs | ✅ Completed |
| Authentication System | ✅ Completed |
| RAG Pipeline | ✅ Completed |
| AI Integration | ✅ Completed |
| Vector Search Workflow | ✅ Completed |
| Documentation | ✅ Updated |
| Testing & Validation | ✅ Completed |

---

---

**Built with ❤️ for enterprise knowledge management**
