import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import ChartCard from '../components/ChartCard'
import { analytics } from '../data'
import { formatCurrency } from '../utils/helpers'

const Analytics = () => (
  <>
    <Navbar title="Analytics" />
    <PageTransition className="page-container">
      <div className="mb-6">
        <h2 className="section-title">Analytics Dashboard</h2>
        <p className="text-slate-500 mt-1">Premium insights into hotel performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Occupancy Trend" subtitle="Monthly occupancy percentage">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.occupancyTrend}>
              <defs>
                <linearGradient id="analyticsOcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="occupancy" stroke="#1e40af" fill="url(#analyticsOcc)" strokeWidth={2} name="Occupancy %" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Revenue Trend" subtitle="Monthly revenue performance">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={3} dot={{ r: 5 }} name="Revenue" />
              <Line type="monotone" dataKey="bookings" stroke="#1e40af" strokeWidth={2} dot={{ r: 4 }} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Room Utilization" subtitle="Utilization by room type">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.roomUtilization}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="utilized" fill="#1e40af" radius={[6, 6, 0, 0]} name="Utilized %" />
              <Bar dataKey="total" fill="#d4af37" radius={[6, 6, 0, 0]} name="Total Rooms" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Booking Trend" subtitle="Weekly booking patterns">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </PageTransition>
  </>
)

export default Analytics
