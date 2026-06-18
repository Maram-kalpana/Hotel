import { useAppDispatch, useHotel, useBookings } from '../hooks/useStore'
import { addCustomer } from '../redux/slices/customerSlice'
import { addBooking } from '../redux/slices/bookingSlice'
import { updateBed } from '../redux/slices/hotelSlice'
import Navbar from '../components/Navbar'
import PageTransition from '../components/PageTransition'
import BookingForm from '../components/BookingForm'

const Bookings = () => {
  const { floors, rooms, beds } = useHotel()
  const { list: bookings } = useBookings()
  const dispatch = useAppDispatch()

  const handleSubmit = (data) => {
    const bed = beds.find((b) => b.id === data.bedId)
    const customerId = `cust-${Date.now()}`

    dispatch(addCustomer({
      id: customerId,
      name: data.name,
      phone: data.phone,
      email: `${data.name.replace(' ', '.').toLowerCase()}@email.com`,
      address: data.address,
      city: data.city,
      state: data.state,
      aadhaar: data.aadhaar,
      pan: data.pan,
      photo: `https://i.pravatar.cc/150?u=${customerId}`,
      status: 'checked-in',
      roomId: data.roomId,
      bedId: data.bedId,
      roomNumber: bed?.roomNumber,
      bedNumber: bed?.bedNumber,
      checkInDate: new Date().toISOString().split('T')[0],
    }))

    dispatch(updateBed({ ...bed, status: 'occupied', customerId }))

    dispatch(addBooking({
      id: `booking-${Date.now()}`,
      customerId,
      customerName: data.name,
      bedId: data.bedId,
      roomId: data.roomId,
      roomNumber: bed?.roomNumber,
      bedNumber: bed?.bedNumber,
      floorNumber: bed?.floorNumber,
      stayType: data.stayType,
      duration: data.duration,
      bedCost: data.bedCost,
      totalAmount: data.totalAmount,
      advancePaid: data.advancePaid,
      balanceAmount: data.balanceAmount,
      status: 'active',
      checkInDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    }))
  }

  return (
    <>
      <Navbar title="Customer Booking" />
      <PageTransition className="page-container">
        <div className="mb-6">
          <h2 className="section-title">New Booking</h2>
          <p className="text-slate-500 mt-1">Register a new customer and assign a bed · {bookings.length} total bookings</p>
        </div>
        <BookingForm floors={floors} rooms={rooms} beds={beds} onSubmit={handleSubmit} />
      </PageTransition>
    </>
  )
}

export default Bookings
