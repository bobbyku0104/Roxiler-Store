import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { HOME_BY_ROLE, ROLE_LABELS } from '../utils/roles'

const LINKS = {
  ADMIN: [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/stores', label: 'Stores' },
  ],
  USER: [{ to: '/stores', label: 'Stores' }],
  OWNER: [{ to: '/owner', label: 'Dashboard' }],
}

function linkClasses({ isActive }) {
  return `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [...LINKS[user.role], { to: '/password', label: 'Change Password' }]

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to={HOME_BY_ROLE[user.role]} className="flex items-center gap-2 font-semibold text-slate-900">
          <span className="text-xl text-amber-400">★</span>
          Store Rating
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <div className="text-right leading-tight">
            <p className="max-w-48 truncate text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-expanded={menuOpen}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden">
          <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
          <p className="mb-3 text-xs text-slate-500">{ROLE_LABELS[user.role]}</p>
          <nav className="space-y-1" onClick={() => setMenuOpen(false)}>
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end} className={linkClasses}>
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Log out
            </button>
          </nav>
        </div>
      )}
    </header>
  )
}
