import { Label } from '@/components/core/Label'
import styles from './CreateProperty.module.css'
import { Textarea } from '@/components/core/Textarea'
import type { ChangeEvent, Dispatch, SetStateAction } from 'react'

export default function Instructions({
  instructions,
  setInstructions,
}: {
  instructions: string
  setInstructions: Dispatch<SetStateAction<string>>
}) {
  return (
    <div className={styles.formSection}>
      <h3 className={styles.formTitle}>Instructions</h3>
      <div className={styles.formFields}>
        <div className={styles.inputCombTitle}>
          <p>Instructions For Guests</p>
          <div className={styles.titleUnderLine}></div>
        </div>
        <div className={styles.inputsCombine}>
          <div className={styles.inputFieldContainer}>
            <Label className={styles.inputLabel}></Label>
            <Textarea
              value={instructions}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
              className={styles.inputField}
              placeholder="  Give Instructions to Guests"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
