import type { Reservation, PaginatedResponse, GetReservationsParams } from './types'

const generateMocks = (): Reservation[] => {
  const statuses: Reservation['status'][] = ['confirmed', 'checked_in', 'checked_out', 'cancelled']
  const channels: Reservation['channel'][] = ['direct', 'airbnb', 'booking.com', 'expedia']
  const properties = [
    { p: 'Downtown Loft', u: 'Apt 4B' },
    { p: 'Nile View Condo', u: 'Floor 12' },
    { p: 'Maadi Retreat', u: 'Villa 2' },
    { p: 'Zamalek Studio', u: 'Unit 8A' },
    { p: 'El Gouna Lagoon', u: 'Chalet 14' }
  ]
  const guests = ['Oliver Smith', 'Liam Johnson', 'Isabella Davis', 'Sophia Garcia', 'Nour El-Din', 'James Wilson', 'Emma Brown', 'Lucas Taylor', 'Amelia Thomas', 'Mia Martinez']
  
  const reservations: Reservation[] = []
  for (let i = 1; i <= 45; i++) {
    const prop = properties[i % properties.length]
    const amount = 150 + ((i * 137) % 1000)
    const isPaid = i % 3 !== 0
    const checkInDay = (i % 23) + 1
    reservations.push({
      id: `RES-${1000 + i}`,
      guestName: guests[i % guests.length],
      checkIn: `2026-07-${String(checkInDay).padStart(2, '0')}`,
      checkOut: `2026-07-${String(checkInDay + 4).padStart(2, '0')}`,
      property: prop.p,
      unit: prop.u,
      status: statuses[i % statuses.length],
      channel: channels[i % channels.length],
      totalAmount: amount,
      balanceDue: isPaid ? 0 : Math.floor(amount * 0.5),
    })
  }
  return reservations
}

const DB = generateMocks()

export const simulateGetReservations = async (params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...DB]

      if (params.search) {
        const lowerSearch = params.search.toLowerCase()
        filtered = filtered.filter(res => 
          res.guestName.toLowerCase().includes(lowerSearch) || 
          res.id.toLowerCase().includes(lowerSearch)
        )
      }

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(res => res.status === params.status)
      }

      const totalCount = filtered.length
      const totalPages = Math.ceil(totalCount / params.limit) || 1
      const safePage = Math.min(Math.max(params.page, 1), totalPages)
      
      const start = (safePage - 1) * params.limit
      const paginatedData = filtered.slice(start, start + params.limit)

      resolve({
        data: paginatedData,
        meta: {
          totalCount,
          totalPages,
          currentPage: safePage,
          limit: params.limit
        }
      })
    }, 500) 
  })
}

export const simulateGetAllReservations = async (): Promise<Reservation[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...DB])
    }, 500)
  })
}