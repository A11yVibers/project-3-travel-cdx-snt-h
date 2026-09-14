import { useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import {
  tripDays,
  itineraryByDay,
  categoryTotals,
  categoryTotalsByDay,
  getDay,
} from './data/tripData.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.dayId ?? null)
  const selectedDay = selectedDayId ? getDay(selectedDayId) : null
  const selectedItinerary = selectedDayId ? itineraryByDay[selectedDayId] ?? [] : []

  return (
    <main className="app">
      <header className="app__header">
        <h1>10 Days Across Europe</h1>
        <p>A visual journal of one new city each day &mdash; from London to Rome.</p>
      </header>

      <section className="app__section" aria-labelledby="journey-heading">
        <h2 id="journey-heading">Journey</h2>
        <JourneyFlowchart
          days={tripDays}
          selectedDayId={selectedDayId}
          onSelectDay={setSelectedDayId}
        />
        <ItineraryPanel day={selectedDay} itinerary={selectedItinerary} />
      </section>

      <section className="app__section" aria-labelledby="expenses-heading">
        <h2 id="expenses-heading">Trip Expenses</h2>
        <ExpenseChart
          categoryTotals={categoryTotals}
          categoryTotalsByDay={categoryTotalsByDay}
        />
      </section>
    </main>
  )
}
