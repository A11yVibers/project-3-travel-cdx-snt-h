import { useId, useMemo, useState } from 'react'
import { buildDonutSlices } from '../lib/donut.js'
import { currencyFormatter, currencyFormatterPrecise } from '../lib/format.js'

const CATEGORY_COLORS = {
  Lodging: '#4f6df5',
  Food: '#f5a742',
  Entertainment: '#3fbf8f',
  Travel: '#e0577b',
}

export default function ExpenseChart({ totals, grandTotal, getBreakdownByCategory }) {
  const defaultCategory = totals[0]?.category ?? null
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const titleId = useId()

  const slices = useMemo(() => buildDonutSlices(totals), [totals])

  const breakdown = useMemo(
    () => (selectedCategory ? getBreakdownByCategory(selectedCategory) : []),
    [selectedCategory, getBreakdownByCategory],
  )

  const maxAmount = useMemo(
    () => breakdown.reduce((max, entry) => Math.max(max, entry.amount), 0),
    [breakdown],
  )

  const selectedTotal = totals.find((entry) => entry.category === selectedCategory)?.total ?? 0

  return (
    <section className="expense-section" aria-labelledby={titleId}>
      <h2 id={titleId}>Trip Spending</h2>
      <div className="expense-layout">
        <div className="donut-wrap">
          <svg
            className="donut-chart"
            viewBox="0 0 200 200"
            role="group"
            aria-label="Spending distribution by category, select a slice for a day-by-day breakdown"
          >
            {slices.map((slice) => {
              const isSelected = slice.category === selectedCategory
              return (
                <path
                  key={slice.category}
                  d={slice.path}
                  fill={CATEGORY_COLORS[slice.category] ?? '#999'}
                  className={`donut-slice${isSelected ? ' donut-slice--selected' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${slice.category}: ${currencyFormatter.format(slice.total)}, ${slice.percentLabel} of total`}
                  onClick={() => setSelectedCategory(slice.category)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedCategory(slice.category)
                    }
                  }}
                />
              )
            })}
          </svg>
          <div className="donut-center" aria-hidden="true">
            <span className="donut-center-label">Total</span>
            <span className="donut-center-value">{currencyFormatter.format(grandTotal)}</span>
          </div>
        </div>

        <div className="expense-legend" role="list">
          {totals.map((entry) => {
            const isSelected = entry.category === selectedCategory
            const percent = grandTotal > 0 ? Math.round((entry.total / grandTotal) * 100) : 0
            return (
              <button
                type="button"
                key={entry.category}
                role="listitem"
                className={`legend-item${isSelected ? ' legend-item--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedCategory(entry.category)}
              >
                <span
                  className="legend-swatch"
                  style={{ backgroundColor: CATEGORY_COLORS[entry.category] ?? '#999' }}
                  aria-hidden="true"
                />
                <span className="legend-label">{entry.category}</span>
                <span className="legend-value">
                  {currencyFormatter.format(entry.total)} &middot; {percent}%
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {selectedCategory && (
        <div className="breakdown-panel" aria-live="polite">
          <h3>
            {selectedCategory} spending by day &middot; {currencyFormatter.format(selectedTotal)} total
          </h3>
          <ul className="breakdown-list">
            {breakdown.map((entry) => {
              const widthPercent = maxAmount > 0 ? Math.max((entry.amount / maxAmount) * 100, entry.amount > 0 ? 3 : 0) : 0
              return (
                <li className="breakdown-row" key={entry.dayId}>
                  <span className="breakdown-day">
                    Day {entry.dayNumber} &middot; {entry.city}
                  </span>
                  <span className="breakdown-bar-track">
                    <span
                      className="breakdown-bar-fill"
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: CATEGORY_COLORS[selectedCategory] ?? '#999',
                      }}
                    />
                  </span>
                  <span className="breakdown-amount">{currencyFormatterPrecise.format(entry.amount)}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
