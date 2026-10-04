import { useState } from 'react'

const INPUT_CLASSES =
  'w-full rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:bg-white focus:outline-none focus:ring-4 disabled:bg-slate-100'

export default function FormField({
  label,
  name,
  error,
  hint,
  as = 'input',
  type,
  optional = false,
  children,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false)
  const Control = as
  const isPassword = type === 'password'
  const describedBy = error ? `${name}-error` : hint ? `${name}-hint` : undefined
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-100'

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
        {optional && <span className="ml-1 font-normal text-slate-400">(optional)</span>}
      </label>

      <div className="relative">
        <Control
          id={name}
          name={name}
          type={isPassword && showPassword ? 'text' : type}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`${INPUT_CLASSES} ${stateClasses} ${isPassword ? 'pr-16' : ''}`}
          {...props}
        >
          {children}
        </Control>

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-2 my-auto h-7 rounded-lg px-2 text-xs font-medium text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        )}
      </div>

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
