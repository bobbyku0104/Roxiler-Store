import client from './client'

export async function getDashboard() {
  const { data } = await client.get('/admin/dashboard')
  return data
}

export async function getUsers(params) {
  const { data } = await client.get('/admin/users', { params })
  return data.users
}

export async function getUser(id) {
  const { data } = await client.get(`/admin/users/${id}`)
  return data.user
}

export async function createUser(user) {
  const { data } = await client.post('/admin/users', user)
  return data.user
}

export async function getOwners() {
  const { data } = await client.get('/admin/owners')
  return data.owners
}

export async function getStores(params) {
  const { data } = await client.get('/admin/stores', { params })
  return data.stores
}

export async function createStore(store) {
  const { data } = await client.post('/admin/stores', store)
  return data.store
}
