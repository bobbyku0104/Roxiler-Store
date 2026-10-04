import { getDashboard } from '../../api/owner'
import { useFetch } from '../../hooks/useFetch'
import { useSort } from '../../hooks/useSort'
import { formatDate } from '../../utils/format'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import StarRating from '../../components/StarRating'
import DataTable from '../../components/DataTable'
import Alert from '../../components/Alert'

const COLUMNS = [
  { key: 'name', label: 'Customer', sortable: true, className: 'font-medium text-slate-900' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true, render: (row) => <StarRating value={row.rating} size="text-sm" /> },
  { key: 'ratedAt', label: 'Last updated', sortable: true, render: (row) => formatDate(row.ratedAt) },
]

export default function OwnerDashboard() {
  const { sort, toggleSort } = useSort('ratedAt', 'desc')
  const { data, loading, error, reload } = useFetch(getDashboard, sort)

  if (loading && !data) {
    return <p className="text-sm text-slate-500">Loading...</p>
  }

  if (error && !data) {
    return <Alert onRetry={reload}>{error}</Alert>
  }

  const { store, raters } = data

  if (!store) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <h1 className="text-lg font-semibold text-slate-900">No store assigned yet</h1>
        <p className="mt-2 text-sm text-slate-500">
          Once an administrator links a store to your account, its ratings will show up here.
        </p>
      </div>
    )
  }

  return (
    <>
      <PageHeader title={store.name} description={store.address || store.email} />

      <Alert onRetry={reload}>{error}</Alert>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label="Average rating">
          <StarRating value={store.averageRating} size="text-2xl" />
        </StatCard>
        <StatCard label="Total ratings" value={store.ratingCount} />
      </div>

      <h2 className="mb-3 text-lg font-semibold text-slate-900">Customers who rated your store</h2>

      <DataTable
        columns={COLUMNS}
        rows={raters}
        rowKey="userId"
        sort={sort}
        onSort={toggleSort}
        loading={loading}
        emptyMessage="Nobody has rated your store yet."
      />
    </>
  )
}
