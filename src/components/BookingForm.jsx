import { useForm, Controller } from 'react-hook-form'
import {
  TextField, Button, Grid, MenuItem, FormControl, InputLabel, Select, Typography, Divider, Box,
} from '@mui/material'
import { useEffect } from 'react'
import { formatCurrency } from '../utils/helpers'
import toast from 'react-hot-toast'

const stayTypes = ['Hours', 'Days', 'Weeks', 'Months']

const BookingForm = ({ floors, rooms, beds, onSubmit, onReset }) => {
  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '', phone: '', address: '', city: '', state: '',
      aadhaar: '', pan: '', floorId: '', roomId: '', bedId: '',
      stayType: 'Days', duration: 1, advancePaid: 0,
    },
  })

  const selectedFloor = watch('floorId')
  const selectedRoom = watch('roomId')
  const selectedBed = watch('bedId')
  const duration = watch('duration')
  const advancePaid = watch('advancePaid')

  const filteredRooms = rooms.filter((r) => r.floorId === selectedFloor)
  const filteredBeds = beds.filter((b) => b.roomId === selectedRoom && b.status === 'vacant')
  const selectedBedData = beds.find((b) => b.id === selectedBed)
  const bedCost = selectedBedData?.cost || 0
  const totalAmount = bedCost * (duration || 0)
  const balanceAmount = totalAmount - (advancePaid || 0)

  useEffect(() => {
    setValue('roomId', '')
    setValue('bedId', '')
  }, [selectedFloor, setValue])

  useEffect(() => {
    setValue('bedId', '')
  }, [selectedRoom, setValue])

  const handleFormSubmit = (data) => {
    onSubmit({ ...data, bedCost, totalAmount, balanceAmount })
    toast.success('Booking created successfully!')
  }

  const handleReset = () => {
    reset()
    onReset?.()
  }

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Section title="Personal Information">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><Field control={control} name="name" label="Full Name" rules={{ required: 'Name is required' }} errors={errors} /></Grid>
          <Grid item xs={12} md={6}><Field control={control} name="phone" label="Phone Number" rules={{ required: 'Phone is required' }} errors={errors} /></Grid>
          <Grid item xs={12}><Field control={control} name="address" label="Address" rules={{ required: 'Address is required' }} errors={errors} /></Grid>
          <Grid item xs={12} md={6}><Field control={control} name="city" label="City" rules={{ required: 'City is required' }} errors={errors} /></Grid>
          <Grid item xs={12} md={6}><Field control={control} name="state" label="State" rules={{ required: 'State is required' }} errors={errors} /></Grid>
        </Grid>
      </Section>

      <Section title="Identity Information">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><Field control={control} name="aadhaar" label="Aadhaar Number" rules={{ required: 'Aadhaar is required', minLength: { value: 12, message: 'Must be 12 digits' } }} errors={errors} /></Grid>
          <Grid item xs={12} md={6}><Field control={control} name="pan" label="PAN Number" rules={{ required: 'PAN is required' }} errors={errors} /></Grid>
        </Grid>
      </Section>

      <Section title="Upload Documents">
        <Grid container spacing={2}>
          {['Customer Photo', 'Aadhaar Upload', 'PAN Upload'].map((label) => (
            <Grid item xs={12} md={4} key={label}>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="caption" color="text.secondary">Click to upload</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Section>

      <Section title="Booking Details">
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Controller name="floorId" control={control} rules={{ required: 'Select a floor' }} render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.floorId}>
                <InputLabel>Floor</InputLabel>
                <Select {...field} label="Floor">{floors.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}</Select>
              </FormControl>
            )} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller name="roomId" control={control} rules={{ required: 'Select a room' }} render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.roomId} disabled={!selectedFloor}>
                <InputLabel>Room</InputLabel>
                <Select {...field} label="Room">{filteredRooms.map((r) => <MenuItem key={r.id} value={r.id}>Room {r.roomNumber} ({r.roomType})</MenuItem>)}</Select>
              </FormControl>
            )} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Controller name="bedId" control={control} rules={{ required: 'Select a bed' }} render={({ field }) => (
              <FormControl fullWidth size="small" error={!!errors.bedId} disabled={!selectedRoom}>
                <InputLabel>Bed</InputLabel>
                <Select {...field} label="Bed">{filteredBeds.map((b) => <MenuItem key={b.id} value={b.id}>Bed {b.bedNumber} - {formatCurrency(b.cost)}</MenuItem>)}</Select>
              </FormControl>
            )} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller name="stayType" control={control} render={({ field }) => (
              <FormControl fullWidth size="small"><InputLabel>Stay Type</InputLabel>
                <Select {...field} label="Stay Type">{stayTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}</Select>
              </FormControl>
            )} />
          </Grid>
          <Grid item xs={12} md={6}><Field control={control} name="duration" label="Duration" type="number" rules={{ required: true, min: 1 }} errors={errors} /></Grid>
        </Grid>
      </Section>

      <Section title="Financial Details">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FinanceBox label="Bed Cost" value={formatCurrency(bedCost)} />
          <FinanceBox label="Total Amount" value={formatCurrency(totalAmount)} highlight />
          <FinanceBox label="Advance Paid" input={
            <Controller name="advancePaid" control={control} render={({ field }) => (
              <TextField {...field} type="number" size="small" fullWidth onChange={(e) => field.onChange(Number(e.target.value))} />
            )} />
          } />
          <FinanceBox label="Balance Amount" value={formatCurrency(balanceAmount)} warning={balanceAmount > 0} />
        </div>
      </Section>

      <div className="flex gap-3 justify-end">
        <Button variant="outlined" onClick={handleReset} size="large">Reset</Button>
        <Button type="submit" variant="contained" size="large" className="gradient-royal! px-8!">Book Now</Button>
      </div>
    </Box>
  )
}

const Section = ({ title, children }) => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
    <Typography variant="h6" className="font-[Poppins]! font-semibold! mb-4! text-slate-900!">{title}</Typography>
    <Divider className="mb-4!" />
    {children}
  </div>
)

const Field = ({ control, name, label, rules, errors, type = 'text' }) => (
  <Controller name={name} control={control} rules={rules} render={({ field }) => (
    <TextField {...field} label={label} type={type} fullWidth error={!!errors[name]} helperText={errors[name]?.message} />
  )} />
)

const FinanceBox = ({ label, value, highlight, warning, input }) => (
  <div className={`rounded-xl p-4 ${highlight ? 'bg-blue-50 border border-blue-100' : warning ? 'bg-red-50 border border-red-100' : 'bg-slate-50'}`}>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    {input || <p className={`text-lg font-bold font-[Poppins] ${warning ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>}
  </div>
)

export default BookingForm
