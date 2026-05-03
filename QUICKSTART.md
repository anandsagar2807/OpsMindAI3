# Quick Start Guide - OpsMind AI

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key (free at https://makersuite.google.com/app/apikey)

---

## Step 1: Clone & Setup (2 minutes)

```bash
# Navigate to project
cd "OpsMind Ai"

# Setup Backend
cd backend
npm install
cp .env.example .env
```

**Edit `backend/.env`:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opsmind-ai
JWT_SECRET=your-random-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
EMBEDDING_PROVIDER=gemini
```

```bash
# Setup Frontend
cd ../frontend
npm install
```

---

## Step 2: Start Services (1 minute)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Wait for:
```
✅ MongoDB Connected
🚀 OpsMind AI Backend running on port 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:3000/
```

---

## Step 3: Test the System (2 minutes)

### Create Account
1. Open http://localhost:3000/register
2. Register with:
   - Name: `Admin`
   - Email: `admin@test.com`
   - Password: `admin123`

### Upload PDF
1. Click "Upload Documents"
2. Drag & drop any PDF file
3. Wait for "Processing" → "Completed"

### View Results
1. Click "My Documents"
2. Click "View Vectors"
3. See extracted chunks with embeddings!

---

## 🎉 You're Done!

Your corporate knowledge brain is now running. The system:
- ✅ Extracted text from your PDF
- ✅ Split it into smart chunks
- ✅ Generated AI embeddings
- ✅ Stored vectors in MongoDB

---

## Next Steps

**Week 2:** Add semantic search to query your documents
**Week 3:** Build RAG chat interface for Q&A

---

## Troubleshooting

**Backend won't start?**
- Check MongoDB URI is correct
- Verify Gemini API key is valid

**Upload fails?**
- Ensure file is PDF format
- Check file size < 20MB

**Need help?**
- Check README.md for detailed docs
- Review TESTING_GUIDE.md for full testing

---

**Built with ❤️ for Enterprise Knowledge Management**
