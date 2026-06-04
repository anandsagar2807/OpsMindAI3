import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuthContext'

const PrivateRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return isSignedIn ? children : <Navigate to="/" replace />
}

export default PrivateRoute
