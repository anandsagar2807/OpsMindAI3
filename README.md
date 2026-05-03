# OpsMind AI - Context-Aware Corporate Knowledge Brain

## 🚀 Week 1: Knowledge Ingestion System

A production-grade enterprise SaaS platform for uploading, processing, and vectorizing corporate SOP documents using AI embeddings.

---

## 📋 Features

### ✅ Completed Features

1. **Admin Upload Dashboard**
   - Premium enterprise UI with glass-morphism design
   - Drag & drop PDF upload with react-dropzone
   - Real-time upload progress
   - Toast notifications for success/failure
   - List of uploaded documents with status

2. **File Upload API**
   - `POST /api/documents/upload`
   - Multer middleware for secure file handling
   - PDF-only validation
   - 20MB file size limit
   - Secure file storage

3. **PDF Processing Pipeline**
   - Text extraction from all PDF pages
   - Smart chunking (1000 chars, 100 overlap)
   - Metadata generation per chunk
   - Async processing to avoid blocking

4. **AI Embeddings**
   - Support for Google Gemini API
   - Support for OpenAI Embeddings API
   - Batch processing with rate limiting
   - Vector generation for semantic search

5. **MongoDB Atlas Storage**
   - `documents` collection for file metadata
   - `vectors` collection for embeddings
   - Indexed for fast queries
   - Relationship between documents and vectors

6. **Security**
   - JWT authentication
   - Role-based access control (Admin only)
   - Rate limiting (100 req/15min)
   - Input validation with express-validator
   - Helmet.js security headers
   - CORS protection

7. **Premium UI Design**
   - Microsoft Copilot-inspired design
   - Dark theme with gradient accents
   - Responsive layout (mobile + desktop)
   - Glass-morphism effects
   - Lucide React icons
   - Smooth animations

---

## 🏗️ Architecture

```
OpsMind AI/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # MongoDB connection
│   │   │   └── multer.js            # File upload config
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── documentController.js # Document CRUD
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── errorHandler.js      # Global error handler
│   │   │   └── validation.js        # Input validation
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Document.js          # Document schema
│   │   │   └── Vector.js            # Vector schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   └── documentRoutes.js    # Document endpoints
│   │   ├── services/
│   │   │   ├── embeddingService.js  # AI embeddings
│   │   │   └── pdfProcessor.js      # PDF extraction
│   │   └── server.js                # Express app
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── PrivateRoute.jsx     # Auth guard
    │   ├── pages/
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Register.jsx         # Register page
    │   │   ├── Dashboard.jsx        # Main layout
    │   │   ├── UploadPage.jsx       # Upload interface
    │   │   └── DocumentsPage.jsx    # Documents list
    │   ├── store/
    │   │   └── authStore.js         # Zustand auth state
    │   ├── utils/
    │   │   └── api.js               # Axios instance
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas
- **File Upload:** Multer
- **PDF Parser:** pdf-parse
- **AI Embeddings:** Google Gemini / OpenAI
- **Auth:** JWT + bcryptjs
- **Security:** Helmet, CORS, express-rate-limit
- **Validation:** express-validator

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **State:** Zustand
- **HTTP Client:** Axios
- **UI Components:** Lucide React icons
- **File Upload:** react-dropzone
- **Notifications:** react-hot-toast

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account
- Google Gemini API key OR OpenAI API key

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials:
# - MONGODB_URI (MongoDB Atlas connection string)
# - JWT_SECRET (random secure string)
# - GEMINI_API_KEY or OPENAI_API_KEY
# - EMBEDDING_PROVIDER (gemini or openai)

# Start server
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default: http://localhost:5000/api)

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 🔑 API Endpoints

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Documents (Protected - Admin Only)
```
POST   /api/documents/upload
GET    /api/documents
GET    /api/documents/:id
DELETE /api/documents/:id
GET    /api/documents/:id/vectors
```

---

## 🧪 Testing Guide

### 1. Register Admin Account
1. Open `http://localhost:3000/register`
2. Fill in:
   - Name: Admin User
   - Email: admin@opsmind.ai
   - Password: admin123
3. Click "Create Account"

### 2. Upload PDF Document
1. Navigate to "Upload Documents"
2. Drag & drop a PDF file (max 20MB)
3. Wait for upload confirmation
4. Document status shows "Processing"

### 3. Verify Processing
1. Go to "My Documents"
2. Check document status changes to "Completed"
3. View document details:
   - Total pages
   - Total chunks
   - File size

### 4. View Vectors
1. Click "View Vectors" on any completed document
2. See all text chunks with:
   - Chunk index
   - Page number
   - Extracted text
   - Metadata

### 5. Verify in MongoDB Atlas
```javascript
// Connect to your MongoDB Atlas cluster

// Check documents collection
db.documents.find().pretty()

// Check vectors collection
db.vectors.find().limit(5).pretty()

// Count vectors for a document
db.vectors.countDocuments({ documentId: ObjectId("...") })

// Verify embeddings exist
db.vectors.findOne({}, { embedding: 1 })
```

---

## 🔒 Security Features

1. **JWT Authentication**
   - Token-based auth
   - 7-day expiration
   - Secure password hashing (bcrypt)

2. **Rate Limiting**
   - 100 requests per 15 minutes
   - Per-IP tracking

3. **Input Validation**
   - Email format validation
   - Password strength (min 6 chars)
   - File type validation (PDF only)
   - File size limit (20MB)

4. **Security Headers**
   - Helmet.js protection
   - CORS configuration
   - XSS prevention

5. **Role-Based Access**
   - Admin-only document routes
   - User isolation (users see only their docs)

---

## 🎨 UI Design Highlights

- **Color Scheme:** Dark theme with cyan/blue accents
- **Typography:** Inter font family
- **Components:**
  - Glass-morphism cards
  - Gradient buttons
  - Smooth transitions
  - Loading states
  - Toast notifications
  - Responsive sidebar
  - Mobile-friendly

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String (admin/user),
  isActive: Boolean,
  createdAt: Date
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  name: String,
  originalName: String,
  filePath: String,
  fileSize: Number,
  mimeType: String,
  uploadedBy: ObjectId (ref: User),
  status: String (processing/completed/failed),
  totalPages: Number,
  totalChunks: Number,
  processingError: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Vectors Collection
```javascript
{
  _id: ObjectId,
  documentId: ObjectId (ref: Document),
  text: String,
  embedding: [Number], // 768 or 1536 dimensions
  pageNumber: Number,
  chunkIndex: Number,
  metadata: {
    documentName: String,
    sectionTitle: String,
    uploadedAt: Date,
    chunkSize: Number,
    startPosition: Number,
    endPosition: Number
  },
  createdAt: Date
}
```

---

## 🚀 Next Steps (Week 2+)

1. **Semantic Search**
   - Query endpoint
   - Vector similarity search
   - Ranked results

2. **Chat Interface**
   - RAG implementation
   - Context-aware responses
   - Chat history

3. **Advanced Features**
   - Multi-file upload
   - Batch processing
   - Document versioning
   - Search filters

---

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify API keys are set
- Ensure port 5000 is available

### Frontend won't connect
- Verify backend is running
- Check VITE_API_URL in .env
- Clear browser cache

### Upload fails
- Check file is PDF format
- Verify file size < 20MB
- Check backend logs for errors

### Embeddings not generating
- Verify API key is correct
- Check EMBEDDING_PROVIDER setting
- Review rate limits on API

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key
EMBEDDING_PROVIDER=gemini
MAX_FILE_SIZE=20971520
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📄 License

MIT License - Feel free to use for commercial projects

---

## 👨‍💻 Support

For issues or questions:
1. Check troubleshooting section
2. Review API endpoint responses
3. Check browser console for errors
4. Verify MongoDB Atlas connection

---

**Built with ❤️ for Enterprise Knowledge Management**
