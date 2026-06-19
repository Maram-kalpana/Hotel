import { Box } from '@mui/material'
import DatePickerField from './DatePickerField'
import { fieldSx } from '../utils/layout'

const compactFieldSx = {
  ...fieldSx,
  flex: 1,
  minWidth: 0,
}

/** Separate date + native time inputs — cleaner than combined DateTimePicker popover */
const DateTimeSplitField = ({ dateLabel, timeLabel, dateValue, timeValue, onDateChange, onTimeChange, required }) => (
  <Box sx={{ display: 'flex', gap: 1.5, width: '100%' }}>
    <DatePickerField
      label={dateLabel}
      value={dateValue}
      onChange={onDateChange}
      sx={compactFieldSx}
    />
    <Box
      component="input"
      type="time"
      value={timeValue || ''}
      required={required}
      onChange={(e) => onTimeChange(e.target.value)}
      style={{
        flex: 1,
        minWidth: 0,
        height: 44,
        padding: '0 12px',
        border: '1px solid #cbd5e1',
        borderRadius: 4,
        fontSize: '0.875rem',
        fontFamily: 'Inter, sans-serif',
        color: '#334155',
        backgroundColor: '#fff',
        outline: 'none',
      }}
      aria-label={timeLabel}
    />
  </Box>
)

export const combineDateAndTime = (date, time) => {
  if (!date) return ''
  const t = time || '00:00'
  return new Date(`${date}T${t}`).toISOString()
}

export const splitDateTime = (iso) => {
  if (!iso) return { date: '', time: '' }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    const [datePart] = iso.split('T')
    return { date: datePart || iso, time: '12:00' }
  }
  const date = d.toISOString().split('T')[0]
  const time = d.toTimeString().slice(0, 5)
  return { date, time }
}

export default DateTimeSplitField
