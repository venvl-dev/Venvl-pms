import {
  Check, Wifi, AirVent, UtensilsCrossed, Waves, Car, WashingMachine, Tv,
  Bath, Wind, Droplets, Shirt, Thermometer, BedDouble, Blinds, Sparkles,
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
  air_conditioning: AirVent,
  kitchen: UtensilsCrossed,
  pool: Waves,
  parking: Car,
  washer: WashingMachine,
  dryer: WashingMachine,
  tv: Tv,
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
}


export function Icon({ name, size = 20, strokeWidth = 2, color = "currentColor", className = "" }: IconProps) {
  const LucideComp = ICONS[name.toLowerCase()] ?? Check
  return <LucideComp size={size} strokeWidth={strokeWidth} color={color} className={className} />
}
