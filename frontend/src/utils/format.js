export function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRating(value) {
  return value === null || value === undefined ? '-' : Number(value).toFixed(1)
}

export function pluralize(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}
