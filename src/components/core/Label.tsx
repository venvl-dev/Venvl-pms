import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cx } from '@/lib/cx'
import styles from './Label.module.css'
import type { ComponentPropsWithoutRef } from 'react'

export const Label = forwardRef<
  HTMLLabelElement,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(function Label({ className, ...props }, ref) {
  return <LabelPrimitive.Root ref={ref} className={cx(styles.label, className)} {...props} />
})
