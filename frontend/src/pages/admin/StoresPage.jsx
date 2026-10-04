import { useState } from 'react'
import { getStores } from '../../api/admin'
import { useFetch } from '../../hooks/useFetch'
import { useFilters } from '../../hooks/useFilters'
import { useSort } from '../../hooks/useSort'
import { useToast } from '../../hooks/useToast'
import PageHeader from '../../components/PageHeader'
import FilterBar from '../../components/FilterBar'
import DataTable from '../../components/DataTable'
import StarRating from '../../components/StarRating'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Alert from '../../components/Alert'
import AddStoreForm from './AddStoreForm'

const FILTER_FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Search name' },
  { name: 'email', label: 'Email', placeholder: 'Search email' },
  { name: 'address', label: 'Address', placeholder: 'Search address' },
]

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-slate-900' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true, className: 'max-w-xs truncate' },
  {
    key: 'rating',
    label: 'Rating',
    sortable: true,
    render: (store) => <StarRating value={store.averageRating} count={store.ratingCount} size="text-sm" />,
  },
  {
    key: 'owner',
    label: 'Owner',
    render: (store) => store.ownerName || <span className="text-slate-400">Unassigned</span>,
  },
]

export default function StoresPage() {
  const { showToast } = useToast()
  const { filters, debouncedFilters, handleChange, reset, isActive } = useFilters({
    name: '',
    email: '',
    address: '',
  })
  const { sort, toggleSort } = useSort('name')
  const { data: stores = [], loading, error, reload } = useFetch(getStores, { ...debouncedFilters, ...sort })
  const [showForm, setShowForm] = useState(false)

  function handleCreated(store) {
    setShowForm(false)
    showToast(`${store.name} was added`)
    reload()
  }

  return (
    <>
      <PageHeader
        title="Stores"
        description="All stores registered on the platform."
        action={<Button onClick={() => setShowForm(true)}>+ Add store</Button>}
      />

      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={handleChange} onReset={reset} isActive={isActive} />

      <Alert onRetry={reload}>{error}</Alert>

      <DataTable
        columns={COLUMNS}
        rows={stores}
        sort={sort}
        onSort={toggleSort}
        loading={loading}
        emptyMessage={isActive ? 'No stores match these filters' : 'No stores yet'}
      />

      {showForm && (
        <Modal title="Add store" onClose={() => setShowForm(false)}>
          <AddStoreForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </>
  )
}
