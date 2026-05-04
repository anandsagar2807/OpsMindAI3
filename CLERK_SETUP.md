# Clerk Authentication Setup

## Get Your Clerk Secret Key

You need to add your Clerk Secret Key to the backend `.env` file.

### Steps:

1. Go to https://dashboard.clerk.com/
2. Select your application (the one with publishable key: `pk_test_bGlrZWQtZHJhZ29uLTYuY2xlcmsuYWNjb3VudHMuZGV2JA`)
3. Navigate to **API Keys** in the left sidebar
4. Copy the **Secret Key** (starts with `sk_test_...`)
5. Open `backend/.env` file
6. Replace `your-clerk-secret-key-here` with your actual secret key:

```env
CLERK_SECRET_KEY=sk_test_your_actual_secret_key_here
```

7. Save the file
8. The backend will automatically restart (nodemon is watching)

## What Changed

✅ **Frontend**: Now uses Clerk's `getToken()` to get JWT tokens
✅ **Backend**: Installed `@clerk/express` middleware
✅ **Auth Middleware**: Created `clerkAuth.js` to verify Clerk tokens
✅ **Chat Routes**: Updated to use Clerk authentication

## After Adding the Secret Key

Once you add the secret key and the backend restarts, the chat will work! The flow will be:

1. User logs in with Clerk → Gets JWT token
2. Frontend calls `/api/chat/query` with Clerk token
3. Backend verifies token with Clerk
4. Chat service retrieves relevant documents
5. Groq API generates response
6. User sees answer with sources

## Quick Test

After adding the secret key, try asking a question in the chat. If you get an auth error, make sure:
- You're logged in with Clerk
- The secret key is correct
- The backend restarted successfully
