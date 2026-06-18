import { useState } from 'react'
import { TextField, Button, IconButton } from '@mui/material'
import { Plus, Edit, Trash2, Layers, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import DataTable from '../components/DataTable'
import Modal from '../components/Modal'
import { useHotel, useAppDispatch } from '../hooks/useStore'
import { addFloor, updateFloor, deleteFloor } from '../redux/slices/hotelSlice'
import toast from 'react-hot-toast'

const Floors = () => {
  const { floors } = useHotel()
  const dispatch = useAppDispatch()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editFloor, setEditFloor] = useState(null)
  const [form, setForm] = useState({ name: '', totalRooms: 10, description: '' })

  const filtered = floors.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))

  const handleSave = () => {
    if (editFloor) {
      dispatch(updateFloor({ ...editFloor, ...form }))
      toast.success('Floor updated successfully')
    } else {
      dispatch(addFloor({
        id: `floor-${Date.now()}`,
        number: floors.length + 1,
        ...form,
      }))
      toast.success('Floor added successfully')
    }
    setModalOpen(false)
    setEditFloor(null)
    setForm({ name: '', totalRooms: 10, description: '' })
  }

  const handleEdit = (floor) => {
    setEditFloor(floor)
    setForm({ name: floor.name, totalRooms: floor.totalRooms, description: floor.description })
    setModalOpen(true)
  }

  const handleDelete = (floor) => {
    dispatch(deleteFloor(floor.id))
    toast.success('Floor deleted')
  }

  const columns = [
    { field: 'name', headerName: 'Floor Name' },
    { field: 'number', headerName: 'Floor Number' },
    { field: 'totalRooms', headerName: 'Total Rooms' },
    { field: 'description', headerName: 'Description' },
  ]

  return (
    <>
      <Navbar title="Floor Management" />
      <PageTransition className="page-container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="section-title">Floors</h2>
            <p className="text-slate-500 mt-1">Manage hotel floors and room allocation</p>
          </div>
          <div className="flex gap-3">
            <TextField
              size="small" placeholder="Search floor..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <Search size={16} className="mr-2 text-slate-400" /> }}
            />
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setModalOpen(true)}>
              Add Floor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {filtered.map((floor, i) => (
            <motion.div
              key={floor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:border-blue-200 transition-all"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                <Layers size={24} />
              </div>
              <h3 className="text-lg font-semibold font-[Poppins] text-slate-900">{floor.name}</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">{floor.totalRooms} Rooms</p>
              <div className="flex gap-2 mt-4">
                <IconButton size="small" onClick={() => handleEdit(floor)} color="primary"><Edit size={16} /></IconButton>
                <IconButton size="small" onClick={() => handleDelete(floor)} color="error"><Trash2 size={16} /></IconButton>
              </div>
            </motion.div>
          ))}
        </div>

        <DataTable
          columns={columns}
          rows={filtered}
          actions={[
            { label: 'Edit', icon: Edit, onClick: handleEdit },
            { label: 'Delete', icon: Trash2, onClick: handleDelete, color: 'error' },
          ]}
        />

        <Modal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditFloor(null) }}
          title={editFloor ? 'Edit Floor' : 'Add New Floor'}
          actions={
            <>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={handleSave}>Save</Button>
            </>
          }
        >
          <div className="space-y-4 pt-2">
            <TextField label="Floor Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField label="Total Rooms" type="number" fullWidth value={form.totalRooms} onChange={(e) => setForm({ ...form, totalRooms: Number(e.target.value) })} />
            <TextField label="Description" fullWidth multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </Modal>
      </PageTransition>
    </>
  )
}

export default Floors
