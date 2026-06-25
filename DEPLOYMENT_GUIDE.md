# 🚀 Deployment Guide — Connecting Frontend (Vercel) & Backend (Render)

This guide explains how to connect the **Vercel-hosted frontend** to the **Render-hosted backend**.

- **Frontend (Vercel):** `https://frontend-amber-six-35.vercel.app/`
- **Backend (Render):** `https://gitgaurd-ai.onrender.com`

---

## ✅ What was changed in the code

### Frontend
| File | Change |
|------|--------|
| [`frontend/.env`](frontend/.env:1) | `VITE_API_URL` → `https://gitgaurd-ai.onrender.com` |
| [`frontend/src/services/api.js`](frontend/src/services/api.js:8) | Production fallback → Render backend URL |
| [`frontend/src/config/constants.js`](frontend/src/config/constants.js:3) | `BASE_URL_PROD` → Render backend URL |
| [`frontend/src/pages/EnterpriseLandingPage.jsx`](frontend/src/pages/EnterpriseLandingPage.jsx:27) | Fallback → Render backend URL |

### Backend
| File | Change |
|------|--------|
| [`backend/src/server.js`](backend/src/server.js:25) | CORS now reads `FRONTEND_URL` env var + allows any `*.vercel.app` preview URL |
| [`backend/src/services/openRouterService.js`](backend/src/services/openRouterService.js:15) | `HTTP-Referer` → `APP_URL` env var (production frontend) |
| [`backend/src/services/ragService.js`](backend/src/services/ragService.js:43) | `HTTP-Referer` → `APP_URL` env var |
| [`backend/src/services/embeddingService.js`](backend/src/services/embeddingService.js:32) | `HTTP-Referer` → `APP_URL` env var |
| [`backend/src/services/skillsAnalysisService.js`](backend/src/services/skillsAnalysisService.js:65) | `HTTP-Referer` → `APP_URL` env var |

> ⚠️ **Important:** `frontend/.env` and `backend/.env` are **gitignored** and will NOT be deployed.
> You MUST set the environment variables below in the **Vercel** and **Render** dashboards.

---

## 1️⃣ Vercel — Frontend Environment Variables

Go to your Vercel project → **Settings → Environment Variables** and add:

| Key | Value | Environments |
|-----|-------|--------------|
| `VITE_API_URL` | `https://gitgaurd-ai.onrender.com` | Production, Preview, Development |
| `VITE_CLERK_PUBLISHABLE_KEY` | *(your Clerk publishable key — copy from `frontend/.env`)* | Production, Preview, Development |

After adding these, **redeploy** the frontend (Vercel → Deployments → Redeploy, or push a new commit).

---

## 2️⃣ Render — Backend Environment Variables

Go to your Render service → **Environment** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | *(your MongoDB Atlas connection string — copy from `backend/.env`)* |
| `OPENROUTER_API_KEY` | *(your OpenRouter API key — copy from `backend/.env`)* |
| `OPENROUTER_MODEL` | `openrouter/free` |
| `CLERK_SECRET_KEY` | *(your Clerk secret key — copy from `backend/.env`)* |
| `CLERK_PUBLISHABLE_KEY` | *(your Clerk publishable key — copy from `backend/.env`)* |
| `FRONTEND_URL` | `https://frontend-amber-six-35.vercel.app` |
| `APP_URL` | `https://frontend-amber-six-35.vercel.app` |

> ℹ️ Render auto-assigns `PORT` — do **not** set it manually. The backend reads `process.env.PORT`.

After adding these, **restart** the Render service (Manual Deploy → Deploy latest commit).

---

## 3️⃣ Clerk Dashboard — Allowed Origins

Clerk must allow your Vercel URL for authentication to work in production.

Go to **[Clerk Dashboard](https://dashboard.clerk.com)** → your app → **User & Authentication → Restrictions** (or **Settings → Domains**) and add:

| Setting | Value |
|---------|-------|
| **Allowed Origins** (or **Production Redirect URLs**) | `https://frontend-amber-six-35.vercel.app` |
| **Sign-in / Sign-up redirect URL** | `https://frontend-amber-six-35.vercel.app` |
| **After sign-out URL** | `https://frontend-amber-six-35.vercel.app` |

Also add any Vercel **preview** URLs you want to test (e.g. `https://frontend-amber-six-35-git-main-*.vercel.app`).

---

## 4️⃣ Verify the connection

1. **Backend health check** — open in your browser:
   ```
   https://gitgaurd-ai.onrender.com/health
   ```
   You should see JSON with `"success": true` and database `state: "connected"`.

2. **Frontend → Backend** — visit `https://frontend-amber-six-35.vercel.app/` and:
   - Open DevTools → Network tab.
   - Log in / upload a document / open the chat.
   - Confirm requests go to `https://gitgaurd-ai.onrender.com/api/...` and return `200`.

3. **CORS check** — if you see CORS errors in the console, ensure `FRONTEND_URL` is set correctly on Render and the service has been restarted.

---

## 🔧 Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Network error — unable to reach the server` | Render free tier **sleeps** after inactivity. First request may take ~30–60s to wake it. Wait and retry. |
| `CORS / Not allowed by CORS` | Set `FRONTEND_URL` on Render to your exact Vercel URL (no trailing slash). Restart the service. |
| `401 / 403` auth errors | Add the Vercel URL to Clerk's **Allowed Origins**. Ensure `CLERK_SECRET_KEY` on Render matches the Clerk instance of the frontend's publishable key. |
| Upload fails / `500` | Render free tier has limited memory; large PDFs may time out. The backend skips rate-limiting on `/upload`. |
| OpenRouter errors | Ensure `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` are set on Render. `HTTP-Referer` now uses `APP_URL`. |

---

## 📝 Notes

- **Render free tier cold starts:** The first request after idle time spins up the service (~30–60s). Consider upgrading or using a keep-alive ping for production traffic.
- **Vercel preview URLs:** The backend CORS is configured to allow **any** `*.vercel.app` subdomain once a vercel.app origin is in `FRONTEND_URL`, so preview deployments work automatically.
- **Local development still works:** The Vite dev proxy (`/api` → `localhost:5004`) and localhost CORS origins are preserved, so `npm run dev` is unaffected.
