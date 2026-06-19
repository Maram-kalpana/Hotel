import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import { fieldSx } from '../utils/layout'

const DateTimePickerField = ({ label, value, onChange, sx = {} }) => (
  <DateTimePicker
    label={label}
    value={value ? dayjs(value) : null}
    onChange={(date) => onChange(date ? date.toISOString() : '')}
    slotProps={{
      textField: {
        fullWidth: true,
        size: 'small',
        sx: { ...fieldSx, ...sx },
      },
    }}
  />
)

export default DateTimePickerField
