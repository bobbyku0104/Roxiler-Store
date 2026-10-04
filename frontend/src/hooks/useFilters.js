import { useState } from 'react'
import { useDebounce } from './useDebounce'

export function useFilters(initialFilters, delay = 300) {
  const [filters, setFilters] = useState(initialFilters)
  const debouncedFilters = useDebounce(filters, delay)

  function handleChange(e) {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  function reset() {
    setFilters(initialFilters)
  }

  const isActive = Object.values(filters).some((value) => value !== '')

  return { filters, debouncedFilters, handleChange, reset, isActive }
}
