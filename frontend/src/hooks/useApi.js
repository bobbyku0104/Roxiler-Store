import { useCallback, useEffect, useState } from 'react'
import client, { getErrorMessage } from '../api/client'

export function useApi(url, params) {
  const [reloadKey, setReloadKey] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: '' })

  const paramsKey = JSON.stringify(params || {})
  const requestKey = `${url}|${paramsKey}|${reloadKey}`

  useEffect(() => {
    let ignore = false

    client
      .get(url, { params: JSON.parse(paramsKey) })
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, data: res.data, error: '' })
      })
      .catch((err) => {
        if (!ignore) setResult({ key: requestKey, data: null, error: getErrorMessage(err) })
      })

    return () => {
      ignore = true
    }
  }, [url, paramsKey, requestKey])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return {
    data: result.data,
    error: result.error,
    loading: result.key !== requestKey,
    reload,
  }
}
