import { AppBar, Toolbar, IconButton, Badge, Avatar, InputBase, Box, Typography } from '@mui/material'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useUI, useAuth, useAppDispatch } from '../hooks/useStore'
import { setGlobalSearch } from '../redux/slices/uiSlice'
import { getPageTitle } from '../utils/helpers'
import { NAVBAR_HEIGHT } from '../utils/layout'

const Navbar = () => {
  const { globalSearch } = useUI()
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()
  const pageTitle = getPageTitle(pathname)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        height: NAVBAR_HEIGHT,
        bgcolor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        color: '#0f172a',
        zIndex: 1100,
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          height: NAVBAR_HEIGHT,
          minHeight: `${NAVBAR_HEIGHT}px !important`,
          px: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr auto', sm: 'minmax(120px, 1fr) minmax(280px, 480px) minmax(120px, 1fr)' },
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.125rem' },
            color: '#0B1F4D',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {pageTitle}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            height: 44,
            borderRadius: '999px',
            border: '1px solid #e2e8f0',
            bgcolor: '#f8fafc',
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            order: { xs: 2, sm: 0 },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: '100%',
            justifySelf: 'center',
          }}
        >
          <Search size={18} className="text-slate-400 shrink-0" />
          <InputBase
            placeholder="Search..."
            value={globalSearch}
            onChange={(e) => dispatch(setGlobalSearch(e.target.value))}
            sx={{ flex: 1, fontSize: '0.875rem', color: '#334155' }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            justifySelf: 'end',
            flexShrink: 0,
            order: { xs: 1, sm: 0 },
          }}
        >
          <IconButton size="small" aria-label="Notifications" sx={{ color: '#64748b' }}>
            <Badge color="error" variant="dot" overlap="circular">
              <Bell size={20} />
            </Badge>
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: '#0B1F4D', fontSize: 14, fontWeight: 600 }}>
              {user?.name?.charAt(0) || 'H'}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#334155', display: { xs: 'none', sm: 'block' } }}>
              {user?.name || 'User'}
            </Typography>
            <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
