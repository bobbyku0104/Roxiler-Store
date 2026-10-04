import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { HOME_BY_ROLE } from '../utils/roles'

// Login and signup pages. Once logged in, send the user back to the page they
// originally asked for (ProtectedRoute bounces them home if it's not theirs).
export default function GuestRoute() {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    return <Navigate to={location.state?.from || HOME_BY_ROLE[user.role]} replace />
  }

  return <Outlet />
}
