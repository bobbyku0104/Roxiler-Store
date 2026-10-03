import { useState } from 'react'
import client, { getErrorMessage, getFieldErrors } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { runValidators, validateAddress, validateEmail, validateName } from '../../utils/validation'
import FormField from '../../components/FormField'

const validators = {
  name: validateName,
  email: validateEmail,
  address: validateAddress,
}

export default function AddStoreForm({ onSuccess }) {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' })
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const { data: ownersData } = useApi('/admin/users', { role: 'owner' })
  const owners = ownersData?.users || []

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
      await client.post('/admin/stores', { ...form, ownerId: form.ownerId || null })
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

      <FormField label="Store Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
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

      <div className="form-field">
        <label htmlFor="ownerId">Store Owner</label>
        <select id="ownerId" name="ownerId" value={form.ownerId} onChange={handleChange}>
          <option value="">No owner</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name} ({owner.email})
            </option>
          ))}
        </select>
        {errors.ownerId && <span className="field-error">{errors.ownerId}</span>}
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : 'Add Store'}
      </button>
    </form>
  )
}
