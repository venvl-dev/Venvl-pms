import { airbnbLogo, bookingLogo, directLogo, expediaLogo } from '../properties/Constants'

export const ALL_COLUMNS = ['Channel', 'Status', 'Channex ID', 'Last Synced']
export const ALL_BOOKING_COLUMNS = ['Domain', 'Status', 'Currency', 'Live Listings']
export type ChannelData = {
  channel: 'Airbnb' | 'Booking.com' | 'Direct' | 'Expedia'
  logo: string
  status: boolean
  channex?: string
  last_synced?: string | null
}

export type BookingSiteData = {
  domain: string
  primary?: boolean
  status: string
  statusBool: boolean
  currency: 'USD' | 'EGP'
  liveListings?: number | 0
}

export const SITES_DATA: BookingSiteData[] = [
  {
    domain: 'book.nileview.com',
    primary: true,
    status: 'Live',
    statusBool: true,
    currency: 'USD',
    liveListings: 5,
  },
  {
    domain: 'marassi-stays.com',
    primary: false,
    status: 'Provisioning',
    statusBool: false,
    currency: 'EGP',
    liveListings: 10,
  },
]
export const CHANNELS_DATA: ChannelData[] = [
  {
    channel: 'Airbnb',
    logo: airbnbLogo,
    status: true,
    channex: 'chx-air-1',
    last_synced: 'Aug 6, 2026, 5:55 PM',
  },
  {
    channel: 'Booking.com',
    logo: bookingLogo,
    status: true,
    channex: 'chx-bkg-1',
    last_synced: 'Aug 6, 2026, 5:55 PM',
  },
  {
    channel: 'Direct',
    logo: directLogo,
    status: true,
  },
  {
    channel: 'Expedia',
    logo: expediaLogo,
    status: false,
  },
]
