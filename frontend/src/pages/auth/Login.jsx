import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useForm } from '../../hooks/useForm'
import { getErrorMessage } from '../../api/client'
import { required, validateEmail } from '../../utils/validators'
import AuthLayout from '../../components/AuthLayout'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

const validators = {
  email: validateEmail,
  password: required('Password'),
}

export default function Login() {
  const { login } = useAuth()
  const { values, errors, handleChange, handleBlur, validate } = useForm(
    { email: '', password: '' },
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
      await login(values.email.trim(), values.password)
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to rate and review stores"
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Alert>{error}</Alert>

        <FormField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          autoFocus
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
      </form>
    </AuthLayout>
  )
}
