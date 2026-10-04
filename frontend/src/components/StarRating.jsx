import { formatRating, pluralize } from '../utils/format'

export default function StarRating({ value, count, size = 'text-base' }) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-slate-400">No ratings yet</span>
  }

  const filled = Math.round(value)

  return (
    <span className="inline-flex items-center gap-1.5" title={`${formatRating(value)} out of 5`}>
      <span className={`${size} leading-none tracking-tight`} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= filled ? 'text-amber-400' : 'text-slate-200'}>
            ★
          </span>
        ))}
      </span>
      <span className="text-sm font-semibold text-slate-700">{formatRating(value)}</span>
      {count !== undefined && <span className="text-xs text-slate-400">({pluralize(count, 'rating')})</span>}
    </span>
  )
}
