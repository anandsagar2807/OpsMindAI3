# OpsMind AI - API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Authentication

All document endpoints require JWT authentication via Bearer token.

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@opsmind.ai",
  "password": "admin123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "663f1234567890abcdef1234",
      "email": "admin@opsmind.ai",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@opsmind.ai",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "663f1234567890abcdef1234",
      "email": "admin@opsmind.ai",
      "name": "Admin User",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User
```http
GET /auth/me
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "663f1234567890abcdef1234",
    "email": "admin@opsmind.ai",
    "name": "Admin User",
    "role": "admin"
  }
}
```

---

## Documents

### Upload Document
```http
POST /documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [PDF file]
name: "SOP Document" (optional)
```

**Response (201):**
```json
{
  "success": true,
  "message": "Document uploaded successfully and processing started",
  "data": {
    "documentId": "663f5678901234abcdef5678",
    "name": "SOP_Document.pdf",
    "status": "processing"
  }
}
```

**Errors:**
- `400` - No file uploaded
- `400` - Invalid file type (only PDF allowed)
- `400` - File too large (max 20MB)

---

### Get All Documents
```http
GET /documents?page=1&limit=10&status=completed
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (processing/completed/failed)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "663f5678901234abcdef5678",
      "name": "SOP_Document.pdf",
      "originalName": "SOP_Document.pdf",
      "fileSize": 2458624,
      "mimeType": "application/pdf",
      "uploadedBy": "663f1234567890abcdef1234",
      "status": "completed",
      "totalPages": 10,
      "totalChunks": 45,
      "createdAt": "2026-05-03T13:00:00.000Z",
      "updatedAt": "2026-05-03T13:02:30.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

---

### Get Document by ID
```http
GET /documents/{documentId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "663f5678901234abcdef5678",
    "name": "SOP_Document.pdf",
    "originalName": "SOP_Document.pdf",
    "fileSize": 2458624,
    "mimeType": "application/pdf",
    "uploadedBy": "663f1234567890abcdef1234",
    "status": "completed",
    "totalPages": 10,
    "totalChunks": 45,
    "vectorCount": 45,
    "createdAt": "2026-05-03T13:00:00.000Z",
    "updatedAt": "2026-05-03T13:02:30.000Z"
  }
}
```

**Errors:**
- `404` - Document not found

---

### Get Document Vectors
```http
GET /documents/{documentId}/vectors?page=1&limit=20
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "663f9012345678abcdef9012",
      "documentId": "663f5678901234abcdef5678",
      "text": "This is the standard operating procedure for handling customer inquiries...",
      "pageNumber": 1,
      "chunkIndex": 0,
      "metadata": {
        "documentName": "SOP_Document.pdf",
        "uploadedAt": "2026-05-03T13:00:00.000Z",
        "chunkSize": 1000,
        "startPosition": 0,
        "endPosition": 1000
      },
      "createdAt": "2026-05-03T13:02:15.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pages": 3
  }
}
```

**Note:** Embedding vectors are excluded from response for performance.

---

### Delete Document
```http
DELETE /documents/{documentId}
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

**Errors:**
- `404` - Document not found

**Note:** This also deletes all associated vectors from the database.

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Please provide a valid email",
    "Password must be at least 6 characters"
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "You do not have permission to perform this action"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Document not found"
}
```

### Rate Limit (429)
```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Headers:**
  - `RateLimit-Limit`: Maximum requests allowed
  - `RateLimit-Remaining`: Requests remaining
  - `RateLimit-Reset`: Time when limit resets

---

## Document Processing Flow

1. **Upload** → Document created with status `processing`
2. **Extract** → PDF text extraction from all pages
3. **Chunk** → Text split into 1000-char chunks with 100-char overlap
4. **Embed** → AI embeddings generated for each chunk
5. **Store** → Vectors saved to MongoDB
6. **Complete** → Document status updated to `completed`

**Processing Time:** ~2-5 seconds per page depending on API response time

---

## Embedding Specifications

### Gemini (embedding-001)
- **Dimensions:** 768
- **Model:** text-embedding-004
- **Max Input:** 2048 tokens

### OpenAI (text-embedding-3-small)
- **Dimensions:** 1536
- **Model:** text-embedding-3-small
- **Max Input:** 8191 tokens

---

## Example: Complete Upload Flow

```javascript
// 1. Register/Login
const authResponse = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@opsmind.ai',
    password: 'admin123'
  })
});
const { data: { token } } = await authResponse.json();

// 2. Upload PDF
const formData = new FormData();
formData.append('file', pdfFile);
formData.append('name', 'My SOP Document');

const uploadResponse = await fetch('http://localhost:5000/api/documents/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
const { data: { documentId } } = await uploadResponse.json();

// 3. Poll for completion (wait 5-10 seconds)
await new Promise(resolve => setTimeout(resolve, 10000));

// 4. Get document with vectors
const docResponse = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const document = await docResponse.json();

// 5. Get vectors
const vectorsResponse = await fetch(`http://localhost:5000/api/documents/${documentId}/vectors`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
const vectors = await vectorsResponse.json();

console.log(`Processed ${document.data.totalChunks} chunks from ${document.data.totalPages} pages`);
```

---

## Security Best Practices

1. **Always use HTTPS in production**
2. **Store JWT tokens securely** (httpOnly cookies recommended)
3. **Rotate JWT_SECRET regularly**
4. **Implement token refresh mechanism**
5. **Validate file types on both client and server**
6. **Sanitize all user inputs**
7. **Use environment variables for secrets**
8. **Enable CORS only for trusted origins**
9. **Monitor rate limit violations**
10. **Implement request logging**

---

## Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "success": true,
  "message": "OpsMind AI Backend is running",
  "timestamp": "2026-05-03T13:02:53.456Z"
}
```

---

**API Version:** 1.0.0  
**Last Updated:** May 3, 2026
