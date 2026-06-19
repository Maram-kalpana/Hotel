import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useUI } from '../hooks/useStore'
import { getSidebarOffset } from '../utils/layout'

const AppLayout = () => {
  const { sidebarCollapsed } = useUI()
  const sidebarOffset = getSidebarOffset(sidebarCollapsed)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          ml: `${sidebarOffset}px`,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Navbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            minHeight: 0,
          }}
        >
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
