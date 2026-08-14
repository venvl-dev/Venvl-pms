import { useState, type Dispatch, type SetStateAction } from 'react'
import type { AmenitiesForm } from './types'
import styles from './CreateProperty.module.css'
import Amenity, { AMENITY_CATEGORIES, amenityLabel, amenityIcon } from './Amenity'

interface AmenitiesFormProps {
  amenitiesForm: AmenitiesForm
  setAmenitiesForm: Dispatch<SetStateAction<AmenitiesForm>>
}

export default function AmenitiesFrom({ amenitiesForm, setAmenitiesForm }: AmenitiesFormProps) {
  const [search, setSearch] = useState('')
  const [openCategories, setOpenCategories] = useState<string[]>([])

  const selected = amenitiesForm.selectedAmenities
  const query = search.trim().toLowerCase()

  const groups = AMENITY_CATEGORIES.map((group) => ({
    category: group.category,
    slugs: group.slugs.filter(
      (slug) =>
        !selected.includes(slug) &&
        (!query || amenityLabel(slug).toLowerCase().includes(query)),
    ),
  })).filter((group) => group.slugs.length > 0)

  const toggleAmenity = (slug: string) =>
    setAmenitiesForm((prev) => ({
      selectedAmenities: prev.selectedAmenities.includes(slug)
        ? prev.selectedAmenities.filter((item) => item !== slug)
        : [...prev.selectedAmenities, slug],
    }))

  const toggleCategory = (category: string) =>
    setOpenCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    )

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
          </div>

          <div className={styles.amenityStack}>
            {selected.length > 0 ? (
              selected.map((slug) => (
                <Amenity
                  key={slug}
                  icon={amenityIcon(slug)}
                  label={amenityLabel(slug)}
                  selected
                  onClick={() => toggleAmenity(slug)}
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

        <input
          className={styles.amenitySearch}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search amenities"
        />

        {groups.map((group) => {
          const isOpen = query.length > 0 || openCategories.includes(group.category)

          return (
            <div key={group.category}>
              <button
                type="button"
                className={styles.amenityCategoryHeader}
                onClick={() => toggleCategory(group.category)}
              >
                <span>{group.category}</span>
                <span>{group.slugs.length}</span>
              </button>

              {isOpen && (
                <div className={styles.amenityGrid}>
                  {group.slugs.map((slug) => (
                    <Amenity
                      key={slug}
                      icon={amenityIcon(slug)}
                      label={amenityLabel(slug)}
                      onClick={() => toggleAmenity(slug)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
