import type { BookingChannel } from '@/types/domain'

export type { BookingChannel }
export type PropertyStatus = 'active' | 'draft' | 'archived'
export type PropertyType = 'apartment' | 'villa' | 'studio' | 'chalet'

export interface PropertyPricing {
  price: number
  priceForExtraPerson: number
  weeklyDiscount: number // %
  monthlyDiscount: number // %
  applyExtraPersonAfter: number
  propertyRentTax: number | null // %
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
  name: string
  image: string
  type: PropertyType
  location: string
  status: PropertyStatus
  channels: BookingChannel[]
  bedrooms: number
  bathrooms: number
  description: string
  amenities: string[]
  pricing: PropertyPricing
  additionalInfo: PropertyAdditionalInfo
}

const IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=150',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=150',
]

const generateMocks = (): Property[] => {
  const types: PropertyType[] = ['apartment', 'villa', 'studio', 'chalet']
  const statuses: PropertyStatus[] = ['active', 'active', 'active', 'draft', 'archived']
  const locations = [
    'Zamalek, Cairo',
    'Maadi, Cairo',
    'El Gouna, Red Sea',
    'New Cairo',
    'Marassi, North Coast',
  ]
  const names = [
    'Nile View Condo',
    'Downtown Loft',
    'Lagoon Retreat',
    'Palm Villa',
    'Desert Rose Studio',
  ]
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

    const allAmenities = [
      'WiFi',
      'Air Conditioning',
      'Kitchen',
      'Pool',
      'Parking',
      'Washer',
      'TV',
      'Balcony',
    ]
    const amenityCount = (i % 4) + 7
    const amenityStart = i % allAmenities.length
    const selectedAmenities = Array.from(
      { length: amenityCount },
      (_, k) => allAmenities[(amenityStart + k) % allAmenities.length],
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
      description: `A ${types[i % types.length]} in ${locations[i % locations.length]} with ${(i % 4) + 1} bedrooms and ${(i % 3) + 1} bathrooms.`,
      amenities: selectedAmenities,
      pricing: {
        price: 100 + (i % 8) * 25,
        priceForExtraPerson: (i % 3) * 10,
        weeklyDiscount: 5 + (i % 4),
        monthlyDiscount: 10 + (i % 3) * 5,
        applyExtraPersonAfter: (i % 2) + 1,
        propertyRentTax: i % 3 === 0 ? 14 : null,
        fixedTaxPerReservation: i % 4 === 0 ? 50 : null,
        fixedGuestTaxPerNight: i % 5 === 0 ? 5 : null,
        fixedNightlyTax: null,
        refundableDamageDeposit: (i % 2) * 100,
      },
      additionalInfo: {
        cancellationPolicies: [
          {
            channel: 'Airbnb',
            policy: 'Flexible - Guests can cancel up to 24 hours before check-in for a full refund.',
          },
          {
            channel: 'Booking.com',
            policy: 'Moderate - 100% refund up to 5 days before arrival.',
          },
          {
            channel: 'Vrbo',
            policy: 'Relaxed - 100% refund up to 14 days before arrival, 50% up to 7 days.',
          },
          {
            channel: 'Direct',
            policy: 'Flexible - 100% refund up to 14 days before arrival, 50% up to 7 days.',
          },
        ],
        checkInInstructions: `Door code: ${2000 + i}# — Floor ${(i % 9) + 1}, Apartment ${i}`,
        listingAddress: `${i} Orabi Street, Azbakeya, ${locations[i % locations.length]}`,
        wifiDetails: `Network: unit_${1000 + i} · Password: welcome${i}`,
      },
    })
  }
  return properties
}

export const MOCK_PROPERTIES = generateMocks()
export const getPropertyId = (id: string): Property | undefined =>
  MOCK_PROPERTIES.find((p) => p.id === id)
