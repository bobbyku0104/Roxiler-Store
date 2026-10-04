import { useState } from 'react'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export default function RatingControl({ value, onChange, disabled = false }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value || 0

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex"
        role="radiogroup"
        aria-label="Your rating"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} - ${LABELS[star]}`}
            disabled={disabled}
            onMouseEnter={() => setHovered(star)}
            onClick={() => star !== value && onChange(star)}
            className={`px-0.5 text-2xl leading-none transition-transform hover:scale-110 disabled:cursor-wait disabled:hover:scale-100 ${
              star <= active ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            ★
          </button>
        ))}
      </div>
      <span className="w-16 text-xs text-slate-500">{LABELS[active]}</span>
    </div>
  )
}
