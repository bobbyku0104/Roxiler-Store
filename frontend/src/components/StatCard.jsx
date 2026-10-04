import { Link } from 'react-router-dom'

export default function StatCard({ label, value, to, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <div className="mt-2 text-3xl font-semibold text-slate-900">{children ?? value}</div>
      {to && (
        <Link to={to} className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View all →
        </Link>
      )}
    </div>
  )
}
