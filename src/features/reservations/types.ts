import type { BookingChannel } from '@/types/domain'

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'

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

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export interface GetReservationsParams {
  page: number
  limit: number
  search?: string
  status?: string 
}