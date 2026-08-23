import { Calendar } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { cx } from '@/lib/cx'
import styles from './DashboardView.module.css'
import type { Reservation } from '@/features/reservations/types'

const getInitials = (name: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

interface Props {
  item: Reservation
  onClick: (item: Reservation) => void
}

export function ReservationRow({ item, onClick }: Props) {
  const guestName = item.customer?.name || 'Unknown Guest'
  const propertyName = item.listing?.name || 'Unknown Property'

  return (
    <div className={cx(styles.row, styles.rowInteractive)} onClick={() => onClick(item)}>
      <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', width: '100%' }}>
        <div className={styles.guestAvatar}>{getInitials(guestName)}</div>
        <div className={styles.rowDetails}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className={styles.rowPrimary}>{guestName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Button
                variant="secondary"
                size="icon"
                aria-label="View in Calendar"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log(`Navigate to calendar for ${item.id}`)
                }}
              >
                <Calendar size={14} />
              </Button>
            </div>
          </div>
          <div className={styles.rowMeta}>
            <span>{propertyName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}