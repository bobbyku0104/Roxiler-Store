import { ROLE_LABELS } from '../utils/roles'

const STYLES = {
  ADMIN: 'bg-rose-50 text-rose-700 ring-rose-200',
  OWNER: 'bg-amber-50 text-amber-700 ring-amber-200',
  USER: 'bg-sky-50 text-sky-700 ring-sky-200',
}

export default function RoleBadge({ role }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[role]}`}>
      {ROLE_LABELS[role]}
    </span>
  )
}
