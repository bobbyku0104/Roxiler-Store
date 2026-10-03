import { useState } from 'react'
import client, { getErrorMessage } from '../api/client'
import { validatePassword } from '../utils/validation'
import FormField from '../components/FormField'

const emptyForm = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ChangePassword() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    const formErrors = {}
    if (!form.currentPassword) formErrors.currentPassword = 'Current password is required'
    const passwordError = validatePassword(form.newPassword)
    if (passwordError) formErrors.newPassword = passwordError
    if (form.newPassword !== form.confirmPassword) formErrors.confirmPassword = 'Passwords do not match'

    setErrors(formErrors)
    if (Object.keys(formErrors).length) return

    setLoading(true)
    try {
      await client.patch('/auth/password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      setForm(emptyForm)
      setMessage({ type: 'success', text: 'Password updated successfully' })
    } catch (err) {
      setMessage({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="narrow">
      <form className="card" onSubmit={handleSubmit} noValidate>
        <h2>Change Password</h2>

        {message.text && <div className={`alert alert-${message.type}`}>{message.text}</div>}

        <FormField
          label="Current Password"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
        <FormField
          label="New Password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
        />
        <FormField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
