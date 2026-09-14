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

const CATEGORY_COLORS = {
  Lodging: '#4f6df5',
  Food: '#f5924f',
  Entertainment: '#2fb381',
  Travel: '#d9558c',
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function ExpenseChart({ categoryTotals, categoryTotalsByDay }) {
  const [selectedCategory, setSelectedCategory] = useState(categoryTotals[0]?.category ?? null)

  const grandTotal = useMemo(
    () => categoryTotals.reduce((sum, entry) => sum + entry.total, 0),
    [categoryTotals]
  )

  const dayBreakdown = selectedCategory ? categoryTotalsByDay[selectedCategory] : []

  return (
    <div className="expense-chart">
      <div className="expense-chart__pie">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={categoryTotals}
              dataKey="total"
              nameKey="category"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              onClick={(entry) => setSelectedCategory(entry.category)}
              cursor="pointer"
            >
              {categoryTotals.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category]}
                  stroke={selectedCategory === entry.category ? '#1f2430' : '#ffffff'}
                  strokeWidth={selectedCategory === entry.category ? 3 : 1}
                  opacity={
                    selectedCategory && selectedCategory !== entry.category ? 0.55 : 1
                  }
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [currency.format(value), name]}
            />
            <Legend
              onClick={(entry) => setSelectedCategory(entry.value)}
              wrapperStyle={{ cursor: 'pointer' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <p className="expense-chart__total">
          Total trip spend: <strong>{currency.format(grandTotal)}</strong>
        </p>
        <p className="expense-chart__hint">
          Select a slice or legend entry to compare that category across all 10 days.
        </p>
      </div>

      <div className="expense-chart__breakdown">
        <h3>
          {selectedCategory} spending by day
        </h3>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={dayBreakdown}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickFormatter={(value) => currency.format(value)} />
            <YAxis
              type="category"
              dataKey="city"
              width={90}
              tick={{ fontSize: 13 }}
            />
            <Tooltip
              formatter={(value) => currency.format(value)}
              labelFormatter={(label, payload) => {
                const point = payload?.[0]?.payload
                return point ? `Day ${point.dayNumber} \u2013 ${point.city}` : label
              }}
            />
            <Bar
              dataKey="amount"
              fill={selectedCategory ? CATEGORY_COLORS[selectedCategory] : '#4f6df5'}
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
