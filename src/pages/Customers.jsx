import { useState, useMemo } from 'react'
import { Avatar, TextField } from '@mui/material'
import PageTransition from '../components/PageTransition'
import MuiDataGrid from '../components/MuiDataGrid'
import DatePickerField from '../components/DatePickerField'
import { useCustomers, useHotel, useBookings } from '../hooks/useStore'
import { formatCurrency, formatDate } from '../utils/helpers'
import { filterFieldSx } from '../utils/layout'

const Customers = () => {
  const { list } = useCustomers()
  const { list: bookings } = useBookings()
  const { beds } = useHotel()

  const [search, setSearch] = useState('')
  const [checkInDate, setCheckInDate] = useState('')

  const enrichedCustomers = useMemo(() => list.map((c) => {
    const bed = beds.find((b) => b.id === c.bedId)
    const booking = bookings.find((b) => b.customerId === c.id)
    return {
      ...c,
      floorNumber: bed?.floorNumber ?? '—',
      amount: booking?.totalAmount ?? 0,
      checkOutDateTime: booking?.checkOutDateTime || c.checkOutDateTime || '',
    }
  }), [list, beds, bookings])

  const filtered = useMemo(() => {
    let rows = enrichedCustomers
    const q = search.toLowerCase().trim()
    if (q) {
      rows = rows.filter((c) =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.aadhaar?.includes(q),
      )
    }
    if (checkInDate) rows = rows.filter((c) => c.checkInDate === checkInDate)
    return rows
  }, [enrichedCustomers, search, checkInDate])

  const columns = [
    { field: 'photo', headerName: 'Photo', width: 70, renderCell: ({ row }) => <Avatar src={row.photo} alt={row.name} sx={{ width: 40, height: 40 }} /> },
    { field: 'name', headerName: 'Name', minWidth: 140 },
    { field: 'phone', headerName: 'Phone', minWidth: 130 },
    { field: 'floorNumber', headerName: 'Floor', width: 80 },
    { field: 'roomNumber', headerName: 'Room', width: 80 },
    { field: 'bedNumber', headerName: 'Bed', width: 70 },
    { field: 'checkInDate', headerName: 'Check-In Date', minWidth: 120, valueFormatter: (v) => formatDate(v) },
    { field: 'amount', headerName: 'Amount', minWidth: 110, valueFormatter: (v) => formatCurrency(v) },
    { field: 'checkOutDateTime', headerName: 'Check-Out Date', minWidth: 130, valueFormatter: (v) => v ? formatDate(v) : '—' },
  ]

  return (
    <PageTransition className="page-container">
      <div className="page-header">
        <h2 className="section-title">Customers</h2>
        <p className="page-subtitle">{filtered.length} active customers</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-5">
        <TextField label="Search Customer" value={search} onChange={(e) => setSearch(e.target.value)} sx={filterFieldSx} />
        <DatePickerField label="Check-In Date" value={checkInDate} onChange={setCheckInDate} sx={filterFieldSx} />
      </div>

      <MuiDataGrid rows={filtered} columns={columns} pageSize={10} />
    </PageTransition>
  )
}

export default Customers
