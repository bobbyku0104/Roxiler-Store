function SortIcon({ active, order }) {
  if (!active) return <span className="text-slate-300">↕</span>
  return <span className="text-indigo-600">{order === 'asc' ? '↑' : '↓'}</span>
}

function MobileSort({ columns, sort, onSort }) {
  const sortable = columns.filter((column) => column.sortable)
  if (!sortable.length) return null

  return (
    <div className="mb-3 flex items-center gap-2 md:hidden">
      <label htmlFor="mobile-sort" className="text-sm text-slate-500">
        Sort by
      </label>
      <select
        id="mobile-sort"
        value={sort.sortBy}
        onChange={(e) => onSort(e.target.value)}
        className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
      >
        {sortable.map((column) => (
          <option key={column.key} value={column.key}>
            {column.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onSort(sort.sortBy)}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
        aria-label={`Sort ${sort.order === 'asc' ? 'descending' : 'ascending'}`}
      >
        {sort.order === 'asc' ? '↑ Asc' : '↓ Desc'}
      </button>
    </div>
  )
}

export default function DataTable({
  columns,
  rows,
  sort,
  onSort,
  loading = false,
  emptyMessage = 'No records found',
  rowKey = 'id',
}) {
  const showPlaceholder = loading && !rows.length

  if (showPlaceholder || !rows.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
        {showPlaceholder ? 'Loading...' : emptyMessage}
      </div>
    )
  }

  return (
    <div className={loading ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
      {/* Desktop: regular table */}
      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => {
                const active = sort?.sortBy === column.key
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? (sort.order === 'asc' ? 'ascending' : 'descending') : undefined}
                    className="px-4 py-3 text-left font-semibold whitespace-nowrap text-slate-600"
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort(column.key)}
                        className="inline-flex items-center gap-1 hover:text-slate-900"
                      >
                        {column.label}
                        <SortIcon active={active} order={sort.order} />
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row[rowKey]} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 align-middle ${column.className || ''}`}>
                    {column.render ? column.render(row) : row[column.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phones: one card per row */}
      <div className="md:hidden">
        {sort && <MobileSort columns={columns} sort={sort} onSort={onSort} />}
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row[rowKey]} className="rounded-lg border border-slate-200 bg-white p-4">
              <dl className="space-y-2 text-sm">
                {columns.map((column) =>
                  column.label ? (
                    <div key={column.key} className="flex justify-between gap-4">
                      <dt className="shrink-0 text-slate-500">{column.label}</dt>
                      <dd className="text-right break-words text-slate-800">
                        {column.render ? column.render(row) : row[column.key] || '-'}
                      </dd>
                    </div>
                  ) : (
                    <div key={column.key} className="pt-1">
                      {column.render(row)}
                    </div>
                  ),
                )}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
