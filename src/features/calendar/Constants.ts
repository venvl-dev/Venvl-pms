import type { BookingChannel } from '@/types/domain'
import { airbnbLogo, bookingLogo, directLogo, expediaLogo, vrboLogo } from '../properties/Constants'
import styles from './MultiCalendarView.module.css'

export type ViewMode = 'day' | 'month' | 'year'

// Standardization helpers
export const parseDate = (d: string) => {
  // If it already has a time attached, parse it directly
  if (d.includes('T')) return new Date(d)
  
  // Otherwise, fallback to appending the time for simple YYYY-MM-DD strings
  return new Date(`${d}T00:00:00Z`)
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const getChannelConfig = (channel: BookingChannel) => {
  if (channel === 'airbnb') return { style: styles.channel_airbnb, icon: 'a', logo: airbnbLogo }
  if (channel === 'booking.com')
    return { style: styles.channel_booking_com, icon: 'B.', logo: bookingLogo }
  if (channel === 'vrbo') return { style: styles.channel_vrbo, icon: 'V', logo: vrboLogo }
  if (channel === 'expedia') return { style: styles.channel_expedia, icon: 'E', logo: expediaLogo }
  return { style: styles.channel_direct, icon: 'D', logo: directLogo }
}

export const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'direct', label: 'Direct Booking' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking.com', label: 'Booking.com' },
  { value: 'vrbo', label: 'Vrbo' },
  { value: 'expedia', label: 'Expedia' },
]