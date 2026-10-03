export default function DataTable({ columns, rows, sort, onSort, loading, emptyText = 'No records found' }) {
  function handleSort(column) {
    if (!column.sortable) return
    const order = sort.sortBy === column.key && sort.order === 'asc' ? 'desc' : 'asc'
    onSort({ sortBy: column.key, order })
  }

  function sortIcon(column) {
    if (!column.sortable) return null
    if (sort.sortBy !== column.key) return <span className="sort-icon">↕</span>
    return <span className="sort-icon active">{sort.order === 'asc' ? '▲' : '▼'}</span>
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column)}
                className={column.sortable ? 'sortable' : ''}
              >
                {column.label} {sortIcon(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="table-message">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-message">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
