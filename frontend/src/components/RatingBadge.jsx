export default function RatingBadge({ value }) {
  if (value === null || value === undefined) {
    return <span className="rating-empty">No ratings</span>
  }

  return <span className="rating-badge">★ {Number(value).toFixed(1)}</span>
}
