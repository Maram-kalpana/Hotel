import { useEffect, useState } from 'react'
import {
  Building2, DoorOpen, Bed, Users, DollarSign, TrendingUp, Activity,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import PageTransition from '../components/PageTransition'
import { StatCardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton'
import { useHotel } from '../hooks/useStore'
import { formatCurrency } from '../utils/helpers'
import { analytics } from '../data'
import { motion } from 'framer-motion'

const COLORS = ['#1e40af', '#3b82f6', '#d4af37', '#10b981']

const SuperAdminDashboard = () => {
  const { stats } = useHotel()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const kpiCards = [
    { title: 'Total Floors', value: stats.totalFloors, icon: Building2, color: 'royal' },
    { title: 'Total Rooms', value: stats.totalRooms, icon: DoorOpen, color: 'violet' },
    { title: 'Total Beds', value: stats.totalBeds, icon: Bed, color: 'gold' },
    { title: 'Occupied Beds', value: stats.occupiedBeds, icon: Users, color: 'rose' },
    { title: 'Vacant Beds', value: stats.vacantBeds, icon: Bed, color: 'emerald' },
    { title: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'slate' },
    { title: 'Revenue', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'gold', trend: 12 },
  ]

  return (
    <>
      <Navbar title="Super Admin Dashboard" />
      <PageTransition className="page-container">
        <div className="mb-6">
          <h2 className="section-title">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Monitor your hotel performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <StatCardSkeleton key={i} />)
            : kpiCards.map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <StatCard {...card} />
              </motion.div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <ChartSkeleton /><ChartSkeleton /><ChartSkeleton />
            </>
          ) : (
            <>
              <ChartCard title="Occupancy Chart" subtitle="Monthly occupancy rate">
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={analytics.occupancyTrend}>
                    <defs>
                      <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="occupancy" stroke="#1e40af" fill="url(#occGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Revenue Chart" subtitle="Monthly revenue trend">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.revenueTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => formatCurrency(v)} />
                    <Bar dataKey="revenue" fill="#d4af37" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Room Utilization" subtitle="By room type">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={analytics.roomUtilization} dataKey="utilized" nameKey="type" cx="50%" cy="50%" outerRadius={90} label>
                      {analytics.roomUtilization.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </>
          )}
        </div>

        <ChartCard title="Recent Activity" subtitle="Latest hotel operations">
          <div className="space-y-4">
            {analytics.recentActivity.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                  <Activity size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.time} · {activity.user}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white text-slate-600 capitalize">{activity.type}</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </PageTransition>
    </>
  )
}

export default SuperAdminDashboard
