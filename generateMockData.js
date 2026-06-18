const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 1. Floors (5 Floors)
const floors = [
  { id: 1, name: "Floor 1", roomsCount: 10 },
  { id: 2, name: "Floor 2", roomsCount: 10 },
  { id: 3, name: "Floor 3", roomsCount: 10 },
  { id: 4, name: "Floor 4", roomsCount: 10 },
  { id: 5, name: "Floor 5", roomsCount: 10 }
];

// 2. Rooms (50 Rooms) and Beds (200 Beds)
const rooms = [];
const beds = [];

let bedCounter = 1;
const roomTypes = ["Single", "Double", "Family", "Dormitory"];

// Bed distribution per room type:
// Single: 1 bed
// Double: 2 beds
// Family: 4 beds
// Dormitory: 8 beds
// For each floor, we have:
// Room x01, x02: Single (2 rooms, 2 beds)
// Room x03, x04, x05: Double (3 rooms, 6 beds)
// Room x06, x07: Family (2 rooms, 8 beds)
// Room x08, x09, x10: Dormitory (3 rooms, 24 beds)
// Total beds per floor = 40. Total rooms = 10.
// Total beds for 5 floors = 200. Total rooms = 50.

for (let f = 1; f <= 5; f++) {
  for (let r = 1; r <= 10; r++) {
    const roomNumber = f * 100 + r;
    let type = "";
    let bedCount = 0;
    let baseCost = 0;

    if (r <= 2) {
      type = "Single";
      bedCount = 1;
      baseCost = 1500;
    } else if (r <= 5) {
      type = "Double";
      bedCount = 2;
      baseCost = 2500;
    } else if (r <= 7) {
      type = "Family";
      bedCount = 4;
      baseCost = 4500;
    } else {
      type = "Dormitory";
      bedCount = 8;
      baseCost = 800; // cost per bed
    }

    rooms.push({
      id: roomNumber,
      roomNumber: roomNumber.toString(),
      floorId: f,
      type: type,
      totalBeds: bedCount,
      occupiedBeds: 0,
      vacantBeds: bedCount
    });

    for (let b = 1; b <= bedCount; b++) {
      const bedNumber = `${roomNumber}-${b}`;
      beds.push({
        id: bedCounter++,
        bedNumber: bedNumber,
        roomId: roomNumber,
        floorId: f,
        cost: baseCost,
        status: "Vacant" // Vacant, Occupied, Reserved
      });
    }
  }
}

// 3. Customers (100 mock customers)
const firstNames = [
  "Aarav", "Aditya", "Akash", "Ananya", "Arjun", "Amit", "Alok", "Bhavna", "Chaitanya", "Deepak",
  "Divya", "Gaurav", "Harish", "Isha", "Jay", "Jyoti", "Karan", "Kirti", "Kunal", "Lata",
  "Manish", "Meera", "Manoj", "Neha", "Nikhil", "Nisha", "Pankaj", "Pooja", "Pranav", "Priya",
  "Rahul", "Ritu", "Rohan", "Roshni", "Sachin", "Sanjana", "Sanjay", "Shalini", "Shikha", "Siddharth",
  "Suresh", "Swati", "Tarun", "Udit", "Varun", "Vidya", "Vijay", "Yash", "John", "Sarah",
  "Emma", "David", "James", "Emily", "Michael", "Sophia", "Robert", "Olivia", "William", "Isabella",
  "Abhishek", "Ashwin", "Devendra", "Girish", "Himanshu", "Jitendra", "Karthik", "Madhav", "Narendra", "Pradeep",
  "Rajesh", "Sandesh", "Tushar", "Vineet", "Vivek", "Aarti", "Deepika", "Harsha", "Kalyani", "Nandini",
  "Pallavi", "Radhika", "Sneha", "Uma", "Vandana", "Yogita", "Abhay", "Bhupendra", "Dinesh", "Kailash",
  "Mohit", "Piyush", "Ram", "Satish", "Vinay", "Amrita", "Kiran", "Nidhi", "Payal", "Shweta"
];

const lastNames = [
  "Sharma", "Verma", "Gupta", "Mehra", "Joshi", "Singhal", "Patel", "Shah", "Reddy", "Nair",
  "Kumar", "Singh", "Prasad", "Mishra", "Pandey", "Trivedi", "Dubey", "Sen", "Bose", "Das",
  "Roy", "Chowdhury", "Banerjee", "Mukherjee", "Chatterjee", "Dutta", "Naskar", "Sarkar", "Adhikari", "Ghoshal",
  "Malhotra", "Kapoor", "Khanna", "Anand", "Chopra", "Sethi", "Oberoi", "Mehta", "Bahl", "Suri",
  "Rao", "Shetty", "Hegde", "Menon", "Pillai", "Krishnan", "Iyer", "Iyengar", "Subramanian", "Balakrishnan"
];

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Lucknow"];
const states = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Gujarat", "Tamil Nadu", "West Bengal", "Maharashtra", "Rajasthan", "Uttar Pradesh"];

const customers = [];
for (let i = 1; i <= 100; i++) {
  const fIndex = (i - 1) % firstNames.length;
  const lIndex = (i - 1) % lastNames.length;
  const cityIndex = (i - 1) % cities.length;

  const firstName = firstNames[fIndex];
  const lastName = lastNames[lIndex];
  const phone = `98765${String(10000 + i).substring(1)}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  
  // Aadhaar format: 12 digits
  const aadhaar = `54329876${String(1000 + i)}`;
  // PAN format: 5 letters, 4 digits, 1 letter
  const pan = `ABCDE${String(1000 + i)}F`;

  // Photo placeholders using premium avatars (Unsplash source or system-based fallback)
  // Let's use UI-friendly avatar fallbacks.
  const photo = `https://images.unsplash.com/photo-${[
    '1534528741775-53994a69daeb', // Woman 1
    '1507003211169-0a1dd7228f2d', // Man 1
    '1494790108377-be9c29b29330', // Woman 2
    '1500648767791-00dcc994a43e', // Man 2
    '1438761681033-6461ffad8d80', // Woman 3
    '1472099645785-5658abf4ff4e', // Man 3
    '1544005313-94ddf0286df2', // Woman 4
    '1552058544-f2b08422138a'  // Man 4
  ][i % 8]}?w=150&h=150&fit=crop&crop=faces`;

  customers.push({
    id: i,
    name: `${firstName} ${lastName}`,
    phone: phone,
    email: email,
    address: `Street ${i}, Sector ${i % 10 + 1}`,
    city: cities[cityIndex],
    state: states[cityIndex],
    aadhaarNumber: aadhaar,
    panNumber: pan,
    photo: photo,
    aadhaarFile: `aadhaar_card_${i}.pdf`,
    panFile: `pan_card_${i}.pdf`,
    status: "Active" // Active, Checked-Out, Reserved
  });
}

// 4. Bookings (50 bookings)
// We want:
// - 35 Active Bookings
// - 10 Reserved Bookings
// - 5 Checked Out Bookings
// Let's map them to 50 beds.
const bookings = [];
const recentActivity = [];

// Pick beds randomly or sequentially
// Let's pick beds sequentially to make it clean.
const usedBedIds = new Set();
const stayTypes = ["Hours", "Days", "Weeks", "Months"];

let bookingCounter = 1;

// Helper to format dates
function getPastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

function getFutureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0];
}

// Active bookings (35)
for (let i = 1; i <= 35; i++) {
  // Use customer i
  const customer = customers[i - 1];
  // Find a bed that matches
  const bed = beds[i * 3]; // Spread beds out
  bed.status = "Occupied";
  usedBedIds.add(bed.id);

  // Update room stats
  const room = rooms.find(r => r.id === bed.roomId);
  room.occupiedBeds += 1;
  room.vacantBeds -= 1;

  const duration = (i % 5) + 2;
  const stayType = stayTypes[i % 4];
  const totalAmount = bed.cost * duration;
  const advancePaid = Math.floor(totalAmount * 0.6);
  const balanceAmount = totalAmount - advancePaid;

  const checkInDate = getPastDate(i % 4);

  const booking = {
    id: bookingCounter++,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    bedId: bed.id,
    bedNumber: bed.bedNumber,
    roomId: bed.roomId,
    floorId: bed.floorId,
    checkInDate: checkInDate,
    checkoutDate: null,
    stayType: stayType,
    duration: duration,
    bedCost: bed.cost,
    totalAmount: totalAmount,
    advancePaid: advancePaid,
    balanceAmount: balanceAmount,
    status: "Active",
    paymentStatus: balanceAmount > 0 ? "Pending" : "Paid"
  };

  bookings.push(booking);

  // Update customer record
  customer.status = "Active";

  // Add recent activity
  recentActivity.push({
    id: recentActivity.length + 1,
    type: "Check-in",
    description: `${customer.name} checked into Room ${room.roomNumber}, Bed ${bed.bedNumber}`,
    timestamp: `${checkInDate} 10:30 AM`
  });
}

// Reserved bookings (10)
for (let i = 36; i <= 45; i++) {
  const customer = customers[i - 1];
  // Find another vacant bed
  let bedIndex = i * 4;
  while (usedBedIds.has(beds[bedIndex].id)) {
    bedIndex++;
  }
  const bed = beds[bedIndex];
  bed.status = "Reserved";
  usedBedIds.add(bed.id);

  const duration = (i % 3) + 1;
  const stayType = "Days";
  const totalAmount = bed.cost * duration;
  const advancePaid = Math.floor(totalAmount * 0.3);
  const balanceAmount = totalAmount - advancePaid;

  const reserveDate = getFutureDate(i - 35);

  const booking = {
    id: bookingCounter++,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    bedId: bed.id,
    bedNumber: bed.bedNumber,
    roomId: bed.roomId,
    floorId: bed.floorId,
    checkInDate: reserveDate, // Reserved starting date
    checkoutDate: null,
    stayType: stayType,
    duration: duration,
    bedCost: bed.cost,
    totalAmount: totalAmount,
    advancePaid: advancePaid,
    balanceAmount: balanceAmount,
    status: "Reserved",
    paymentStatus: "Pending"
  };

  bookings.push(booking);

  customer.status = "Reserved";

  recentActivity.push({
    id: recentActivity.length + 1,
    type: "New Booking",
    description: `${customer.name} reserved Room ${rooms.find(r => r.id === bed.roomId).roomNumber}, Bed ${bed.bedNumber} for ${reserveDate}`,
    timestamp: `${getPastDate(1)} 02:15 PM`
  });
}

// Checked Out bookings (5)
for (let i = 46; i <= 50; i++) {
  const customer = customers[i - 1];
  // Find a bed (we can reuse beds or pick vacant ones, let's pick vacant beds but show booking as checked out)
  let bedIndex = i * 4;
  while (usedBedIds.has(beds[bedIndex].id)) {
    bedIndex++;
  }
  const bed = beds[bedIndex];
  // Bed status is Vacant because they checked out!
  bed.status = "Vacant";

  const duration = 3;
  const stayType = "Days";
  const totalAmount = bed.cost * duration;
  const advancePaid = totalAmount; // Fully paid since they checked out
  const balanceAmount = 0;

  const checkInDate = getPastDate(6);
  const checkoutDate = getPastDate(3);

  const booking = {
    id: bookingCounter++,
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    bedId: bed.id,
    bedNumber: bed.bedNumber,
    roomId: bed.roomId,
    floorId: bed.floorId,
    checkInDate: checkInDate,
    checkoutDate: checkoutDate,
    stayType: stayType,
    duration: duration,
    bedCost: bed.cost,
    totalAmount: totalAmount,
    advancePaid: advancePaid,
    balanceAmount: balanceAmount,
    status: "Checked-Out",
    paymentStatus: "Paid"
  };

  bookings.push(booking);

  customer.status = "Checked-Out";

  recentActivity.push({
    id: recentActivity.length + 1,
    type: "Check-out",
    description: `${customer.name} checked out of Room ${rooms.find(r => r.id === bed.roomId).roomNumber}, Bed ${bed.bedNumber}`,
    timestamp: `${checkoutDate} 11:00 AM`
  });
}

// Set status for other customers to "Checked-Out" or "Inactive"
for (let i = 51; i <= 100; i++) {
  customers[i - 1].status = "Inactive";
}

// Order recent activities (most recent first)
recentActivity.reverse();

// Write JSON files
fs.writeFileSync(path.join(dataDir, 'floors.json'), JSON.stringify(floors, null, 2));
fs.writeFileSync(path.join(dataDir, 'rooms.json'), JSON.stringify(rooms, null, 2));
fs.writeFileSync(path.join(dataDir, 'beds.json'), JSON.stringify(beds, null, 2));
fs.writeFileSync(path.join(dataDir, 'customers.json'), JSON.stringify(customers, null, 2));
fs.writeFileSync(path.join(dataDir, 'bookings.json'), JSON.stringify(bookings, null, 2));
fs.writeFileSync(path.join(dataDir, 'recentActivity.json'), JSON.stringify(recentActivity, null, 2));

console.log("Mock data successfully generated in src/data!");
