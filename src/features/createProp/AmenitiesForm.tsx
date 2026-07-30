import { Plus, type LucideIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import type { AmenitiesForm, AmenityType } from './CreateProperty'
import styles from './CreateProperty.module.css'
import Amenity from './Amenity'
import {
  Car,
  Coffee,
  Dumbbell,
  Laptop,
  Snowflake,
  Trees,
  Tv,
  UtensilsCrossed,
  Waves,
  Wifi,
  Bath,
  Dog,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

interface AmenitiesFormProps {
  amenitiesForm: AmenitiesForm
  setAmenitiesForm: Dispatch<SetStateAction<AmenitiesForm>>
}

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  tv: Tv,
  parking: Car,
  ac: Snowflake,
  coffee: Coffee,
  kitchen: UtensilsCrossed,
  pool: Waves,
  gym: Dumbbell,
  workspace: Laptop,
  garden: Trees,
  spa: Sparkles,
  bath: Bath,
  petFriendly: Dog,
  security: ShieldCheck,
}

export default function AmenitiesFrom({ amenitiesForm, setAmenitiesForm }: AmenitiesFormProps) {
  const selectedAmenities = amenitiesForm.selectedAmenities ?? []
  const availableAmenities = (amenitiesForm.allAmenities ?? []).filter(
    (amenity) => !selectedAmenities.some((selected) => selected.label === amenity.label),
  )

  const toggleAmenity = (amenity: AmenityType) => {
    setAmenitiesForm((prev) => {
      const exists = prev.selectedAmenities.some((item) => item.label === amenity.label)

      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter((item) => item.label !== amenity.label)
          : [...prev.selectedAmenities, amenity],
      }
    })
  }

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>Amenities</h3>
      <div className={styles.formFields}>
        <div className={styles.amenityPanel}>
          <div className={styles.amenityHeader}>
            <div className={styles.inputCombTitle}>
              <p>Selected Amenities</p>
              <div className={styles.titleUnderLine}></div>
            </div>
            <button type="button" className={styles.amenityAddButton}>
              <Plus size={16} />
            </button>
          </div>

          <div className={styles.amenityStack}>
            {selectedAmenities.length > 0 ? (
              selectedAmenities.map((amenity) => (
                <Amenity
                  key={amenity.label}
                  icon={iconMap[amenity.icon]}
                  label={amenity.label}
                  selected
                  onClick={() => toggleAmenity(amenity)}
                />
              ))
            ) : (
              <div className={styles.emptyAmenityState}>No amenities selected yet.</div>
            )}
          </div>
        </div>

        <div className={styles.inputCombTitle}>
          <p>Available Amenities</p>
          <div className={styles.titleUnderLine}></div>
        </div>

        <div className={styles.amenityGrid}>
          {availableAmenities.map((amenity) => (
            <Amenity
              key={amenity.label}
              icon={iconMap[amenity.icon]}
              label={amenity.label}
              onClick={() => toggleAmenity(amenity)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
