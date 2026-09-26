import { formatDate } from '../data.js'

export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <section className="flowchart" aria-label="Trip journey flowchart">
      <div className="flowchart-track">
        {days.map((day, index) => {
          const isSelected = day.dayId === selectedDayId
          const shape = index % 2 === 0 ? 'diamond' : 'circle'
          return (
            <div className="flowchart-step" key={day.dayId}>
              <button
                type="button"
                className={`flowchart-node shape-${shape} ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectDay(day.dayId)}
                aria-pressed={isSelected}
                aria-label={`Day ${day.dayNumber}: ${day.city} on ${formatDate(day.date)}. View itinerary.`}
              >
                <span className="flowchart-frame">
                  <img src={day.imageUrl} alt={day.landmark} loading="lazy" />
                </span>
              </button>
              <div className="flowchart-caption">
                <span className="flowchart-day">Day {day.dayNumber}</span>
                <span className="flowchart-city">{day.city}</span>
                <span className="flowchart-date">{formatDate(day.date)}</span>
              </div>
              {index < days.length - 1 && <span className="flowchart-connector" aria-hidden="true" />}
            </div>
          )
        })}
      </div>
    </section>
  )
}
