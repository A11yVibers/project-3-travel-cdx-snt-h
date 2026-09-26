import { useState } from 'react'
import JourneyFlowchart from './components/JourneyFlowchart.jsx'
import ItineraryPanel from './components/ItineraryPanel.jsx'
import ExpenseChart from './components/ExpenseChart.jsx'
import { tripDays } from './data.js'

export default function App() {
  const [selectedDayId, setSelectedDayId] = useState(tripDays[0]?.dayId ?? null)
  const selectedDay = tripDays.find((day) => day.dayId === selectedDayId) ?? null

  return (
    <main className="app">
      <header className="app-header">
        <h1>10-Day Europe Journey</h1>
        <p>Follow the route city by city, then explore where the budget went.</p>
      </header>

      <JourneyFlowchart
        days={tripDays}
        selectedDayId={selectedDayId}
        onSelectDay={setSelectedDayId}
      />

      <ItineraryPanel day={selectedDay} />

      <ExpenseChart />
    </main>
  )
}
