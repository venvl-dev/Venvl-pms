import { cx } from '@/lib/cx'
import styles from './Icon.module.css'
import {
  AirVent,
  Bath,
  BedDouble,
  Blinds,
  Car,
  Check,
  CircleCheck,
  CircleDollarSign,
  Cog,
  Droplets,
  Grid2x2,
  Heart,
  Images,
  Info,
  MapPin,
  Shirt,
  Sparkles,
  Star,
  Thermometer,
  Tv,
  UsersRound,
  UtensilsCrossed,
  Waves,
  Wifi,
  Wind,
  WashingMachine,
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
  air_conditioning: AirVent,
  kitchen: UtensilsCrossed,
  pool: Waves,
  bed: BedDouble,
  bath: Bath,
  parking: Car,
  washer: WashingMachine,
  dryer: WashingMachine,
  tv: Tv,
  users: UsersRound,
  bathtub: Bath,
  hair_dryer: Wind,
  hot_water: Thermometer,
  shampoo: Droplets,
  conditioner: Droplets,
  body_soap: Droplets,
  shower_gel: Droplets,
  cleaning_products: Sparkles,
  essentials: Sparkles,
  hangers: Shirt,
  iron: Shirt,
  drying_rack_for_clothing: Shirt,
  bed_linens: BedDouble,
  extra_pillows_and_blankets: BedDouble,
  room_darkening_shades: Blinds,
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
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      className={cx(styles.icon, filled && styles.filled, className)}
      fill={filled ? color : 'none'}
    />
  )
}
