import { MOCK_RESERVATIONS } from './mockReservations';
import { api } from '@/lib/apiClient'
import type { Reservation, PaginatedResponse, GetReservationsParams } from './types'
import { simulateGetAllReservations, simulateGetReservations } from './mockDb'

const USE_MOCK = true 
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getReservations(params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> {
  if (USE_MOCK) return simulateGetReservations(params)
  
  const { data } = await api.get<PaginatedResponse<Reservation>>('/reservations', { params })
  return data
}

export async function getReservationById(id: string): Promise<Reservation> {
  if (USE_MOCK) {
    await delay(700)
    const reservation = MOCK_RESERVATIONS.find((item) => item.id === id)
    if (!reservation) throw new Error('Reservation not found')

    return reservation
  }

  const { data } = await api.get<Reservation>(`/reservation/${id}`)
  return data
}


export async function getAllReservations(): Promise<Reservation[]> {
  if (USE_MOCK) return simulateGetAllReservations()
  
  const { data } = await api.get<Reservation[]>('/reservations/all')
  return data
}

// export async function createReservation(body: CreateReservationValues): Promise<Reservation> {
//   const { data } = await api.post<Reservation>('/reservations', body)
//   return data
// }