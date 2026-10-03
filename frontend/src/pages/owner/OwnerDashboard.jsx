import { useState } from 'react'
import { useApi } from '../../hooks/useApi'
import DataTable from '../../components/DataTable'
import RatingBadge from '../../components/RatingBadge'

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function OwnerDashboard() {
  const [sort, setSort] = useState({ sortBy: 'updatedAt', order: 'desc' })
  const { data, loading, error } = useApi('/owner/dashboard', sort)

  if (error) {
    return (
      <>
        <h2>My Store</h2>
        <div className="alert alert-error">{error}</div>
      </>
    )
  }

  const columns = [
    { key: 'name', label: 'Name', sortable: true, render: (row) => row.user.name },
    { key: 'email', label: 'Email', sortable: true, render: (row) => row.user.email },
    { key: 'address', label: 'Address', render: (row) => row.user.address },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (row) => <span className="rating-badge">★ {row.rating}</span>,
    },
    { key: 'updatedAt', label: 'Rated On', sortable: true, render: (row) => formatDate(row.updatedAt) },
  ]

  return (
    <>
      <h2>{data?.store.name || 'My Store'}</h2>
      {data && <p className="muted">{data.store.address}</p>}

      <div className="stats-grid">
        <div className="card stat-card">
          <span className="stat-label">Average Rating</span>
          <span className="stat-value">
            {data ? <RatingBadge value={data.averageRating} /> : '...'}
          </span>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Total Ratings</span>
          <span className="stat-value">{data ? data.totalRatings : '...'}</span>
        </div>
      </div>

      <h3 className="section-title">Users who rated your store</h3>

      <DataTable
        columns={columns}
        rows={data?.ratings || []}
        sort={sort}
        onSort={setSort}
        loading={loading}
        emptyText="No one has rated your store yet"
      />
    </>
  )
}
