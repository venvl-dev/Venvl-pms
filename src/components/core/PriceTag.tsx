import styles from './PriceTag.module.css'
import { cx } from '../../lib/cx'

type PriceTagProps = {
  amount: number | string
  currency?: string
  unit?: string
  note?: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'right'
  className?: string
}

export function PriceTag({
  amount,
  currency = '$',
  unit = 'night',
  note,
  size = 'md',
  align = 'left',
  className = '',
}: PriceTagProps) {
  return (
    <div
      className={cx(styles.priceTag, styles[size], align === 'right' && styles.right, className)}
    >
      <div className={styles.row}>
        <span className={styles.amount}>
          {currency}
          {typeof amount === 'number' ? amount.toLocaleString() : amount}
        </span>
        {unit && <span className={styles.unit}>/{unit}</span>}
      </div>
      {note && <span className={styles.note}>{note}</span>}
    </div>
  )
}
