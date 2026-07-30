import React from 'react'
import {
  AirVent,
  Car,
  Check,
  Heart,
  MapPin,
  Star,
  Tv,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wifi,
  BedDouble,
  Bath,
  type LucideIcon,
} from 'lucide-react'
import styles from './IconProps.module.css'
import { cx } from '../../lib/cx'
type IconProps = {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
  filled?: boolean
  className?: string
}

type IconVars = React.CSSProperties & {
  '--icon-size': string
  '--icon-color': string
}

const ICONS: Record<string, LucideIcon> = {
  star: Star,
  heart: Heart,
  'map-pin': MapPin,
  check: Check,
  wifi: Wifi,
  'air conditioning': AirVent,
  kitchen: UtensilsCrossed,
  pool: Waves,
  parking: Car,
  bed: BedDouble,
  bath: Bath,
  washer: WashingMachine,
  tv: Tv,
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = 'currentColor',
  filled = false,
  className = '',
}: IconProps) {
  const IconComponent = ICONS[name.toLowerCase()] ?? Check

  const vars: IconVars = {
    '--icon-size': `${size}px`,
    '--icon-color': color,
  }

  return (
    <span
      aria-hidden="true"
      className={cx(styles.icon, filled && styles.filled, className)}
      style={vars}
    >
      <IconComponent
        name={name}
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        fill={filled ? color : 'none'}
      />
    </span>
  )
}
