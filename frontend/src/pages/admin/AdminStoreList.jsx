import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import RatingBadge from '../../components/RatingBadge'
import AddStoreForm from './AddStoreForm'

const emptyFilters = { name: '', email: '', address: '' }

export default function AdminStoreList() {
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' })
  const [showAdd, setShowAdd] = useState(false)

  const debouncedFilters = useDebounce(filters)
  const { data, loading, error, reload } = useApi('/admin/stores', { ...debouncedFilters, ...sort })

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleStoreAdded() {
    setShowAdd(false)
    reload()
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'rating', label: 'Rating', sortable: true, render: (store) => <RatingBadge value={store.rating} /> },
    { key: 'owner', label: 'Owner', render: (store) => store.owner?.name || '-' },
  ]

  return (
    <>
      <div className="page-header">
        <h2>Stores</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add Store
        </button>
      </div>

      <div className="filters">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} />
        <button className="btn btn-outline" onClick={() => setFilters(emptyFilters)}>
          Clear
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <DataTable columns={columns} rows={data?.stores || []} sort={sort} onSort={setSort} loading={loading} />

      {showAdd && (
        <Modal title="Add Store" onClose={() => setShowAdd(false)}>
          <AddStoreForm onSuccess={handleStoreAdded} />
        </Modal>
      )}
    </>
  )
}
