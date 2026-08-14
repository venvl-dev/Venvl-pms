import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }

export type PropertyStatus = 'active' | 'draft' | 'archived' | 'inactive'
export type StructureType = 'parent' | 'child' | 'single'

export interface PropertyPricing {
  priceForExtraPerson: number
  weeklyDiscount: number
  monthlyDiscount: number
  applyExtraPersonAfter: number
  propertyRentTax: number | null
  fixedTaxPerReservation: number | null
  fixedGuestTaxPerNight: number | null
  fixedNightlyTax: number | null
  refundableDamageDeposit: number
}

export interface CancellationPolicy {
  channel: string
  policy: string
}

export interface PropertyAdditionalInfo {
  cancellationPolicies: CancellationPolicy[]
  checkInInstructions: string
  listingAddress: string
  wifiDetails: string
}

export interface Property {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  images: string[]
  structureType: StructureType
  propertyType: string
  parentListingId: string | null
  area: number | null
  bedrooms: number
  bathrooms: number
  maxOccupancy: number | null
  mapsLocation: string | null
  price: number
  amenities: string[]
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  zipCode: string | null
  currency: string
  countOfUnits: number
  status: PropertyStatus
  channelConnections: BookingChannel[]
  children?: Property[]

  pricing?: PropertyPricing
  additionalInfo?: PropertyAdditionalInfo
}

export interface CreatePropertyResponse {
  data: Property
  message: string
}

export interface PaginatedResponse<T> {
  message?: string
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}