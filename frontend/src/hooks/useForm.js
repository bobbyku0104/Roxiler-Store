import { useState } from 'react'

export function useForm(initialValues, validators = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  function validateField(name, fieldValues = values) {
    const rule = validators[name]
    return rule ? rule(fieldValues[name] ?? '', fieldValues) : ''
  }

  function handleChange(e) {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleBlur(e) {
    const { name } = e.target
    if (values[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name) }))
    }
  }

  function validate() {
    const next = {}
    for (const name of Object.keys(validators)) {
      const message = validateField(name)
      if (message) next[name] = message
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function reset() {
    setValues(initialValues)
    setErrors({})
  }

  return { values, errors, setErrors, handleChange, handleBlur, validate, reset }
}
