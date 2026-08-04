import { useEffect, useRef, useState } from 'react'
import styles from './CreateProperty.module.css'
import TabsBar from './TabsBar'
import { PropertyCard } from './PropertyCard'
import GeneralInfoForm from './GeneralInfoForm'
import Validators from './Validators'
import AmenitiesFrom from './AmenitiesForm'
import PhotosForm from './PhotosForm'
import Pricing from './Pricing'
import Instructions from './Instructions'

const PROPERTY_AMENITIES: AmenityType[] = [
  { icon: 'wifi', label: 'Wi-Fi' },
  { icon: 'tv', label: 'TV' },
  { icon: 'parking', label: 'Parking' },
  { icon: 'ac', label: 'Air Conditioning' },
  { icon: 'coffee', label: 'Coffee Maker' },
  { icon: 'kitchen', label: 'Kitchen' },
  { icon: 'pool', label: 'Swimming Pool' },
  { icon: 'gym', label: 'Gym' },
  { icon: 'workspace', label: 'Work Space' },
  { icon: 'garden', label: 'Garden' },
  { icon: 'spa', label: 'Spa' },
  { icon: 'bath', label: 'Hot Tub' },
  { icon: 'petFriendly', label: 'Pet Friendly' },
  { icon: 'security', label: '24/7 Security' },
]

export type PropTypes =
  'Apartment' | 'Villa' | 'Studio' | 'Loft' | 'Twin House' | 'Pent House' | 'Other'
export type UnitTypes = 'Single' | 'Parent' | 'Child'
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
  propType: PropTypes | null
  unitType: UnitTypes | null
  parent?: string | null
  bedrooms: number
  bathrooms: number
  maxAdults: number
  maxChilds: number
  maxInfs: number
}

export type PricingInfo = {
  base: number | ''
  extraPerson: number | ''
  weeklyDisc?: number | ''
  monthlyDisc?: number | ''
  applyExtraAfter?: number | ''
  refundDamageDeposit?: number | ''
}

export type AmenityType = {
  icon: string | ''
  label: string
}

export type AmenitiesForm = {
  selectedAmenities: AmenityType[] | []
  allAmenities?: AmenityType[]
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

export default function CreateProperty() {
  const tabs: CreatePropertyTab[] = [
    'General Info',
    'Amenities',
    'Photos',
    'Pricing',
    'Instructions',
  ]

  const [currentTab, setCurrentTab] = useState<CreatePropertyTab>('General Info')
  const [completedTabs, setCompletedTabs] = useState<CreatePropertyTab[]>(['General Info'])
  // const handleSetCurrentTab = () => {

  // }
  const [propInfo, setPropInfo] = useState<PropertyCardProps>({
    image: '',
    title: '',
    location: '',
    rating: 5.0,
    price: 0,
    specs: [],
    badge: null,
    favorite: false,
  })

  const [generalInfo, setGeneralInfo] = useState<GeneralInfo>({
    title: '',
    desc: '',
    location: '',
    address: '',
    city: 'Cairo',
    country: 'EG',
    zipcode: '',
    propType: 'Apartment',
    unitType: 'Single',
    parent: null,
    bedrooms: 0,
    bathrooms: 0,
    maxAdults: 1,
    maxChilds: 0,
    maxInfs: 0,
  })

  const [pricingInfo, setPricingInfo] = useState<PricingInfo>({
    base: 0,
    extraPerson: 0,
    weeklyDisc: 0,
    monthlyDisc: 0,
    applyExtraAfter: 0,
    refundDamageDeposit: 0,
  })

  const [instructions, setInstructions] = useState('')

  const [amenitiesForm, setAmenitiesForm] = useState<AmenitiesForm>({
    selectedAmenities: [],
    allAmenities: PROPERTY_AMENITIES,
  })
  const [photosForm, setPhotosForm] = useState<PhotosFormState>({
    photos: [],
    thumbnailId: null,
  })
  const photoUrlsRef = useRef(new Set<string>())

  const registerPhotoUrl = (url: string) => {
    photoUrlsRef.current.add(url)
  }

  const unregisterPhotoUrl = (url: string) => {
    if (photoUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url)
      photoUrlsRef.current.delete(url)
    }
  }

  useEffect(() => {
    setPropInfo((prev) => ({
      ...prev,
      title: generalInfo.title,
      location: generalInfo.address,
      specs: [
        { icon: 'bed', label: `${generalInfo.bedrooms}` },
        { icon: 'bath', label: `${generalInfo.bathrooms}` },
        { icon: 'users', label: `${generalInfo.maxAdults}` },
      ],
    }))
  }, [generalInfo])

  useEffect(() => {
    const coverImg = photosForm.photos.find((p) => p.id === photosForm.thumbnailId)?.src
    setPropInfo((prev) => ({
      ...prev,
      image: coverImg || '',
    }))
  }, [photosForm])

  useEffect(() => {
    const urls = photoUrlsRef.current
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Create Property</h1>
      </header>
      <div className={styles.formDivider}>
        <div className={styles.formContent}>
          <TabsBar currentTab={currentTab} completedTabs={completedTabs} tabs={tabs} />
          {currentTab === 'General Info' ? (
            <GeneralInfoForm generalInfo={generalInfo} setGeneralInfo={setGeneralInfo} />
          ) : currentTab === 'Amenities' ? (
            <AmenitiesFrom amenitiesForm={amenitiesForm} setAmenitiesForm={setAmenitiesForm} />
          ) : currentTab === 'Photos' ? (
            <PhotosForm
              photosForm={photosForm}
              setPhotosForm={setPhotosForm}
              registerPhotoUrl={registerPhotoUrl}
              unregisterPhotoUrl={unregisterPhotoUrl}
            />
          ) : currentTab === 'Pricing' ? (
            <Pricing
              setPropInfo={setPropInfo}
              pricingInfo={pricingInfo}
              setPricingInfo={setPricingInfo}
            />
          ) : currentTab === 'Instructions' ? (
            <Instructions instructions={instructions} setInstructions={setInstructions} />
          ) : (
            <></>
          )}

          <Validators
            currentTab={currentTab}
            tabs={tabs}
            setCurrentTab={setCurrentTab}
            setCompletedTabs={setCompletedTabs}
            generalInfo={generalInfo}
            amenitiesForm={amenitiesForm}
            photosForm={photosForm}
            pricingInfo={pricingInfo}
          />
        </div>
        <div className={styles.propertyCardHolder}>
          <PropertyCard {...propInfo} />
        </div>
      </div>
    </div>
  )
}
