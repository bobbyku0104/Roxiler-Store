import { useState } from 'react'
import client, { getErrorMessage, getFieldErrors } from '../../api/client'
import {
  runValidators,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validation'
import { ROLE_LABELS } from '../../utils/roles'
import FormField from '../../components/FormField'

const validators = {
  name: validateName,
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
}

export default function AddUserForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

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

    setSaving(true)
    try {
      await client.post('/admin/users', form)
      onSuccess()
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {error && <div className="alert alert-error">{error}</div>}

      <FormField label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
      <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
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

      <div className="form-field">
        <label htmlFor="role">Role</label>
        <select id="role" name="role" value={form.role} onChange={handleChange}>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Add User'}
      </button>
    </form>
  )
}
