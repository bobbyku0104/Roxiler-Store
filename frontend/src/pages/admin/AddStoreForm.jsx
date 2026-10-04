import { useState } from 'react'
import { createStore, getOwners } from '../../api/admin'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { useForm } from '../../hooks/useForm'
import {
  ADDRESS_MAX,
  STORE_NAME_MAX,
  validateAddress,
  validateEmail,
  validateStoreName,
} from '../../utils/validators'
import FormField from '../../components/FormField'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

const validators = {
  name: validateStoreName,
  email: validateEmail,
  address: validateAddress,
}

export default function AddStoreForm({ onCreated, onCancel }) {
  const { values, errors, setErrors, handleChange, handleBlur, validate } = useForm(
    { name: '', email: '', address: '', ownerId: '' },
    validators,
  )
  const { data: owners = [], loading: loadingOwners } = useFetch(getOwners)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const availableOwners = owners.filter((owner) => !owner.hasStore)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const store = await createStore({
        name: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim() || null,
        ownerId: values.ownerId ? Number(values.ownerId) : null,
      })
      onCreated(store)
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
        label="Store name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        maxLength={STORE_NAME_MAX}
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
      <FormField
        label="Store owner"
        name="ownerId"
        as="select"
        value={values.ownerId}
        onChange={handleChange}
        error={errors.ownerId}
        disabled={loadingOwners}
        hint={
          !loadingOwners && !availableOwners.length
            ? 'Every store owner already has a store. Add a new Store Owner user first.'
            : 'Only store owners without a store are listed.'
        }
        optional
      >
        <option value="">No owner</option>
        {availableOwners.map((owner) => (
          <option key={owner.id} value={owner.id}>
            {owner.name} ({owner.email})
          </option>
        ))}
      </FormField>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          Add store
        </Button>
      </div>
    </form>
  )
}
