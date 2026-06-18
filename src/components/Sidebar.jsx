import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Layers, DoorOpen, Bed, Users, CalendarCheck, Map, BarChart3, FileText, Settings, LogOut, ChevronLeft, ChevronRight, Crown,
} from 'lucide-react'
import { useAuth, useUI, useAppDispatch } from '../hooks/useStore'
import { toggleSidebar } from '../redux/slices/uiSlice'
import { logout } from '../redux/slices/authSlice'
import { MENU_ITEMS, ROLES } from '../utils/helpers'
import toast from 'react-hot-toast'

const iconMap = {
  LayoutDashboard, Layers, DoorOpen, Bed, Users, CalendarCheck, Map, BarChart3, FileText, Settings,
}

const Sidebar = () => {
  const { user } = useAuth()
  const { sidebarCollapsed } = useUI()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="glass-sidebar fixed left-0 top-0 z-40 flex h-screen flex-col"
    >
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-royal text-white shrink-0">
          <Crown size={20} />
        </div>
        {!sidebarCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-xs text-slate-500 leading-none">Luxury Hotel</p>
            <p className="font-semibold text-slate-900 font-[Poppins] text-sm">Management System</p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {MENU_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const dashboardPath = user?.role === ROLES.SUPER_ADMIN ? '/super-admin/dashboard' : '/admin/dashboard'
          const path = item.path === '/dashboard' ? dashboardPath : item.path

          return (
            <NavLink
              key={item.path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-100 p-3 space-y-1">
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white text-sm font-bold">
              {user.name?.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role?.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm text-slate-500 hover:text-blue-600"
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  )
}

export default Sidebar
