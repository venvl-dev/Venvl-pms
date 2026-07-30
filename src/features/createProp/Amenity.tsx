import { Check, Circle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import styles from './CreateProperty.module.css'

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
