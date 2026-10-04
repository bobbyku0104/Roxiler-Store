import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './contexts'
import * as authApi from '../api/auth'
import { setUnauthorizedHandler, tokenStorage } from '../api/client'
import { useToast } from '../hooks/useToast'
import { ROLES } from '../utils/roles'

const USER_KEY = 'user'

function readStoredUser() {
  if (!tokenStorage.get()) return null
  try {
    const user = JSON.parse(localStorage.getItem(USER_KEY))
    return user && Object.values(ROLES).includes(user.role) ? user : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)
  // True when the user clicked "Log out" (as opposed to the session expiring),
  // so the login page shouldn't send the next person back to the old page.
  const [loggedOutByUser, setLoggedOutByUser] = useState(false)
  const { showToast } = useToast()

  const saveSession = useCallback(({ token, user }) => {
    tokenStorage.set(token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
    setLoggedOutByUser(false)
    return user
  }, [])

  const clearSession = useCallback(() => {
    tokenStorage.clear()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    setLoggedOutByUser(true)
    clearSession()
  }, [clearSession])

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      clearSession()
      showToast(message || 'Your session has ended, please log in again', 'error')
    })
    return () => setUnauthorizedHandler(null)
  }, [clearSession, showToast])

  // Refresh the saved profile on load so changes made by an admin are picked up.
  useEffect(() => {
    if (!tokenStorage.get()) return

    authApi
      .getCurrentUser()
      .then((freshUser) => {
        localStorage.setItem(USER_KEY, JSON.stringify(freshUser))
        setUser(freshUser)
      })
      .catch(() => {})
  }, [])

  const value = useMemo(
    () => ({
      user,
      loggedOutByUser,
      login: async (email, password) => saveSession(await authApi.login(email, password)),
      signup: async (form) => saveSession(await authApi.signup(form)),
      logout,
    }),
    [user, loggedOutByUser, saveSession, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
