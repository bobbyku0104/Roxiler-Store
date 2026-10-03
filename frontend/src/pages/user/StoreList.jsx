import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import RatingBadge from '../../components/RatingBadge'
import RateStoreForm from './RateStoreForm'

const emptySearch = { name: '', address: '' }

export default function StoreList() {
  const [search, setSearch] = useState(emptySearch)
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' })
  const [selectedStore, setSelectedStore] = useState(null)
  const [message, setMessage] = useState('')

  const debouncedSearch = useDebounce(search)
  const { data, loading, error, reload } = useApi('/stores', { ...debouncedSearch, ...sort })

  function handleSearchChange(e) {
    setSearch({ ...search, [e.target.name]: e.target.value })
  }

  function handleRated() {
    setMessage(`Your rating for "${selectedStore.name}" has been saved`)
    setSelectedStore(null)
    reload()
  }

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Overall Rating',
      sortable: true,
      render: (store) => <RatingBadge value={store.rating} />,
    },
    {
      key: 'myRating',
      label: 'Your Rating',
      render: (store) =>
        store.myRating ? (
          <span className="rating-badge">★ {store.myRating}</span>
        ) : (
          <span className="rating-empty">Not rated</span>
        ),
    },
    {
      key: 'actions',
      label: '',
      render: (store) => (
        <button
          className={store.myRating ? 'btn btn-outline btn-sm' : 'btn btn-primary btn-sm'}
          onClick={() => {
            setMessage('')
            setSelectedStore(store)
          }}
        >
          {store.myRating ? 'Modify' : 'Rate'}
        </button>
      ),
    },
  ]

  return (
    <>
      <div className="page-header">
        <h2>Stores</h2>
      </div>

      <div className="filters">
        <input name="name" placeholder="Search by store name" value={search.name} onChange={handleSearchChange} />
        <input
          name="address"
          placeholder="Search by address"
          value={search.address}
          onChange={handleSearchChange}
        />
        <button className="btn btn-outline" onClick={() => setSearch(emptySearch)}>
          Clear
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <DataTable
        columns={columns}
        rows={data?.stores || []}
        sort={sort}
        onSort={setSort}
        loading={loading}
        emptyText="No stores found"
      />

      {selectedStore && (
        <Modal
          title={selectedStore.myRating ? `Modify rating: ${selectedStore.name}` : `Rate ${selectedStore.name}`}
          onClose={() => setSelectedStore(null)}
        >
          <RateStoreForm store={selectedStore} onSuccess={handleRated} />
        </Modal>
      )}
    </>
  )
}
