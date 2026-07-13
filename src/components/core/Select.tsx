import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from '@/lib/cx'
import styles from './Select.module.css'
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <div className={styles.wrap}>
      <select ref={ref} className={cx(styles.select, className)} {...props}>
        {children}
      </select>
      <ChevronDown size={16} className={styles.chevron} aria-hidden />
    </div>
  )
})
