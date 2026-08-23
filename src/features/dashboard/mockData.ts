export type DashboardReservation = {
  id: string
  guestName: string
  propertyName: string
  unitName: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  channel: 'direct' | 'airbnb' | 'booking.com' | 'vrbo' | 'expedia'
  totalAmount: number
  balanceDue: number
}


const day = (offset: number): string => {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().split('T')[0]
}

export const MOCK_DASHBOARD_DATA = {
  user: { name: 'Sara', roleLabel: 'Org admin' },
  metrics: {
    occupancy: 57,
    adr: '205.00',
    revpar: '12.00',
    revenue: '3.27K',
    checkIns: '124',
    confirmed: '42',
  },
  reservations: [
    // ARRIVALS (checkIn: 07-29)
    {
      id: 'RES-1001',
      guestName: 'Oliver Smith',
      propertyName: 'Downtown Loft',
      unitName: 'Apt 4B',
      checkIn: day(0),
      checkOut: day(3),
      status: 'confirmed',
      channel: 'airbnb',
      totalAmount: 850,
      balanceDue: 0,
    },
    {
      id: 'RES-1002',
      guestName: 'Liam Johnson',
      propertyName: 'Nile View Condo',
      unitName: 'Floor 12',
      checkIn: day(0),
      checkOut: day(14),
      status: 'confirmed',
      channel: 'airbnb',
      totalAmount: 420,
      balanceDue: 420,
    },
    {
      id: 'RES-1011',
      guestName: 'Hassan Ali',
      propertyName: 'Zamalek Studio',
      unitName: 'Unit 8A',
      checkIn: day(0),
      checkOut: day(16),
      status: 'confirmed',
      channel: 'booking.com',
      totalAmount: 300,
      balanceDue: 0,
    },
    {
      id: 'RES-1012',
      guestName: 'Sarah Miller',
      propertyName: 'El Gouna Lagoon',
      unitName: 'Chalet 14',
      checkIn: day(0),
      checkOut: day(5),
      status: 'confirmed',
      channel: 'vrbo',
      totalAmount: 1400,
      balanceDue: 200,
    },

    // DEPARTURES (checkOut: 07-29)
    {
      id: 'RES-1003',
      guestName: 'Nour El-Din',
      propertyName: 'Maadi Nile Apartment',
      unitName: 'Apt 2A',
      checkIn: day(-4),
      checkOut: day(0),
      status: 'checked_in',
      channel: 'booking.com',
      totalAmount: 1100,
      balanceDue: 0,
    },
    {
      id: 'RES-1004',
      guestName: 'James Wilson',
      propertyName: 'Zamalek Studio',
      unitName: 'Unit 3C',
      checkIn: day(-3),
      checkOut: day(0),
      status: 'checked_in',
      channel: 'airbnb',
      totalAmount: 500,
      balanceDue: 0,
    },
    {
      id: 'RES-1013',
      guestName: 'Chloe Davis',
      propertyName: 'Downtown Loft',
      unitName: 'Apt 5',
      checkIn: day(-6),
      checkOut: day(0),
      status: 'checked_in',
      channel: 'vrbo',
      totalAmount: 800,
      balanceDue: 0,
    },
    {
      id: 'RES-1014',
      guestName: 'Youssef Tariq',
      propertyName: 'New Cairo Serviced',
      unitName: 'Apt 101',
      checkIn: day(-2),
      checkOut: day(0),
      status: 'checked_in',
      channel: 'vrbo',
      totalAmount: 250,
      balanceDue: 0,
    },

    // STAYING (checkIn < 07-29 AND checkOut > 07-29)
    {
      id: 'RES-1005',
      guestName: 'Emma Brown',
      propertyName: 'El Gouna Lagoon',
      unitName: 'Chalet 14',
      checkIn: day(-4),
      checkOut: day(7),
      status: 'checked_in',
      channel: 'vrbo',
      totalAmount: 2400,
      balanceDue: 0,
    },
    {
      id: 'RES-1006',
      guestName: 'Lucas Taylor',
      propertyName: 'Marassi Beachfront',
      unitName: 'Villa 9',
      checkIn: day(-1),
      checkOut: day(2),
      status: 'checked_in',
      channel: 'direct',
      totalAmount: 1600,
      balanceDue: 0,
    },
    {
      id: 'RES-1015',
      guestName: 'Fatima Zahra',
      propertyName: 'Nile View Condo',
      unitName: 'Floor 10',
      checkIn: day(-8),
      checkOut: day(4),
      status: 'checked_in',
      channel: 'airbnb',
      totalAmount: 950,
      balanceDue: 0,
    },
    {
      id: 'RES-1016',
      guestName: 'John Doe',
      propertyName: 'Zayed Family Villa',
      unitName: 'Villa 1',
      checkIn: day(-10),
      checkOut: day(1),
      status: 'checked_in',
      channel: 'airbnb',
      totalAmount: 3200,
      balanceDue: 0,
    },

    // UPCOMING (checkIn > 07-29)
    {
      id: 'RES-1007',
      guestName: 'Amelia Thomas',
      propertyName: 'Zayed Family Villa',
      unitName: 'Villa 1',
      checkIn: day(2),
      checkOut: day(6),
      status: 'confirmed',
      channel: 'expedia',
      totalAmount: 950,
      balanceDue: 150,
    },
    {
      id: 'RES-1008',
      guestName: 'Mia Martinez',
      propertyName: 'New Cairo Serviced',
      unitName: 'Apt 101',
      checkIn: day(3),
      checkOut: day(12),
      status: 'confirmed',
      channel: 'booking.com',
      totalAmount: 1800,
      balanceDue: 0,
    },
    {
      id: 'RES-1017',
      guestName: 'Omar Hassan',
      propertyName: 'Downtown Loft',
      unitName: 'Apt 4B',
      checkIn: day(5),
      checkOut: day(21),
      status: 'confirmed',
      channel: 'direct',
      totalAmount: 700,
      balanceDue: 350,
    },
    {
      id: 'RES-1018',
      guestName: 'Elena Rodriguez',
      propertyName: 'Marassi Beachfront',
      unitName: 'Villa 9',
      checkIn: day(9),
      checkOut: day(29),
      status: 'confirmed',
      channel: 'airbnb',
      totalAmount: 4500,
      balanceDue: 0,
    },
  ] as DashboardReservation[],
}
