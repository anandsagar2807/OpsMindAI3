# 🔑 API Keys Required

To make the chat work, you need to add these API keys to `backend/.env`:

## 1. OpenRouter API Key (Required for Embeddings / LLM access)

**Get it here:** https://openrouter.ai/keys

1. Go to https://openrouter.ai/keys
2. Create an API key
3. Copy the key
4. Add to `backend/.env`:
   ```env
   OPENROUTER_API_KEY=your_actual_openrouter_key_here
   ```

> If your backend expects a different env var name (e.g., `OPENROUTER_KEY`), use the one referenced in your code.

## 2. Clerk Secret Key (Required for Authentication)

**Get it here:** https://dashboard.clerk.com/

1. Go to https://dashboard.clerk.com/
2. Select your app
3. Navigate to **API Keys**
4. Copy the **Secret Key** (starts with `sk_test_...`)
5. Add to `backend/.env`:
   ```env
   CLERK_SECRET_KEY=sk_test_your_actual_key_here
   ```

## Current Status

✅ **Open Router and Groq API** - Configured (for AI responses)
✅ **MongoDB** - Connected
✅ **Backend** - Running on port 5000
✅ **CORS** - Fixed for localhost
✅ **Temporary Auth Bypass** - Active (for testing)

❌ **OpenRouter API** - Missing (needed for embeddings / model access)
❌ **Clerk Secret** - Missing (needed for production auth)

## What Each Key Does

- **Groq API**: Generates AI chat responses using Llama 3.1 70B
- **OpenRouter API**: Provides access to models for embeddings and/or completions (depending on your implementation)
- **Clerk Secret**: Verifies user authentication tokens

## After Adding Keys

1. Save the `.env` file
2. Backend will auto-restart (nodemon)
3. Try the chat again
4. Upload documents first, then ask questions about them

## Note

The chat currently has a **temporary auth bypass** so you can test it without Clerk. Once you add the Clerk secret key, remove the bypass for production use.
