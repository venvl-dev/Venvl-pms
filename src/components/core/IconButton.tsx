import React from 'react'
import { Icon } from './Icon'
import styles from './IconButton.module.css'
import { cx } from '../../lib/cx'

const ICON_SIZE: Record<string, number> = { sm: 18, md: 20, lg: 24 }

type IconButtonProps = {
  icon: string
  variant?: string
  size?: 'sm' | 'md' | 'lg'
  active?: boolean
  ariaLabel?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function IconButton({
  icon,
  variant = 'tonal',
  size = 'md',
  active = false,
  disabled = false,
  ariaLabel,
  onClick,
  className = '',
  ...rest
}: IconButtonProps) {
  const iconSize = ICON_SIZE[size] ?? ICON_SIZE.md

  return (
    <button
      type="button"
      aria-label={ariaLabel || icon}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        styles.iconBtn,
        styles[size],
        styles[variant],
        active && styles.active,
        className,
      )}
      {...rest}
    >
      <Icon name={icon} size={iconSize} strokeWidth={2.1} color="currentColor" />
    </button>
  )
}
