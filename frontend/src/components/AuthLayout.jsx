export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-amber-50 px-4 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white px-6 py-10 shadow-xl ring-1 shadow-indigo-100/60 ring-slate-200/70 sm:px-10">
        <div className="text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-amber-400">
            ★
          </span>
          <h1 className="mt-4 text-2xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        </div>

        <div className="mt-8">{children}</div>

        {footer && <p className="mt-8 text-center text-sm text-slate-600">{footer}</p>}
      </div>
    </div>
  )
}
