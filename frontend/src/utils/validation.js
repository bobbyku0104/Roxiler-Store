const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/

export function validateName(value) {
  const length = value.trim().length
  if (length < 20 || length > 60) return 'Name must be between 20 and 60 characters'
  return ''
}

export function validateEmail(value) {
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email address'
  return ''
}

export function validateAddress(value) {
  if (!value.trim()) return 'Address is required'
  if (value.length > 400) return 'Address can be at most 400 characters'
  return ''
}

export function validatePassword(value) {
  if (!PASSWORD_REGEX.test(value)) {
    return 'Password must be 8-16 characters with at least one uppercase letter and one special character'
  }
  return ''
}

export function runValidators(values, validators) {
  const errors = {}
  for (const [field, validator] of Object.entries(validators)) {
    const message = validator(values[field] || '')
    if (message) errors[field] = message
  }
  return errors
}
