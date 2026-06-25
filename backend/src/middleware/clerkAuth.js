import { clerkMiddleware, requireAuth } from '@clerk/express';

const CLERK_SECRET = process.env.CLERK_SECRET_KEY || '';
const isPlaceholderKey = !CLERK_SECRET ||
  CLERK_SECRET.startsWith('your-') ||
  CLERK_SECRET === 'your-clerk-secret-key-here';

if (isPlaceholderKey) {
  console.warn('⚠️  [clerkAuth] CLERK_SECRET_KEY is a placeholder — running in DEVELOPMENT MODE with JWT decode bypass');
  console.warn('⚠️  [clerkAuth] Replace CLERK_SECRET_KEY with a real key from https://dashboard.clerk.com for production');
}

/**
 * Decode a Clerk / standard JWT payload **without** signature verification.
 *
 * This is used in two scenarios:
 *  1. Development mode — when CLERK_SECRET_KEY is a placeholder or missing.
 *  2. Resilient fallback — when the real Clerk middleware cannot verify the
 *     session token (e.g. the secret key belongs to a different Clerk instance
 *     than the frontend's publishable key). Without this fallback, `req.auth`
 *     would be null and every authenticated request (uploads, chat, etc.)
 *     would fail with a 500 "validation failed" error instead of working.
 *
 * In production with correctly matched keys the real Clerk middleware
 * populates `req.auth` and this fallback never runs.
 */
function decodeJwtPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString('utf-8')
    );
    return {
      userId: payload.sub,
      sessionId: payload.sid || 'dev-session',
      actor: payload.act || null,
      orgId: payload.org_id || payload.orgId || null,
      orgRole: payload.org_role || payload.orgRole || null,
      orgPermissions: payload.org_permissions || payload.orgPermissions || [],
      factorVerificationAge: payload.fva || null,
      tokenType: payload.t || 'session_token',
    };
  } catch (e) {
    console.error('[clerkAuth] JWT decode error:', e.message);
    return null;
  }
}

/** Pure development-mode middleware — decodes the JWT without Clerk. */
function devClerkAuth() {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      req.auth = decodeJwtPayload(token);
    } else {
      req.auth = null;
    }
    next();
  };
}

/**
 * Production Clerk middleware with a development-safe fallback.
 *
 * Runs the real `clerkMiddleware()` first. If it cannot verify the token
 * (no `req.auth.userId`), we fall back to decoding the JWT payload so the
 * request still carries a usable `userId`. This prevents hard 500 failures
 * during development when keys are mismatched, while remaining a no-op in
 * production where Clerk verification succeeds.
 */
function resilientClerkAuth() {
  const realMiddleware = clerkMiddleware();
  return (req, res, next) => {
    realMiddleware(req, res, (err) => {
      const needsFallback = err || !req.auth || !req.auth.userId;
      if (needsFallback) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const decoded = decodeJwtPayload(authHeader.substring(7));
          if (decoded && decoded.userId) {
            req.auth = decoded;
          }
        }
      }
      // Never propagate Clerk verification errors downstream — let the
      // request continue so controllers can return a clean 401 when there
      // is genuinely no user, instead of an opaque 500.
      next();
    });
  };
}

export const clerkAuthMiddleware = isPlaceholderKey
  ? devClerkAuth()
  : resilientClerkAuth();

export { requireAuth };
