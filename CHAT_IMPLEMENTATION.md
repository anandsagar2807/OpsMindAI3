# Chat Implementation with Groq API

## Overview
Successfully integrated Groq API for dynamic chatbot functionality with RAG (Retrieval Augmented Generation) capabilities.

## Backend Implementation

### 1. Dependencies Added
- `groq-sdk` - Official Groq SDK for AI completions

### 2. Files Created

#### `backend/src/services/chatService.js`
- **generateChatResponse()** - Non-streaming chat responses
- **generateStreamingResponse()** - Streaming chat responses
- Uses vector similarity search to find relevant document chunks
- Constructs context from top 5 most relevant chunks
- Sends context + query to Groq's `llama-3.1-70b-versatile` model
- Returns AI response with source citations

#### `backend/src/controllers/chatController.js`
- **chat()** - POST endpoint handler for regular chat
- **chatStream()** - POST endpoint handler for streaming chat (SSE)
- Validates user authentication
- Handles errors gracefully

#### `backend/src/routes/chatRoutes.js`
- `/api/chat/query` - Regular chat endpoint
- `/api/chat/stream` - Streaming chat endpoint
- Both protected with authentication middleware

### 3. Configuration
- Uses `GROQ_API_KEY` from `.env` file
- Model: `llama-3.1-70b-versatile`
- Temperature: 0.7
- Max tokens: 1024

## Frontend Implementation

### Updated `frontend/src/pages/ChatPage.jsx`
- Connected to backend API at `/api/chat/query`
- Sends authenticated requests with JWT token
- Displays AI responses with source citations
- Shows error messages when requests fail
- "New Chat" button to reset conversation
- Real-time typing indicators
- Source document display with page numbers

## How It Works

1. **User sends a query** → Frontend sends POST to `/api/chat/query`
2. **Backend retrieves context** → Searches vector database for relevant chunks
3. **Constructs prompt** → Combines context + user query
4. **Calls Groq API** → Sends to Llama 3.1 70B model
5. **Returns response** → AI answer + source citations
6. **Frontend displays** → Shows response with document sources

## API Endpoints

### POST `/api/chat/query`
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "What is our refund policy?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "Based on your documents...",
    "sources": [
      {
        "documentId": "...",
        "filename": "Employee_Handbook.pdf",
        "pageNumber": 12,
        "similarity": 0.85
      }
    ]
  }
}
```

## Testing

1. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Login** to get authentication token

4. **Upload documents** to create vector embeddings

5. **Use Chat** to ask questions about your documents

## Features

✅ Dynamic AI responses using Groq API
✅ RAG with vector similarity search
✅ Source citations with page numbers
✅ Authentication protected
✅ Error handling
✅ Streaming support (SSE)
✅ Real-time typing indicators
✅ Clean, modern UI

## Environment Variables Required

```env
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMBEDDING_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key (for embeddings)
```
