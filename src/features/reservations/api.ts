import { api } from '@/lib/apiClient'
import type { Reservation, GetReservationsParams, PaginatedResponse } from './types'


export async function getReservations(params: GetReservationsParams): Promise<PaginatedResponse<Reservation>> {
  const { data } = await api.get<PaginatedResponse<Reservation>>('/booking', { params })
  const rows=data.data??[]
  
  return {
    data: rows,
    meta:{
      total: data.meta?.total ?? null,
      page: data.meta?.page ?? params.page,
      limit: data.meta?.limit ?? params.limit,

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