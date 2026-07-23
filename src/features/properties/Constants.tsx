import { Badge } from '@/components/core/Badge'
import type { Property, BookingChannel } from './types'
import styles from './PropertiesView.module.css'

export const airbnbLogo = '/images/channels/airbnb.png'
export const bookingLogo = '/images/channels/booking.jpg'
export const expediaLogo = '/images/channels/expedia.png'
export const vrboLogo = '/images/channels/vrbo.jpg'
export const directLogo = '/images/venvl-mark.svg'

export const ALL_COLUMNS = [
  { id: 'listing', label: 'Listing', defaultVisible: true },
  { id: 'id', label: 'Property ID', defaultVisible: false },
  { id: 'type', label: 'Unit Type', defaultVisible: true },
  { id: 'capacity', label: 'Beds/Baths', defaultVisible: false },
  { id: 'location', label: 'Location', defaultVisible: true },
  { id: 'channels', label: 'Channels', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
]

export const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

export const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'direct', label: 'Direct Booking' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking.com', label: 'Booking.com' },
  { value: 'vrbo', label: 'Vrbo' },
]

export const getStatusBadge = (status: Property['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>
    case 'archived':
      return <Badge variant="outline">Archived</Badge>
  }
}

export const renderChannelCluster = (channels: BookingChannel[]) => {
  const config: Record<BookingChannel, { color: string; initial: string; logo?: string }> = {
    airbnb: { color: '#FF5A5F', initial: 'A', logo: airbnbLogo },
    'booking.com': { color: '#003580', initial: 'B', logo: bookingLogo },
    vrbo: { color: '#00266b', initial: 'V', logo: vrboLogo },
    expedia: { color: '#FFC72C', initial: 'E', logo: expediaLogo },
    direct: { color: 'var(--primary)', initial: 'D', logo: directLogo },
  }

  return (
    <div className={styles.channelCluster}>
      {channels.map((ch) => (
        <div
          key={ch}
          className={styles.channelDot}
          style={{ backgroundColor: config[ch].color }}
          title={ch}
        >
          {config[ch].logo ? <img src={config[ch].logo} alt={ch} /> : config[ch].initial}
        </div>
      ))}
    </div>
  )
}
