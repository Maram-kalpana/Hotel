import { createSlice } from '@reduxjs/toolkit'
import { hotelSettings as settingsData } from '../../data'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarCollapsed: false,
    theme: settingsData.theme || 'light',
    settings: settingsData,
    loading: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload }
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed, setTheme, updateSettings, setLoading } = uiSlice.actions
export default uiSlice.reducer
