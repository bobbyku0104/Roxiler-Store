import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { useToast } from '../../hooks/useToast'
import { getErrorMessage, getFieldErrors } from '../../api/client'
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
import AuthLayout from '../../components/AuthLayout'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

const validators = {
  name: validateName,
  email: validateEmail,
  address: validateAddress,
  password: validatePassword,
}

export default function Signup() {
  const { signup } = useAuth()
  const { showToast } = useToast()
  const { values, errors, setErrors, handleChange, handleBlur, validate } = useForm(
    { name: '', email: '', address: '', password: '' },
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
      await signup({
        name: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim() || null,
        password: values.password,
      })
      showToast('Account created. Welcome!')
    } catch (err) {
      setErrors(getFieldErrors(err))
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up to start rating stores"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{error}</Alert>

        <FormField
          label="Full name"
          name="name"
          autoComplete="name"
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
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
        />
        <FormField
          label="Address"
          name="address"
          as="textarea"
          rows={3}
          autoComplete="street-address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.address}
          hint={`${values.address.length}/${ADDRESS_MAX} characters`}
          maxLength={ADDRESS_MAX}
          optional
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

        <Button type="submit" loading={submitting} className="w-full">
          Sign up
        </Button>
      </form>
    </AuthLayout>
  )
}
