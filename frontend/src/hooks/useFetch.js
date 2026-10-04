import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client'

// fetcher must be a stable function (e.g. one of the api/* helpers).
export function useFetch(fetcher, params) {
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ key: null, data: undefined, error: '' })

  const paramsKey = JSON.stringify(params ?? null)
  const requestKey = `${paramsKey}|${reloadKey}`

  useEffect(() => {
    let ignore = false

    fetcher(JSON.parse(paramsKey))
      .then((data) => {
        if (!ignore) setResult({ key: requestKey, data, error: '' })
      })
      .catch((err) => {
        if (!ignore) {
          setResult((prev) => ({ key: requestKey, data: prev.data, error: getErrorMessage(err) }))
        }
      })

    return () => {
      ignore = true
    }
  }, [fetcher, paramsKey, requestKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== requestKey,
    reload,
  }
}
