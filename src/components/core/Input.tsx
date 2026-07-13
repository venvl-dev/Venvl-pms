import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './Input.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...props },
  ref,
) {
  return <input ref={ref} className={cx(styles.input, className)} {...props} />
})
