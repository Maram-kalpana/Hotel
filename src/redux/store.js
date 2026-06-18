import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import hotelReducer from './slices/hotelSlice'
import customerReducer from './slices/customerSlice'
import bookingReducer from './slices/bookingSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotel: hotelReducer,
    customers: customerReducer,
    bookings: bookingReducer,
    ui: uiReducer,
  },
})

export default store
