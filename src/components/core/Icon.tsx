import { cx } from '@/lib/cx'
import styles from './Icon.module.css'
import {
  AirVent,
  Car,
  Check,
  Heart,
  MapPin,
  Star,
  Bath,
  BedDouble,
  Tv,
  UsersRound,
  UtensilsCrossed,
  Waves,
  Wifi,
  WashingMachine,
  Info,
  Grid2x2,
  Images,
  CircleDollarSign,
  Cog,
  CircleCheck,
  type LucideIcon,
} from 'lucide-react'

type IconProps = {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
  filled?: boolean
  className?: string
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
  bed: BedDouble,
  bath: Bath,
  parking: Car,
  washer: WashingMachine,
  tv: Tv,
  users: UsersRound,
  'general info': Info,
  amenities: Grid2x2,
  photos: Images,
  pricing: CircleDollarSign,
  instructions: Cog,
  donetab: CircleCheck,
}

export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = 'currentColor',
  filled = false,
  className = '',
}: IconProps) {
  const normalizedKey = name ? name.toLowerCase().trim() : 'check'
  const LucideComp = ICONS[normalizedKey] ?? Check
  return (
    <LucideComp
      name={name}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={cx(styles.icon, filled && styles.filled, className)}
      fill={filled ? color : 'none'}
    />
  )
}
