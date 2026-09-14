export default function ItineraryPanel({ day, itinerary }) {
  if (!day) {
    return (
      <div className="panel itinerary-panel">
        <p className="panel__placeholder">Select a day above to see its itinerary.</p>
      </div>
    )
  }

  return (
    <div className="panel itinerary-panel">
      <div className="panel__header">
        <h3>
          Day {day.dayNumber} &middot; {day.city}, {day.country}
        </h3>
        <span className="panel__subheading">{day.displayDate}</span>
      </div>
      <table className="itinerary-table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Place</th>
            <th scope="col">Activity</th>
          </tr>
        </thead>
        <tbody>
          {itinerary.map((item) => (
            <tr key={`${day.dayId}-${item.order}`}>
              <td>{item.time}</td>
              <td>{item.place}</td>
              <td>{item.activity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
