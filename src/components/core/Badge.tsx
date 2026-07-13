import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './Badge.module.css'

export type BadgeVariant =
  'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info'

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  default: styles.default,
  secondary: styles.secondary,
  outline: styles.outline,
  success: styles.success,
  warning: styles.warning,
  destructive: styles.destructive,
  info: styles.info,
}

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant
}
export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <div className={cx(styles.badge, VARIANT_CLASS[variant], className)} {...props}>
      {children}
    </div>
  )
}
