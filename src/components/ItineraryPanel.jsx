import { formatDate } from '../data.js'

export default function ItineraryPanel({ day }) {
  if (!day) {
    return (
      <section className="itinerary-panel" aria-label="Day itinerary">
        <p className="itinerary-empty">Select a day on the flowchart to see its itinerary.</p>
      </section>
    )
  }

  return (
    <section className="itinerary-panel" aria-label={`Itinerary for day ${day.dayNumber}`}>
      <header className="itinerary-header">
        <h2>
          Day {day.dayNumber} · {day.city}
        </h2>
        <p>{formatDate(day.date)} · {day.country}</p>
      </header>
      <table className="itinerary-table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Place</th>
            <th scope="col">Activity</th>
          </tr>
        </thead>
        <tbody>
          {day.itinerary.map((item) => (
            <tr key={`${day.dayId}-${item.order}`}>
              <td>{item.time}</td>
              <td>{item.place}</td>
              <td>{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
