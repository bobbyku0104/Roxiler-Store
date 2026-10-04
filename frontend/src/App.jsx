import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { HOME_BY_ROLE, ROLES } from './utils/roles'
import ProtectedRoute from './components/ProtectedRoute'
import GuestRoute from './components/GuestRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ChangePassword from './pages/common/ChangePassword'
import NotFound from './pages/common/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersPage from './pages/admin/UsersPage'
import UserDetailsPage from './pages/admin/UserDetailsPage'
import AdminStoresPage from './pages/admin/StoresPage'
import UserStoresPage from './pages/user/StoresPage'
import OwnerDashboard from './pages/owner/OwnerDashboard'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? HOME_BY_ROLE[user.role] : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/users/:id" element={<UserDetailsPage />} />
            <Route path="/admin/stores" element={<AdminStoresPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={[ROLES.USER]} />}>
            <Route path="/stores" element={<UserStoresPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={[ROLES.OWNER]} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>

          <Route path="/password" element={<ChangePassword />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
