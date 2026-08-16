import { Button } from '@/components/core/Button'
import styles from './CreateProperty.module.css'
import { useCallback, useEffect, useState } from 'react'
import type {
  AmenitiesForm,
  CreatePropertyTab,
  GeneralInfo,
  PhotosFormState,
  PricingInfo,
} from './types'

interface ValidatorsProps {
  currentTab: CreatePropertyTab
  tabs: CreatePropertyTab[]
  setCurrentTab: React.Dispatch<React.SetStateAction<CreatePropertyTab>>
  setCompletedTabs: React.Dispatch<React.SetStateAction<CreatePropertyTab[]>>
  generalInfo: GeneralInfo
  amenitiesForm: AmenitiesForm
  photosForm: PhotosFormState
  pricingInfo: PricingInfo
  onSubmit:()=>void
  isSubmitting:boolean
}

export default function Validators({
  currentTab,
  tabs,
  setCurrentTab,
  setCompletedTabs,
  generalInfo,
  amenitiesForm,
  photosForm,
  pricingInfo,
  onSubmit,
  isSubmitting,
}: ValidatorsProps) {
  const [canProceed, setCanProceed] = useState(false)

  const isNonEmptyString = (value: unknown): value is string =>
    typeof value === 'string' && value.trim().length > 0

  const validateGeneral = useCallback(() => {
    const {
      title,
      desc,
      address,
      city,
      country,
      propType,
      unitType,
      parent,
      bedrooms,
      bathrooms,
      maxOccupancy,
    } = generalInfo

    const requiredStrings = [
      title,
      desc,
      // location,
      address,
      city,
      // zipcode
    ]
    const allStringsValid = requiredStrings.every(isNonEmptyString)

    const propTypeValid = propType !== null && isNonEmptyString(propType)
const unitTypeValid = unitType !== null && isNonEmptyString(unitType)
const parentValid = unitType !== 'child' || (parent !== null && isNonEmptyString(parent))


    const numbersValid =
      typeof bedrooms === 'number' &&
      bedrooms >= 0 &&
      typeof bathrooms === 'number' &&
      bathrooms >= 0 &&
      typeof maxOccupancy === 'number' &&
      maxOccupancy >= 1 
     
    const countryValid = isNonEmptyString(country)

    return (
      allStringsValid &&
      propTypeValid &&
      unitTypeValid &&
      parentValid &&
      numbersValid &&
      countryValid
    )
  }, [generalInfo])

  const validateAmenities = useCallback(() => {
    return (amenitiesForm.selectedAmenities?.length ?? 0) > 0
  }, [amenitiesForm.selectedAmenities])

  const validatePhotos = useCallback(() => {
    if (photosForm.photos.length === 0 || photosForm.thumbnailId === null) {
      return false
    }

    return photosForm.photos.some((photo) => photo.id === photosForm.thumbnailId)
  }, [photosForm.photos, photosForm.thumbnailId])

  const validatePricing = useCallback(() => {
    const { base, extraPerson, weeklyDisc, monthlyDisc, applyExtraAfter, refundDamageDeposit } =
      pricingInfo

    const baseValid = typeof base === 'number' && Number.isFinite(base) && base > 0
    const optionalNumbers = [
      extraPerson,
      weeklyDisc ?? 0,
      monthlyDisc ?? 0,
      applyExtraAfter ?? 0,
      refundDamageDeposit ?? 0,
    ]
    const optionalValuesValid = optionalNumbers.every(
      (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0,
    )

    return baseValid && optionalValuesValid
  }, [pricingInfo])

  const handleNextButton = () => {
    if (!canProceed) return

    const currentIndex = tabs.findIndex((tab) => tab === currentTab)
    const nextIndex = currentIndex + 1

    if (nextIndex < tabs.length) {
      const nextTab = tabs[nextIndex]
      setCurrentTab(nextTab)
      setCompletedTabs((prev: CreatePropertyTab[]) =>
        prev.includes(nextTab) ? prev : [...prev, nextTab],
      )
    }
  }

  const handlePreviousButton = () => {
    const currentIndex = tabs.findIndex((tab) => tab === currentTab)
    const previousIndex = currentIndex - 1

    if (previousIndex >= 0) {
      const previousTab = tabs[previousIndex]
      setCurrentTab(previousTab)
      setCompletedTabs((prev) => {
        const newArr = [...prev]
        newArr.pop()
        return newArr
      })
    }
  }

  useEffect(() => {
    switch (currentTab) {
      case 'General Info':
        setCanProceed(validateGeneral())
        break
      case 'Amenities':
        setCanProceed(validateAmenities())
        break
      case 'Photos':
        setCanProceed(validatePhotos())
        break
      case 'Pricing':
        setCanProceed(validatePricing())
        break
      case 'Instructions':
        setCanProceed(true)
        break
      default:
        setCanProceed(false)
    }
  }, [currentTab, validateAmenities, validateGeneral, validatePhotos, validatePricing])

  return (
    <div className={styles.actionsHolder}>
      <Button onClick={handlePreviousButton} variant="outline" disabled={currentTab === tabs[0]}>
        Previous
      </Button>
      <Button
        onClick={currentTab === tabs[tabs.length - 1] ? onSubmit : handleNextButton}
        disabled={!canProceed || isSubmitting}
      >
        {currentTab === tabs[tabs.length - 1]
          ? isSubmitting
            ? 'Creating…'
            : 'Create Property'
          : 'Next'}
      </Button>
    </div>
  )
}
