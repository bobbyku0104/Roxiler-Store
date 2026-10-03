import { useState } from 'react'
import client, { getErrorMessage } from '../../api/client'
import StarInput from '../../components/StarInput'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function RateStoreForm({ store, onSuccess }) {
  const [rating, setRating] = useState(store.myRating || 0)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!rating) {
      setError('Please select a rating')
      return
    }

    setError('')
    setSaving(true)
    try {
      await client.put(`/stores/${store.id}/rating`, { rating })
      onSuccess()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="muted">{store.address}</p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="rate-box">
        <StarInput value={rating} onChange={setRating} />
        <span className="muted">{LABELS[rating] || 'Select a rating'}</span>
      </div>

      <button className="btn btn-primary" disabled={saving}>
        {saving ? 'Saving...' : store.myRating ? 'Update Rating' : 'Submit Rating'}
      </button>
    </form>
  )
}
