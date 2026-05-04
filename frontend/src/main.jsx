import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/enterprise.css'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { setClerkTokenGetter } from './utils/api.js'

// Component to set up Clerk token getter
function ClerkTokenProvider({ children }) {
  const { getToken } = useAuth()

  React.useEffect(() => {
    setClerkTokenGetter(() => getToken)
  }, [getToken])

  return children
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
    >
      <ClerkTokenProvider>
        <App />
      </ClerkTokenProvider>
    </ClerkProvider>
  </React.StrictMode>,
)
