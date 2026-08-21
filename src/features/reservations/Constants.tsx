import { Badge, type BadgeVariant } from '@/components/core/Badge'
import type { Reservation } from './types'
import styles from './ReservationsView.module.css'

export const ALL_COLUMNS = [
  { id: 'id', label: 'Booking ID', defaultVisible: false },
  { id: 'guest', label: 'Guest Name', defaultVisible: true },
  { id: 'dates', label: 'Check-in / Out', defaultVisible: true },
  { id: 'property', label: 'Property & Unit', defaultVisible: true },
  { id: 'channel', label: 'Channel', defaultVisible: false },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'amount', label: 'Total', defaultVisible: true },
]

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const SOURCE_OPTIONS = [
  { value: 'all', label: 'All Sources' },
  { value: 'direct', label: 'Direct Booking' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking.com', label: 'Booking.com' },
  { value: 'vrbo', label: 'Vrbo' },
  { value: 'expedia', label: 'Expedia' },
]


export const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr))

export const formatCurrency = (amount: number, currency?: string | null) => {
  const code = currency?.toUpperCase() || 'USD'
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: code }).format(amount)
  } catch {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
  }
}

const CHANNEL_CONFIG: Record<string, { logo: string }> = {
  airbnb: { logo: '/images/channels/airbnb.png' },
  'booking.com': { logo: '/images/channels/booking.jpg' },
  vrbo: { logo: '/images/channels/vrbo.jpg' },
  expedia: { logo: '/images/channels/expedia.png' },
  direct: { logo: '/images/venvl-mark.svg' },
}

export const renderChannel = (channel: string) => {
  const config = CHANNEL_CONFIG[channel.toLowerCase()] || { logo: '/images/venvl-mark.svg' }
  return (
    <div className={styles.channelChip}>
      <img src={config.logo} alt={channel} className={styles.channelLogo} />
    </div>
  )
}

const STATUS_BADGE: Record<string, { variant: BadgeVariant; label: string }> = {
  confirmed: { variant: 'info', label: 'Confirmed' },
  checked_in: { variant: 'success', label: 'Checked In' },
  checked_out: { variant: 'secondary', label: 'Checked Out' },
  cancelled: { variant: 'destructive', label: 'Cancelled' },
}

export const getStatusBadge = (status: Reservation['status']) => {
  const config = STATUS_BADGE[status]
  if (config) return <Badge variant={config.variant}>{config.label}</Badge>
  return <Badge variant="outline">{String(status).replace(/_/g, ' ')}</Badge>
}
