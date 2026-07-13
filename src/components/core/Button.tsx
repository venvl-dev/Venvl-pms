import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cx } from '@/lib/cx'
import styles from './Button.module.css'

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'default' | 'lg' | 'icon'

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  default: styles.variantDefault,
  destructive: styles.variantDestructive,
  outline: styles.variantOutline,
  secondary: styles.variantSecondary,
  ghost: styles.variantGhost,
  link: styles.variantLink,
}
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: styles.sm,
  default: styles.default,
  lg: styles.lg,
  icon: styles.icon,
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', size = 'default', asChild = false, className, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cx(styles.button, VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      {...props}
    />
  )
})
