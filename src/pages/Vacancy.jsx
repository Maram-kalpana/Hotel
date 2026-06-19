import { useMemo, useState } from 'react'
import { TextField } from '@mui/material'
import PageTransition from '../components/PageTransition'
import MuiDataGrid from '../components/MuiDataGrid'
import StatusBadge from '../components/StatusBadge'
import { useAuth, useHotel } from '../hooks/useStore'
import { formatCurrency, ROLES } from '../utils/helpers'
import { filterFieldSx } from '../utils/layout'

const Vacancy = () => {
  const { user } = useAuth()
  const { beds } = useHotel()
  const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN

  const [floorFilter, setFloorFilter] = useState('')
  const [roomFilter, setRoomFilter] = useState('')

  const tableRows = useMemo(() => {
    let rows = beds
      .filter((b) => b.status === 'vacant')
      .map((b) => ({
        id: b.id,
        floorNumber: b.floorNumber,
        roomNumber: b.roomNumber,
        bedNumber: b.bedNumber,
        costPerBed: b.cost,
        status: 'vacant',
      }))
    if (floorFilter) rows = rows.filter((r) => String(r.floorNumber).includes(floorFilter))
    if (roomFilter) rows = rows.filter((r) => String(r.roomNumber).includes(roomFilter))
    return rows
  }, [beds, floorFilter, roomFilter])

  const columns = [
    { field: 'floorNumber', headerName: 'Floor Number', flex: 1, minWidth: 120 },
    { field: 'roomNumber', headerName: 'Room Number', flex: 1, minWidth: 120 },
    { field: 'bedNumber', headerName: 'Bed Number', flex: 1, minWidth: 110 },
    { field: 'costPerBed', headerName: 'Cost Per Bed', flex: 1, minWidth: 130, valueFormatter: (value) => formatCurrency(value) },
    ...(isSuperAdmin ? [] : [{ field: 'status', headerName: 'Status', width: 110, renderCell: () => <StatusBadge status="vacant" /> }]),
  ]

  return (
    <PageTransition className="page-container">
      <div className="page-header">
        <h2 className="section-title">Vacancy</h2>
        <p className="page-subtitle">{tableRows.length} vacant beds available</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 mb-5">
        <TextField label="Floor Number" value={floorFilter} onChange={(e) => setFloorFilter(e.target.value)} sx={filterFieldSx} />
        <TextField label="Room Number" value={roomFilter} onChange={(e) => setRoomFilter(e.target.value)} sx={filterFieldSx} />
      </div>

      <MuiDataGrid rows={tableRows} columns={columns} pageSize={10} />
    </PageTransition>
  )
}

export default Vacancy
