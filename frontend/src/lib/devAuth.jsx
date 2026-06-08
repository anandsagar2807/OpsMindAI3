import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Dev-mode authentication bypass for when Clerk publishable key is a placeholder.
 * This mirrors the backend's devClerkAuth() middleware pattern.
 */

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

const PLACEHOLDER_PATTERNS = [
    'pk_test_placeholder',
    'your-clerk-publishable-key-here',
];

/**
 * Detects if the app should run in dev mode (custom signup/signin forms)
 * or production mode (Clerk hosted auth).
 *
 * Controlled by VITE_DEV_MODE in frontend/.env:
 *   - "true"  → use custom forms (DevAuthProvider)
 *   - "false" → use Clerk auth (ClerkProvider)
 *
 * Also falls back to dev mode if the Clerk publishable key is missing or
 * a known placeholder value.
 */
export const isDevMode = () => {
    // ── Check .env flag first ──
    const envDevMode = import.meta.env.VITE_DEV_MODE;
    if (envDevMode === 'true') return true;
    if (envDevMode === 'false') return false;

    // ── Auto-detect: missing or placeholder key → dev mode ──
    if (!CLERK_PUBLISHABLE_KEY) return true;
    if (PLACEHOLDER_PATTERNS.includes(CLERK_PUBLISHABLE_KEY)) return true;
    // Also detect patterns like "your-" prefix or "placeholder" in the key
    if (CLERK_PUBLISHABLE_KEY.startsWith('your-') || CLERK_PUBLISHABLE_KEY.includes('placeholder')) return true;
    // A real Clerk key starts with pk_test_ or pk_live_ and is longer than typical placeholders
    // But our placeholder also starts with pk_test_, so we check against known placeholder values
    return false;
};

const DEV_MODE = isDevMode();

if (DEV_MODE) {
    console.warn('⚠️  [devAuth] Clerk publishable key is a placeholder or missing — running in DEVELOPMENT MODE with auth bypass');
    console.warn('⚠️  [devAuth] Replace VITE_CLERK_PUBLISHABLE_KEY with a real key from https://dashboard.clerk.com for production');
}

/**
 * Creates a dev-mode JWT token that the backend's devClerkAuth() middleware can decode.
 * Format: header.payload.signature (3 parts, base64url-encoded payload)
 */
const createDevJWT = () => {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const payload = btoa(JSON.stringify({
        sub: 'dev-user-001',
        sid: 'dev-session-001',
        org_id: null,
        org_role: null,
        org_permissions: [],
        t: 'session_token',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
    }))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    // Fake signature — backend doesn't verify in dev mode
    const signature = 'dev-signature-bypass';

    return `${header}.${payload}.${signature}`;
};

/**
 * Mock user object that mimics Clerk's User type
 */
const DEV_USER = {
    id: 'dev-user-001',
    fullName: 'Dev User',
    username: 'devuser',
    primaryEmailAddress: { emailAddress: 'dev@opsmind.local' },
    imageUrl: null,
    createdAt: new Date().toISOString(),
    publicMetadata: {},
    unsafeMetadata: {},
};

// ===== React Context for Dev Auth =====

const DevAuthContext = createContext(null);

export const DevAuthProvider = ({ children }) => {
    const [signedIn, setSignedIn] = useState(false); // Start as not signed in so auth forms are visible

    const getToken = useCallback(async () => {
        return createDevJWT();
    }, []);

    const signOut = useCallback(() => {
        setSignedIn(false);
    }, []);

    // Dev-mode signIn — sets signedIn to true (no real auth, any credentials work)
    const signIn = useCallback(async () => {
        setSignedIn(true);
    }, []);

    // Dev-mode signUp — sets signedIn to true (no real auth, any credentials work)
    const signUp = useCallback(async () => {
        setSignedIn(true);
    }, []);

    const value = {
        isLoaded: true,
        isSignedIn: signedIn,
        getToken,
        signOut,
        signIn,
        signUp,
        userId: signedIn ? 'dev-user-001' : null,
        sessionId: signedIn ? 'dev-session-001' : null,
        orgId: null,
    };

    return (
        <DevAuthContext.Provider value={value}>
            {children}
        </DevAuthContext.Provider>
    );
};

export const useDevAuth = () => {
    const context = useContext(DevAuthContext);
    if (!context) {
        throw new Error('useDevAuth must be used within a DevAuthProvider');
    }
    return context;
};

// ===== Dev User Context =====

const DevUserContext = createContext(null);

export const DevUserProvider = ({ children }) => {
    const { isSignedIn } = useDevAuth();

    const value = {
        isSignedIn,
        isLoaded: true,
        user: isSignedIn ? DEV_USER : null,
    };

    return (
        <DevUserContext.Provider value={value}>
            {children}
        </DevUserContext.Provider>
    );
};

export const useDevUser = () => {
    const context = useContext(DevUserContext);
    if (!context) {
        throw new Error('useDevUser must be used within a DevUserProvider');
    }
    return context;
};

export { DEV_USER, DEV_MODE, createDevJWT };
export default { isDevMode, DevAuthProvider, DevUserProvider, useDevAuth, useDevUser };