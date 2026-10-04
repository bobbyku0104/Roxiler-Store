export default function Alert({ children, onRetry }) {
  if (!children) return null

  return (
    <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{children}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-medium underline hover:no-underline">
          Retry
        </button>
      )}
    </div>
  )
}
