import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

// Wrap any route element in this to require the user to be logged in.
// Pass adminOnly to additionally require role === 'admin'.
function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loading message="Checking your session..." />
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
