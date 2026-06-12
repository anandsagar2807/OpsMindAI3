// Real Clerk auth hooks — replaces the previous dev-mode mock.
// All components import { useAuth, useUser } from here so auth
// can be swapped or extended in one place.

import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/react';

export const useAuth = useClerkAuth;
export const useUser = useClerkUser;