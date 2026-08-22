import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }

export type ReservationStatus = 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | string

export interface Occupancy {
  adults: number
  children: number
  infants: number
  ages: number[]
}

export interface Customer {
  id: string
  name: string
  email: string
  ota: string | null
}

export interface ListingLocation {
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  zipCode: string | null
  mapsLocation: string | null
}

export interface Listing {
  id: string
  name: string
  type?: string
  thumbnail: string | null
  bedrooms: number
  bathrooms: number
  maxOccupancy?: number
  area?: number
  price?: number
  currency?: string
  location: ListingLocation
}

export interface Reservation {
  id: string
  startDate: string
  endDate: string
  listingId: string
  status: ReservationStatus
  amount: number | null
  currency: string | null
  channexBookingId: string | null
  occupancy: Occupancy | null
  customer: Customer
  listing: Listing
}

export interface GetReservationsParams {
  page: number
  limit: number
  status?: string
  startDate?: string
  endDate?: string
  source?: string
  search?: string
}

export interface PaginatedResponse<T> {
  message?: string
  data: T[]
  meta: {
    total:number|null
    page: number
    limit: number
  }
}