import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { HOME_BY_ROLE } from '../utils/roles'

export default function ProtectedRoute({ roles }) {
  const { user, loggedOutByUser } = useAuth()
  const location = useLocation()

  if (!user) {
    const state = loggedOutByUser ? undefined : { from: location.pathname }
    return <Navigate to="/login" replace state={state} />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role]} replace />
  }

  return <Outlet />
}
