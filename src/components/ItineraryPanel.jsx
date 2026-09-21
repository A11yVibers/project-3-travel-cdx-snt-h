export default function ItineraryPanel({ day, items }) {
  if (!day) return null

  return (
    <section className="itinerary-panel" aria-labelledby="itinerary-heading">
      <div className="itinerary-heading">
        <h2 id="itinerary-heading">
          Day {day.dayNumber} &middot; {day.city}, {day.country}
        </h2>
        <p className="itinerary-sub">{day.dateLabel}</p>
      </div>
      <div className="itinerary-table-wrap">
        <table className="itinerary-table">
          <caption className="sr-only">{`Itinerary for ${day.city} on ${day.dateLabel}`}</caption>
          <thead>
            <tr>
              <th scope="col">Time</th>
              <th scope="col">Place</th>
              <th scope="col">Activity</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${day.id}-${item.order}`}>
                <td>{item.time}</td>
                <td>{item.place}</td>
                <td>{item.activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
