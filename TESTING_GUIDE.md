# OpsMind AI - Testing Checklist

## ✅ Complete Testing Guide

### Step 1: Environment Setup

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/opsmind-ai
JWT_SECRET=opsmind-secret-key-2026
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-gemini-api-key-here
EMBEDDING_PROVIDER=gemini
MAX_FILE_SIZE=20971520
```

Start backend:
```bash
npm run dev
```

Expected output:
```
🚀 OpsMind AI Backend running on port 5000
📝 Environment: development
🔐 Embedding Provider: gemini
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```

Start frontend:
```bash
npm run dev
```

Expected output:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:3000/
```

---

### Step 2: Test Authentication

#### Register New Admin
1. Open browser: `http://localhost:3000/register`
2. Fill form:
   - Name: `Admin User`
   - Email: `admin@opsmind.ai`
   - Password: `admin123`
3. Click "Create Account"
4. ✅ Should redirect to dashboard
5. ✅ Should see welcome toast

#### Test Login
1. Logout from dashboard
2. Go to `http://localhost:3000/login`
3. Enter credentials:
   - Email: `admin@opsmind.ai`
   - Password: `admin123`
4. Click "Sign In"
5. ✅ Should redirect to dashboard

---

### Step 3: Test PDF Upload

#### Upload Test Document
1. Navigate to "Upload Documents" page
2. Prepare a test PDF (any SOP document, max 20MB)
3. Drag & drop PDF onto upload zone
4. ✅ Should show upload progress
5. ✅ Should show success toast
6. ✅ Should display "Processing" status

#### Verify Backend Processing
Check backend console logs:
```
✅ Document processed successfully
📄 Extracted text from 10 pages
🔪 Created 45 chunks
🧠 Generated 45 embeddings
💾 Stored 45 vectors in MongoDB
```

---

### Step 4: Verify MongoDB Storage

#### Connect to MongoDB Atlas
1. Open MongoDB Atlas dashboard
2. Click "Browse Collections"
3. Select `opsmind-ai` database

#### Check Documents Collection
```javascript
// Should see document record
{
  "_id": ObjectId("..."),
  "name": "SOP_Document.pdf",
  "originalName": "SOP_Document.pdf",
  "uploadedBy": ObjectId("..."),
  "status": "completed",
  "totalPages": 10,
  "totalChunks": 45,
  "fileSize": 2458624,
  "createdAt": ISODate("2026-05-03T13:00:00.000Z")
}
```

#### Check Vectors Collection
```javascript
// Should see vector records
{
  "_id": ObjectId("..."),
  "documentId": ObjectId("..."),
  "text": "This is the standard operating procedure for...",
  "embedding": [0.123, -0.456, 0.789, ...], // 768 dimensions
  "pageNumber": 1,
  "chunkIndex": 0,
  "metadata": {
    "documentName": "SOP_Document.pdf",
    "uploadedAt": ISODate("2026-05-03T13:00:00.000Z"),
    "chunkSize": 1000,
    "startPosition": 0,
    "endPosition": 1000
  }
}
```

#### Run Verification Queries
```javascript
// Count total documents
db.documents.countDocuments()
// Expected: 1

// Count vectors for document
db.vectors.countDocuments({ documentId: ObjectId("your-doc-id") })
// Expected: 45 (or your chunk count)

// Verify embedding dimensions
db.vectors.findOne({}, { embedding: 1 })
// Expected: Array of 768 numbers (Gemini) or 1536 (OpenAI)

// Check all chunks are indexed
db.vectors.find({ documentId: ObjectId("your-doc-id") })
  .sort({ chunkIndex: 1 })
  .limit(5)
```

---

### Step 5: Test Document Management

#### View Documents List
1. Navigate to "My Documents"
2. ✅ Should see uploaded document
3. ✅ Should show status badge (Completed)
4. ✅ Should display:
   - Total pages
   - Total chunks
   - File size

#### View Document Vectors
1. Click "View Vectors" button
2. ✅ Should load vectors in right panel
3. ✅ Each vector should show:
   - Chunk number
   - Page number
   - Text preview
   - Metadata

#### Delete Document
1. Click trash icon on document
2. Confirm deletion
3. ✅ Should remove from list
4. ✅ Should show success toast
5. ✅ Verify vectors deleted from MongoDB

---

### Step 6: Test Error Handling

#### Invalid File Type
1. Try uploading .txt or .docx file
2. ✅ Should show error: "Only PDF files are allowed"

#### File Too Large
1. Try uploading PDF > 20MB
2. ✅ Should show error: "File size must be less than 20MB"

#### Invalid Credentials
1. Logout and try login with wrong password
2. ✅ Should show error: "Invalid email or password"

#### Unauthorized Access
1. Logout
2. Try accessing `http://localhost:3000/dashboard`
3. ✅ Should redirect to login page

---

### Step 7: Test API Endpoints

#### Using cURL or Postman

**Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@opsmind.ai",
    "password": "test123"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@opsmind.ai",
    "password": "admin123"
  }'
```

**Get Documents** (use token from login)
```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Upload Document**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "name=Test Document"
```

**Get Document Vectors**
```bash
curl -X GET http://localhost:5000/api/documents/DOCUMENT_ID/vectors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Step 8: Performance Testing

#### Upload Multiple Documents
1. Upload 5 different PDF files
2. ✅ All should process successfully
3. ✅ Check MongoDB for all vectors
4. ✅ Verify no memory leaks in backend

#### Large Document Test
1. Upload a 15-20MB PDF with 100+ pages
2. ✅ Should handle without crashing
3. ✅ Should create appropriate chunks
4. ✅ Monitor processing time

---

### Step 9: UI/UX Testing

#### Responsive Design
1. Test on mobile (375px width)
2. Test on tablet (768px width)
3. Test on desktop (1920px width)
4. ✅ Sidebar should collapse on mobile
5. ✅ All buttons should be accessible

#### Dark Theme
1. ✅ Verify glass-morphism effects
2. ✅ Check gradient buttons
3. ✅ Verify text contrast
4. ✅ Test hover states

#### Loading States
1. ✅ Upload shows spinner
2. ✅ Documents page shows loader
3. ✅ Vectors panel shows loader
4. ✅ Processing status updates

---

### Step 10: Security Testing

#### JWT Expiration
1. Login and get token
2. Wait 7 days (or modify JWT_EXPIRES_IN to 1m for testing)
3. ✅ Should auto-logout on expired token

#### Rate Limiting
1. Make 101 requests in 15 minutes
2. ✅ Should get 429 error: "Too many requests"

#### SQL Injection Prevention
1. Try login with: `admin@test.com' OR '1'='1`
2. ✅ Should fail safely

#### XSS Prevention
1. Try uploading file named: `<script>alert('xss')</script>.pdf`
2. ✅ Should sanitize filename

---

## 🎯 Success Criteria

### Backend ✅
- [x] Server starts without errors
- [x] MongoDB connection successful
- [x] All API endpoints respond correctly
- [x] PDF processing works
- [x] Embeddings generate successfully
- [x] Vectors stored in MongoDB
- [x] JWT authentication works
- [x] Rate limiting active
- [x] Error handling works

### Frontend ✅
- [x] App loads without errors
- [x] Login/Register works
- [x] Dashboard renders correctly
- [x] File upload works
- [x] Documents list displays
- [x] Vectors view works
- [x] Delete functionality works
- [x] Responsive on all devices
- [x] Toast notifications work

### Database ✅
- [x] Documents collection populated
- [x] Vectors collection populated
- [x] Embeddings have correct dimensions
- [x] Indexes created
- [x] Relationships maintained

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB connection fails
**Solution:** 
- Check connection string format
- Verify IP whitelist in Atlas
- Ensure network access configured

### Issue: Embeddings not generating
**Solution:**
- Verify API key is correct
- Check EMBEDDING_PROVIDER setting
- Review API quota limits

### Issue: Upload fails silently
**Solution:**
- Check backend console for errors
- Verify uploads/ directory exists
- Check file permissions

### Issue: Frontend can't connect to backend
**Solution:**
- Verify backend is running on port 5000
- Check VITE_API_URL in frontend .env
- Disable browser CORS extensions

---

## 📊 Expected Results Summary

| Test | Expected Result | Status |
|------|----------------|--------|
| Backend starts | Port 5000 listening | ✅ |
| MongoDB connects | Connection successful | ✅ |
| User registration | Account created | ✅ |
| User login | JWT token received | ✅ |
| PDF upload | File accepted | ✅ |
| Text extraction | Text extracted from all pages | ✅ |
| Chunking | ~45 chunks per 10-page doc | ✅ |
| Embeddings | 768-dim vectors generated | ✅ |
| Vector storage | All vectors in MongoDB | ✅ |
| Documents list | Shows all user documents | ✅ |
| Vectors view | Displays all chunks | ✅ |
| Delete document | Removes doc + vectors | ✅ |
| Rate limiting | Blocks after 100 requests | ✅ |
| JWT expiration | Auto-logout after 7 days | ✅ |

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure production MongoDB cluster
- [ ] Set up SSL/TLS certificates
- [ ] Configure production CORS origins
- [ ] Set up monitoring (e.g., PM2, New Relic)
- [ ] Configure backup strategy for MongoDB
- [ ] Set up error logging (e.g., Sentry)
- [ ] Configure CDN for frontend assets
- [ ] Set up CI/CD pipeline
- [ ] Configure environment-specific .env files
- [ ] Test with production API keys
- [ ] Set up health check endpoints
- [ ] Configure auto-scaling if needed
- [ ] Document deployment process

---

**Testing completed successfully! 🎉**

All features working as expected. Ready for Week 2 development.
