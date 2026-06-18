import { useState } from 'react'
import { TextField, Button, MenuItem } from '@mui/material'
import { FileText, Download, BarChart3, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import toast from 'react-hot-toast'

const reports = [
  { id: 'occupancy', title: 'Occupancy Report', description: 'Detailed room and bed occupancy statistics', icon: BarChart3, color: 'from-blue-600 to-blue-400' },
  { id: 'revenue', title: 'Revenue Report', description: 'Financial performance and revenue breakdown', icon: TrendingUp, color: 'from-amber-500 to-yellow-400' },
  { id: 'customer', title: 'Customer Report', description: 'Guest demographics and stay patterns', icon: Users, color: 'from-emerald-600 to-emerald-400' },
]

const Reports = () => {
  const [dateFrom, setDateFrom] = useState('2026-01-01')
  const [dateTo, setDateTo] = useState('2026-06-18')
  const [reportType, setReportType] = useState('all')

  const handleExport = (format) => {
    toast.success(`${format} export initiated (UI only)`)
  }

  return (
    <>
      <Navbar title="Reports" />
      <PageTransition className="page-container">
        <div className="mb-6">
          <h2 className="section-title">Reports</h2>
          <p className="text-slate-500 mt-1">Generate and export professional hotel reports</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 mb-8">
          <h3 className="font-semibold font-[Poppins] text-slate-900 mb-4">Report Filters</h3>
          <div className="flex flex-wrap gap-4 items-end">
            <TextField type="date" label="From Date" size="small" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField type="date" label="To Date" size="small" value={dateTo} onChange={(e) => setDateTo(e.target.value)} InputLabelProps={{ shrink: true }} />
            <TextField select label="Report Type" size="small" value={reportType} onChange={(e) => setReportType(e.target.value)} sx={{ minWidth: 180 }}>
              <MenuItem value="all">All Reports</MenuItem>
              <MenuItem value="occupancy">Occupancy</MenuItem>
              <MenuItem value="revenue">Revenue</MenuItem>
              <MenuItem value="customer">Customer</MenuItem>
            </TextField>
            <Button variant="contained" startIcon={<FileText size={18} />}>Generate Report</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${report.color} text-white mb-4`}>
                <report.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold font-[Poppins] text-slate-900">{report.title}</h3>
              <p className="text-sm text-slate-500 mt-2 mb-6">{report.description}</p>
              <div className="flex gap-2">
                <Button size="small" variant="outlined" startIcon={<Download size={14} />} onClick={() => handleExport('PDF')}>PDF</Button>
                <Button size="small" variant="outlined" startIcon={<Download size={14} />} onClick={() => handleExport('Excel')}>Excel</Button>
                <Button size="small" variant="outlined" startIcon={<Download size={14} />} onClick={() => handleExport('CSV')}>CSV</Button>
              </div>
            </motion.div>
          ))}
        </div>
      </PageTransition>
    </>
  )
}

export default Reports
