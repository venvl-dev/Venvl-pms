import styles from './CreateProperty.module.css'
import type { PricingInfo, PropertyCardProps } from './CreateProperty'
import type { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from 'react'
import { Label } from '@/components/core/Label'
import { Input } from '@/components/core/Input'
import { Select } from '@/components/core/Select'

const optionalLabel = <span className={styles.optionalFieldLabel}>(optional)</span>

const disallowedNumberKeys = new Set(['-', '+', 'e', 'E'])

export default function Pricing({
  pricingInfo,
  setPricingInfo,
  setPropInfo,
}: {
  pricingInfo: PricingInfo
  setPricingInfo: Dispatch<SetStateAction<PricingInfo>>
  setPropInfo: Dispatch<SetStateAction<PropertyCardProps>>
}) {
  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disallowedNumberKeys.has(event.key)) {
      event.preventDefault()
    }
  }
  // const handleMaxPercentage = (event: ChangeEvent<HTMLInputElement>) => {
  //   if (Number(event.target.value) > 100) {
  //     event.preventDefault()
  //     event.target.setV
  //   }
  // }

  const handleNumberFocus = (
    event: ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
  ) => {
    if (event.target.value === '0') {
      event.target.select()
    }
  }

  const getPositiveNumber = (value: string) => {
    if (value === '') {
      return 0
    }

    return Math.max(0, Number(value))
  }

  const handleMaxPercentage = (event: ChangeEvent<HTMLInputElement>, type: string) => {
    const input = event.target.value
    if (input === '') {
      if (type === 'week') {
        setPricingInfo((prev) => ({ ...prev, weeklyDisc: '' }))
      } else {
        setPricingInfo((prev) => ({ ...prev, monthlyDisc: '' }))
      }
      return
    }

    const num = parseFloat(input)
    const clampedValue = Math.min(Math.max(num, 0), 100)
    if (type === 'week') {
      setPricingInfo((prev) => ({ ...prev, weeklyDisc: clampedValue }))
    } else {
      setPricingInfo((prev) => ({ ...prev, monthlyDisc: clampedValue }))
    }
  }

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>Pricing</h3>
      <div className={styles.formFields}>
        <div className={styles.inputCombTitle}>
          <p>Pricing Info</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={`${styles.inputsCombine} ${styles.pricingPhone}`}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Base Price</Label>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.base}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPricingInfo((prev) => ({
                  ...prev,
                  base: getPositiveNumber(e.target.value),
                }))
                setPropInfo((prev) => ({ ...prev, price: Number(e.target.value) }))
              }}
            />
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Price For Extra Person</Label>
            <span className={styles.optionalLabel}>{optionalLabel}</span>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.extraPerson}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  extraPerson: getPositiveNumber(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className={`${styles.inputsCombine} ${styles.pricingPhone}`}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Weekly Discount</Label>
            <span className={styles.optionalLabel}>{optionalLabel}</span>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              max={100}
              value={pricingInfo.weeklyDisc}
              onFocus={handleNumberFocus}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                handleNumberKeyDown(event)
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleMaxPercentage(e, 'week')
              }}
            />
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Monthly Discount</Label>
            <span className={styles.optionalLabel}>{optionalLabel}</span>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              max={100}
              value={pricingInfo.monthlyDisc}
              onFocus={handleNumberFocus}
              onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                handleNumberKeyDown(event)
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleMaxPercentage(e, 'month')
              }}
            />
          </div>
        </div>
        <div className={`${styles.inputsCombine} ${styles.pricingPhone}`}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Refundable Damage Deposit Fee</Label>
            <span className={styles.optionalLabel}>{optionalLabel}</span>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.refundDamageDeposit}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  refundDamageDeposit: getPositiveNumber(e.target.value),
                }))
              }
            />
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Apply Price For Extra Person After</Label>
            <span className={styles.optionalLabel}>{optionalLabel}</span>
            <Select
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  applyExtraAfter: Number(e.target.value),
                }))
              }
              value={pricingInfo.applyExtraAfter}
            >
              <option value={0}>0 Days</option>
              <option value={1}>1 Day</option>
              <option value={2}>2 Days</option>
              <option value={3}>3 Days</option>
              <option value={4}>4 Days</option>
              <option value={5}>5 Days</option>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
