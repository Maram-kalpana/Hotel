export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0)

export const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export const getBedStatusColor = (status) => {
  switch (status) {
    case 'vacant':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', hex: '#10b981' }
    case 'occupied':
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', hex: '#ef4444' }
    case 'reserved':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', hex: '#f59e0b' }
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300', hex: '#64748b' }
  }
}

export const getOccupancyPercentage = (occupied, total) => {
  if (!total) return 0
  return Math.round((occupied / total) * 100)
}

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
}

export const MENU_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Floors', path: '/floors', icon: 'Layers' },
  { label: 'Rooms', path: '/rooms', icon: 'DoorOpen' },
  { label: 'Beds', path: '/beds', icon: 'Bed' },
  { label: 'Customers', path: '/customers', icon: 'Users' },
  { label: 'Bookings', path: '/bookings', icon: 'CalendarCheck' },
  { label: 'Vacancies', path: '/vacancies', icon: 'Map' },
  { label: 'Analytics', path: '/analytics', icon: 'BarChart3' },
  { label: 'Reports', path: '/reports', icon: 'FileText' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
]
