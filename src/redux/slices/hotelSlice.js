import { createSlice } from '@reduxjs/toolkit'
import { floors as floorsData, rooms as roomsData, beds as bedsData, stats as statsData } from '../../data'

const hotelSlice = createSlice({
  name: 'hotel',
  initialState: {
    floors: floorsData,
    rooms: roomsData,
    beds: bedsData,
    stats: statsData,
  },
  reducers: {
    addFloor: (state, action) => {
      state.floors.push(action.payload)
      state.stats.totalFloors = state.floors.length
    },
    updateFloor: (state, action) => {
      const index = state.floors.findIndex((f) => f.id === action.payload.id)
      if (index !== -1) state.floors[index] = { ...state.floors[index], ...action.payload }
    },
    deleteFloor: (state, action) => {
      state.floors = state.floors.filter((f) => f.id !== action.payload)
      state.stats.totalFloors = state.floors.length
    },
    updateRoom: (state, action) => {
      const index = state.rooms.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) state.rooms[index] = { ...state.rooms[index], ...action.payload }
    },
    updateBed: (state, action) => {
      const index = state.beds.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) state.beds[index] = { ...state.beds[index], ...action.payload }
      state.stats.occupiedBeds = state.beds.filter((b) => b.status === 'occupied').length
      state.stats.vacantBeds = state.beds.filter((b) => b.status === 'vacant').length
      state.stats.reservedBeds = state.beds.filter((b) => b.status === 'reserved').length
    },
    recalculateStats: (state) => {
      state.stats.totalFloors = state.floors.length
      state.stats.totalRooms = state.rooms.length
      state.stats.totalBeds = state.beds.length
      state.stats.occupiedBeds = state.beds.filter((b) => b.status === 'occupied').length
      state.stats.vacantBeds = state.beds.filter((b) => b.status === 'vacant').length
      state.stats.reservedBeds = state.beds.filter((b) => b.status === 'reserved').length
    },
  },
})

export const { addFloor, updateFloor, deleteFloor, updateRoom, updateBed, recalculateStats } = hotelSlice.actions
export default hotelSlice.reducer
