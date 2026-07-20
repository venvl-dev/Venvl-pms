import {
  Check,
  Wifi,
  AirVent,
  UtensilsCrossed,
  Waves,
  Car,
  WashingMachine,
  Tv,
  type LucideIcon,
} from 'lucide-react'

type IconProps = {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

const ICONS: Record<string, LucideIcon> = {
  check: Check,
  wifi: Wifi,
  'air conditioning': AirVent,
  kitchen: UtensilsCrossed,
  pool: Waves,
  parking: Car,
  washer: WashingMachine,
  tv: Tv,
}

export function Icon({ name, size = 20, strokeWidth = 2, color = "currentColor", className = "" }: IconProps) {
  const LucideComp = ICONS[name.toLowerCase()] ?? Check
  return <LucideComp size={size} strokeWidth={strokeWidth} color={color} className={className} />
}
