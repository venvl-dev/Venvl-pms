export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
export type BookingChannel = 'direct' | 'airbnb' | 'booking.com' | 'expedia'

export interface Reservation {
  id: string
  guestName: string
  checkIn: string
  checkOut: string
  property: string
  unit: string
  status: ReservationStatus
  channel: BookingChannel
  totalAmount: number
  balanceDue: number
}

// Helper to generate mock data
const generateMocks = (): Reservation[] => {
  const statuses: ReservationStatus[] = ['confirmed', 'checked_in', 'checked_out', 'cancelled']
  const channels: BookingChannel[] = ['direct', 'airbnb', 'booking.com', 'expedia']
  const properties = [
    { p: 'Downtown Loft', u: 'Apt 4B' },
    { p: 'Nile View Condo', u: 'Floor 12' },
    { p: 'Maadi Retreat', u: 'Villa 2' },
    { p: 'Zamalek Studio', u: 'Unit 8A' },
    { p: 'El Gouna Lagoon', u: 'Chalet 14' }
  ]
  const guests = ['Oliver Smith', 'Liam Johnson', 'Isabella Davis', 'Sophia Garcia', 'Nour El-Din', 'James Wilson', 'Emma Brown', 'Lucas Taylor', 'Amelia Thomas', 'Mia Martinez']

  const reservations: Reservation[] = []
  
  for (let i = 1; i <= 25; i++) {
    const prop = properties[i % properties.length]
    const amount = Math.floor(Math.random() * 1000) + 150
    const isPaid = Math.random() > 0.3
    
    reservations.push({
      id: `RES-${1000 + i}`,
      guestName: guests[i % guests.length],
      checkIn: `2026-07-${String((i % 28) + 1).padStart(2, '0')}`,
      checkOut: `2026-07-${String((i % 28) + 5).padStart(2, '0')}`,
      property: prop.p,
      unit: prop.u,
      status: statuses[i % statuses.length],
      channel: channels[i % channels.length],
      totalAmount: amount,
      balanceDue: isPaid ? 0 : Math.floor(amount * 0.5), // 50% deposit paid
    })
  }
  return reservations
}

export const MOCK_RESERVATIONS = generateMocks()