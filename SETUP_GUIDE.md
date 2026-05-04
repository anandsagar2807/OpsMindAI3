# OpsMind AI - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Groq API key (get from https://console.groq.com)
- Clerk account for authentication (get from https://clerk.com)

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opsmind
JWT_SECRET=your_random_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret
EMBEDDING_PROVIDER=simple
```

Start backend:
```bash
npm start
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
```

Start frontend:
```bash
npm run dev
```

Frontend runs on: http://localhost:5173

### 3. Get API Keys

#### Groq API Key
1. Go to https://console.groq.com
2. Sign up / Log in
3. Navigate to API Keys
4. Create new API key
5. Copy and paste into backend `.env` as `GROQ_API_KEY`

#### Clerk Keys
1. Go to https://clerk.com
2. Create account and new application
3. Copy Publishable Key → both `.env` files
4. Copy Secret Key → backend `.env` only

#### MongoDB URI
1. Go to https://cloud.mongodb.com
2. Create free cluster
3. Create database user
4. Get connection string
5. Replace `<password>` with your password
6. Add to backend `.env` as `MONGODB_URI`

### 4. Test the System

1. Open http://localhost:5173
2. Sign up / Log in
3. Upload a PDF document (Upload page)
4. Wait for processing
5. Go to Chat page
6. Ask questions about your document

### 5. Test Hallucination Control

**Valid Question (should answer):**
```
Q: "What is mentioned in the document about refunds?"
A: [Answer with citation from document]
```

**Invalid Question (should refuse):**
```
Q: "What's the weather today?"
A: "I don't know based on available company SOPs."
```

## API Endpoints

### Chat Endpoints
- `POST /api/groq-chat/ask` - Non-streaming chat
- `POST /api/groq-chat/ask/stream` - Streaming chat (SSE)
- `GET /api/groq-chat/history` - Get chat history
- `GET /api/groq-chat/:chatId` - Get specific chat
- `DELETE /api/groq-chat/:chatId` - Delete chat

### Document Endpoints
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Search Endpoint
- `POST /api/chat/search` - Vector search only (no LLM)

## Architecture

```
User Question
    ↓
Generate Embedding (Simple Embedding Service)
    ↓
Vector Search MongoDB (Top 5 chunks, similarity > 0.3)
    ↓
Build Context Window (with document names & page numbers)
    ↓
Send to Groq API (llama3-70b-8192)
    ↓
Stream Response (SSE)
    ↓
Display with Source Citations
```

## Features

✅ **RAG Pipeline**
- PDF upload & chunking
- Vector embeddings
- Semantic search
- Context optimization

✅ **Groq Integration**
- Streaming responses
- llama3-70b-8192 model
- Rate limit handling
- Error recovery

✅ **Hallucination Prevention**
- Strict system prompt
- Context-only responses
- Low temperature (0.1)
- Explicit "I don't know" fallback

✅ **Source Citations**
- Document name + page number
- Automatic citation format
- Source panel in UI

✅ **Chat Features**
- Persistent chat history
- Multi-turn conversations
- Stop generation
- Retry responses
- Delete chats

✅ **UI/UX**
- ChatGPT-style interface
- Real-time streaming
- Sidebar chat history
- Source display
- Responsive design

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables
- Check port 5000 is available

### Frontend won't connect
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Check CORS settings in backend

### No search results
- Upload documents first
- Check documents are processed
- Verify embeddings are stored in MongoDB

### Groq API errors
- Verify API key is correct
- Check rate limits
- Try fallback model (mixtral-8x7b-32768)

### Chat not streaming
- Check browser supports SSE
- Verify Content-Type: text/event-stream
- Check network tab for errors

## Production Deployment

### Environment Variables
- Set `NODE_ENV=production`
- Use production MongoDB cluster
- Add production frontend URL to CORS
- Use strong JWT_SECRET

### Security
- Enable rate limiting
- Use HTTPS
- Secure API keys
- Implement proper authentication

### Monitoring
- Monitor Groq API usage
- Track response times
- Log errors
- Monitor MongoDB performance

## Next Steps

1. ✅ Upload test documents
2. ✅ Test chat functionality
3. ✅ Verify source citations
4. ✅ Test hallucination control
5. ⏳ Add conversation memory (multi-turn context)
6. ⏳ Implement feedback system
7. ⏳ Add analytics dashboard
8. ⏳ Deploy to production

## Support

For issues or questions:
- Check GROQ_CHAT_IMPLEMENTATION.md for technical details
- Review TROUBLESHOOTING.md for common issues
- Check backend logs for errors
- Verify all API keys are correct
