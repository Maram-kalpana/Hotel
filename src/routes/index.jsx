import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import { ROLES } from '../utils/helpers'

import Login from '../pages/Login'
import SuperAdminDashboard from '../pages/SuperAdminDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import Floors from '../pages/Floors'
import Rooms from '../pages/Rooms'
import Beds from '../pages/Beds'
import Vacancies from '../pages/Vacancies'
import Customers from '../pages/Customers'
import Bookings from '../pages/Bookings'
import CustomerProfile from '../pages/CustomerProfile'
import Checkout from '../pages/Checkout'
import Analytics from '../pages/Analytics'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/super-admin/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}><SuperAdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/floors" element={<Floors />} />
      <Route path="/rooms" element={<Rooms />} />
      <Route path="/beds" element={<Beds />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/customers/:id" element={<CustomerProfile />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/checkout/:id" element={<Checkout />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

export default AppRoutes
