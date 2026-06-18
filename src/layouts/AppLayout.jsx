import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useUI } from '../hooks/useStore'
import { AnimatePresence } from 'framer-motion'

const AppLayout = () => {
  const { sidebarCollapsed } = useUI()

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <main
        className="min-h-screen transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 80 : 260 }}
      >
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  )
}

export default AppLayout
