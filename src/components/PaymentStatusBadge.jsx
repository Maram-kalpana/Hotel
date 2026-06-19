import { Chip } from '@mui/material'
import { getPaymentStatusBadge, getPaymentStatus } from '../utils/helpers'

const PaymentStatusBadge = ({ balanceAmount, status }) => {
  const paymentStatus = status || getPaymentStatus(balanceAmount)
  const badge = getPaymentStatusBadge(paymentStatus)
  return (
    <Chip
      label={badge.label}
      size="small"
      className={`${badge.className} border font-semibold`}
      sx={{ fontSize: '0.75rem' }}
    />
  )
}

export default PaymentStatusBadge
