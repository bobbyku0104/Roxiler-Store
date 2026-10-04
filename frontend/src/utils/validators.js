// Mirrors the backend rules in backend/src/utils/rules.js
export const NAME_MIN = 20
export const NAME_MAX = 60
export const STORE_NAME_MAX = 60
export const ADDRESS_MAX = 400

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const PASSWORD_HINT = '8-16 characters, with at least one uppercase letter and one special character'

export function validateName(value) {
  const length = value.trim().length
  if (length < NAME_MIN || length > NAME_MAX) {
    return `Name must be between ${NAME_MIN} and ${NAME_MAX} characters (currently ${length})`
  }
  return ''
}

export function validateStoreName(value) {
  const length = value.trim().length
  if (!length) return 'Store name is required'
  if (length > STORE_NAME_MAX) return `Store name can be at most ${STORE_NAME_MAX} characters`
  return ''
}

export function validateEmail(value) {
  if (!value.trim()) return 'Email is required'
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address'
  return ''
}

export function validateAddress(value) {
  if (value.length > ADDRESS_MAX) return `Address can be at most ${ADDRESS_MAX} characters`
  return ''
}

export function validatePassword(value) {
  if (!PASSWORD_REGEX.test(value)) return `Password must be ${PASSWORD_HINT}`
  return ''
}

export function required(label) {
  return (value) => (value.trim() ? '' : `${label} is required`)
}
