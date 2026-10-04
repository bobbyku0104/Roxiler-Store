import { useState } from 'react'
import { getStores, rateStore } from '../../api/stores'
import { getErrorMessage } from '../../api/client'
import { useFetch } from '../../hooks/useFetch'
import { useFilters } from '../../hooks/useFilters'
import { useSort } from '../../hooks/useSort'
import { useToast } from '../../hooks/useToast'
import PageHeader from '../../components/PageHeader'
import FilterBar from '../../components/FilterBar'
import DataTable from '../../components/DataTable'
import StarRating from '../../components/StarRating'
import RatingControl from '../../components/RatingControl'
import Alert from '../../components/Alert'

const FILTER_FIELDS = [
  { name: 'name', label: 'Store name', placeholder: 'Search by store name' },
  { name: 'address', label: 'Address', placeholder: 'Search by address' },
]

export default function StoresPage() {
  const { showToast } = useToast()
  const { filters, debouncedFilters, handleChange, reset, isActive } = useFilters({ name: '', address: '' })
  const { sort, toggleSort } = useSort('name')
  const { data: stores = [], loading, error, reload } = useFetch(getStores, { ...debouncedFilters, ...sort })
  const [savingId, setSavingId] = useState(null)

  async function handleRate(store, rating) {
    setSavingId(store.id)
    try {
      await rateStore(store.id, rating)
      showToast(
        store.myRating
          ? `Your rating for ${store.name} was updated to ${rating}`
          : `Thanks! You rated ${store.name} ${rating} out of 5`,
      )
      reload()
    } catch (err) {
      showToast(getErrorMessage(err), 'error')
    } finally {
      setSavingId(null)
    }
  }

  const columns = [
    { key: 'name', label: 'Store', sortable: true, className: 'font-medium text-slate-900' },
    { key: 'address', label: 'Address', sortable: true, className: 'max-w-xs' },
    {
      key: 'rating',
      label: 'Overall rating',
      sortable: true,
      render: (store) => <StarRating value={store.averageRating} count={store.ratingCount} size="text-sm" />,
    },
    {
      key: 'myRating',
      label: 'Your rating',
      sortable: true,
      render: (store) => (
        <div className="flex flex-col items-end gap-0.5 md:items-start">
          <RatingControl
            value={store.myRating}
            onChange={(rating) => handleRate(store, rating)}
            disabled={savingId === store.id}
          />
          <span className="text-xs text-slate-400">
            {store.myRating ? 'Click a star to change' : 'Not rated yet - click to rate'}
          </span>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Stores" description="Find a store and share your rating from 1 to 5." />

      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={handleChange} onReset={reset} isActive={isActive} />

      <Alert onRetry={reload}>{error}</Alert>

      <DataTable
        columns={columns}
        rows={stores}
        sort={sort}
        onSort={toggleSort}
        loading={loading}
        emptyMessage={isActive ? 'No stores match your search' : 'No stores have been added yet'}
      />
    </>
  )
}
