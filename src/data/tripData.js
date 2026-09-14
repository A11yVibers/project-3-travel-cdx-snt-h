import { parseCsv } from './parseCsv.js'

import tripDaysRaw from '../../project-assets/trip_days.csv?raw'
import itineraryRaw from '../../project-assets/itinerary.csv?raw'
import expensesRaw from '../../project-assets/expenses.csv?raw'

const EXPENSE_CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const EXPENSE_CATEGORIES = ['Lodging', 'Food', 'Entertainment', 'Travel']

const tripDayRows = parseCsv(tripDaysRaw)
const itineraryRows = parseCsv(itineraryRaw)
const expenseRows = parseCsv(expensesRaw)

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return dateFormatter.format(date)
}

export const tripDays = tripDayRows
  .map((row) => ({
    dayId: row.day_id,
    dayNumber: Number(row.day_number),
    date: row.date,
    displayDate: formatDate(row.date),
    city: row.city,
    country: row.country,
    landmark: row.iconic_landmark,
    imageUrl: row.landmark_image_url,
  }))
  .sort((a, b) => a.dayNumber - b.dayNumber)

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

Object.values(itineraryByDay).forEach((items) => items.sort((a, b) => a.order - b.order))

const dayLookup = tripDays.reduce((acc, day) => {
  acc[day.dayId] = day
  return acc
}, {})

export const expensesByDay = expenseRows.reduce((acc, row) => {
  const entry = {
    order: Number(row.expense_order),
    category: EXPENSE_CATEGORY_LABELS[row.category] ?? row.category,
    subcategory: row.subcategory,
    description: row.description,
    amount: Number(row.amount_usd),
  }
  if (!acc[row.day_id]) acc[row.day_id] = []
  acc[row.day_id].push(entry)
  return acc
}, {})

// Overall totals per category across the whole trip, for the donut chart.
export const categoryTotals = EXPENSE_CATEGORIES.map((category) => {
  const total = expenseRows
    .filter((row) => EXPENSE_CATEGORY_LABELS[row.category] === category)
    .reduce((sum, row) => sum + Number(row.amount_usd), 0)
  return { category, total: Math.round(total * 100) / 100 }
})

// Per-day, per-category totals with city labels, for the comparison view.
export const categoryTotalsByDay = EXPENSE_CATEGORIES.reduce((acc, category) => {
  acc[category] = tripDays.map((day) => {
    const total = (expensesByDay[day.dayId] ?? [])
      .filter((entry) => entry.category === category)
      .reduce((sum, entry) => sum + entry.amount, 0)
    return {
      dayId: day.dayId,
      dayNumber: day.dayNumber,
      city: day.city,
      amount: Math.round(total * 100) / 100,
    }
  })
  return acc
}, {})

export function getDay(dayId) {
  return dayLookup[dayId]
}
