import { useAuth as clerkUseAuth, useUser as clerkUseUser } from '@clerk/react';
import { DEV_MODE, useDevAuth, useDevUser } from '../lib/devAuth';

/**
 * Unified auth hooks that automatically switch between Clerk and dev-mode
 * based on whether the Clerk publishable key is a placeholder.
 *
 * DEV_MODE is a constant evaluated at module load time from import.meta.env,
 * so the conditional is effectively static — only one branch ever runs.
 *
 * In dev mode: useDevAuth/useDevUser are called (requires DevAuthProvider in tree)
 * In Clerk mode: clerkUseAuth/clerkUseUser are called (requires ClerkProvider in tree)
 *
 * Usage: Replace `import { useAuth } from '@clerk/react'` with
 *        `import { useAuth } from '../hooks/useAuthContext'`
 */

export const useAuth = () => {
    if (DEV_MODE) {
        return useDevAuth();
    }
    return clerkUseAuth();
};

export const useUser = () => {
    if (DEV_MODE) {
        return useDevUser();
    }
    return clerkUseUser();
};