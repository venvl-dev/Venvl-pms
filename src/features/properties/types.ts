import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }
export type PropertyStatus = 'active' | 'draft' | 'archived'
export type PropertyType = 'parent' | 'child' | 'single'

export interface PropertyPricing {
  price: number
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
  parentId?: string
  name: string
  image: string
  type: PropertyType
  location: string
  status: PropertyStatus
  channels: BookingChannel[]
  bedrooms: number
  bathrooms: number
  description?: string
  amenities?: string[]
  pricing?: PropertyPricing
  additionalInfo?: PropertyAdditionalInfo
}

export interface CreatePropertyResponse {
  data: Property
  message: string
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
