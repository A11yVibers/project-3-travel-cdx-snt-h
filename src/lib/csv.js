export function parseCSV(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false
  const pushField = () => { row.push(field); field = '' }
  const pushRow = () => { rows.push(row); row = [] }
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1 } else { inQuotes = false }
      } else {
        field += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\n') {
      pushField(); pushRow()
    } else if (char === '\r') {
      // skip, handled by following \n
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) { pushField(); pushRow() }
  const filtered = rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''))
  const [header, ...body] = filtered
  return body.map((values) => {
    const record = {}
    header.forEach((key, index) => { record[key] = values[index] ?? '' })
    return record
  })
}
