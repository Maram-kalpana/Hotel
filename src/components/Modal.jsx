import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

const Modal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth
    PaperProps={{
      component: motion.div,
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      className: 'rounded-2xl!',
    }}
  >
    <DialogTitle className="flex items-center justify-between font-[Poppins]! font-semibold!">
      {title}
      <IconButton onClick={onClose} size="small"><X size={18} /></IconButton>
    </DialogTitle>
    <DialogContent dividers>{children}</DialogContent>
    {actions && <DialogActions className="p-4!">{actions}</DialogActions>}
  </Dialog>
)

export default Modal
