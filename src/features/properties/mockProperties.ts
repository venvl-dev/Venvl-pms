import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }
export type PropertyStatus = 'active' | 'draft' | 'archived'
export type PropertyType = 'apartment' | 'villa' | 'studio' | 'chalet'

export interface Property {
  id: string
  name: string
  image: string
  type: PropertyType
  location: string
  status: PropertyStatus
  channels: BookingChannel[]
  bedrooms: number
  bathrooms: number
}

const IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=150"
]

const generateMocks = (): Property[] => {
  const types: PropertyType[] = ['apartment', 'villa', 'studio', 'chalet']
  const statuses: PropertyStatus[] = ['active', 'active', 'active', 'draft', 'archived']
  const locations = ['Zamalek, Cairo', 'Maadi, Cairo', 'El Gouna, Red Sea', 'New Cairo', 'Marassi, North Coast']
  const names = ['Nile View Condo', 'Downtown Loft', 'Lagoon Retreat', 'Palm Villa', 'Desert Rose Studio']
  const allChannels: BookingChannel[] = ['direct', 'airbnb', 'booking.com', 'vrbo']

  const properties: Property[] = []
  
  for (let i = 1; i <= 25; i++) {
    // Deterministic channels (1 to 4), rotated by index so the mock is reproducible.
    const channelCount = (i % allChannels.length) + 1
    const start = i % allChannels.length
    const connectedChannels = Array.from(
      { length: channelCount },
      (_, k) => allChannels[(start + k) % allChannels.length],
    )

    properties.push({
      id: `PRP-${1000 + i}`,
      name: `${names[i % names.length]} ${i}`,
      image: IMAGES[i % IMAGES.length],
      type: types[i % types.length],
      location: locations[i % locations.length],
      status: statuses[i % statuses.length],
      channels: connectedChannels,
      bedrooms: (i % 4) + 1,
      bathrooms: (i % 3) + 1,
    })
  }
  return properties
}

export const MOCK_PROPERTIES = generateMocks()