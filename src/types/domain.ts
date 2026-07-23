export type Role =
  'platform_super_admin' | 'org_admin' | 'manager' | 'front_desk' | 'housekeeping' | 'owner'

export type BookingChannel = 'direct' | 'airbnb' | 'booking.com' | 'vrbo' | 'expedia'

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    totalCount: number
    totalPages: number
    currentPage: number
    limit: number
  }
}