import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query';
import App from './App';
import { DEV_MODE, DevAuthProvider, DevUserProvider } from './lib/devAuth';
import toast from 'react-hot-toast';
import './index.css';

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // Global error handler for all query failures
    onError: (error) => {
      // Only show toast for network/server errors, not auth or client errors
      // (those are typically handled by the component itself)
      if (error?.isNetworkError) {
        toast.error('Network error — unable to reach the server. Please check your connection.', {
          id: 'network-error', // deduplicate toasts
          duration: 5000,
        });
      } else if (error?.isServerError && !error?.isAuthError) {
        toast.error('Server error — something went wrong on our end. Please try again later.', {
          id: 'server-error',
          duration: 5000,
        });
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        // Don't retry auth errors — they need user intervention
        if (error?.isAuthError) return false;
        // Don't retry client errors (4xx) except 429 (rate limit) and 408 (timeout)
        if (error?.status >= 400 && error?.status < 500 && error?.status !== 429 && error?.status !== 408) return false;
        // Retry network errors and server errors up to 3 times
        if (error?.isNetworkError || error?.isServerError) return failureCount < 3;
        // Default: retry up to 2 times
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false, // Don't auto-retry mutations — user decides
    },
  },
});

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder';

// Conditionally wrap with ClerkProvider (production) or DevAuthProvider (dev mode)
// In dev mode, ClerkProvider would fail with a placeholder key, so we bypass it entirely
const AuthProvider = DEV_MODE
  ? ({ children }) => (
    <DevAuthProvider>
      <DevUserProvider>
        {children}
      </DevUserProvider>
    </DevAuthProvider>
  )
  : ({ children }) => (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      {children}
    </ClerkProvider>
  );

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
