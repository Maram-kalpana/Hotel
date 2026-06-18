import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Divider, Typography } from '@mui/material'
import { CheckCircle, User, DoorOpen, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import Modal from '../components/Modal'
import { useCustomers, useBookings, useAppDispatch, useHotel } from '../hooks/useStore'
import { checkoutCustomer } from '../redux/slices/customerSlice'
import { updateBed } from '../redux/slices/hotelSlice'
import { formatCurrency, formatDate } from '../utils/helpers'
import toast from 'react-hot-toast'

const Checkout = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { list } = useCustomers()
  const { list: bookings } = useBookings()
  const { beds } = useHotel()
  const [successOpen, setSuccessOpen] = useState(false)

  const customer = list.find((c) => c.id === id)
  const booking = bookings.find((b) => b.customerId === id)

  if (!customer) {
    return (
      <>
        <Navbar title="Checkout" />
        <PageTransition className="page-container"><Typography>Customer not found</Typography></PageTransition>
      </>
    )
  }

  const handleCheckout = () => {
    dispatch(checkoutCustomer(customer.id))
    const bed = beds.find((b) => b.id === customer.bedId)
    if (bed) dispatch(updateBed({ ...bed, status: 'vacant', customerId: null }))
    setSuccessOpen(true)
    toast.success('Checkout completed successfully!')
  }

  return (
    <>
      <Navbar title="Checkout" />
      <PageTransition className="page-container">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white shadow-lg border border-slate-100 overflow-hidden"
          >
            <div className="gradient-royal p-8 text-white text-center">
              <h2 className="text-2xl font-bold font-[Poppins]">Guest Checkout</h2>
              <p className="text-blue-100 mt-1">Complete the checkout process</p>
            </div>

            <div className="p-8 space-y-6">
              <Section icon={User} title="Customer Information">
                <Info label="Name" value={customer.name} />
                <Info label="Phone" value={customer.phone} />
                <Info label="Check-In Date" value={formatDate(customer.checkInDate)} />
              </Section>

              <Divider />

              <Section icon={DoorOpen} title="Room Information">
                <Info label="Room" value={customer.roomNumber ? `Room ${customer.roomNumber}` : '—'} />
                <Info label="Bed" value={customer.bedNumber ? `Bed ${customer.bedNumber}` : '—'} />
              </Section>

              <Divider />

              <Section icon={CreditCard} title="Payment Details">
                <Info label="Total Amount" value={formatCurrency(booking?.totalAmount)} />
                <Info label="Advance Paid" value={formatCurrency(booking?.advancePaid)} />
                <Info label="Pending Balance" value={formatCurrency(booking?.balanceAmount)} highlight />
              </Section>

              <Button
                variant="contained" fullWidth size="large"
                onClick={handleCheckout}
                className="gradient-royal! py-3! mt-4!"
                startIcon={<CheckCircle size={20} />}
              >
                Complete Checkout
              </Button>
            </div>
          </motion.div>
        </div>

        <Modal
          open={successOpen}
          onClose={() => { setSuccessOpen(false); navigate('/customers') }}
          title="Checkout Successful"
          actions={
            <Button variant="contained" onClick={() => { setSuccessOpen(false); navigate('/customers') }}>
              Back to Customers
            </Button>
          }
        >
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4"
            >
              <CheckCircle size={40} />
            </motion.div>
            <Typography variant="h6" className="font-[Poppins]!">{customer.name} has been checked out successfully!</Typography>
            <Typography variant="body2" color="text.secondary" className="mt-2">
              Room {customer.roomNumber} · Bed {customer.bedNumber} is now available.
            </Typography>
          </div>
        </Modal>
      </PageTransition>
    </>
  )
}

const Section = ({ icon: Icon, title, children }) => (
  <div>
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} className="text-blue-600" />
      <h3 className="font-semibold font-[Poppins] text-slate-900">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
  </div>
)

const Info = ({ label, value, highlight }) => (
  <div className={`p-3 rounded-xl ${highlight ? 'bg-red-50' : 'bg-slate-50'}`}>
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`font-semibold mt-0.5 ${highlight ? 'text-red-600' : 'text-slate-900'}`}>{value}</p>
  </div>
)

export default Checkout
