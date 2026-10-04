import { useState } from 'react'
import { changePassword } from '../../api/auth'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { useForm } from '../../hooks/useForm'
import { useToast } from '../../hooks/useToast'
import { PASSWORD_HINT, required, validatePassword } from '../../utils/validators'
import PageHeader from '../../components/PageHeader'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

const validators = {
  currentPassword: required('Current password'),
  newPassword: (value, values) => {
    if (value && value === values.currentPassword) {
      return 'New password must be different from the current one'
    }
    return validatePassword(value)
  },
  confirmPassword: (value, values) => (value === values.newPassword ? '' : 'Passwords do not match'),
}

const initialValues = { currentPassword: '', newPassword: '', confirmPassword: '' }

export default function ChangePassword() {
  const { showToast } = useToast()
  const { values, errors, setErrors, handleChange, handleBlur, validate, reset } = useForm(
    initialValues,
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
      await changePassword(values.currentPassword, values.newPassword)
      reset()
      showToast('Password updated successfully')
    } catch (err) {
      const fieldErrors = getFieldErrors(err)
      setErrors(fieldErrors)
      if (!Object.keys(fieldErrors).length) setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg">
      <PageHeader title="Change password" description="Use a password you don't use anywhere else." />

      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Alert>{error}</Alert>

        <FormField
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={values.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
        />
        <FormField
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          value={values.newPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.newPassword}
          hint={PASSWORD_HINT}
          maxLength={16}
        />
        <FormField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.confirmPassword}
          maxLength={16}
        />

        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </form>
    </div>
  )
}
