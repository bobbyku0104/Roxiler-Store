import { Link } from 'react-router-dom'
import { useApi } from '../../hooks/useApi'

export default function AdminDashboard() {
  const { data, loading, error } = useApi('/admin/dashboard')

  const stats = [
    { label: 'Total Users', value: data?.totalUsers, link: '/admin/users' },
    { label: 'Total Stores', value: data?.totalStores, link: '/admin/stores' },
    { label: 'Total Ratings', value: data?.totalRatings },
  ]

  return (
    <>
      <h2>Dashboard</h2>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{loading ? '...' : stat.value}</span>
            {stat.link && <Link to={stat.link}>View all</Link>}
          </div>
        ))}
      </div>
    </>
  )
}
