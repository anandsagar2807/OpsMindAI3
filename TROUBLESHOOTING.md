# Troubleshooting Chat Issues

## Current Status
✅ Backend running on http://localhost:5000
✅ CORS configured for localhost:3000, 5173, 5174
✅ Groq API key configured
✅ MongoDB connected

## Issue: "Failed to fetch"

This error means the frontend can't reach the backend. Here's how to fix it:

### 1. Check Frontend Port
Open your browser and check what port your frontend is running on:
- Look at the URL bar (e.g., `http://localhost:5173`)

### 2. Verify API URL
Open browser console (F12) and check the network tab when you send a chat message:
- Does it show the correct URL?
- Is it trying to reach `http://localhost:5000/api/chat/query`?

### 3. Add Clerk Secret Key (REQUIRED)
The chat won't work without this:

1. Go to https://dashboard.clerk.com/
2. Click on your app
3. Go to **API Keys**
4. Copy the **Secret Key** (starts with `sk_test_...`)
5. Edit `backend/.env`:
   ```env
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   ```
6. Save and the backend will restart

### 4. Test Without Auth (Temporary)
If you want to test the chat without Clerk auth first, I can create a temporary bypass.

### 5. Check Browser Console
Open browser DevTools (F12) → Console tab
Look for any error messages when you try to send a chat message.

## Quick Test Commands

Test backend directly:
```bash
curl http://localhost:5000/health
```

Test chat endpoint (will fail auth but shows it's reachable):
```bash
curl -X POST http://localhost:5000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{"query":"test"}'
```

## What to Share
If still not working, share:
1. What port is your frontend running on?
2. Any errors in browser console (F12)?
3. Did you add the Clerk Secret Key?
