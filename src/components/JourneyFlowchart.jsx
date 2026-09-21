export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <div className="journey-scroll" role="group" aria-label="Trip days, choose one to view its itinerary">
      <ol className="journey-track">
        {days.map((day, index) => {
          const isSelected = day.id === selectedDayId
          return (
            <li className="journey-item" key={day.id}>
              {index > 0 && <span className="journey-connector" aria-hidden="true" />}
              <button
                type="button"
                className={`journey-node${isSelected ? ' journey-node--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onSelectDay(day.id)}
              >
                <span className="journey-frame">
                  <img
                    className="journey-image"
                    src={day.landmarkImageUrl}
                    alt={`${day.landmarkName} in ${day.city}, ${day.country}`}
                    loading="lazy"
                  />
                  <span className="journey-day-badge">Day {day.dayNumber}</span>
                </span>
                <span className="journey-caption">
                  <span className="journey-city">{day.city}</span>
                  <span className="journey-date">{day.dateLabel}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
