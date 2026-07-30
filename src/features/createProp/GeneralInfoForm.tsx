import { Label } from '@/components/core/Label'
import type { GeneralInfo } from './CreateProperty'
import styles from './CreateProperty.module.css'
import { Input } from '@/components/core/Input'
import { Textarea } from '@/components/core/Textarea'
import type { PropTypes } from './CreateProperty'
import type { UnitTypes } from './CreateProperty'
import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from 'react'
import { Select } from '@/components/core/Select'
import { Country, City } from 'country-state-city'
import { useProperties } from '../properties/hooks'

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
                  propType: e.target.value as PropTypes,
                }))
              }
              value={generalInfo.propType as PropTypes}
            >
              <option value={'Apartment'}>Apartment</option>
              <option value={'Villa'}>Villa</option>
              <option value={'Loft'}>Loft</option>
              <option value={'Twin House'}>Twin House</option>
              <option value={'Pent House'}>Pent House</option>
              <option value={'Other'}>Other</option>
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
                  unitType: e.target.value as UnitTypes,
                }))
              }
              value={generalInfo.unitType as UnitTypes}
            >
              <option value={'Single'}>Single</option>
              <option value={'Parent'}>Parent</option>
              <option value={'Child'}>Child</option>
            </Select>
          </div>
          {generalInfo.unitType === 'Child' ? (
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
        </div>
        <div className={styles.inputCombTitle}>
          <p>Guests</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Max. Adults</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  maxAdults: Number(e.target.value),
                }))
              }
              value={generalInfo.maxAdults}
            >
              <option value={1}>1 Adult</option>
              <option value={2}>2 Adults</option>
              <option value={3}>3 Adults</option>
              <option value={4}>4 Adults</option>
              <option value={5}>5 Adults</option>
              <option value={6}>6 Adults</option>
              <option value={7}>7 Adults</option>
              <option value={8}>8 Adults</option>
              <option value={9}>9 Adults</option>
              <option value={10}>10 Adults</option>
            </Select>
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Max. Childs</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  maxChilds: Number(e.target.value),
                }))
              }
              value={generalInfo.maxChilds}
            >
              <option value={10}>Not Specified</option>
              <option value={0}>0 Childs</option>
              <option value={1}>1 Child</option>
              <option value={2}>2 Childs</option>
              <option value={3}>3 Childs</option>
              <option value={4}>4 Childs</option>
              <option value={5}>5 Childs</option>
            </Select>
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Max. Infants</Label>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  maxInfs: Number(e.target.value),
                }))
              }
              value={generalInfo.maxInfs}
            >
              <option value={10}>Not Specified</option>
              <option value={0}>0 Infants</option>
              <option value={1}>1 Infant</option>
              <option value={2}>2 Infants</option>
              <option value={3}>3 Infants</option>
              <option value={4}>4 Infants</option>
              <option value={5}>5 Infants</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
