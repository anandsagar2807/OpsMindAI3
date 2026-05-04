# Testing Instructions for OpsMind AI

## Prerequisites Check

Before testing, ensure you have:
- [x] Node.js 18+ installed
- [x] MongoDB Atlas account or local MongoDB
- [ ] Groq API key from https://console.groq.com
- [ ] Clerk account from https://clerk.com

## Step 1: Get API Keys

### Groq API Key (Required)
1. Visit https://console.groq.com
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the key (starts with `gsk_`)

### Clerk Keys (Required)
1. Visit https://clerk.com
2. Create account and new application
3. Copy "Publishable Key" (starts with `pk_test_`)
4. Copy "Secret Key" (starts with `sk_test_`)

### MongoDB URI (Required)
1. Visit https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user with password
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your actual password

## Step 2: Backend Setup

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env file with your keys
# Required fields:
# - GROQ_API_KEY=gsk_your_key_here
# - MONGODB_URI=mongodb+srv://...
# - CLERK_PUBLISHABLE_KEY=pk_test_...
# - CLERK_SECRET_KEY=sk_test_...
# - JWT_SECRET=any_random_string

# Install dependencies (if not done)
npm install

# Start backend
npm start
```

Expected output:
```
🚀 OpsMind AI Backend running on port 5000
📝 Environment: development
🔐 Embedding Provider: simple
```

## Step 3: Frontend Setup

```bash
# Open new terminal
cd frontend

# Copy environment template
cp .env.example .env

# Edit .env file
# Required fields:
# - VITE_API_URL=http://localhost:5000
# - VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Install dependencies (if not done)
npm install

# Start frontend
npm run dev
```

Expected output:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## Step 4: Test Authentication

1. Open browser: http://localhost:5173
2. Click "Sign Up" or "Get Started"
3. Create account with email
4. Verify email if required
5. Should redirect to dashboard

## Step 5: Test Document Upload

1. Navigate to "Upload" page
2. Click "Choose File" or drag & drop
3. Select a PDF file (test with any PDF)
4. Click "Upload"
5. Wait for processing (should see progress)
6. Check "Documents" page to verify upload

Expected: Document appears in list with status "Processed"

## Step 6: Test Chat (Main Feature)

1. Navigate to "Chat" page
2. You should see:
   - Empty chat area with "Start a Conversation"
   - Sidebar with "New Chat" button
   - Input box at bottom

3. Type a question about your uploaded document
   Example: "What is this document about?"

4. Click "Send" or press Enter

5. Verify:
   - [x] Message appears on right (blue)
   - [x] AI response streams in on left (white)
   - [x] Typing indicator shows while streaming
   - [x] Sources panel appears below with document name + page
   - [x] Chat appears in sidebar history

## Step 7: Test Hallucination Control

### Test 1: Valid Question
```
Question: "What topics are covered in the document?"
Expected: Answer based on document content with citation
Format: "The document covers... (Source: filename.pdf, Page X)"
```

### Test 2: Invalid Question (No Context)
```
Question: "What's the weather today?"
Expected: "I don't know based on available company SOPs."
```

### Test 3: Unrelated Question
```
Question: "Who won the World Cup?"
Expected: "I don't know based on available company SOPs."
```

## Step 8: Test Chat Features

### Stop Generation
1. Ask a long question
2. While streaming, click "Stop" button
3. Verify: Streaming stops immediately

### Retry
1. After a response, click "Retry" button (circular arrow)
2. Verify: Last message removed, input populated with question

### New Chat
1. Click "New Chat" in sidebar
2. Verify: Chat area clears, ready for new conversation

### Load Previous Chat
1. Click on a chat in sidebar history
2. Verify: Full conversation loads

### Delete Chat
1. Hover over chat in sidebar
2. Click trash icon
3. Verify: Chat removed from history

## Step 9: Verify Source Citations

Every AI response should include:
```
Answer text here...
(Source: Document Name, Page Number)
```

And sources panel should show:
```
📄 Sources Used
├─ document.pdf • Page 5
└─ document.pdf • Page 12
```

## Step 10: Test Error Handling

### No Documents
1. Delete all documents
2. Ask a question in chat
3. Expected: "I don't have any documents in your knowledge base yet..."

### Invalid API Key
1. Set wrong GROQ_API_KEY in backend .env
2. Restart backend
3. Try to chat
4. Expected: Error message displayed

### Network Error
1. Stop backend server
2. Try to send message
3. Expected: "Failed to get response" error

## Common Issues & Solutions

### Backend won't start
- Check all environment variables are set
- Verify MongoDB connection string is correct
- Ensure port 5000 is not in use

### Frontend can't connect
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Check browser console for CORS errors

### No search results
- Ensure documents are uploaded and processed
- Check MongoDB has vectors collection
- Verify embeddings were generated

### Groq API errors
- Verify API key is correct (starts with gsk_)
- Check rate limits (free tier has limits)
- Try again after a few seconds

### Chat not streaming
- Check browser supports EventSource (SSE)
- Verify Content-Type: text/event-stream in network tab
- Check backend logs for errors

## Success Criteria

✅ Backend starts without errors
✅ Frontend loads and connects to backend
✅ User can sign up/login
✅ Documents can be uploaded and processed
✅ Chat interface loads correctly
✅ Questions get streamed responses
✅ Source citations appear
✅ Invalid questions return "I don't know" response
✅ Chat history persists
✅ All chat features work (stop, retry, delete)

## Performance Benchmarks

- Document upload: < 30 seconds for 10-page PDF
- First response: < 3 seconds
- Streaming: Real-time (no lag)
- Vector search: < 500ms
- Chat history load: < 1 second

## Next Steps After Testing

1. Upload real company SOPs
2. Test with actual business questions
3. Monitor hallucination rate
4. Gather user feedback
5. Adjust similarity threshold if needed
6. Consider adding conversation memory

## Support

If you encounter issues:
1. Check backend logs in terminal
2. Check browser console (F12)
3. Verify all API keys are correct
4. Review TROUBLESHOOTING.md
5. Check GROQ_CHAT_IMPLEMENTATION.md for technical details
