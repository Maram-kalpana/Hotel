import { Drawer as MuiDrawer, IconButton, Box } from '@mui/material'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const Drawer = ({ open, onClose, title, children, anchor = 'right', width = 420 }) => (
  <MuiDrawer
    anchor={anchor}
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: { width: { xs: '100%', sm: width }, borderRadius: anchor === 'right' ? '16px 0 0 16px' : '0' },
    }}
  >
    <Box className="p-5">
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-semibold font-[Poppins] text-slate-900"
        >
          {title}
        </motion.h2>
        <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
      </div>
      {children}
    </Box>
  </MuiDrawer>
)

export default Drawer
