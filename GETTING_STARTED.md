# 🎯 OpsMind AI - Getting Started

## Welcome to OpsMind AI!

Your Week 1 Knowledge Ingestion System is complete and ready to use.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend (.env):**
```bash
cd backend
cp .env.example .env
nano .env
```

Required settings:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opsmind-ai
JWT_SECRET=your-random-secret-key
GEMINI_API_KEY=your-gemini-api-key
```

Get your Gemini API key: https://makersuite.google.com/app/apikey

### Step 3: Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Wait for: "✅ MongoDB Connected"

# Terminal 2: Frontend
cd frontend
npm run dev
# Wait for: "Local: http://localhost:3000/"
```

### Step 4: Test It!

1. Open http://localhost:3000/register
2. Create account: `admin@test.com` / `admin123`
3. Upload a PDF document
4. Watch it process automatically
5. View vectors in "My Documents"

---

## 📚 What You Can Do Now

### Upload Documents
- Drag & drop PDF files (max 20MB)
- Automatic text extraction
- Smart chunking (1000 chars, 100 overlap)
- AI embeddings generation
- Vector storage in MongoDB

### Manage Documents
- View all uploaded documents
- Check processing status
- View extracted text chunks
- See embeddings metadata
- Delete documents

### Security
- JWT authentication
- Role-based access (admin only)
- Rate limiting (100 req/15min)
- Secure file validation

---

## 🎓 Learn More

- **README.md** - Complete documentation
- **API_DOCUMENTATION.md** - API reference
- **TESTING_GUIDE.md** - Testing procedures
- **DEPLOYMENT.md** - Production deployment
- **NEXT_STEPS.md** - Week 2 roadmap

---

## 🐛 Troubleshooting

**Backend won't start?**
- Check MongoDB URI is correct
- Verify Gemini API key is valid
- Ensure port 5000 is available

**Upload fails?**
- File must be PDF format
- Max size is 20MB
- Check backend logs for errors

**Frontend can't connect?**
- Verify backend is running on port 5000
- Check browser console for errors

---

## 🚀 Next Steps

### Week 2: Semantic Search
Build intelligent search that understands meaning.

### Week 3: RAG Chat
Add conversational AI with context.

### Week 4: Advanced Features
Analytics, multi-user, and more.

---

## 💡 Tips

1. **Start Small:** Test with a 5-10 page PDF first
2. **Check Logs:** Backend console shows processing progress
3. **MongoDB Atlas:** Use free M0 tier for development
4. **API Keys:** Keep them secure, never commit to Git

---

## ✅ Success Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can upload PDF file
- [ ] Document shows "Processing" status
- [ ] Status changes to "Completed"
- [ ] Can view vectors
- [ ] Can delete document

---

## 🎉 You're Ready!

Your OpsMind AI Knowledge Brain is now operational.

Start uploading your SOP documents and building your corporate knowledge base!

---

**Need Help?** Check the documentation files or review the error logs.

**Ready for More?** See NEXT_STEPS.md for Week 2 development.

**Happy Building! 🚀**
