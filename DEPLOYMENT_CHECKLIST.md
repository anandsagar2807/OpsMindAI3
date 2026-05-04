# OpsMind AI - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. API Keys & Environment Variables

**Backend (.env)**
- [ ] GROQ_API_KEY configured
- [ ] MONGODB_URI points to production cluster
- [ ] CLERK_PUBLISHABLE_KEY set
- [ ] CLERK_SECRET_KEY set
- [ ] JWT_SECRET is strong and unique
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL points to production domain
- [ ] Rate limiting configured appropriately

**Frontend (.env)**
- [ ] VITE_API_URL points to production backend
- [ ] VITE_CLERK_PUBLISHABLE_KEY set

### 2. Database Setup

- [ ] MongoDB Atlas production cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (or 0.0.0.0/0 for cloud)
- [ ] Indexes created on collections:
  - vectors: userId, documentId, pageNumber
  - documents: uploadedBy, status
  - chats: userId, createdAt
- [ ] Backup strategy configured

### 3. Security

- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS configured with production domains only
- [ ] Rate limiting enabled and tested
- [ ] Helmet.js security headers active
- [ ] Input validation on all endpoints
- [ ] File upload size limits enforced
- [ ] JWT expiration set appropriately
- [ ] Sensitive data not logged

### 4. Testing

- [ ] All API endpoints tested
- [ ] Chat streaming works correctly
- [ ] Document upload and processing works
- [ ] Vector search returns relevant results
- [ ] Hallucination control verified
- [ ] Source citations appear correctly
- [ ] Chat history persists
- [ ] User authentication works

### 5. Performance

- [ ] Response times acceptable (< 3s first response)
- [ ] Streaming has no lag
- [ ] Vector search optimized (< 500ms)
- [ ] Database queries indexed

### 6. Monitoring & Logging

- [ ] Error logging configured
- [ ] Performance monitoring setup
- [ ] API usage tracking
- [ ] Groq API quota monitoring
- [ ] Database performance monitoring
- [ ] Uptime monitoring

---

## 🚀 Quick Deployment Guide

### Backend (Railway/Render/Heroku)

1. Create new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy from master branch

### Frontend (Vercel - Recommended)

```bash
npm i -g vercel
cd frontend
vercel --prod
```

### Post-Deployment Verification

```bash
# Test backend health
curl https://api.yourdomain.com/health

# Test frontend
# Visit https://yourdomain.com
# Upload document → Ask question → Verify response
```

---

## 📊 Success Metrics

- **Uptime**: > 99.9%
- **Response Time**: < 3s average
- **Error Rate**: < 0.1%
- **API Usage**: Stay within Groq limits

---

**Deployment Date**: _____________
**Deployed By**: _____________
**Version**: _____________
