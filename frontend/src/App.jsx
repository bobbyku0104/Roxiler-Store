import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { HOME_BY_ROLE } from './utils/roles'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ChangePassword from './pages/ChangePassword'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserList from './pages/admin/UserList'
import AdminStoreList from './pages/admin/AdminStoreList'
import StoreList from './pages/user/StoreList'
import OwnerDashboard from './pages/owner/OwnerDashboard'

function HomeRedirect() {
  const { user } = useAuth()
  return <Navigate to={user ? HOME_BY_ROLE[user.role] : '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/stores" element={<AdminStoreList />} />
          </Route>

          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/stores" element={<StoreList />} />
          </Route>

          <Route element={<ProtectedRoute roles={['owner']} />}>
            <Route path="/owner" element={<OwnerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute roles={['user', 'owner']} />}>
            <Route path="/password" element={<ChangePassword />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
