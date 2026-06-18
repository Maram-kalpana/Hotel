import { useState, useMemo } from 'react'
import { TextField, MenuItem } from '@mui/material'
import { Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import RoomCard from '../components/RoomCard'
import { useHotel } from '../hooks/useStore'

const roomTypes = ['All', 'Single', 'Double', 'Family', 'Dormitory']
const statuses = ['All', 'available', 'occupied', 'maintenance']

const Rooms = () => {
  const { rooms, floors } = useHotel()
  const [search, setSearch] = useState('')
  const [floorFilter, setFloorFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(() => rooms.filter((room) => {
    const matchSearch = room.roomNumber.includes(search) || room.roomType.toLowerCase().includes(search.toLowerCase())
    const matchFloor = floorFilter === 'All' || room.floorId === floorFilter
    const matchType = typeFilter === 'All' || room.roomType === typeFilter
    const matchStatus = statusFilter === 'All' || room.status === statusFilter
    return matchSearch && matchFloor && matchType && matchStatus
  }), [rooms, search, floorFilter, typeFilter, statusFilter])

  return (
    <>
      <Navbar title="Room Management" />
      <PageTransition className="page-container">
        <div className="mb-6">
          <h2 className="section-title">Rooms</h2>
          <p className="text-slate-500 mt-1">{filtered.length} rooms found</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <TextField size="small" placeholder="Search rooms..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Search size={16} className="mr-2 text-slate-400" /> }} />
          <TextField select size="small" label="Floor" value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} sx={{ minWidth: 140 }}>
            <MenuItem value="All">All Floors</MenuItem>
            {floors.map((f) => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Room Type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {roomTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </PageTransition>
    </>
  )
}

export default Rooms
