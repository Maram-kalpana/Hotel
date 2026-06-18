import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useStore'
import { ROLES } from '../utils/helpers'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirect = user?.role === ROLES.SUPER_ADMIN ? '/super-admin/dashboard' : '/admin/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}

export default ProtectedRoute
