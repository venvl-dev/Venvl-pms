import React from 'react'
import { Icon } from './Icon'
import styles from './ButtonProps.module.css'
import { cx } from '../../lib/cx'

const ICON_SIZE: Record<string, number> = { sm: 16, md: 18, lg: 20 }

type ButtonProps = {
  children?: React.ReactNode
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: string
  fullWidth?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}: ButtonProps) {
  const iconSize = ICON_SIZE[size] ?? ICON_SIZE.md

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        styles.btn,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...rest}
    >
      {icon && <Icon name={icon} size={iconSize} strokeWidth={2.25} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} strokeWidth={2.25} />}
    </button>
  )
}
