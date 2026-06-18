import { motion } from 'framer-motion'
import { Avatar, Chip } from '@mui/material'
import { Phone, MapPin } from 'lucide-react'
import { formatDate } from '../utils/helpers'

const CustomerCard = ({ customer, onView }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:border-blue-100 transition-all"
  >
    <div className="flex items-center gap-4">
      <Avatar src={customer.photo} alt={customer.name} sx={{ width: 56, height: 56 }} />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-900 truncate font-[Poppins]">{customer.name}</h3>
        <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
          <Phone size={12} />
          <span>{customer.phone}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-500 mt-0.5">
          <MapPin size={12} />
          <span>{customer.city}, {customer.state}</span>
        </div>
      </div>
      <Chip
        label={customer.status}
        size="small"
        color={customer.status === 'checked-in' ? 'success' : 'default'}
        sx={{ textTransform: 'capitalize' }}
      />
    </div>
    {customer.roomNumber && (
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
        <span className="text-slate-500">Room {customer.roomNumber} · Bed {customer.bedNumber}</span>
        <span className="text-slate-500">{formatDate(customer.checkInDate)}</span>
      </div>
    )}
    {onView && (
      <button
        onClick={() => onView(customer)}
        className="mt-3 w-full py-2 text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
      >
        View Profile
      </button>
    )}
  </motion.div>
)

export default CustomerCard
