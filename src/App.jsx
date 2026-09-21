import { useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import {
  tripDays,
  itineraryByDay,
  expenseTotalsByCategory,
  expenseGrandTotal,
  getCategoryBreakdownByDay,
  getDayById,
} from './lib/data.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.id ?? null)
  const selectedDay = getDayById(selectedDayId)
  const selectedItems = selectedDayId ? itineraryByDay[selectedDayId] ?? [] : []

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="app-eyebrow">10-Day Europe Trip</p>
        <h1>Travel Journal</h1>
        <p className="app-subtitle">
          {tripDays[0]?.city} to {tripDays[tripDays.length - 1]?.city} &middot;{' '}
          {tripDays[0]?.dateLabel} &ndash; {tripDays[tripDays.length - 1]?.dateLabel}
        </p>
      </header>

      <section className="journey-section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">Journey</h2>
        <p className="journey-instructions">Select a day to see that day&rsquo;s itinerary.</p>
        <JourneyFlowchart days={tripDays} selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />
      </section>

      <ItineraryPanel day={selectedDay} items={selectedItems} />

      <ExpenseChart
        totals={expenseTotalsByCategory}
        grandTotal={expenseGrandTotal}
        getBreakdownByCategory={getCategoryBreakdownByDay}
      />
    </main>
  )
}
