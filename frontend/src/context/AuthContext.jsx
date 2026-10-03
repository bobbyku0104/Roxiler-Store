import { useState } from 'react'
import { AuthContext } from './auth-context'
import client from '../api/client'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user'))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser)

  function saveSession({ token, user }) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
    return user
  }

  async function login(email, password) {
    const { data } = await client.post('/auth/login', { email, password })
    return saveSession(data)
  }

  async function signup(form) {
    const { data } = await client.post('/auth/signup', form)
    return saveSession(data)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
