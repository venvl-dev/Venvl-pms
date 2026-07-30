import React from 'react'
import { Icon } from './Icon'
import styles from './Tag.module.css'
import { cx } from '../../lib/cx'

type TagProps = {
  children?: React.ReactNode
  icon?: string
  variant?: string
  className?: string
  size?: number
}

export function Tag({ children, icon, variant = 'outline', className = '', size = 15 }: TagProps) {
  return (
    <span className={cx(styles.tag, styles[variant], className)}>
      {icon && <Icon name={icon} size={size} strokeWidth={2} color="var(--ring)" />}
      {children}
    </span>
  )
}
