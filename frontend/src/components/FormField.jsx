const INPUT_CLASSES =
  'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:bg-slate-100'

export default function FormField({
  label,
  name,
  error,
  hint,
  as = 'input',
  optional = false,
  children,
  ...props
}) {
  const Control = as
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined
  const stateClasses = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>

      <Control
        id={name}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${INPUT_CLASSES} ${stateClasses}`}
        {...props}
      >
        {children}
      </Control>

      {error ? (
        <p id={`${name}-error`} className="text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${name}-hint`} className="text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}
