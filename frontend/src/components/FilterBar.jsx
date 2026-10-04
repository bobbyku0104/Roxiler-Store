const CONTROL_CLASSES =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200'

export default function FilterBar({ fields, values, onChange, onReset, isActive }) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {fields.map((field) => (
        <div key={field.name} className="sm:min-w-40 sm:flex-1">
          <label htmlFor={`filter-${field.name}`} className="sr-only">
            {field.label}
          </label>
          {field.options ? (
            <select
              id={`filter-${field.name}`}
              name={field.name}
              value={values[field.name]}
              onChange={onChange}
              className={CONTROL_CLASSES}
            >
              <option value="">{field.placeholder}</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={`filter-${field.name}`}
              type="search"
              name={field.name}
              value={values[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              className={CONTROL_CLASSES}
            />
          )}
        </div>
      ))}

      {isActive && (
        <button
          type="button"
          onClick={onReset}
          className="rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
