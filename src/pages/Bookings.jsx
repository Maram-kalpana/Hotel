import { useState, useMemo } from 'react'
import { Button, IconButton, TextField, MenuItem, Avatar, Typography, Box } from '@mui/material'
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import PageTransition from '../components/PageTransition'
import MuiDataGrid from '../components/MuiDataGrid'
import RightDrawer from '../components/RightDrawer'
import DatePickerField from '../components/DatePickerField'
import DateTimeSplitField, { combineDateAndTime, splitDateTime } from '../components/DateTimeSplitField'
import DrawerFormStack from '../components/DrawerFormStack'
import DrawerDetailItem from '../components/DrawerDetailItem'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import BookingForm from '../components/BookingForm'
import { useAuth, useAppDispatch, useHotel, useBookings, useCustomers } from '../hooks/useStore'
import { addCustomer } from '../redux/slices/customerSlice'
import { addBooking, updateBooking, deleteBooking } from '../redux/slices/bookingSlice'
import { updateBed } from '../redux/slices/hotelSlice'
import { formatCurrency, formatDateTime, ROLES, getPaymentStatus, formatStayDuration } from '../utils/helpers'
import { fieldSx, filterFieldSx, primaryButtonSx } from '../utils/layout'

const BookingsContent = () => {
  const { user } = useAuth()
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN
  const { floors, rooms, beds } = useHotel()
  const { list: bookings } = useBookings()
  const { list: customers } = useCustomers()
  const dispatch = useAppDispatch()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewBooking, setViewBooking] = useState(null)
  const [editBooking, setEditBooking] = useState(null)
  const [search, setSearch] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const emptyEditForm = {
    amount: '', paymentDate: '', paymentTime: '12:00', paymentType: 'Cash', paymentStatus: 'pending',
    extendedDate: '', extendedTime: '12:00', extendedAmount: '', extendedStatus: 'pending',
  }
  const [editForm, setEditForm] = useState(emptyEditForm)

  const tableRows = useMemo(() => {
    let rows = bookings
      .filter((b) => isSuperAdmin ? ['active', 'reserved', 'booked'].includes(b.status) : true)
      .map((b) => {
        const customer = customers.find((c) => c.id === b.customerId)
        const status = b.paymentStatus || getPaymentStatus(b.balanceAmount)
        return {
          id: b.id,
          customerName: b.customerName,
          phone: customer?.phone || b.phone || '—',
          floorNumber: b.floorNumber,
          roomNumber: b.roomNumber,
          bedNumber: b.bedNumber,
          checkInDateTime: b.checkInDateTime || b.checkInDate,
          checkOutDateTime: b.checkOutDateTime || '',
          stayDuration: formatStayDuration(b.duration, b.stayType),
          totalAmount: b.totalAmount,
          paymentType: b.paymentType || '—',
          paymentStatus: status,
          balanceAmount: b.balanceAmount ?? 0,
          booking: b,
          customer,
        }
      })

    const q = search.toLowerCase().trim()
    if (q) {
      rows = rows.filter((r) =>
        r.customerName?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        String(r.roomNumber).includes(q),
      )
    }
    if (bookingDate) {
      rows = rows.filter((r) => {
        const d = r.checkInDateTime?.split('T')[0] || r.checkInDateTime
        return d === bookingDate
      })
    }
    if (paymentFilter) {
      rows = rows.filter((r) => r.paymentStatus === paymentFilter)
    }
    return rows
  }, [bookings, customers, search, bookingDate, paymentFilter, isSuperAdmin])

  const handleSubmit = (data) => {
    const bed = beds.find((b) => b.id === data.bedId)
    const customerId = `cust-${Date.now()}`
    const checkInDate = data.checkInDateTime?.split('T')[0] || new Date().toISOString().split('T')[0]

    dispatch(addCustomer({
      id: customerId,
      name: data.name,
      phone: data.phone,
      email: `${data.name.replace(/\s+/g, '.').toLowerCase()}@email.com`,
      address: data.address,
      city: data.city,
      state: data.state,
      aadhaar: data.aadhaar,
      pan: data.pan,
      photo: data.photo,
      aadhaarDoc: data.aadhaarDoc,
      panDoc: data.panDoc,
      status: 'checked-in',
      roomId: data.roomId,
      bedId: data.bedId,
      roomNumber: bed?.roomNumber,
      bedNumber: bed?.bedNumber,
      checkInDate,
      checkInDateTime: data.checkInDateTime,
    }))
    dispatch(updateBed({ ...bed, status: 'occupied', customerId }))
    dispatch(addBooking({
      id: `booking-${Date.now()}`,
      customerId,
      customerName: data.name,
      phone: data.phone,
      bedId: data.bedId,
      roomId: data.roomId,
      roomNumber: bed?.roomNumber,
      bedNumber: bed?.bedNumber,
      floorNumber: bed?.floorNumber,
      stayType: data.stayType,
      duration: data.duration,
      bedCost: data.bedCost,
      totalAmount: data.totalAmount,
      advancePaid: data.advancePaid,
      balanceAmount: data.balanceAmount,
      paymentType: data.paymentType,
      paymentStatus: data.paymentStatus,
      status: 'active',
      checkInDate,
      checkInDateTime: data.checkInDateTime,
      checkOutDateTime: data.checkOutDateTime || '',
      createdAt: checkInDate,
      payments: data.advancePaid > 0 ? [{ amount: data.advancePaid, date: data.checkInDateTime, type: data.paymentType, status: data.paymentStatus }] : [],
    }))
    setDrawerOpen(false)
  }

  const handleDelete = (row) => {
    const booking = row.booking
    const bed = beds.find((b) => b.id === booking.bedId)
    if (bed) dispatch(updateBed({ ...bed, status: 'vacant', customerId: null }))
    dispatch(deleteBooking(booking.id))
    toast.success('Booking deleted')
  }

  const openEdit = (row) => {
    const b = row.booking
    const today = new Date().toISOString().split('T')[0]
    const ext = splitDateTime(b.extendedUpto || '')
    setEditBooking(b)
    setEditForm({
      amount: b.balanceAmount > 0 ? String(b.balanceAmount) : '',
      paymentDate: today,
      paymentTime: new Date().toTimeString().slice(0, 5),
      paymentType: b.paymentType || 'Cash',
      paymentStatus: b.paymentStatus || getPaymentStatus(b.balanceAmount),
      extendedDate: ext.date,
      extendedTime: ext.time || '12:00',
      extendedAmount: '',
      extendedStatus: b.extendedStatus || 'pending',
    })
  }

  const handleEditSave = () => {
    if (!editBooking) return
    let updated = { ...editBooking }
    let changed = false

    const payAmount = Number(editForm.amount) || 0
    if (payAmount > 0) {
      const paymentDateTime = combineDateAndTime(editForm.paymentDate, editForm.paymentTime)
      if (!editForm.paymentDate) { toast.error('Enter payment date'); return }
      const newAdvance = (updated.advancePaid || 0) + payAmount
      const newBalance = Math.max(0, (updated.totalAmount || 0) - newAdvance)
      const newStatus = editForm.paymentStatus === 'completed' && newBalance === 0 ? 'completed' : (newBalance > 0 ? 'pending' : 'completed')
      updated = {
        ...updated,
        advancePaid: newAdvance,
        balanceAmount: newBalance,
        paymentStatus: newStatus,
        paymentType: editForm.paymentType,
        payments: [...(updated.payments || []), {
          amount: payAmount,
          date: paymentDateTime,
          type: editForm.paymentType,
          status: newStatus,
        }],
      }
      changed = true
    }

    const extAmount = Number(editForm.extendedAmount) || 0
    if (editForm.extendedDate && extAmount > 0) {
      const extendedUpto = combineDateAndTime(editForm.extendedDate, editForm.extendedTime)
      updated = {
        ...updated,
        extendedUpto,
        extendedAmount: (updated.extendedAmount || 0) + extAmount,
        extendedStatus: editForm.extendedStatus,
        totalAmount: (updated.totalAmount || 0) + extAmount,
        balanceAmount: (updated.balanceAmount || 0) + extAmount,
        paymentStatus: editForm.extendedStatus === 'completed' ? updated.paymentStatus : 'pending',
      }
      changed = true
    }

    if (!changed) {
      toast.error('Update payment amount or extended stay details')
      return
    }

    dispatch(updateBooking(updated))
    toast.success('Booking updated')
    setEditBooking(null)
    setEditForm(emptyEditForm)
  }

  const columns = [
    { field: 'customerName', headerName: 'Customer Name', flex: 1, minWidth: 140 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
    { field: 'floorNumber', headerName: 'Floor', width: 75 },
    { field: 'roomNumber', headerName: 'Room', width: 75 },
    { field: 'bedNumber', headerName: 'Bed', width: 65 },
    { field: 'checkInDateTime', headerName: 'Checked In', flex: 1, minWidth: 150, valueFormatter: (v) => formatDateTime(v) },
    { field: 'checkOutDateTime', headerName: 'Checked Out', flex: 1, minWidth: 150, valueFormatter: (v) => v ? formatDateTime(v) : '—' },
    { field: 'stayDuration', headerName: 'Stay', width: 100 },
    { field: 'totalAmount', headerName: 'Amount', flex: 1, minWidth: 100, valueFormatter: (v) => formatCurrency(v) },
    { field: 'paymentType', headerName: 'Payment Type', width: 110 },
    { field: 'paymentStatus', headerName: 'Payment Status', width: 130, renderCell: ({ row }) => <PaymentStatusBadge status={row.paymentStatus} balanceAmount={row.balanceAmount} /> },
    {
      field: 'actions', headerName: 'Actions', width: isSuperAdmin ? 80 : 130,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-0.5">
          <IconButton size="small" color="primary" onClick={() => setViewBooking(row.booking)} title="View"><Eye size={16} /></IconButton>
          {!isSuperAdmin && (
            <>
              <IconButton size="small" color="info" onClick={() => openEdit(row)} title="Edit"><Pencil size={16} /></IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(row)} title="Delete"><Trash2 size={16} /></IconButton>
            </>
          )}
        </div>
      ),
    },
  ]

  const viewCustomer = viewBooking ? customers.find((c) => c.id === viewBooking.customerId) : null

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="section-title">Bookings</h2>
          <p className="page-subtitle">{tableRows.length} bookings</p>
        </div>
        {!isSuperAdmin && (
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setDrawerOpen(true)} sx={{ ...primaryButtonSx, flexShrink: 0 }}>
            Add Booking
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-5">
        <TextField label="Search Booking" value={search} onChange={(e) => setSearch(e.target.value)} sx={filterFieldSx} />
        <DatePickerField label="Booking Date" value={bookingDate} onChange={setBookingDate} sx={filterFieldSx} />
        <TextField select label="Payment Status" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} sx={filterFieldSx}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>
      </div>

      <MuiDataGrid rows={tableRows} columns={columns} pageSize={10} />

      {!isSuperAdmin && (
        <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Add Booking" variant="booking">
          <BookingForm floors={floors} rooms={rooms} beds={beds} onSubmit={handleSubmit} onCancel={() => setDrawerOpen(false)} />
        </RightDrawer>
      )}

      <RightDrawer open={!!viewBooking} onClose={() => setViewBooking(null)} title="Booking Details" variant="booking" footer={
        <Button onClick={() => setViewBooking(null)} sx={{ height: 44 }}>Close</Button>
      }>
        {viewBooking && (
          <DrawerFormStack>
            <DrawerDetailItem label="Customer Name" value={viewBooking.customerName} />
            <DrawerDetailItem label="Phone" value={viewBooking.phone || viewCustomer?.phone || '—'} />
            <DrawerDetailItem label="Floor / Room / Bed" value={`${viewBooking.floorNumber} / ${viewBooking.roomNumber} / ${viewBooking.bedNumber}`} />
            <DrawerDetailItem label="Checked In" value={formatDateTime(viewBooking.checkInDateTime || viewBooking.checkInDate)} />
            <DrawerDetailItem label="Checked Out" value={viewBooking.checkOutDateTime ? formatDateTime(viewBooking.checkOutDateTime) : '—'} />
            <DrawerDetailItem label="Stay" value={formatStayDuration(viewBooking.duration, viewBooking.stayType)} />
            <DrawerDetailItem label="Amount" value={formatCurrency(viewBooking.totalAmount)} />
            <DrawerDetailItem label="Advance Paid" value={formatCurrency(viewBooking.advancePaid)} />
            <DrawerDetailItem label="Balance" value={formatCurrency(viewBooking.balanceAmount)} />
            <DrawerDetailItem label="Payment Type" value={viewBooking.paymentType || '—'} />
            {viewBooking.extendedUpto && (
              <>
                <DrawerDetailItem label="Extended Upto" value={formatDateTime(viewBooking.extendedUpto)} />
                <DrawerDetailItem label="Extension Amount" value={formatCurrency(viewBooking.extendedAmount)} />
              </>
            )}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500 mb-2">Payment Status</p>
              <PaymentStatusBadge status={viewBooking.paymentStatus} balanceAmount={viewBooking.balanceAmount} />
            </div>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>ID Proofs</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {viewCustomer?.photo && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Photo</Typography>
                  <Avatar src={viewCustomer.photo} variant="rounded" sx={{ width: '100%', height: 120, mt: 0.5 }} />
                </Box>
              )}
              {viewCustomer?.aadhaarDoc && (
                <Box>
                  <Typography variant="caption" color="text.secondary">Aadhaar</Typography>
                  <Box component="img" src={viewCustomer.aadhaarDoc} alt="Aadhaar" sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', mt: 0.5 }} />
                </Box>
              )}
              {viewCustomer?.panDoc && (
                <Box>
                  <Typography variant="caption" color="text.secondary">PAN</Typography>
                  <Box component="img" src={viewCustomer.panDoc} alt="PAN" sx={{ width: '100%', maxHeight: 120, objectFit: 'cover', mt: 0.5 }} />
                </Box>
              )}
              {!viewCustomer?.photo && !viewCustomer?.aadhaarDoc && !viewCustomer?.panDoc && (
                <Typography variant="body2" color="text.secondary">No documents uploaded</Typography>
              )}
            </Box>
          </DrawerFormStack>
        )}
      </RightDrawer>

      <RightDrawer open={!!editBooking} onClose={() => { setEditBooking(null); setEditForm(emptyEditForm) }} title="Edit Booking" variant="booking" footer={
        <>
          <Button onClick={() => { setEditBooking(null); setEditForm(emptyEditForm) }} sx={{ height: 44 }}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} sx={primaryButtonSx}>Save Changes</Button>
        </>
      }>
        {editBooking && (
          <DrawerFormStack>
            <DrawerDetailItem label="Customer" value={editBooking.customerName} />
            <DrawerDetailItem label="Current Balance" value={formatCurrency(editBooking.balanceAmount)} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, pt: 1 }}>Update Payment</Typography>
            <TextField fullWidth label="Balance Amount Paid" type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} sx={fieldSx} />
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <DatePickerField label="Payment Date" value={editForm.paymentDate} onChange={(v) => setEditForm({ ...editForm, paymentDate: v })} sx={{ ...fieldSx, flex: 1 }} />
              <TextField select label="Payment Status" value={editForm.paymentStatus} onChange={(e) => setEditForm({ ...editForm, paymentStatus: e.target.value })} sx={{ ...fieldSx, flex: 1 }}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
              <TextField select label="Payment Type" value={editForm.paymentType} onChange={(e) => setEditForm({ ...editForm, paymentType: e.target.value })} sx={{ ...fieldSx, flex: 1 }}>
                {['Cash', 'UPI', 'Card', 'Bank Transfer'].map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextField>
            </Box>

            <Typography variant="subtitle2" sx={{ fontWeight: 600, pt: 2 }}>Extend Stay</Typography>
            <DateTimeSplitField
              dateLabel="Extended Upto Date"
              timeLabel="Extended Upto Time"
              dateValue={editForm.extendedDate}
              timeValue={editForm.extendedTime}
              onDateChange={(v) => setEditForm({ ...editForm, extendedDate: v })}
              onTimeChange={(v) => setEditForm({ ...editForm, extendedTime: v })}
            />
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
              <TextField fullWidth label="Extension Amount" type="number" value={editForm.extendedAmount} onChange={(e) => setEditForm({ ...editForm, extendedAmount: e.target.value })} sx={{ ...fieldSx, flex: 1 }} />
              <TextField select fullWidth label="Extension Status" value={editForm.extendedStatus} onChange={(e) => setEditForm({ ...editForm, extendedStatus: e.target.value })} sx={{ ...fieldSx, flex: 1 }}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Box>
          </DrawerFormStack>
        )}
      </RightDrawer>
    </>
  )
}

const Bookings = () => (
  <PageTransition className="page-container">
    <BookingsContent />
  </PageTransition>
)

export default Bookings
