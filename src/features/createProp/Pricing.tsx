import styles from './CreateProperty.module.css'
import type { PricingInfo } from './CreateProperty'
import type { ChangeEvent, Dispatch, KeyboardEvent, SetStateAction } from 'react'
import { Label } from '@/components/core/Label'
import { Input } from '@/components/core/Input'
import { Select } from '@/components/core/Select'

const optionalLabel = <span className={styles.optionalFieldLabel}>(optional)</span>

const disallowedNumberKeys = new Set(['-', '+', 'e', 'E'])

export default function Pricing({
  pricingInfo,
  setPricingInfo,
}: {
  pricingInfo: PricingInfo
  setPricingInfo: Dispatch<SetStateAction<PricingInfo>>
}) {
  const handleNumberKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (disallowedNumberKeys.has(event.key)) {
      event.preventDefault()
    }
  }

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

  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>Pricing</h3>
      <div className={styles.formFields}>
        <div className={styles.inputCombTitle}>
          <p>Pricing Info</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Base Price</Label>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.base}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  base: getPositiveNumber(e.target.value),
                }))
              }
            />
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Price For Extra Person {optionalLabel}</Label>
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
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Weekly Discount {optionalLabel}</Label>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.weeklyDisc}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  weeklyDisc: getPositiveNumber(e.target.value),
                }))
              }
            />
          </div>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>Monthly Discount {optionalLabel}</Label>
            <Input
              className={styles.inputField}
              type="number"
              min={0}
              value={pricingInfo.monthlyDisc}
              onFocus={handleNumberFocus}
              onKeyDown={handleNumberKeyDown}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPricingInfo((prev) => ({
                  ...prev,
                  monthlyDisc: getPositiveNumber(e.target.value),
                }))
              }
            />
          </div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}>
              Refundable Damage Deposit Fee {optionalLabel}
            </Label>
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
            <Label className={styles.inputLabel}>
              Apply Price For Extra Person After {optionalLabel}
            </Label>
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
