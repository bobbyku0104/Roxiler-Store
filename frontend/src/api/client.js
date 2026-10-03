import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error) {
  return error.response?.data?.message || 'Something went wrong. Please try again.'
}

export function getFieldErrors(error) {
  const list = error.response?.data?.errors || []
  return list.reduce((acc, item) => ({ ...acc, [item.field]: item.message }), {})
}

export default client
