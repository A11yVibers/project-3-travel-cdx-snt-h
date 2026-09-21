import { parseCSV } from './csv.js'
import tripDaysRaw from '../../project-assets/trip_days.csv?raw'
import itineraryRaw from '../../project-assets/itinerary.csv?raw'
import expensesRaw from '../../project-assets/expenses.csv?raw'

const CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

const CATEGORY_ORDER = ['Lodging', 'Food', 'Entertainment', 'Travel']

function toNumber(value) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

const tripDayRows = parseCSV(tripDaysRaw).sort((a, b) => Number(a.day_number) - Number(b.day_number))
const itineraryRows = parseCSV(itineraryRaw).sort((a, b) => Number(a.item_order) - Number(b.item_order))
const expenseRows = parseCSV(expensesRaw)

export const tripDays = tripDayRows.map((row) => ({
  id: row.day_id,
  dayNumber: Number(row.day_number),
  date: row.date,
  dateLabel: formatDate(row.date),
  city: row.city,
  country: row.country,
  landmarkName: row.iconic_landmark,
  landmarkImageUrl: row.landmark_image_url,
}))

export const itineraryByDay = itineraryRows.reduce((acc, row) => {
  const entry = {
    order: Number(row.item_order),
    time: row.time,
    place: row.place,
    activity: row.activity,
  }
  if (!acc[row.day_id]) acc[row.day_id] = []
  acc[row.day_id].push(entry)
  return acc
}, {})

const dayLookup = new Map(tripDays.map((day) => [day.id, day]))

export const expenseCategories = CATEGORY_ORDER

export const expenseTotalsByCategory = CATEGORY_ORDER.map((label) => ({
  category: label,
  total: 0,
}))

const categoryTotalMap = new Map(expenseTotalsByCategory.map((entry) => [entry.category, entry]))

export const expensesByDayAndCategory = new Map()

for (const day of tripDays) {
  const perCategory = new Map(CATEGORY_ORDER.map((label) => [label, 0]))
  expensesByDayAndCategory.set(day.id, perCategory)
}

for (const row of expenseRows) {
  const label = CATEGORY_LABELS[row.category] ?? row.category
  const amount = toNumber(row.amount_usd)
  const dayTotals = expensesByDayAndCategory.get(row.day_id)
  if (dayTotals) {
    dayTotals.set(label, (dayTotals.get(label) ?? 0) + amount)
  }
  const categoryEntry = categoryTotalMap.get(label)
  if (categoryEntry) categoryEntry.total += amount
}

export const expenseGrandTotal = expenseTotalsByCategory.reduce((sum, entry) => sum + entry.total, 0)

export function getCategoryBreakdownByDay(category) {
  return tripDays.map((day) => ({
    dayId: day.id,
    dayNumber: day.dayNumber,
    city: day.city,
    dateLabel: day.dateLabel,
    amount: expensesByDayAndCategory.get(day.id)?.get(category) ?? 0,
  }))
}

export function getDayById(dayId) {
  return dayLookup.get(dayId)
}
