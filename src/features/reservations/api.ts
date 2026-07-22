import { api } from '@/lib/apiClient'
import type { Reservation, PaginatedResponse, GetReservationsParams } from './types'
import { simulateGetReservations } from './mockDb'

const USE_MOCK = true 

export async function getReservations(params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> {
  if (USE_MOCK) return simulateGetReservations(params)
  
  const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations', { params })
  return data
}

// export async function createReservation(body: CreateReservationValues): Promise<Reservation> {
//   const { data } = await api.post<Reservation>('/reservations', body)
//   return data
// }