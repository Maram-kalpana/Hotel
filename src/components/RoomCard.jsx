import { motion } from 'framer-motion'
import { Chip } from '@mui/material'
import { Bed, Users } from 'lucide-react'

const RoomCard = ({ room, onClick }) => {
  const occupancyRate = room.totalBeds ? Math.round((room.occupiedBeds / room.totalBeds) * 100) : 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white p-5 shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 font-[Poppins]">Room {room.roomNumber}</h3>
          <p className="text-sm text-slate-500">Floor {room.floorNumber}</p>
        </div>
        <Chip label={room.roomType} size="small" color="primary" variant="outlined" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 rounded-xl bg-slate-50">
          <Bed size={16} className="mx-auto text-blue-600 mb-1" />
          <p className="text-xs text-slate-500">Total</p>
          <p className="font-bold text-slate-900">{room.totalBeds}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-red-50">
          <Users size={16} className="mx-auto text-red-500 mb-1" />
          <p className="text-xs text-slate-500">Occupied</p>
          <p className="font-bold text-red-600">{room.occupiedBeds}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-emerald-50">
          <Bed size={16} className="mx-auto text-emerald-500 mb-1" />
          <p className="text-xs text-slate-500">Vacant</p>
          <p className="font-bold text-emerald-600">{room.vacantBeds}</p>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Occupancy</span>
          <span>{occupancyRate}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${occupancyRate}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default RoomCard
