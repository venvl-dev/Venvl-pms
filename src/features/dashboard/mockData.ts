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
    { id: 'RES-1001', guestName: 'Oliver Smith', propertyName: 'Downtown Loft', unitName: 'Apt 4B', checkIn: '2026-07-30', checkOut: '2026-08-02', status: 'confirmed', channel: 'airbnb', totalAmount: 850, balanceDue: 0 },
    { id: 'RES-1002', guestName: 'Liam Johnson', propertyName: 'Nile View Condo', unitName: 'Floor 12', checkIn: '2026-07-30', checkOut: '2026-07-31', status: 'confirmed', channel: 'airbnb', totalAmount: 420, balanceDue: 420 },
    { id: 'RES-1011', guestName: 'Hassan Ali', propertyName: 'Zamalek Studio', unitName: 'Unit 8A', checkIn: '2026-07-29', checkOut: '2026-08-01', status: 'confirmed', channel: 'booking.com', totalAmount: 300, balanceDue: 0 },
    { id: 'RES-1012', guestName: 'Sarah Miller', propertyName: 'El Gouna Lagoon', unitName: 'Chalet 14', checkIn: '2026-07-30', checkOut: '2026-08-05', status: 'confirmed', channel: 'vrbo', totalAmount: 1400, balanceDue: 200 },
    
    // DEPARTURES (checkOut: 07-29)
    { id: 'RES-1003', guestName: 'Nour El-Din', propertyName: 'Maadi Nile Apartment', unitName: 'Apt 2A', checkIn: '2026-07-24', checkOut: '2026-07-29', status: 'checked_in', channel: 'booking.com', totalAmount: 1100, balanceDue: 0 },
    { id: 'RES-1004', guestName: 'James Wilson', propertyName: 'Zamalek Studio', unitName: 'Unit 3C', checkIn: '2026-07-26', checkOut: '2026-07-29', status: 'checked_in', channel: 'airbnb', totalAmount: 500, balanceDue: 0 },
    { id: 'RES-1013', guestName: 'Chloe Davis', propertyName: 'Downtown Loft', unitName: 'Apt 5', checkIn: '2026-07-25', checkOut: '2026-07-29', status: 'checked_in', channel: 'vrbo', totalAmount: 800, balanceDue: 0 },
    { id: 'RES-1014', guestName: 'Youssef Tariq', propertyName: 'New Cairo Serviced', unitName: 'Apt 101', checkIn: '2026-07-27', checkOut: '2026-07-29', status: 'checked_in', channel: 'vrbo', totalAmount: 250, balanceDue: 0 },
    
    // STAYING (checkIn < 07-29 AND checkOut > 07-29)
    { id: 'RES-1005', guestName: 'Emma Brown', propertyName: 'El Gouna Lagoon', unitName: 'Chalet 14', checkIn: '2026-07-25', checkOut: '2026-08-05', status: 'checked_in', channel: 'vrbo', totalAmount: 2400, balanceDue: 0 },
    { id: 'RES-1006', guestName: 'Lucas Taylor', propertyName: 'Marassi Beachfront', unitName: 'Villa 9', checkIn: '2026-07-28', checkOut: '2026-08-01', status: 'checked_in', channel: 'direct', totalAmount: 1600, balanceDue: 0 },
    { id: 'RES-1015', guestName: 'Fatima Zahra', propertyName: 'Nile View Condo', unitName: 'Floor 10', checkIn: '2026-07-26', checkOut: '2026-08-02', status: 'checked_in', channel: 'airbnb', totalAmount: 950, balanceDue: 0 },
    { id: 'RES-1016', guestName: 'John Doe', propertyName: 'Zayed Family Villa', unitName: 'Villa 1', checkIn: '2026-07-20', checkOut: '2026-07-30', status: 'checked_in', channel: 'airbnb', totalAmount: 3200, balanceDue: 0 },
    
    // UPCOMING (checkIn > 07-29)
    { id: 'RES-1007', guestName: 'Amelia Thomas', propertyName: 'Zayed Family Villa', unitName: 'Villa 1', checkIn: '2026-07-31', checkOut: '2026-08-04', status: 'confirmed', channel: 'expedia', totalAmount: 950, balanceDue: 150 },
    { id: 'RES-1008', guestName: 'Mia Martinez', propertyName: 'New Cairo Serviced', unitName: 'Apt 101', checkIn: '2026-08-01', checkOut: '2026-08-10', status: 'confirmed', channel: 'booking.com', totalAmount: 1800, balanceDue: 0 },
    { id: 'RES-1017', guestName: 'Omar Hassan', propertyName: 'Downtown Loft', unitName: 'Apt 4B', checkIn: '2026-08-03', checkOut: '2026-08-08', status: 'confirmed', channel: 'direct', totalAmount: 700, balanceDue: 350 },
    { id: 'RES-1018', guestName: 'Elena Rodriguez', propertyName: 'Marassi Beachfront', unitName: 'Villa 9', checkIn: '2026-08-05', checkOut: '2026-08-15', status: 'confirmed', channel: 'airbnb', totalAmount: 4500, balanceDue: 0 },
  ] as DashboardReservation[],
}