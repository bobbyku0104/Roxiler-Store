import client from './client'

export async function getStores(params) {
  const { data } = await client.get('/stores', { params })
  return data.stores
}

export async function rateStore(storeId, rating) {
  const { data } = await client.put(`/stores/${storeId}/rating`, { rating })
  return data
}
