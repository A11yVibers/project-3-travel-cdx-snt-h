import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { EXPENSE_CATEGORIES, getCategoryByDay, getCategoryTotals, getTotalSpend } from '../data.js'

const CATEGORY_COLORS = {
  Lodging: '#3d4fc4',
  Food: '#a15f13',
  Entertainment: '#b23a63',
  Travel: '#178070',
}

function currency(value) {
  return `$${value.toFixed(0)}`
}

export default function ExpenseChart() {
  const totals = useMemo(() => getCategoryTotals(), [])
  const grandTotal = useMemo(() => getTotalSpend(), [])
  const [selectedCategory, setSelectedCategory] = useState(EXPENSE_CATEGORIES[0])

  const byDay = useMemo(() => getCategoryByDay(selectedCategory), [selectedCategory])

  return (
    <section className="expense-section" aria-label="Trip expense breakdown">
      <div className="expense-chart-grid">
        <div className="expense-donut">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={totals}
                dataKey="total"
                nameKey="category"
                innerRadius="55%"
                outerRadius="85%"
                paddingAngle={2}
                onClick={(entry) => setSelectedCategory(entry.category)}
                cursor="pointer"
              >
                {totals.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={CATEGORY_COLORS[entry.category]}
                    stroke={entry.category === selectedCategory ? '#1c1c1c' : 'none'}
                    strokeWidth={entry.category === selectedCategory ? 3 : 0}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => currency(value)} />
              <Legend
                onClick={(entry) => setSelectedCategory(entry.value)}
                formatter={(value) => (value === selectedCategory ? `${value} (selected)` : value)}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="expense-total">Total trip spend: {currency(grandTotal)}</p>
          <div className="category-buttons" role="group" aria-label="Select expense category">
            {EXPENSE_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-button ${category === selectedCategory ? 'is-active' : ''}`}
                style={{ '--active-color': CATEGORY_COLORS[category], borderColor: CATEGORY_COLORS[category] }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="expense-daily">
          <h2>{selectedCategory} Spending by Day</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byDay} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize: 12 }} interval={0} angle={-30} textAnchor="end" height={60} />
              <YAxis tickFormatter={currency} width={50} />
              <Tooltip
                formatter={(value) => currency(value)}
                labelFormatter={(label, payload) => {
                  const point = payload?.[0]?.payload
                  return point ? `Day ${point.dayNumber} · ${point.city}` : label
                }}
              />
              <Bar dataKey="amount" fill={CATEGORY_COLORS[selectedCategory]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  )
}
