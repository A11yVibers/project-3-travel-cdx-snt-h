const TAU = Math.PI * 2

function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle - Math.PI / 2),
    y: cy + radius * Math.sin(angle - Math.PI / 2),
  }
}

export function buildDonutSlices(values, { cx = 100, cy = 100, outerRadius = 92, innerRadius = 54 } = {}) {
  const total = values.reduce((sum, item) => sum + item.total, 0)
  if (total <= 0) return []

  let startAngle = 0
  return values.map((item) => {
    const fraction = item.total / total
    const endAngle = startAngle + fraction * TAU
    const isFullCircle = fraction >= 0.9999
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0

    let d
    if (isFullCircle) {
      d = [
        `M ${cx - outerRadius} ${cy}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx + outerRadius} ${cy}`,
        `A ${outerRadius} ${outerRadius} 0 1 1 ${cx - outerRadius} ${cy}`,
        `L ${cx - innerRadius} ${cy}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx + innerRadius} ${cy}`,
        `A ${innerRadius} ${innerRadius} 0 1 0 ${cx - innerRadius} ${cy}`,
        'Z',
      ].join(' ')
    } else {
      const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle)
      const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle)
      const innerStart = polarToCartesian(cx, cy, innerRadius, endAngle)
      const innerEnd = polarToCartesian(cx, cy, innerRadius, startAngle)
      d = [
        `M ${outerStart.x} ${outerStart.y}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
        `L ${innerStart.x} ${innerStart.y}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
        'Z',
      ].join(' ')
    }

    const midAngle = (startAngle + endAngle) / 2
    const labelPoint = polarToCartesian(cx, cy, (outerRadius + innerRadius) / 2, midAngle)

    const slice = {
      category: item.category,
      total: item.total,
      fraction,
      percentLabel: `${Math.round(fraction * 100)}%`,
      path: d,
      labelX: labelPoint.x,
      labelY: labelPoint.y,
    }
    startAngle = endAngle
    return slice
  })
}
