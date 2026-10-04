import client, { tokenStorage } from './client'

export async function login(email, password) {
  const { data } = await client.post('/auth/login', { email, password })
  return data
}

export async function signup(form) {
  const { data } = await client.post('/auth/signup', form)
  return data
}

export async function getCurrentUser() {
  const { data } = await client.get('/auth/me')
  return data.user
}

export async function changePassword(currentPassword, newPassword) {
  const { data } = await client.put('/auth/password', { currentPassword, newPassword })
  // The server invalidates older tokens when the password changes, so keep the new one.
  tokenStorage.set(data.token)
  return data
}
