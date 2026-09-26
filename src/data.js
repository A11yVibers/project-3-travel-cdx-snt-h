import Papa from 'papaparse'
import tripDaysCsv from '../project-assets/trip_days.csv?raw'
import itineraryCsv from '../project-assets/itinerary.csv?raw'
import expensesCsv from '../project-assets/expenses.csv?raw'

function parse(csvText) {
  const { data } = Papa.parse(csvText.trim(), {
    header: true,
    skipEmptyLines: true,
  })
  return data
}

const rawTripDays = parse(tripDaysCsv)
const rawItinerary = parse(itineraryCsv)
const rawExpenses = parse(expensesCsv)

export const EXPENSE_CATEGORY_LABELS = {
  lodging: 'Lodging',
  food: 'Food',
  entertainment: 'Entertainment',
  travel: 'Travel',
}

export const EXPENSE_CATEGORIES = ['Lodging', 'Food', 'Entertainment', 'Travel']

const itineraryByDay = new Map()
for (const row of rawItinerary) {
  const list = itineraryByDay.get(row.day_id) ?? []
  list.push({
    order: Number(row.item_order),
    time: row.time,
    place: row.place,
    activity: row.activity,
  })
  itineraryByDay.set(row.day_id, list)
}
for (const list of itineraryByDay.values()) {
  list.sort((a, b) => a.order - b.order)
}

const expensesByDay = new Map()
for (const row of rawExpenses) {
  const list = expensesByDay.get(row.day_id) ?? []
  list.push({
    order: Number(row.expense_order),
    category: EXPENSE_CATEGORY_LABELS[row.category] ?? row.category,
    subcategory: row.subcategory,
    description: row.description,
    amount: Number(row.amount_usd),
  })
  expensesByDay.set(row.day_id, list)
}

export const tripDays = rawTripDays
  .map((row) => ({
    dayId: row.day_id,
    dayNumber: Number(row.day_number),
    date: row.date,
    city: row.city,
    country: row.country,
    landmark: row.iconic_landmark,
    imageUrl: row.landmark_image_url,
    itinerary: itineraryByDay.get(row.day_id) ?? [],
    expenses: expensesByDay.get(row.day_id) ?? [],
  }))
  .sort((a, b) => a.dayNumber - b.dayNumber)

export function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getCategoryTotals() {
  const totals = new Map(EXPENSE_CATEGORIES.map((category) => [category, 0]))
  for (const day of tripDays) {
    for (const expense of day.expenses) {
      totals.set(expense.category, (totals.get(expense.category) ?? 0) + expense.amount)
    }
  }
  return EXPENSE_CATEGORIES.map((category) => ({
    category,
    total: totals.get(category) ?? 0,
  }))
}

export function getCategoryByDay(category) {
  return tripDays.map((day) => {
    const total = day.expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
    return {
      dayNumber: day.dayNumber,
      city: day.city,
      date: day.date,
      amount: total,
    }
  })
}

export function getTotalSpend() {
  return getCategoryTotals().reduce((sum, entry) => sum + entry.total, 0)
}
