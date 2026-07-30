import { X, Calendar as CalendarIcon, MapPin } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import type { DashboardReservation } from './mockData'
import styles from './DashboardView.module.css'

interface Props {
  reservation: DashboardReservation
  onClose: () => void
  onNavigate: () => void
}

export function ReservationDrawer({ reservation, onClose, onNavigate }: Props) {
  return (
    <div className={styles.drawerOverlay} onClick={onClose}>
      <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 className={styles.title}>{reservation.guestName}</h3>
            <div style={{ marginTop: '4px' }}>
              <Badge variant="outline" style={{ textTransform: 'capitalize' }}>
                {reservation.status.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} style={{ margin: '-8px -8px 0 0' }}>
            <X size={20} />
          </Button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <MapPin size={18} className="text-muted-foreground" />
            <div>
              <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                {reservation.propertyName}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                {reservation.unitName}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <CalendarIcon size={18} className="text-muted-foreground" />
            <div style={{ fontSize: 'var(--text-sm)' }}>
              {reservation.checkIn} — {reservation.checkOut}
            </div>
          </div>

        </div>

        <div style={{ background: 'var(--muted)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Total Amount</span>
            <span style={{ fontWeight: 500 }}>${reservation.totalAmount}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Balance Due</span>
            {reservation.balanceDue > 0 ? (
              <Badge variant="warning">${reservation.balanceDue}</Badge>
            ) : (
              <Badge variant="success">Paid</Badge>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)' }}>
            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>Channel</span>
            <span style={{ textTransform: 'capitalize', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              {reservation.channel}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-6)' }}>
          <Button variant="default" style={{ width: '100%' }} onClick={onNavigate}>
            View Full Details
          </Button>
        </div>

      </div>
    </div>
  )
}