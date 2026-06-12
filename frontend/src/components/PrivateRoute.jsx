import { useAuth } from '@clerk/react';
import { Navigate } from 'react-router-dom';

/**
 * Protects routes — redirects unauthenticated users to /sign-in.
 * Shows a loading spinner while Clerk is resolving auth state.
 */
const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Clerk is still loading — show a clean spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400 font-medium">Loading authentication…</p>
        </div>
      </div>
    );
  }

  // Not signed in — redirect to sign-in page
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Signed in — render the protected content
  return children;
};

export default PrivateRoute;
