// Minimal RFC4180-style CSV parser: handles quoted fields, embedded commas,
// and escaped quotes ("") inside quoted fields. Returns an array of objects
// keyed by the header row.
export function parseCsv(text) {
  const rows = []
  let row = []
  let field = ''
  let inQuotes = false

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      pushField()
    } else if (char === '\n') {
      if (field.length > 0 || row.length > 0) pushRow()
    } else if (char === '\r') {
      // skip, \n handles the row break
    } else {
      field += char
    }
  }
  if (field.length > 0 || row.length > 0) pushRow()

  const [header, ...body] = rows
  return body
    .filter((cells) => cells.some((cell) => cell !== ''))
    .map((cells) => {
      const record = {}
      header.forEach((key, index) => {
        record[key] = cells[index] ?? ''
      })
      return record
    })
}
