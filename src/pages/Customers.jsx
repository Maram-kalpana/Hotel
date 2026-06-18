import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Avatar, Chip } from '@mui/material'
import { Eye, Edit, LogOut, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import DataTable from '../components/DataTable'
import { useCustomers } from '../hooks/useStore'
import { formatDate } from '../utils/helpers'

const Customers = () => {
  const { list } = useCustomers()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = list.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    (c.roomNumber && c.roomNumber.includes(search))
  )

  const columns = [
    {
      field: 'photo', headerName: 'Photo',
      renderCell: (row) => <Avatar src={row.photo} alt={row.name} sx={{ width: 40, height: 40 }} />,
    },
    { field: 'name', headerName: 'Name' },
    { field: 'phone', headerName: 'Phone' },
    { field: 'roomNumber', headerName: 'Room', renderCell: (row) => row.roomNumber ? `Room ${row.roomNumber}` : '—' },
    { field: 'bedNumber', headerName: 'Bed', renderCell: (row) => row.bedNumber || '—' },
    { field: 'checkInDate', headerName: 'Check-In', renderCell: (row) => formatDate(row.checkInDate) },
    {
      field: 'status', headerName: 'Status',
      renderCell: (row) => <Chip label={row.status} size="small" color={row.status === 'checked-in' ? 'success' : 'default'} sx={{ textTransform: 'capitalize' }} />,
    },
  ]

  return (
    <>
      <Navbar title="Customer Details" />
      <PageTransition className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="section-title">Customers</h2>
            <p className="text-slate-500 mt-1">{filtered.length} customers registered</p>
          </div>
          <TextField size="small" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <Search size={16} className="mr-2 text-slate-400" /> }} />
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          actions={[
            { label: 'View', icon: Eye, onClick: (row) => navigate(`/customers/${row.id}`) },
            { label: 'Edit', icon: Edit, onClick: (row) => navigate(`/customers/${row.id}`) },
            { label: 'Checkout', icon: LogOut, onClick: (row) => navigate(`/checkout/${row.id}`), color: 'warning' },
          ]}
        />
      </PageTransition>
    </>
  )
}

export default Customers
