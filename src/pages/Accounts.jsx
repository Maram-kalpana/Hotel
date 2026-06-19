import { useState, useMemo } from 'react'
import { TextField, MenuItem } from '@mui/material'
import PageTransition from '../components/PageTransition'
import MuiDataGrid from '../components/MuiDataGrid'
import DatePickerField from '../components/DatePickerField'
import { useBookings } from '../hooks/useStore'
import { formatCurrency, formatDate, getMonthYear } from '../utils/helpers'
import { filterFieldSx } from '../utils/layout'

const Accounts = () => {
  const { list: bookings } = useBookings()
  const [searchDate, setSearchDate] = useState('')
  const [filterMode, setFilterMode] = useState('day')

  const computedRecords = useMemo(() => {
    const map = new Map()

    bookings.forEach((b) => {
      const addToMap = (dateKey, amount, type) => {
        if (!dateKey || !amount) return
        const key = dateKey.split('T')[0]
        if (!map.has(key)) {
          map.set(key, { id: key, date: key, cash: 0, upi: 0, card: 0, bank: 0, total: 0, bookings: 0 })
        }
        const row = map.get(key)
        row.total += amount
        row.bookings += 1
        const t = (type || 'cash').toLowerCase()
        if (t === 'cash') row.cash += amount
        else if (t === 'upi') row.upi += amount
        else if (t === 'card') row.card += amount
        else row.bank += amount
      }

      if (b.advancePaid > 0) {
        addToMap(b.checkInDateTime || b.checkInDate || b.createdAt, b.advancePaid, b.paymentType)
      }
      ;(b.payments || []).forEach((p) => addToMap(p.date, p.amount, p.type))
    })

    return [...map.values()].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [bookings])

  const monthRecords = useMemo(() => {
    const map = new Map()
    computedRecords.forEach((r) => {
      const monthKey = getMonthYear(r.date)
      if (!map.has(monthKey)) {
        map.set(monthKey, { id: monthKey, period: monthKey, cash: 0, upi: 0, card: 0, bank: 0, total: 0, bookings: 0 })
      }
      const row = map.get(monthKey)
      row.cash += r.cash
      row.upi += r.upi
      row.card += r.card
      row.bank += r.bank
      row.total += r.total
      row.bookings += r.bookings
    })
    return [...map.values()]
  }, [computedRecords])

  const filtered = useMemo(() => {
    if (filterMode === 'month') return monthRecords
    if (searchDate) return computedRecords.filter((r) => r.date === searchDate)
    return computedRecords
  }, [computedRecords, monthRecords, searchDate, filterMode])

  const dayColumns = [
    { field: 'date', headerName: 'Date', flex: 1, minWidth: 120, valueFormatter: (v) => formatDate(v) },
    { field: 'total', headerName: 'Amount', flex: 1, minWidth: 120, valueFormatter: (v) => formatCurrency(v) },
    { field: 'cash', headerName: 'Cash', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'upi', headerName: 'UPI', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'card', headerName: 'Card', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'bank', headerName: 'Bank', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'bookings', headerName: 'Bookings', width: 90 },
  ]

  const monthColumns = [
    { field: 'period', headerName: 'Month', flex: 1, minWidth: 160 },
    { field: 'total', headerName: 'Amount', flex: 1, minWidth: 120, valueFormatter: (v) => formatCurrency(v) },
    { field: 'cash', headerName: 'Cash', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'upi', headerName: 'UPI', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'card', headerName: 'Card', width: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'bookings', headerName: 'Bookings', width: 90 },
  ]

  const totalAmount = filtered.reduce((sum, r) => sum + (r.total || 0), 0)

  return (
    <PageTransition className="page-container">
      <div className="flex flex-wrap items-end gap-3 mb-5">
        <TextField select label="View By" value={filterMode} onChange={(e) => setFilterMode(e.target.value)} sx={filterFieldSx}>
          <MenuItem value="day">Day</MenuItem>
          <MenuItem value="month">Month</MenuItem>
        </TextField>
        {filterMode === 'day' && (
          <DatePickerField label="Search By Date" value={searchDate} onChange={setSearchDate} sx={filterFieldSx} />
        )}
      </div>

      <MuiDataGrid
        rows={filtered}
        columns={filterMode === 'month' ? monthColumns : dayColumns}
        pageSize={10}
      />
    </PageTransition>
  )
}

export default Accounts
