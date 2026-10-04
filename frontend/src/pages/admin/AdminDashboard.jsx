import { getDashboard } from '../../api/admin'
import { useFetch } from '../../hooks/useFetch'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/StatCard'
import Alert from '../../components/Alert'

export default function AdminDashboard() {
  const { data, loading, error, reload } = useFetch(getDashboard)
  const show = (value) => (loading && !data ? '…' : (value ?? '-'))

  return (
    <>
      <PageHeader title="Dashboard" description="Overview of everything on the platform." />

      <Alert onRetry={reload}>{error}</Alert>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={show(data?.totalUsers)} to="/admin/users" />
        <StatCard label="Total stores" value={show(data?.totalStores)} to="/admin/stores" />
        <StatCard label="Submitted ratings" value={show(data?.totalRatings)} />
      </div>
    </>
  )
}
