import { api } from '@/lib/apiClient'
import type { Reservation, GetReservationsParams, PaginatedResponse } from './types'

export const USE_MOCK = false 

export async function getReservations(params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> {
  const { data } = await api.get<PaginatedResponse<Reservation>>('/booking', { params })
  
  return {
    data: data.data || [],
    meta: data.meta || {
      total: data.data?.length || 0,
      page: params.page,
      limit: params.limit,
    }
  }
}

export async function getReservationById(id: string): Promise<Reservation> {
  const { data } = await api.get<{data: Reservation}>(`/booking/${id}`)
  return data.data
}

export async function getAllReservations(): Promise<Reservation[]> {
  const { data } = await api.get<Reservation[]>('/booking/all')
  return data
}