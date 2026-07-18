export type Role =
  'platform_super_admin' | 'org_admin' | 'manager' | 'front_desk' | 'housekeeping' | 'owner'

// Single source of truth for booking channels used across properties and reservations.
export type BookingChannel = 'direct' | 'airbnb' | 'booking.com' | 'vrbo' | 'expedia'
