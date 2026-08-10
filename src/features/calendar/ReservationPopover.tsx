import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import type { Reservation } from '@/features/reservations/types'
import { formatDate, formatCurrency, getStatusBadge } from '@/features/reservations/Constants'
import type { BookingChannel } from '@/types/domain'
import { getChannelConfig } from './Constants'
import styles from './MultiCalendarView.module.css'

interface Props {
  reservation: Reservation
  anchorRect: DOMRect
  onClose: () => void
  onNavigate: () => void
}

export function ReservationPopover({ reservation, anchorRect, onClose, onNavigate }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 10)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const POPOVER_WIDTH = 320
  const POPOVER_HEIGHT = 280 
  const SPACING = 8

  let top = anchorRect.bottom + SPACING
  let left = anchorRect.left + anchorRect.width / 2 - POPOVER_WIDTH / 2
  let transformOrigin = 'top center'

  if (left < 16) left = 16
  if (left + POPOVER_WIDTH > window.innerWidth - 16) {
    left = window.innerWidth - POPOVER_WIDTH - 16
  }

  if (top + POPOVER_HEIGHT > window.innerHeight) {
    top = anchorRect.top - POPOVER_HEIGHT - SPACING
    transformOrigin = 'bottom center'
  }

  const channel = (reservation.customer?.ota || 'direct') as BookingChannel
  const channelConfig = getChannelConfig(channel)
  const amount = reservation.amount || 0
  const balanceDue = 0 // Defaulting to 0 since backend doesn't provide balanceDue yet

  return (
    <div
      ref={popoverRef}
      className={styles.popoverCard}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        transformOrigin,
      }}
    >
      <div className={styles.popoverHeader}>
        <div>
          <div className={styles.popoverGuest}>{reservation.customer?.name || 'Unknown Guest'}</div>
          <div style={{ marginTop: '4px' }}>{getStatusBadge(reservation.status)}</div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} style={{ margin: '-8px -8px 0 0' }}>
          <X size={16} />
        </Button>
      </div>

      <div className={styles.popoverGrid}>
        <div className={styles.popoverRow}>
          <span className={styles.popoverLabel}>Dates</span>
          <span className={styles.popoverValue}>
            {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
          </span>
        </div>
        
        <div className={styles.popoverRow}>
          <span className={styles.popoverLabel}>Unit</span>
          <span className={styles.popoverValue}>
            {reservation.listing?.name || 'Unknown Property'}
          </span>
        </div>

        <div className={styles.popoverRow}>
          <span className={styles.popoverLabel}>Channel</span>
          <span className={styles.popoverValue} style={{ textTransform: 'capitalize' }}>
            <img
              src={channelConfig.logo}
              alt=""
              style={{ width: '16px', height: '16px', borderRadius: '50%' }}
            />
            {channel}
          </span>
        </div>

        <div className={styles.popoverRow}>
          <span className={styles.popoverLabel}>Total</span>
          <span className={styles.popoverValue}>{formatCurrency(amount)}</span>
        </div>
      </div>

      <div className={styles.popoverFooter}>
        {balanceDue > 0 ? (
          <Badge variant="warning">{formatCurrency(balanceDue)} Due</Badge>
        ) : (
          <Badge variant="success">Paid</Badge>
        )}
        <Button variant="default" size="sm" onClick={onNavigate}>
          More details
        </Button>
      </div>
    </div>
  )
}