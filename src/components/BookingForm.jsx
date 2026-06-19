import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material'
import dayjs from 'dayjs'
import { formatCurrency } from '../utils/helpers'
import { fieldSx, primaryButtonSx, drawerFormStackSx } from '../utils/layout'
import DateTimeSplitField, { combineDateAndTime } from './DateTimeSplitField'
import DatePickerField from './DatePickerField'
import FileUpload from './FileUpload'
import toast from 'react-hot-toast'

const stayTypes = ['Hours', 'Days', 'Weeks', 'Months']
const paymentTypes = ['Cash', 'UPI', 'Card', 'Bank Transfer']
const paymentStatuses = ['pending', 'completed']

const rowSx = { display: 'flex', gap: 1.5, width: '100%', flexWrap: { xs: 'wrap', sm: 'nowrap' } }
const thirdFieldSx = { ...fieldSx, flex: 1, minWidth: { xs: '100%', sm: 0 } }

const BookingForm = ({ floors, rooms, beds, onSubmit, onCancel }) => {
  const [photoFile, setPhotoFile] = useState(null)
  const [aadhaarFile, setAadhaarFile] = useState(null)
  const [panFile, setPanFile] = useState(null)

  const now = dayjs()
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '', phone: '', address: '', city: '', state: '',
      aadhaar: '', pan: '', floorId: '', roomId: '', bedId: '',
      stayType: 'Days', duration: 1, advancePaid: 0,
      checkInDate: now.format('YYYY-MM-DD'),
      checkInTime: now.format('HH:mm'),
      checkOutDate: '',
      checkOutTime: '',
      paymentDate: now.format('YYYY-MM-DD'),
      paymentType: 'Cash',
      paymentStatus: 'pending',
    },
  })

  const selectedFloor = watch('floorId')
  const selectedRoom = watch('roomId')
  const selectedBed = watch('bedId')
  const duration = watch('duration')
  const advancePaid = watch('advancePaid')
  const paymentStatus = watch('paymentStatus')
  const checkInDate = watch('checkInDate')
  const checkInTime = watch('checkInTime')
  const checkOutDate = watch('checkOutDate')
  const checkOutTime = watch('checkOutTime')

  const filteredRooms = rooms.filter((r) => r.floorId === selectedFloor)
  const filteredBeds = beds.filter((b) => b.roomId === selectedRoom && b.status === 'vacant')
  const selectedBedData = beds.find((b) => b.id === selectedBed)
  const bedCost = selectedBedData?.cost || 0
  const totalAmount = bedCost * (duration || 0)
  const balanceAmount = Math.max(0, totalAmount - (advancePaid || 0))

  useEffect(() => { setValue('roomId', ''); setValue('bedId', '') }, [selectedFloor, setValue])
  useEffect(() => { setValue('bedId', '') }, [selectedRoom, setValue])
  useEffect(() => {
    if (balanceAmount <= 0 && totalAmount > 0) setValue('paymentStatus', 'completed')
    else if (balanceAmount > 0) setValue('paymentStatus', 'pending')
  }, [balanceAmount, totalAmount, setValue])

  const handleFormSubmit = (data) => {
    const checkInDateTime = combineDateAndTime(data.checkInDate, data.checkInTime)
    const checkOutDateTime = data.checkOutDate
      ? combineDateAndTime(data.checkOutDate, data.checkOutTime || '12:00')
      : ''

    onSubmit({
      ...data,
      checkInDateTime,
      checkOutDateTime,
      bedCost,
      totalAmount,
      balanceAmount,
      photoFile,
      aadhaarFile,
      panFile,
      photo: photoFile?.preview || `https://i.pravatar.cc/150?u=${data.name}`,
      aadhaarDoc: aadhaarFile?.preview || null,
      panDoc: panFile?.preview || null,
      paymentStatus: data.paymentStatus || (balanceAmount > 0 ? 'pending' : 'completed'),
    })
    toast.success('Booking created successfully!')
    reset()
    setPhotoFile(null); setAadhaarFile(null); setPanFile(null)
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Section title="Customer Information">
        <Field control={control} name="name" label="Full Name" rules={{ required: 'Name is required' }} errors={errors} />
        <Field control={control} name="phone" label="Phone Number" rules={{ required: 'Phone is required' }} errors={errors} />
        <Field control={control} name="address" label="Address" rules={{ required: 'Address is required' }} errors={errors} />
        <Field control={control} name="city" label="City" rules={{ required: 'City is required' }} errors={errors} />
        <Field control={control} name="state" label="State" rules={{ required: 'State is required' }} errors={errors} />
      </Section>

      <Section title="Identity Information">
        <Field control={control} name="aadhaar" label="Aadhaar Number" rules={{ required: 'Aadhaar is required', minLength: { value: 12, message: 'Must be 12 digits' } }} errors={errors} />
        <Field control={control} name="pan" label="PAN Number" rules={{ required: 'PAN is required' }} errors={errors} />
        <FileUpload label="Photo Upload" value={photoFile} onChange={setPhotoFile} />
        <FileUpload label="Aadhaar Upload" value={aadhaarFile} onChange={setAadhaarFile} />
        <FileUpload label="PAN Upload" value={panFile} onChange={setPanFile} />
      </Section>

      <Section title="Booking Information">
        <Controller name="floorId" control={control} rules={{ required: 'Select a floor' }} render={({ field }) => (
          <TextField {...field} select fullWidth label="Floor" error={!!errors.floorId} helperText={errors.floorId?.message} sx={fieldSx}>
            {floors.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
          </TextField>
        )} />
        <Controller name="roomId" control={control} rules={{ required: 'Select a room' }} render={({ field }) => (
          <TextField {...field} select fullWidth label="Room" disabled={!selectedFloor} error={!!errors.roomId} helperText={errors.roomId?.message} sx={fieldSx}>
            {filteredRooms.map((r) => <MenuItem key={r.id} value={r.id}>Room {r.roomNumber}</MenuItem>)}
          </TextField>
        )} />
        <Controller name="bedId" control={control} rules={{ required: 'Select a bed' }} render={({ field }) => (
          <TextField {...field} select fullWidth label="Bed" disabled={!selectedRoom} error={!!errors.bedId} helperText={errors.bedId?.message} sx={fieldSx}>
            {filteredBeds.map((b) => <MenuItem key={b.id} value={b.id}>Bed {b.bedNumber} — {formatCurrency(b.cost)}</MenuItem>)}
          </TextField>
        )} />
        <Box sx={rowSx}>
          <Controller name="duration" control={control} rules={{ required: true, min: 1 }} render={({ field }) => (
            <TextField {...field} type="number" label="Duration" error={!!errors.duration} sx={{ ...fieldSx, flex: 1 }} />
          )} />
          <Controller name="stayType" control={control} render={({ field }) => (
            <TextField {...field} select label="Stay Type" sx={{ ...fieldSx, flex: 1 }}>
              {stayTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          )} />
        </Box>
        <DateTimeSplitField
          dateLabel="Check-In Date"
          timeLabel="Check-In Time"
          dateValue={checkInDate}
          timeValue={checkInTime}
          onDateChange={(v) => setValue('checkInDate', v, { shouldValidate: true })}
          onTimeChange={(v) => setValue('checkInTime', v)}
          required
        />
        <DateTimeSplitField
          dateLabel="Check-Out Date"
          timeLabel="Check-Out Time"
          dateValue={checkOutDate}
          timeValue={checkOutTime}
          onDateChange={(v) => setValue('checkOutDate', v)}
          onTimeChange={(v) => setValue('checkOutTime', v)}
        />
      </Section>

      <Section title="Payment Information">
        <Box sx={{ display: 'flex', gap: 1.5, p: 1.5, bgcolor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Total Amount</Typography>
            <Typography variant="body1" fontWeight={700}>{formatCurrency(totalAmount)}</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="text.secondary">Bed Cost</Typography>
            <Typography variant="body1" fontWeight={600}>{formatCurrency(bedCost)}</Typography>
          </Box>
        </Box>

        <Box sx={rowSx}>
          <Controller name="advancePaid" control={control} render={({ field }) => (
            <TextField {...field} type="number" label="Advance Paid" onChange={(e) => field.onChange(Number(e.target.value))} sx={{ ...fieldSx, flex: 1 }} />
          )} />
          <TextField label="Balance Amount" value={formatCurrency(balanceAmount)} InputProps={{ readOnly: true }} sx={{ ...fieldSx, flex: 1, '& input': { fontWeight: 600, color: balanceAmount > 0 ? '#dc2626' : '#059669' } }} />
        </Box>

        <Box sx={rowSx}>
          <Controller name="paymentDate" control={control} render={({ field: { value, onChange } }) => (
            <DatePickerField label="Payment Date" value={value} onChange={onChange} sx={thirdFieldSx} />
          )} />
          <Controller name="paymentStatus" control={control} render={({ field }) => (
            <TextField {...field} select label="Payment Status" sx={thirdFieldSx}>
              {paymentStatuses.map((s) => (
                <MenuItem key={s} value={s}>{s === 'completed' ? 'Completed' : 'Pending'}</MenuItem>
              ))}
            </TextField>
          )} />
          <Controller name="paymentType" control={control} render={({ field }) => (
            <TextField {...field} select label="Payment Type" sx={thirdFieldSx}>
              {paymentTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          )} />
        </Box>
        {paymentStatus === 'completed' && balanceAmount > 0 && (
          <Typography variant="caption" color="error">Mark completed only when balance is cleared</Typography>
        )}
      </Section>

      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', pt: 1 }}>
        <Button variant="outlined" onClick={onCancel} sx={{ height: 44 }}>Cancel</Button>
        <Button type="submit" variant="contained" sx={primaryButtonSx}>Save Booking</Button>
      </Box>
    </Box>
  )
}

const Section = ({ title, children }) => (
  <Box sx={{ p: 2, border: '1px solid #e2e8f0', bgcolor: '#fafbfc' }}>
    <Typography variant="subtitle2" sx={{ fontFamily: 'Poppins', fontWeight: 600, mb: 1.5, color: '#0f172a' }}>{title}</Typography>
    <Box sx={drawerFormStackSx}>{children}</Box>
  </Box>
)

const Field = ({ control, name, label, rules, errors, type = 'text' }) => (
  <Controller name={name} control={control} rules={rules} render={({ field }) => (
    <TextField {...field} label={label} type={type} fullWidth error={!!errors[name]} helperText={errors[name]?.message} sx={fieldSx} />
  )} />
)

export default BookingForm
