import { Link, useParams } from 'react-router-dom'
import { getUser } from '../../api/admin'
import { useFetch } from '../../hooks/useFetch'
import { ROLES } from '../../utils/roles'
import { formatDate } from '../../utils/format'
import RoleBadge from '../../components/RoleBadge'
import StarRating from '../../components/StarRating'
import Alert from '../../components/Alert'

function Detail({ label, children }) {
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm break-words text-slate-900 sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  )
}

export default function UserDetailsPage() {
  const { id } = useParams()
  const { data: user, loading, error, reload } = useFetch(getUser, id)

  return (
    <div className="max-w-2xl">
      <Link to="/admin/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        ← Back to users
      </Link>

      <h1 className="mt-4 mb-6 text-2xl font-semibold text-slate-900">User details</h1>

      <Alert onRetry={reload}>{error}</Alert>

      {loading && !user && <p className="text-sm text-slate-500">Loading...</p>}

      {user && !error && (
        <dl className="divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-6">
          <Detail label="Name">{user.name}</Detail>
          <Detail label="Email">{user.email}</Detail>
          <Detail label="Address">{user.address || '-'}</Detail>
          <Detail label="Role">
            <RoleBadge role={user.role} />
          </Detail>
          <Detail label="Joined">{formatDate(user.createdAt)}</Detail>

          {user.role === ROLES.OWNER && (
            <>
              <Detail label="Store">{user.store ? user.store.name : 'No store assigned yet'}</Detail>
              <Detail label="Rating">
                {user.store ? (
                  <StarRating value={user.store.averageRating} count={user.store.ratingCount} />
                ) : (
                  '-'
                )}
              </Detail>
            </>
          )}
        </dl>
      )}
    </div>
  )
}
