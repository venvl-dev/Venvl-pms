import { Check, Circle, type LucideIcon } from 'lucide-react'
import {
  Anchor, Armchair, Baby, Bath, Bell, Bike, Building2, Car, Cctv, CircleAlert,
  Coffee, CookingPot, Droplets, Dumbbell, Eye, Fan, Flame, Flower2, Gamepad2,
  KeyRound, Laptop, Lock, Luggage, MapPin, Microwave, Mountain, Music,
  Refrigerator, Shirt, ShowerHead, Siren, Snowflake, Sparkles, Sun, Tent,
  Thermometer, Trees, Tv, Umbrella, Utensils, UtensilsCrossed, WashingMachine,
  Waves, Wifi, Wine, Zap,
} from 'lucide-react'
import styles from './CreateProperty.module.css'

export const AMENITY_CATEGORIES: { category: string; slugs: string[] }[] = [
  { category: 'Bathroom', slugs: ['bathtub','hair_dryer','cleaning_products','shampoo','conditioner','body_soap','shower_gel','hot_water'] },
  { category: 'Bedroom and laundry', slugs: ['washer','dryer','essentials','hangers','bed_linens','extra_pillows_and_blankets','room_darkening_shades','iron','drying_rack_for_clothing','clothing_storage','safe'] },
  { category: 'Entertainment', slugs: ['tv','cable_tv','ethernet_connection','sound_system','game_console','books_and_reading_material','piano','exercise_equipment'] },
  { category: 'Family', slugs: ['crib','high_chair','pack_n_play_travel_crib','children_books_and_toys','baby_safety_gates','baby_bath','board_games','babysitter_recommendations','changing_table','outlet_covers','window_guards','table_corner_guards'] },
  { category: 'Heating and cooling', slugs: ['air_conditioning','heating','ceiling_fan','portable_fans','indoor_fireplace'] },
  { category: 'Home safety', slugs: ['smoke_alarm','carbon_monoxide_alarm','fire_extinguisher','first_aid_kit','security_cameras'] },
  { category: 'Internet and office', slugs: ['wifi','dedicated_workspace'] },
  { category: 'Kitchen and dining', slugs: ['kitchen','kitchenette','refrigerator','freezer','microwave','cooking_basics','dishes_and_silverware','dishwasher','stove','oven','hot_water_kettle','coffee_maker','wine_glasses','toaster','baking_sheet','blender','barbecue_utensils','dining_table'] },
  { category: 'Location features', slugs: ['private_entrance','waterfront','lake_access','beach_access','ski_in_ski_out','laundromat_nearby','resort_access'] },
  { category: 'Outdoor', slugs: ['patio_or_balcony','backyard','fire_pit','outdoor_furniture','outdoor_dining_area','bbq_grill','hammock','beach_essentials','bikes','kayak','boat_slip','outdoor_shower'] },
  { category: 'Parking and facilities', slugs: ['free_parking_on_premises','free_street_parking','paid_parking_on_premises','paid_parking_off_premises','ev_charger','gym','pool','private_pool','hot_tub','sauna','single_level_home','elevator'] },
  { category: 'Services', slugs: ['luggage_dropoff_allowed','long_term_stays_allowed','self_check_in','lockbox','smart_lock','keypad','building_staff','host_greets_you','cleaning_available_during_stay','breakfast'] },
  { category: 'Scenic views', slugs: ['mountain_view','ocean_view','sea_view','lake_view','garden_view','city_skyline_view','pool_view','valley_view','courtyard_view','bay_view','beach_view','canal_view','desert_view','golf_course_view','harbor_view','park_view','resort_view','river_view','vineyard_view'] },
]

const LABEL_OVERRIDES: Record<string, string> = {
  wifi: 'WiFi',
  tv: 'TV',
  cable_tv: 'Cable TV',
  bbq_grill: 'BBQ grill',
  ev_charger: 'EV charger',
  ski_in_ski_out: 'Ski-in/ski-out',
  pack_n_play_travel_crib: "Pack 'n play travel crib",
  children_books_and_toys: "Children's books and toys",
  luggage_dropoff_allowed: 'Luggage drop-off allowed',
  long_term_stays_allowed: 'Long-term allowed',
}

export const amenityLabel = (slug: string) =>
  LABEL_OVERRIDES[slug] ?? slug.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Bathroom': ShowerHead,
  'Bedroom and laundry': Shirt,
  'Entertainment': Tv,
  'Family': Baby,
  'Heating and cooling': Thermometer,
  'Home safety': Siren,
  'Internet and office': Wifi,
  'Kitchen and dining': UtensilsCrossed,
  'Location features': MapPin,
  'Outdoor': Trees,
  'Parking and facilities': Car,
  'Services': Bell,
  'Scenic views': Eye,
}

const AMENITY_ICONS: Record<string, LucideIcon> = {
  bathtub: Bath, hot_water: Droplets, hair_dryer: Fan,
  washer: WashingMachine, dryer: WashingMachine, safe: Lock,
  tv: Tv, sound_system: Music, game_console: Gamepad2, exercise_equipment: Dumbbell,
  air_conditioning: Snowflake, heating: Thermometer, ceiling_fan: Fan, indoor_fireplace: Flame,
  smoke_alarm: CircleAlert, carbon_monoxide_alarm: CircleAlert,
  fire_extinguisher: Flame, security_cameras: Cctv,
  wifi: Wifi, dedicated_workspace: Laptop,
  kitchen: UtensilsCrossed, kitchenette: Utensils, refrigerator: Refrigerator,
  freezer: Snowflake, microwave: Microwave, cooking_basics: CookingPot,
  stove: Flame, oven: CookingPot, coffee_maker: Coffee, hot_water_kettle: Coffee,
  wine_glasses: Wine, dining_table: Armchair,
  private_entrance: KeyRound, waterfront: Waves, beach_access: Umbrella,
  patio_or_balcony: Armchair, backyard: Trees, fire_pit: Flame,
  outdoor_furniture: Armchair, outdoor_dining_area: Utensils, bbq_grill: Flame,
  hammock: Tent, bikes: Bike, kayak: Anchor, boat_slip: Anchor, outdoor_shower: ShowerHead,
  free_parking_on_premises: Car, free_street_parking: Car,
  paid_parking_on_premises: Car, paid_parking_off_premises: Car,
  ev_charger: Zap, gym: Dumbbell, pool: Waves, private_pool: Waves,
  hot_tub: Bath, sauna: Sparkles, elevator: Building2,
  self_check_in: KeyRound, lockbox: Lock, smart_lock: Lock, keypad: Lock,
  building_staff: Bell, luggage_dropoff_allowed: Luggage, breakfast: Coffee,
  mountain_view: Mountain, ocean_view: Waves, sea_view: Waves, lake_view: Waves,
  garden_view: Flower2, city_skyline_view: Building2, pool_view: Waves,
  valley_view: Mountain, beach_view: Umbrella, desert_view: Sun,
  park_view: Trees, river_view: Waves, harbor_view: Anchor, bay_view: Anchor,
  crib: Baby, high_chair: Baby, baby_bath: Baby, board_games: Gamepad2,
}

const SLUG_TO_CATEGORY = new Map(
  AMENITY_CATEGORIES.flatMap((g) => g.slugs.map((s) => [s, g.category] as const)),
)

export function amenityIcon(slug: string): LucideIcon {
  return (
    AMENITY_ICONS[slug] ??
    CATEGORY_ICONS[SLUG_TO_CATEGORY.get(slug) ?? ''] ??
    Sparkles
  )
}



type AmenityProps = {
  icon?: LucideIcon
  label: string
  selected?: boolean
  onClick?: () => void
}

export default function Amenity({ icon: Icon, label, selected = false, onClick }: AmenityProps) {
  return (
    <button type="button" className={styles.amenityCard} onClick={onClick}>
      <div className={styles.amenityContent}>
        <div className={styles.amenityIconWrap}>{Icon ? <Icon size={18} /> : null}</div>
        <span className={styles.amenityLabel}>{label}</span>
      </div>
      <div className={`${styles.amenityToggle} ${selected ? styles.amenityToggleSelected : ''}`}>
        {selected ? <Check size={16} /> : <Circle size={16} />}
      </div>
    </button>
  )
}
