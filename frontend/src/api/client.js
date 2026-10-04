import axios from 'axios'

const TOKEN_KEY = 'token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// Accepts "https://my-api.onrender.com", ".../api" or ".../api/" and always ends in /api.
function resolveApiUrl(value) {
  const url = (value || 'http://localhost:5000').trim().replace(/\/+$/, '')
  return url.endsWith('/api') ? url : `${url}/api`
}

const client = axios.create({
  baseURL: resolveApiUrl(import.meta.env.VITE_API_URL),
  // Free hosting tiers can take a while to wake up on the first request.
  timeout: 60000,
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler
}

// Tells the UI when requests are taking unusually long, which on a free
// host almost always means the API is starting up after being idle.
const SLOW_AFTER_MS = 4000
const slowListeners = new Set()
let pendingRequests = 0
let slowTimer = null

export function onSlowServer(listener) {
  slowListeners.add(listener)
  return () => slowListeners.delete(listener)
}

function requestStarted() {
  pendingRequests += 1
  if (pendingRequests === 1) {
    slowTimer = setTimeout(() => slowListeners.forEach((listener) => listener(true)), SLOW_AFTER_MS)
  }
}

function requestFinished() {
  pendingRequests = Math.max(0, pendingRequests - 1)
  if (pendingRequests === 0) {
    clearTimeout(slowTimer)
    slowListeners.forEach((listener) => listener(false))
  }
}

client.interceptors.request.use((config) => {
  requestStarted()
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (response) => {
    requestFinished()
    return response
  },
  (error) => {
    requestFinished()
    if (error.response?.status === 401 && tokenStorage.get()) {
      unauthorizedHandler?.(error.response.data?.message)
    }
    return Promise.reject(error)
  },
)

// Fire-and-forget request so a sleeping API starts booting while the
// visitor is still typing their email and password.
export function wakeUpServer() {
  client.get('/health').catch(() => {})
}

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
