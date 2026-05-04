import { clerkMiddleware, requireAuth } from '@clerk/express';

export const clerkAuth = clerkMiddleware();

export const protectWithClerk = requireAuth({
  onError: (error) => {
    console.error('Clerk auth error:', error);
  }
});
