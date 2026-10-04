import axios from 'axios'

const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

client.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && tokenStorage.get()) {
      unauthorizedHandler?.(error.response.data?.message)
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error) {
  if (!error.response) {
    return 'Cannot reach the server. Please check your connection and try again.'
  }
  return error.response.data?.message || 'Something went wrong. Please try again.'
}

export function getFieldErrors(error) {
  const list = error.response?.data?.errors || []
  return Object.fromEntries(list.map((item) => [item.field, item.message]))
}

export default client
