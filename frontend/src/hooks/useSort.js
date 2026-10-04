import { useCallback, useState } from 'react'

export function useSort(defaultSortBy, defaultOrder = 'asc') {
  const [sort, setSort] = useState({ sortBy: defaultSortBy, order: defaultOrder })

  const toggleSort = useCallback((key) => {
    setSort((prev) =>
      prev.sortBy === key
        ? { sortBy: key, order: prev.order === 'asc' ? 'desc' : 'asc' }
        : { sortBy: key, order: 'asc' },
    )
  }, [])

  return { sort, setSort, toggleSort }
}
