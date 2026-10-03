import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import { HOME_BY_ROLE } from '../utils/roles'
import {
  runValidators,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../utils/validation'
import FormField from '../components/FormField'

const validators = {
  name: validateName,
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
}

export default function Signup() {
  const { user, signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) {
    return <Navigate to={HOME_BY_ROLE[user.role]} replace />
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const formErrors = runValidators(form, validators)
    setErrors(formErrors)
    if (Object.keys(formErrors).length) return

    setLoading(true)
    try {
      await signup(form)
      navigate('/stores')
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="card auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Create Account</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Address"
          name="address"
          as="textarea"
          rows={3}
          value={form.address}
          onChange={handleChange}
          error={errors.address}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  )
}
