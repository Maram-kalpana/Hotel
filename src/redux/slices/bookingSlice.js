import { createSlice } from '@reduxjs/toolkit'
import { bookings as bookingsData } from '../../data'

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    list: bookingsData,
  },
  reducers: {
    addBooking: (state, action) => {
      state.list.unshift(action.payload)
    },
    updateBooking: (state, action) => {
      const index = state.list.findIndex((b) => b.id === action.payload.id)
      if (index !== -1) state.list[index] = { ...state.list[index], ...action.payload }
    },
  },
})

export const { addBooking, updateBooking } = bookingSlice.actions
export default bookingSlice.reducer
