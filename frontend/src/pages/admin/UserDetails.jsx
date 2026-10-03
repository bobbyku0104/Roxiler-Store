import { useApi } from '../../hooks/useApi'
import { ROLE_LABELS } from '../../utils/roles'
import RatingBadge from '../../components/RatingBadge'

export default function UserDetails({ userId }) {
  const { data, loading, error } = useApi(`/admin/users/${userId}`)

  if (loading) return <p>Loading...</p>
  if (error) return <div className="alert alert-error">{error}</div>

  const { user } = data

  return (
    <dl className="details">
      <dt>Name</dt>
      <dd>{user.name}</dd>

      <dt>Email</dt>
      <dd>{user.email}</dd>

      <dt>Address</dt>
      <dd>{user.address}</dd>

      <dt>Role</dt>
      <dd>{ROLE_LABELS[user.role]}</dd>

      {user.role === 'owner' && (
        <>
          <dt>Store</dt>
          <dd>{user.store ? user.store.name : 'No store assigned'}</dd>

          <dt>Rating</dt>
          <dd>
            <RatingBadge value={user.rating} />
          </dd>
        </>
      )}
    </dl>
  )
}
