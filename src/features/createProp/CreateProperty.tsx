import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './CreateProperty.module.css'
import TabsBar from './TabsBar'
import { PropertyCard } from './PropertyCard'
import GeneralInfoForm from './GeneralInfoForm'
import Validators from './Validators'
import AmenitiesFrom from './AmenitiesForm'
import PhotosForm from './PhotosForm'
import Pricing from './Pricing'
import Instructions from './Instructions'
import type {
  AmenitiesForm,
  CreatePropertyTab,
  GeneralInfo,
  PhotosFormState,
  PricingInfo,
  PropertyCardProps,
}  from './types'
import { useCreateListing } from './hooks'



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
    propType: 'apartment',
    unitType: 'single',
    parent: null,
    bedrooms: 0,
    bathrooms: 0,
    maxOccupancy: 1,
    area: '',
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
  })
  const [photosForm, setPhotosForm] = useState<PhotosFormState>({
    photos: [],
    thumbnailId: null,
  })
  const photoUrlsRef = useRef(new Set<string>())

  const navigate = useNavigate()
  const { mutate: createProperty, isPending } = useCreateListing()

  const handleSubmit = () => {
    createProperty(
      {
        photos: photosForm,
        listing: {
          title: generalInfo.title,
          description: generalInfo.desc,
          structureType: generalInfo.unitType ?? 'single',
          ...(generalInfo.unitType === 'child' && generalInfo.parent
            ? { parentListingId: generalInfo.parent }
            : {}),
          propertyType: generalInfo.propType ?? 'apartment',
          area: Number(generalInfo.area) || 0,
          bedrooms: generalInfo.bedrooms,
          bathrooms: generalInfo.bathrooms,
          maxOccupancy: generalInfo.maxOccupancy,
          mapsLocation: generalInfo.location || null,
          price: Number(pricingInfo.base) || 0,
          amenities: amenitiesForm.selectedAmenities,
          address: generalInfo.address,
          city: generalInfo.city,
          state: null,
          country: generalInfo.country,
          zipCode: generalInfo.zipcode || null,
          currency: 'USD',
          countOfUnits: 1,
        },
      },
      { onSuccess: (property) => navigate(`/properties/${property.id}`) },
    )
  }

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
        { icon: 'users', label: `${generalInfo.maxOccupancy}` },
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
            onSubmit={handleSubmit}
            isSubmitting={isPending}
          />
        </div>
        <div className={styles.propertyCardHolder}>
          <PropertyCard {...propInfo} />
        </div>
      </div>
    </div>
  )
}
