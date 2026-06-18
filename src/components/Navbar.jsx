import { AppBar, Toolbar, IconButton, Badge, Avatar, InputBase, Box } from '@mui/material'
import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'
import { useUI, useAuth, useAppDispatch } from '../hooks/useStore'
import { toggleSidebar, setTheme } from '../redux/slices/uiSlice'
import { motion } from 'framer-motion'

const Navbar = ({ title }) => {
  const { sidebarCollapsed, theme } = useUI()
  const { user } = useAuth()
  const dispatch = useAppDispatch()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
        ml: `${sidebarCollapsed ? 80 : 260}px`,
        width: `calc(100% - ${sidebarCollapsed ? 80 : 260}px)`,
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar className="gap-4">
        <IconButton className="md:hidden!" onClick={() => dispatch(toggleSidebar())} edge="start">
          <Menu size={20} />
        </IconButton>
        <motion.h1
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold font-[Poppins] text-slate-900 hidden sm:block"
        >
          {title}
        </motion.h1>
        <Box className="flex-1 max-w-md mx-auto hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
          <Search size={16} className="text-slate-400" />
          <InputBase placeholder="Search anything..." className="flex-1 text-sm" />
        </Box>
        <div className="flex items-center gap-2 ml-auto">
          <IconButton onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))} size="small">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>
          <IconButton size="small">
            <Badge badgeContent={3} color="error" variant="dot">
              <Bell size={18} />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#1e40af', fontSize: 14 }}>
            {user?.name?.charAt(0)}
          </Avatar>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
