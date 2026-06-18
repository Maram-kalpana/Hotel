import { motion } from 'framer-motion'
import { formatCurrency, getBedStatusColor } from '../utils/helpers'

const BedCard = ({ bed, compact = false, onClick }) => {
  const colors = getBedStatusColor(bed.status)

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-3 ${colors.bg} ${colors.border} ${compact ? 'p-2' : 'p-4'}`}
    >
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${colors.text}`}>Bed {bed.bedNumber}</span>
        <span className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full bg-white/60 ${colors.text}`}>
          {bed.status}
        </span>
      </div>
      {!compact && (
        <>
          <p className="text-xs text-slate-500 mt-1">Room {bed.roomNumber}</p>
          <p className="text-sm font-bold text-slate-800 mt-2">{formatCurrency(bed.cost)}/day</p>
        </>
      )}
    </motion.div>
  )
}

export default BedCard
