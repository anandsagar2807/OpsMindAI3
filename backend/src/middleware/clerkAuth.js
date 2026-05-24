import { clerkMiddleware, requireAuth } from '@clerk/express';

const CLERK_SECRET = process.env.CLERK_SECRET_KEY || '';
const isPlaceholderKey = !CLERK_SECRET ||
  CLERK_SECRET.startsWith('your-') ||
  CLERK_SECRET === 'your-clerk-secret-key-here';

if (isPlaceholderKey) {
  console.warn('⚠️  [clerkAuth] CLERK_SECRET_KEY is a placeholder — running in DEVELOPMENT MODE with JWT decode bypass');
  console.warn('⚠️  [clerkAuth] Replace CLERK_SECRET_KEY with a real key from https://dashboard.clerk.com for production');
}

function devClerkAuth() {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const parts = token.split('.');
        if (parts.length < 2) {
          req.auth = null;
          return next();
        }
        const payload = JSON.parse(
          Buffer.from(parts[1], 'base64url').toString('utf-8')
        );
        req.auth = {
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
        console.error('[clerkAuth] Dev JWT decode error:', e.message);
        req.auth = null;
      }
    } else {
      req.auth = null;
    }
    next();
  };
}

export const clerkAuthMiddleware = isPlaceholderKey
  ? devClerkAuth()
  : clerkMiddleware();

export { requireAuth };
