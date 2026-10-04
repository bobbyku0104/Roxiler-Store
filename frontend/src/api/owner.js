import client from './client'

export async function getDashboard(params) {
  const { data } = await client.get('/owner/dashboard', { params })
  return data
}
