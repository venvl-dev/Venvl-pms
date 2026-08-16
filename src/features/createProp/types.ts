export const PROPERTY_TYPES = [
  'apartment',
  'villa',
  'house',
  'condo',
  'cottage',
  'cabin',
  'loft',
  'studio',
  'townhouse',
  'chalet',
  'bungalow',
  'hotel',
  'other',
] as const
export type PropertyType = (typeof PROPERTY_TYPES)[number]

export const STRUCTURE_TYPES = ['single', 'parent', 'child'] as const
export type StructureType = (typeof STRUCTURE_TYPES)[number]

export type CreatePropertyTab = 'General Info' | 'Amenities' | 'Photos' | 'Pricing' | 'Instructions'

export type PropertySpec = {
  icon: string
  label: string
}

export type PropertyCardProps = {
  image?: string
  title?: string
  location?: string
  rating?: number
  price?: number
  currency?: string
  unit?: string
  specs?: PropertySpec[]
  badge?: string | null
  favorite?: boolean
  ctaLabel?: string
}

export type GeneralInfo = {
  title: string | ''
  desc: string | ''
  location: string | ''
  address: string | ''
  city: string | ''
  country: string | ''
  zipcode: string | ''
  propType: PropertyType | null
  unitType: StructureType | null
  parent?: string | null
  bedrooms: number
  bathrooms: number
  maxOccupancy: number
  area: number | ''
}

export type PricingInfo = {
  base: number | ''
  extraPerson: number | ''
  weeklyDisc?: number | ''
  monthlyDisc?: number | ''
  applyExtraAfter?: number | ''
  refundDamageDeposit?: number | ''
}

export type AmenitiesForm = {
  selectedAmenities: string[]
}

export type PhotoItem = {
  id: number
  src: string
  name: string
  file: File
}

export type PhotosFormState = {
  photos: PhotoItem[]
  thumbnailId: number | null
}

export type UploadKind = 'thumbnail' | 'gallery'
export type PresignFile = { type: UploadKind; fileName: string; contentType: string }
export type PresignRequest = { resourceType: 'listing'; files: PresignFile[] }
export type PresignedUpload = { type: UploadKind; key: string; uploadUrl: string }
export type PresignResponse = { uploads: PresignedUpload[] }

export type ListingMedia = { thumbnailKey: string; imageKeys: string[] }


export type CreateListingRequest = {
  title: string
  description: string
  media: ListingMedia
  structureType: StructureType
  parentListingId?: string
  propertyType: PropertyType
  area: number
  bedrooms: number
  bathrooms: number
  maxOccupancy: number
  mapsLocation: string | null
  price: number
  amenities: string[]
  address: string
  city: string
  state: string | null
  country: string
  zipCode: string | null
  currency: string
  countOfUnits: number
}
