import { cn } from '../../utils/helpers'
import { getMonthlyStatusBadge } from '../../utils/monthlyPaymentHelpers'

const MonthlyPaymentStatusBadge = ({ status }) => {
  const badge = getMonthlyStatusBadge(status)
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border', badge.className)}>
      {badge.label}
    </span>
  )
}

export default MonthlyPaymentStatusBadge
