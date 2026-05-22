# Week 2 - Command Reference Guide

## 🚀 Quick Commands

### Start Development Environment

```bash
# Start Backend (Terminal 1)
cd backend
npm run dev

# Start Frontend (Terminal 2)
cd frontend
npm run dev

# Access Application
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```


### Test APIs with cURL

```bash
# 1. Get your Clerk token
# Open browser → DevTools → Application → Local Storage → Copy token

# 2. Set token variable
export TOKEN="your_clerk_token_here"

# 3. Test Search API
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "How do I process a refund?"}'

# 4. Test Chat API
curl -X POST http://127.0.0.1:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "What is our refund policy?"}'

# 5. Test Health Endpoint (No auth required)
curl http://127.0.0.1:5000/health
```

### Run Automated Tests

```bash
# Install node-fetch if needed
npm install node-fetch

# Run test script
node test-search-api.js YOUR_CLERK_TOKEN
```

### Check Backend Logs

```bash
# View real-time logs
cd backend
npm run dev

# Look for:
# ✅ "OpsMind AI Backend running on port 5000"
# ✅ "MongoDB connected successfully"
# ✅ "Embedding Provider: simple"
```

### Verify Database

```bash
# Connect to MongoDB Atlas
# Check collections:
# - documents (uploaded PDFs)
# - vectors (embeddings with userId)
# - users (if using custom auth)

# Verify indexes on vectors collection:
# - { userId: 1, documentId: 1 }
# - { documentId: 1, chunkIndex: 1 }
# - { documentId: 1, pageNumber: 1 }
```

---

## 📝 Common Tasks

### Upload a Document

```bash
# Via UI: Navigate to Upload page

# Via API:
curl -X POST http://127.0.0.1:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "name=Refund Policy"
```

### Search Documents

```bash
# Search Mode (Vector Search)
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "How do I process a refund?"
  }'

# Expected Response:
# {
#   "success": true,
#   "message": "Found 5 relevant chunks from 2 documents",
#   "data": {
#     "results": [...],
#     "context": {...},
#     "metadata": {...}
#   }
# }
```

### Chat with AI

```bash
# Chat Mode (AI Response)
curl -X POST http://127.0.0.1:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "query": "What is our refund policy?"
  }'

# Expected Response:
# {
#   "success": true,
#   "data": {
#     "response": "Based on your company's refund policy...",
#     "sources": [...]
#   }
# }
```

### List Documents

```bash
curl -X GET "http://127.0.0.1:5000/api/documents?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

### Delete Document

```bash
curl -X DELETE http://127.0.0.1:5000/api/documents/DOCUMENT_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🐛 Troubleshooting Commands

### Check if Backend is Running

```bash
curl http://127.0.0.1:5000/health

# Expected:
# {
#   "success": true,
#   "message": "OpsMind AI Backend is running",
#   "timestamp": "2026-05-04T09:50:36.337Z"
# }
```

### Check MongoDB Connection

```bash
# In backend terminal, look for:
# "✅ MongoDB connected successfully"

# If connection fails:
# - Verify MONGODB_URI in .env
# - Check MongoDB Atlas IP whitelist
# - Verify network connectivity
```

### Check Clerk Authentication

```bash
# Test with invalid token
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{"query": "test"}'

# Expected: 401 Unauthorized
```

### View Vector Count

```bash
# Connect to MongoDB and run:
db.vectors.countDocuments({ userId: "YOUR_USER_ID" })

# Or via API (if endpoint exists):
curl -X GET http://127.0.0.1:5000/api/documents/DOCUMENT_ID/vectors \
  -H "Authorization: Bearer $TOKEN"
```

### Clear Browser Cache

```bash
# Chrome/Edge
# Press: Ctrl + Shift + Delete
# Select: Cached images and files
# Click: Clear data

# Or in DevTools:
# Right-click refresh button → Empty Cache and Hard Reload
```

---

## 🔧 Configuration Commands

### Update Environment Variables

```bash
# Backend
cd backend
nano .env  # or use your preferred editor

# Frontend
cd frontend
nano .env
```

### Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install

# Both (from root)
npm install --prefix backend && npm install --prefix frontend
```

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update specific package
npm update package-name

# Update all
npm update
```

---

## 📊 Monitoring Commands

### Check API Response Time

```bash
# Using time command
time curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "test"}'

# Target: < 500ms
```

### Monitor Backend Performance

```bash
# In backend terminal, watch for:
# - Request processing time
# - MongoDB query time
# - Embedding generation time
# - LLM response time
```

### Check Memory Usage

```bash
# Node.js process
ps aux | grep node

# Or use htop/top
htop
```

---

## 🧪 Testing Commands

### Test Refund Policy Search

```bash
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "How do I process a refund?"}'
```

### Test Leave Policy Search

```bash
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "How do I request leave?"}'
```

### Test Escalation Matrix Search

```bash
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "What is the escalation matrix?"}'
```

### Test Hallucination Prevention

```bash
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "What is the weather today?"}'

# Expected: "No relevant policy found"
```

---

## 📦 Deployment Commands

### Build Frontend for Production

```bash
cd frontend
npm run build

# Output: dist/ folder
# Deploy dist/ to your hosting service
```

### Start Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

### Environment Variables for Production

```bash
# Backend .env
MONGODB_URI=mongodb+srv://production-cluster...
CLERK_SECRET_KEY=sk_live_...
GROQ_API_KEY=gsk_...
EMBEDDING_PROVIDER=simple
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Frontend .env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://api.your-domain.com/api
```

---

## 🔐 Security Commands

### Generate New API Keys

```bash
# Clerk: https://dashboard.clerk.com
# Groq: https://console.groq.com

# After generating, update .env files
```

### Rotate Secrets

```bash
# 1. Generate new keys
# 2. Update .env files
# 3. Restart services
# 4. Verify functionality
# 5. Revoke old keys
```

---

## 📈 Performance Optimization

### Check Bundle Size

```bash
cd frontend
npm run build
ls -lh dist/assets/*.js

# Optimize if needed:
# - Code splitting
# - Lazy loading
# - Tree shaking
```

### Analyze Backend Performance

```bash
# Add timing logs in code:
console.time('vector-search');
// ... search code
console.timeEnd('vector-search');
```

---

## 🎯 Quick Reference

### Most Used Commands

```bash
# Start dev environment
npm run dev  # (in backend/ and frontend/)

# Test search API
curl -X POST http://127.0.0.1:5000/api/chat/search \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"query": "test"}'

# Check health
curl http://127.0.0.1:5000/health

# View logs
# (check terminal running npm run dev)

# Run tests
node test-search-api.js $TOKEN
```

### Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend | 5000 | http://localhost:5000 |
| MongoDB | 27017 | mongodb://localhost:27017 (if local) |

### API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| /health | GET | ❌ | Health check |
| /api/chat/search | POST | ✅ | Vector search |
| /api/chat/query | POST | ✅ | AI chat |
| /api/chat/stream | POST | ✅ | Streaming |
| /api/documents | GET | ✅ | List docs |
| /api/documents/upload | POST | ✅ | Upload doc |
| /api/documents/:id | DELETE | ✅ | Delete doc |

---

## 📞 Support

### Get Help

```bash
# Check documentation
cat WEEK2_IMPLEMENTATION.md
cat QUICK_START_WEEK2.md
cat WEEK2_VERIFICATION.md

# View logs
# Backend: Check terminal running npm run dev
# Frontend: Check browser console (F12)

# Test connectivity
curl http://127.0.0.1:5000/health
```

### Common Issues

```bash
# Issue: Port already in use
# Solution: Kill process on port
lsof -ti:5000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend

# Issue: MongoDB connection failed
# Solution: Check MONGODB_URI in .env

# Issue: Clerk authentication failed
# Solution: Verify CLERK_SECRET_KEY

# Issue: Frontend can't reach backend
# Solution: Use 127.0.0.1 instead of localhost
```

---

**Week 2 Complete - All Commands Ready! 🚀**
