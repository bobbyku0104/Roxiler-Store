import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import { useDebounce } from '../../hooks/useDebounce'
import { ROLE_LABELS } from '../../utils/roles'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import AddUserForm from './AddUserForm'
import UserDetails from './UserDetails'

const emptyFilters = { name: '', email: '', address: '', role: '' }

export default function UserList() {
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' })
  const [showAdd, setShowAdd] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  const debouncedFilters = useDebounce(filters)
  const { data, loading, error, reload } = useApi('/admin/users', { ...debouncedFilters, ...sort })

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function handleUserAdded() {
    setShowAdd(false)
    reload()
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => <span className={`role-tag role-${user.role}`}>{ROLE_LABELS[user.role]}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (user) => (
        <button className="btn btn-outline btn-sm" onClick={() => setSelectedId(user.id)}>
          View
        </button>
      ),
    },
  ]

  return (
    <>
      <div className="page-header">
        <h2>Users</h2>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add User
        </button>
      </div>

      <div className="filters">
        <input name="name" placeholder="Filter by name" value={filters.name} onChange={handleFilterChange} />
        <input name="email" placeholder="Filter by email" value={filters.email} onChange={handleFilterChange} />
        <input name="address" placeholder="Filter by address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <button className="btn btn-outline" onClick={() => setFilters(emptyFilters)}>
          Clear
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <DataTable columns={columns} rows={data?.users || []} sort={sort} onSort={setSort} loading={loading} />

      {showAdd && (
        <Modal title="Add User" onClose={() => setShowAdd(false)}>
          <AddUserForm onSuccess={handleUserAdded} />
        </Modal>
      )}

      {selectedId && (
        <Modal title="User Details" onClose={() => setSelectedId(null)}>
          <UserDetails userId={selectedId} />
        </Modal>
      )}
    </>
  )
}
