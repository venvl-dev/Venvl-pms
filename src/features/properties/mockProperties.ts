import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }
export type PropertyStatus = 'active' | 'draft' | 'archived'
export type PropertyType = 'parent' | 'child' | 'single'

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
}

const IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=150"
]

const generateMocks = (): Property[] => {
  const statuses: PropertyStatus[] = ['active', 'active', 'active', 'draft', 'archived']
  const locations = ['Zamalek, Cairo', 'Maadi, Cairo', 'El Gouna, Red Sea', 'New Cairo', 'Marassi, North Coast']
  const parentNames = ['Nile View Building', 'Downtown Complex', 'Lagoon Residences', 'Palm Towers']
  const singleNames = ['Desert Rose Villa', 'Oasis Chalet', 'Sea Breeze Studio']
  const allChannels: BookingChannel[] = ['direct', 'airbnb', 'booking.com', 'vrbo', 'expedia']

  const properties: Property[] = []
  let idCounter = 1000
  
  for (let i = 1; i <= 25; i++) {
    const isSingle = i % 3 === 0
    const rootId = `PRP-${++idCounter}`
    const channelCount = (i % allChannels.length) + 1
    const connectedChannels = Array.from(
      { length: channelCount },
      (_, k) => allChannels[(i + k) % allChannels.length],
    )

    properties.push({
      id: rootId,
      name: isSingle ? `${singleNames[i % singleNames.length]} ${i}` : `${parentNames[i % parentNames.length]} ${i}`,
      image: IMAGES[i % IMAGES.length],
      type: isSingle ? 'single' : 'parent',
      location: locations[i % locations.length],
      status: statuses[i % statuses.length],
      channels: connectedChannels,
      bedrooms: (i % 4) + 1,
      bathrooms: (i % 3) + 1,
    })

    // generate 1-2 children 
    if (!isSingle) {
      const childCount = (i % 3) 
      for (let j = 1; j <= childCount; j++) {
        properties.push({
          id: `PRP-${++idCounter}`,
          parentId: rootId,
          name: `Unit ${j}${['A', 'B', 'C'][j % 3]}`,
          image: IMAGES[(i + j) % IMAGES.length],
          type: 'child',
          location: locations[i % locations.length],
          status: statuses[(i + j) % statuses.length],
          channels: connectedChannels.slice(0, 2), 
          bedrooms: (j % 3) + 1,
          bathrooms: 1,
        })
      }
    }
  }
  return properties
}

export const MOCK_PROPERTIES = generateMocks()