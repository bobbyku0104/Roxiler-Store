import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../../api/admin'
import { useFetch } from '../../hooks/useFetch'
import { useFilters } from '../../hooks/useFilters'
import { useSort } from '../../hooks/useSort'
import { useToast } from '../../hooks/useToast'
import { ROLE_LABELS, ROLES } from '../../utils/roles'
import PageHeader from '../../components/PageHeader'
import FilterBar from '../../components/FilterBar'
import DataTable from '../../components/DataTable'
import RoleBadge from '../../components/RoleBadge'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import Alert from '../../components/Alert'
import AddUserForm from './AddUserForm'

const FILTER_FIELDS = [
  { name: 'name', label: 'Name', placeholder: 'Search name' },
  { name: 'email', label: 'Email', placeholder: 'Search email' },
  { name: 'address', label: 'Address', placeholder: 'Search address' },
  {
    name: 'role',
    label: 'Role',
    placeholder: 'All roles',
    options: Object.values(ROLES).map((role) => ({ value: role, label: ROLE_LABELS[role] })),
  },
]

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, className: 'font-medium text-slate-900' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: true, className: 'max-w-xs truncate' },
  { key: 'role', label: 'Role', sortable: true, render: (user) => <RoleBadge role={user.role} /> },
  {
    key: 'actions',
    label: '',
    className: 'text-right',
    render: (user) => (
      <Link to={`/admin/users/${user.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        View details
      </Link>
    ),
  },
]

export default function UsersPage() {
  const { showToast } = useToast()
  const { filters, debouncedFilters, handleChange, reset, isActive } = useFilters({
    name: '',
    email: '',
    address: '',
    role: '',
  })
  const { sort, toggleSort } = useSort('name')
  const { data: users = [], loading, error, reload } = useFetch(getUsers, { ...debouncedFilters, ...sort })
  const [showForm, setShowForm] = useState(false)

  function handleCreated(user) {
    setShowForm(false)
    showToast(`${user.name} was added as ${ROLE_LABELS[user.role]}`)
    reload()
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Everyone registered on the platform."
        action={<Button onClick={() => setShowForm(true)}>+ Add user</Button>}
      />

      <FilterBar fields={FILTER_FIELDS} values={filters} onChange={handleChange} onReset={reset} isActive={isActive} />

      <Alert onRetry={reload}>{error}</Alert>

      <DataTable
        columns={COLUMNS}
        rows={users}
        sort={sort}
        onSort={toggleSort}
        loading={loading}
        emptyMessage={isActive ? 'No users match these filters' : 'No users yet'}
      />

      {showForm && (
        <Modal title="Add user" onClose={() => setShowForm(false)}>
          <AddUserForm onCreated={handleCreated} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </>
  )
}
