import { Label } from '@/components/core/Label'
import {
  PROPERTY_TYPES,
  STRUCTURE_TYPES,
  type GeneralInfo,
  type PropertyType,
  type StructureType,
} from './types'
import styles from './CreateProperty.module.css'
import { Input } from '@/components/core/Input'
import { Textarea } from '@/components/core/Textarea'
import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { Select } from '@/components/core/Select'
import { Country, City } from 'country-state-city'
import { useProperties } from '../properties/hooks'

const optionLabel = (slug: string) => slug.charAt(0).toUpperCase() + slug.slice(1)

export default function GeneralInfoForm({
  generalInfo,
  setGeneralInfo,
}: {
  generalInfo: GeneralInfo
  setGeneralInfo: Dispatch<SetStateAction<GeneralInfo>>
}) {
  const { data } = useProperties()
  const countries = Country.getAllCountries()
  const [countryCode, setCountryCode] = useState('EG')
  const [cities, setCities] = useState(City.getCitiesOfCountry('EG'))
  useEffect(() => {
    setCities(City.getCitiesOfCountry(countryCode))
  }, [countryCode])
  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>General Information</h3>
      <div className={styles.formFields}>
        <div className={styles.inputCombTitle}>
          <p>Property Info</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Property Title</Label>
            <Input
              className={styles.inputField}
              type="text"
              placeholder="Ex: Desert Oasis Lodge"
              value={generalInfo.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

          </div>

          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Property Type</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  propType: e.target.value as PropertyType,
                }))
              }
              value={generalInfo.propType ?? ''}
            >
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {optionLabel(type)}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Unit Type</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  unitType: e.target.value as StructureType,
                }))
              }
              value={generalInfo.unitType ?? ''}
            >
              {STRUCTURE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {optionLabel(type)}
                </option>
              ))}
            </Select>
          </div>
          {generalInfo.unitType === 'child' ? (
            <div className={styles.inputFieldContainer}>
              <Label className={styles.inputLabel}>Parent Listing</Label>
              <Select
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setGeneralInfo((prev) => ({
                    ...prev,
                    parent: e.target.value,
                  }))
                }
                value={generalInfo.parent as string}
              >
                {data?.data
                  .filter((prop) => prop.type === 'parent')
                  .map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.name}
                    </option>
                  ))}
              </Select>
            </div>
          ) : (
            <div className={`${styles.inputFieldContainer} ${styles.hide}`}></div>
          )}
        </div>

        <div className={styles.inputFieldContainer} style={{ width: '100%' }}>
          <Label className={styles.inputLabel}>Description</Label>
          <Textarea
            className={styles.inputField}
            placeholder="Describe your property"
            value={generalInfo.desc}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setGeneralInfo((prev) => ({
                ...prev,
                desc: e.target.value,
              }))
            }
          />
        </div>
        <div className={styles.inputCombTitle}>
          <p>Address</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Country</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setGeneralInfo((prev) => ({
                  ...prev,
                  country: e.target.value,
                }))
                setCountryCode(e.target.value)
              }}
              value={countryCode}
            >
              {countries.map((country) => {
                return (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                )
              })}
            </Select>
          </div>

          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>City</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              value={generalInfo.city || 'Cairo'}
            >
              {cities?.map((city) => (
                <option key={city.latitude} value={city.name}>
                  {city.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.inputFieldContainer}>
          <Label className={styles.inputLabel}>Address</Label>
          <Input
            className={styles.inputField}
            type="text"
            placeholder="Ex: Mohamed Nagiub, New Cairo"
            value={generalInfo.address}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setGeneralInfo((prev) => ({
                ...prev,
                address: e.target.value,
              }))
            }
          />
        </div>

        <div className={styles.inputCombTitle}>
          <p>Facilities</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Bedrooms</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  bedrooms: Number(e.target.value),
                }))
              }
              value={generalInfo.bedrooms}
            >
              <option value={0}>0 Bedrooms</option>
              <option value={1}>1 Bedroom</option>
              <option value={2}>2 Bedrooms</option>
              <option value={3}>3 Bedrooms</option>
              <option value={4}>4 Bedrooms</option>
              <option value={5}>5 Bedrooms</option>
              <option value={6}>6 Bedrooms</option>
              <option value={7}>7 Bedrooms</option>
              <option value={8}>8 Bedrooms</option>
              <option value={9}>9 Bedrooms</option>
              <option value={10}>10 Bedrooms</option>
            </Select>
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Bathrooms</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  bathrooms: Number(e.target.value),
                }))
              }
              value={generalInfo.bathrooms}
            >
              <option value={0}>0 Bathrooms</option>
              <option value={1}>1 Bathroom</option>
              <option value={2}>2 Bathrooms</option>
              <option value={3}>3 Bathrooms</option>
              <option value={4}>4 Bathrooms</option>
              <option value={5}>5 Bathrooms</option>
              <option value={6}>6 Bathrooms</option>
              <option value={7}>7 Bathrooms</option>
              <option value={8}>8 Bathrooms</option>
              <option value={9}>9 Bathrooms</option>
              <option value={10}>10 Bathrooms</option>
            </Select>
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Area (m²)</Label>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              placeholder="Ex: 120"
              value={generalInfo.area}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  area: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)),
                }))
              }
            />
          </div>
        </div>
        <div className={styles.inputCombTitle}>
          <p>Guests</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Max. Occupancy</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  maxOccupancy: Number(e.target.value),
                }))
              }
              value={generalInfo.maxOccupancy}
            >
              <option value={1}>1 Guest</option>
              <option value={2}>2 Guests</option>
              <option value={3}>3 Guests</option>
              <option value={4}>4 Guests</option>
              <option value={5}>5 Guests</option>
              <option value={6}>6 Guests</option>
              <option value={7}>7 Guests</option>
              <option value={8}>8 Guests</option>
              <option value={9}>9 Guests</option>
              <option value={10}>10 Guests</option>
            </Select>
          </div>
          <div className={`${styles.inputFieldContainer} ${styles.hide}`}></div>
        </div>
      </div>
    </div>
  )
}
