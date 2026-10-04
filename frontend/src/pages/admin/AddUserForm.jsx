import { useState } from 'react'
import { createUser } from '../../api/admin'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { useForm } from '../../hooks/useForm'
import { ROLE_LABELS, ROLES } from '../../utils/roles'
import {
  ADDRESS_MAX,
  NAME_MAX,
  NAME_MIN,
  PASSWORD_HINT,
  validateAddress,
  validateEmail,
  validateName,
  validatePassword,
} from '../../utils/validators'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

const validators = {
  name: validateName,
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
}

export default function AddUserForm({ onCreated, onCancel }) {
  const { values, errors, setErrors, handleChange, handleBlur, validate } = useForm(
    { name: '', email: '', address: '', password: '', role: ROLES.USER },
    validators,
  )
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const user = await createUser({
        name: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim() || null,
        password: values.password,
        role: values.role,
      })
      onCreated(user)
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Alert>{error}</Alert>

      <FormField
        label="Full name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        hint={`${NAME_MIN}-${NAME_MAX} characters`}
        maxLength={NAME_MAX}
        autoFocus
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        hint={PASSWORD_HINT}
        maxLength={16}
      />
      <FormField
        label="Address"
        name="address"
        as="textarea"
        rows={2}
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.address}
        maxLength={ADDRESS_MAX}
        optional
      />
      <FormField label="Role" name="role" as="select" value={values.role} onChange={handleChange} error={errors.role}>
        {Object.values(ROLES).map((role) => (
          <option key={role} value={role}>
            {ROLE_LABELS[role]}
          </option>
        ))}
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Add user
        </Button>
      </div>
    </form>
  )
}
