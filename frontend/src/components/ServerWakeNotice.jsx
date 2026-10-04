import { useEffect, useState } from 'react'
import { onSlowServer, wakeUpServer } from '../api/client'

export default function ServerWakeNotice() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const unsubscribe = onSlowServer(setSlow)
    wakeUpServer()
    return unsubscribe
  }, [])

  if (!slow) return null

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-center gap-3 bg-amber-50 px-4 py-2 text-sm text-amber-800 shadow-sm"
    >
      <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
      The server is waking up after being idle. This can take up to a minute — thanks for waiting.
    </div>
  )
}
