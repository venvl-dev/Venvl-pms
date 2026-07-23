import { Badge } from '@/components/core/Badge'
import type { Reservation } from './types'
import styles from './ReservationsView.module.css'

export const ALL_COLUMNS = [
  { id: 'id', label: 'Booking ID', defaultVisible: false },
  { id: 'guest', label: 'Guest Name', defaultVisible: true },
  { id: 'dates', label: 'Check-in / Out', defaultVisible: true },
  { id: 'property', label: 'Property & Unit', defaultVisible: true },
  { id: 'channel', label: 'Channel', defaultVisible: false },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'amount', label: 'Total', defaultVisible: false },
  { id: 'balance', label: 'Balance Due', defaultVisible: true },
]

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
]

export const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(dateStr),
  )
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
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

export const getStatusBadge = (status: Reservation['status']) => {
  switch (status) {
    case 'confirmed':
      return <Badge variant="info">Confirmed</Badge>
    case 'checked_in':
      return <Badge variant="success">Checked In</Badge>
    case 'checked_out':
      return <Badge variant="secondary">Checked Out</Badge>
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>
  }
}
