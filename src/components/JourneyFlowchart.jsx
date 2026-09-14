export default function JourneyFlowchart({ days, selectedDayId, onSelectDay }) {
  return (
    <div className="flowchart" role="list" aria-label="10-day trip journey">
      {days.map((day, index) => (
        <div className="flowchart__step" key={day.dayId}>
          <button
            type="button"
            role="listitem"
            className={
              'flowchart__node' +
              (selectedDayId === day.dayId ? ' flowchart__node--active' : '')
            }
            onClick={() => onSelectDay(day.dayId)}
            aria-pressed={selectedDayId === day.dayId}
            aria-label={`Day ${day.dayNumber}: ${day.city} on ${day.displayDate}`}
          >
            <span className="flowchart__frame">
              <img src={day.imageUrl} alt={day.landmark} loading="lazy" />
              <span className="flowchart__badge">{day.dayNumber}</span>
            </span>
            <span className="flowchart__city">{day.city}</span>
            <span className="flowchart__date">{day.displayDate}</span>
          </button>
          {index < days.length - 1 && (
            <span className="flowchart__connector" aria-hidden="true" />
          )}
        </div>
      ))}
    </div>
  )
}
