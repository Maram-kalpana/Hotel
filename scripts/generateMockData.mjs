import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '..', 'src', 'data')
mkdirSync(dataDir, { recursive: true })

const roomTypes = ['Single', 'Double', 'Family', 'Dormitory']
const statuses = ['vacant', 'occupied', 'reserved']
const stayTypes = ['Hours', 'Days', 'Weeks', 'Months']
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Jaipur']
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Rajasthan']
const firstNames = ['Aarav', 'Priya', 'Rahul', 'Ananya', 'Vikram', 'Sneha', 'Arjun', 'Kavya', 'Rohan', 'Meera', 'Aditya', 'Isha', 'Karan', 'Neha', 'Dev', 'Pooja', 'Sanjay', 'Ritu', 'Manish', 'Deepa']
const lastNames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Reddy', 'Gupta', 'Mehta', 'Joshi', 'Nair', 'Iyer', 'Desai', 'Rao', 'Verma', 'Malhotra', 'Chopra']

const floors = Array.from({ length: 5 }, (_, i) => ({
  id: `floor-${i + 1}`,
  name: `Floor ${i + 1}`,
  number: i + 1,
  totalRooms: 10,
  description: `Luxury accommodation on floor ${i + 1}`,
}))

const rooms = []
const beds = []
let bedCounter = 1

floors.forEach((floor) => {
  for (let r = 1; r <= 10; r++) {
    const roomNumber = `${floor.number}${String(r).padStart(2, '0')}`
    const roomType = roomTypes[(floor.number + r) % roomTypes.length]
    const bedCount = 4
    const roomId = `room-${roomNumber}`

    rooms.push({
      id: roomId,
      floorId: floor.id,
      floorNumber: floor.number,
      roomNumber,
      roomType,
      totalBeds: bedCount,
      occupiedBeds: 0,
      vacantBeds: bedCount,
      status: 'available',
    })

    for (let b = 1; b <= bedCount; b++) {
      const cost = roomType === 'Single' ? 800 : roomType === 'Double' ? 1200 : roomType === 'Family' ? 2000 : 600
      beds.push({
        id: `bed-${bedCounter}`,
        bedNumber: b,
        roomId,
        roomNumber,
        floorId: floor.id,
        floorNumber: floor.number,
        cost,
        status: 'vacant',
        customerId: null,
      })
      bedCounter++
    }
  }
})

const customers = Array.from({ length: 100 }, (_, i) => {
  const firstName = firstNames[i % firstNames.length]
  const lastName = lastNames[i % lastNames.length]
  return {
    id: `cust-${i + 1}`,
    name: `${firstName} ${lastName}`,
    phone: `+91 ${9000000000 + i}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
    address: `${100 + i} MG Road`,
    city: cities[i % cities.length],
    state: states[i % states.length],
    aadhaar: `${1000 + i}${2000 + i}${3000 + i}`.slice(0, 12),
    pan: `ABCDE${1000 + i}F`,
    photo: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
    status: i < 50 ? 'checked-in' : 'checked-out',
    roomId: null,
    bedId: null,
    roomNumber: null,
    bedNumber: null,
    checkInDate: i < 50 ? `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}` : null,
    checkOutDate: i >= 50 ? `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}` : null,
  }
})

const bookings = []
for (let i = 0; i < 50; i++) {
  const bed = beds[i]
  const customer = customers[i]
  bed.status = i % 5 === 0 ? 'reserved' : 'occupied'
  bed.customerId = customer.id

  const room = rooms.find((r) => r.id === bed.roomId)
  if (room) {
    room.occupiedBeds = beds.filter((b) => b.roomId === room.id && b.status === 'occupied').length
    room.vacantBeds = room.totalBeds - room.occupiedBeds
  }

  customer.roomId = bed.roomId
  customer.bedId = bed.id
  customer.roomNumber = bed.roomNumber
  customer.bedNumber = bed.bedNumber

  const duration = (i % 7) + 1
  const totalAmount = bed.cost * duration
  const advancePaid = Math.floor(totalAmount * 0.4)

  bookings.push({
    id: `booking-${i + 1}`,
    customerId: customer.id,
    customerName: customer.name,
    bedId: bed.id,
    roomId: bed.roomId,
    roomNumber: bed.roomNumber,
    bedNumber: bed.bedNumber,
    floorNumber: bed.floorNumber,
    stayType: stayTypes[i % stayTypes.length],
    duration,
    bedCost: bed.cost,
    totalAmount,
    advancePaid,
    balanceAmount: totalAmount - advancePaid,
    status: i % 5 === 0 ? 'reserved' : 'active',
    checkInDate: customer.checkInDate,
    createdAt: `2026-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  })
}

rooms.forEach((room) => {
  const roomBeds = beds.filter((b) => b.roomId === room.id)
  room.occupiedBeds = roomBeds.filter((b) => b.status === 'occupied').length
  room.vacantBeds = room.totalBeds - room.occupiedBeds - roomBeds.filter((b) => b.status === 'reserved').length
})

const analytics = {
  occupancyTrend: [
    { month: 'Jan', occupancy: 62, revenue: 420000 },
    { month: 'Feb', occupancy: 68, revenue: 480000 },
    { month: 'Mar', occupancy: 71, revenue: 510000 },
    { month: 'Apr', occupancy: 75, revenue: 540000 },
    { month: 'May', occupancy: 78, revenue: 580000 },
    { month: 'Jun', occupancy: 82, revenue: 620000 },
  ],
  revenueTrend: [
    { month: 'Jan', revenue: 420000, bookings: 38 },
    { month: 'Feb', revenue: 480000, bookings: 42 },
    { month: 'Mar', revenue: 510000, bookings: 45 },
    { month: 'Apr', revenue: 540000, bookings: 48 },
    { month: 'May', revenue: 580000, bookings: 52 },
    { month: 'Jun', revenue: 620000, bookings: 55 },
  ],
  roomUtilization: roomTypes.map((type) => ({
    type,
    utilized: Math.floor(Math.random() * 40) + 50,
    total: rooms.filter((r) => r.roomType === type).length,
  })),
  bookingTrend: [
    { week: 'W1', bookings: 12 },
    { week: 'W2', bookings: 18 },
    { week: 'W3', bookings: 15 },
    { week: 'W4', bookings: 22 },
    { week: 'W5', bookings: 19 },
    { week: 'W6', bookings: 25 },
  ],
  recentActivity: [
    { id: 1, type: 'booking', message: 'New booking for Room 102 - Bed 2', time: '2 mins ago', user: 'Admin' },
    { id: 2, type: 'checkin', message: 'Check-in completed for Priya Sharma', time: '15 mins ago', user: 'Reception' },
    { id: 3, type: 'checkout', message: 'Check-out completed for Room 305', time: '1 hour ago', user: 'Reception' },
    { id: 4, type: 'booking', message: 'New booking for Room 401 - Bed 1', time: '2 hours ago', user: 'Admin' },
    { id: 5, type: 'checkin', message: 'Check-in completed for Rahul Singh', time: '3 hours ago', user: 'Reception' },
  ],
}

const hotelSettings = {
  hotelName: 'Grand Luxe Hotel & Suites',
  address: '123 Royal Boulevard, Bandra West, Mumbai - 400050',
  phone: '+91 22 4567 8900',
  email: 'info@grandluxehotel.com',
  gstNumber: '27AABCU9603R1ZM',
  theme: 'light',
}

const stats = {
  totalFloors: floors.length,
  totalRooms: rooms.length,
  totalBeds: beds.length,
  occupiedBeds: beds.filter((b) => b.status === 'occupied').length,
  vacantBeds: beds.filter((b) => b.status === 'vacant').length,
  reservedBeds: beds.filter((b) => b.status === 'reserved').length,
  totalCustomers: customers.length,
  revenue: bookings.reduce((sum, b) => sum + b.advancePaid, 0),
  pendingPayments: bookings.reduce((sum, b) => sum + b.balanceAmount, 0),
  todayCheckIns: 8,
  todayCheckOuts: 5,
}

const files = { floors, rooms, beds, customers, bookings, analytics, hotelSettings, stats }
Object.entries(files).forEach(([name, data]) => {
  writeFileSync(join(dataDir, `${name}.json`), JSON.stringify(data, null, 2))
})

console.log('Mock data generated successfully!')
console.log(`Floors: ${floors.length}, Rooms: ${rooms.length}, Beds: ${beds.length}, Customers: ${customers.length}, Bookings: ${bookings.length}`)
