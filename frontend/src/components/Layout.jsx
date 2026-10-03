import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '../utils/roles'

const LINKS = {
  admin: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  user: [{ to: '/stores', label: 'Stores' }],
  owner: [{ to: '/owner', label: 'Dashboard' }],
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="navbar">
        <span className="brand">Store Ratings</span>

        <nav className="nav-links">
          {LINKS[user.role].map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
          {user.role !== 'admin' && <NavLink to="/password">Change Password</NavLink>}
        </nav>

        <div className="nav-user">
          <span>
            {user.name} <small>({ROLE_LABELS[user.role]})</small>
          </span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}
