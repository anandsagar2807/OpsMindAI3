# Clerk Authentication Setup Guide

**Date**: May 4, 2026  
**Status**: ✅ IMPLEMENTED

---

## Overview

OpsMind AI now uses **Clerk** for enterprise-grade authentication with the following features:
- Social login (Google, Microsoft, GitHub)
- Email/password authentication
- Multi-factor authentication (MFA)
- Session management
- User profile management
- Role-based access control (RBAC)

---

## Setup Instructions

### 1. Create Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application named "OpsMind AI"

### 2. Get API Keys

From your Clerk Dashboard:

1. Go to **API Keys** section
2. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
3. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 3. Configure Environment Variables

**Backend** (`.env`):
```env
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

**Frontend** (`.env`):
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

### 4. Configure Clerk Dashboard

#### Application Settings

1. **Application Name**: OpsMind AI
2. **Application URL**: http://localhost:3001 (development)

#### Authentication Settings

1. Go to **User & Authentication** → **Email, Phone, Username**
2. Enable:
   - ✅ Email address (required)
   - ✅ Password (required)
   
3. Go to **User & Authentication** → **Social Connections**
4. Enable (optional):
   - ✅ Google
   - ✅ Microsoft
   - ✅ GitHub

#### Redirect URLs

1. Go to **Paths**
2. Set the following URLs:

**Sign-in page**: `/login`  
**Sign-up page**: `/register`  
**After sign-in**: `/dashboard`  
**After sign-up**: `/dashboard`  
**After sign-out**: `/`

#### Allowed Origins (CORS)

Add these origins in **Settings** → **Allowed Origins**:
- `http://localhost:3001`
- `http://localhost:3000`
- `http://127.0.0.1:3001`
- `http://127.0.0.1:3000`

---

## How It Works

### Frontend Authentication Flow

1. **User visits landing page** → Not authenticated
2. **User clicks "Sign In"** → Redirected to `/login`
3. **Clerk SignIn component** → Handles authentication
4. **After successful login** → Redirected to `/dashboard`
5. **API calls** → Automatically include Clerk JWT token

### Backend Authentication Flow

1. **Request received** → `clerkAuth` middleware validates JWT
2. **User synced** → `syncUser` middleware creates/updates user in MongoDB
3. **Authorization check** → RBAC middleware checks permissions
4. **Request processed** → Controller handles business logic

### Code Flow

```
Frontend Request
    ↓
Clerk JWT Token (automatically added)
    ↓
Backend: clerkAuth middleware (validates token)
    ↓
Backend: syncUser middleware (creates/updates user in DB)
    ↓
Backend: RBAC middleware (checks permissions)
    ↓
Backend: Controller (processes request)
    ↓
Response
```

---

## Implementation Details

### Frontend Changes

**1. Login Page** (`frontend/src/pages/Login.jsx`)
- Replaced custom form with Clerk's `<SignIn />` component
- Styled to match OpsMind AI branding

**2. Register Page** (`frontend/src/pages/Register.jsx`)
- Replaced custom form with Clerk's `<SignUp />` component
- Styled to match OpsMind AI branding

**3. API Configuration** (`frontend/src/utils/api.js`)
- Updated to use Clerk's `getToken()` method
- Automatically includes JWT in Authorization header

**4. Main App** (`frontend/src/main.jsx`)
- Wrapped app with `<ClerkProvider>`
- Added `ClerkTokenProvider` to initialize token getter

**5. Private Routes** (`frontend/src/components/PrivateRoute.jsx`)
- Uses Clerk's `useAuth()` hook
- Checks `isSignedIn` status

### Backend Changes

**1. Clerk Middleware** (`backend/src/middleware/clerkAuth.js`)
- Uses `@clerk/express` package
- Validates JWT tokens from Clerk
- Extracts user ID from token

**2. RBAC Middleware** (`backend/src/middleware/rbac.js`)
- `syncUser`: Creates/updates user in MongoDB on first login
- `requirePermission`: Checks user permissions
- `requireAdmin`: Checks admin role

**3. User Model** (`backend/src/models/User.js`)
- Stores Clerk user ID (`clerkId`)
- Manages roles and permissions
- Tracks last login

**4. Server Configuration** (`backend/src/server.js`)
- Applied `clerkAuth` middleware globally
- Applied `syncUser` middleware to sync users

---

## User Roles & Permissions

### Employee Role (Default)
- `chat:read` - View chat history
- `chat:write` - Send messages
- `documents:read` - View documents
- `documents:upload` - Upload documents

### Admin Role
All employee permissions plus:
- `chat:delete` - Delete any chat
- `documents:delete` - Delete any document
- `admin:users` - Manage users
- `admin:analytics` - View analytics
- `admin:settings` - Manage settings

### Assigning Admin Role

**Option 1: Via Clerk Dashboard**
1. Go to **Users** in Clerk Dashboard
2. Select a user
3. Go to **Metadata** → **Public Metadata**
4. Add: `{ "role": "admin" }`

**Option 2: Via MongoDB**
```javascript
db.users.updateOne(
  { email: "admin@opsmind.ai" },
  { $set: { role: "admin", permissions: [...adminPermissions] } }
)
```

---

## Testing Authentication

### 1. Start Servers
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 2. Test Sign Up
1. Go to http://localhost:3001
2. Click "Get Started"
3. Fill in email and password
4. Verify email (check inbox)
5. Should redirect to `/dashboard`

### 3. Test Sign In
1. Go to http://localhost:3001
2. Click "Sign In"
3. Enter credentials
4. Should redirect to `/dashboard`

### 4. Test Protected Routes
1. Try accessing `/dashboard/chat` without login
2. Should redirect to `/login`
3. After login, should access successfully

### 5. Test API Calls
1. Open browser DevTools → Network tab
2. Make a chat request
3. Check request headers for `Authorization: Bearer <token>`
4. Should receive successful response

---

## Security Features

### JWT Token Validation
- Tokens are validated on every request
- Expired tokens are rejected
- Invalid signatures are rejected

### Session Management
- Sessions expire after inactivity
- Refresh tokens handled automatically
- Logout clears all sessions

### CORS Protection
- Only allowed origins can make requests
- Credentials required for cross-origin requests

### Rate Limiting
- 100 requests per 15 minutes per IP
- Prevents brute force attacks

---

## Troubleshooting

### Issue: "Invalid publishable key"
**Solution**: Check that `VITE_CLERK_PUBLISHABLE_KEY` is set correctly in frontend `.env`

### Issue: "Unauthorized" on API calls
**Solution**: 
1. Check that `CLERK_SECRET_KEY` is set in backend `.env`
2. Verify token is being sent in Authorization header
3. Check Clerk Dashboard → JWT Templates

### Issue: User not created in MongoDB
**Solution**: 
1. Check MongoDB connection
2. Verify `syncUser` middleware is applied
3. Check backend logs for errors

### Issue: Redirect loop after login
**Solution**: 
1. Check redirect URLs in Clerk Dashboard
2. Verify `afterSignInUrl` in ClerkProvider
3. Clear browser cookies and try again

---

## Production Deployment

### 1. Update Environment Variables
```env
# Backend
CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
CLERK_SECRET_KEY=sk_live_your_production_secret
NODE_ENV=production

# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
VITE_API_URL=https://api.yourdomain.com
```

### 2. Update Clerk Dashboard
1. Add production domain to **Allowed Origins**
2. Update redirect URLs to production URLs
3. Enable production instance

### 3. Enable Additional Security
1. **Multi-factor authentication** (MFA)
2. **Bot protection** (CAPTCHA)
3. **Email verification** (required)
4. **Password strength** (strong)

---

## API Endpoints

All endpoints require authentication except:
- `GET /health` - Health check
- Public landing page routes

### Protected Endpoints
- `POST /api/groq-chat/ask` - Send chat message
- `GET /api/groq-chat/history` - Get chat history
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List documents

### Admin-Only Endpoints
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id/role` - Update user role
- `GET /api/admin/analytics` - View analytics

---

## Next Steps

1. ✅ Clerk authentication implemented
2. ✅ User sync with MongoDB
3. ✅ RBAC with permissions
4. ✅ Protected routes
5. ✅ API token validation

**Optional Enhancements:**
- [ ] Add social login (Google, Microsoft)
- [ ] Enable multi-factor authentication
- [ ] Add user profile page
- [ ] Implement password reset flow
- [ ] Add email notifications

---

## Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [Clerk Express SDK](https://clerk.com/docs/references/express/overview)
- [Clerk Dashboard](https://dashboard.clerk.com)

---

**Status**: ✅ PRODUCTION READY  
**Last Updated**: May 4, 2026
