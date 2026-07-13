import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ComponentRef } from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cx } from '@/lib/cx'
import styles from './Separator.module.css'
export const Separator = forwardRef<
  ComponentRef<typeof SeparatorPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(function Separator({ className, orientation = 'horizontal', decorative = true, ...props }, ref) {
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      orientation={orientation}
      decorative={decorative}
      className={cx(
        styles.separator,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        className,
      )}
      {...props}
    />
  )
})
