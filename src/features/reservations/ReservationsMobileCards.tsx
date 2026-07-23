import { Calendar, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import { Skeleton } from '@/components/core/Skeleton'
import type { Reservation } from './types'
import { getStatusBadge, formatDate, formatCurrency, renderChannel } from './Constants'
import styles from './ReservationsView.module.css'

interface Props {
  isLoading: boolean
  items: Reservation[]
  rowsPerPage: number
}

export function ReservationsMobileCards({ isLoading, items, rowsPerPage }: Props) {
  return (
    <div className={styles.mobileList}>
      {isLoading ? (
        Array.from({ length: rowsPerPage }).map((_, i) => (
          <div key={`mob-skeleton-${i}`} className={styles.mobileCardWrap}>
            <div className={styles.mobileCardHeader}>
              <div>
                <Skeleton style={{ height: '1.25rem', width: '120px', marginBottom: '4px' }} />
                <Skeleton style={{ height: '1rem', width: '160px' }} />
              </div>
              <Skeleton style={{ height: '1.5rem', width: '80px', borderRadius: '12px' }} />
            </div>
            <div className={styles.mobileCardGrid}>
              <div className={styles.mobileCardGridCol}>
                <Skeleton style={{ height: '10px', width: '80px', marginBottom: '4px' }} />
                <Skeleton style={{ height: '1.25rem', width: '100px', marginBottom: '2px' }} />
                <Skeleton style={{ height: '1rem', width: '80px' }} />
              </div>
              <div className={styles.mobileCardGridCol} style={{ alignItems: 'flex-end' }}>
                <Skeleton style={{ height: '10px', width: '60px', marginBottom: '4px' }} />
                <Skeleton style={{ height: '1.5rem', width: '70px', borderRadius: '12px' }} />
              </div>
            </div>
            <div className={styles.mobileCardFooter}>
              <div className={styles.mobileCardMeta}>
                <Skeleton style={{ height: '1rem', width: '60px', marginBottom: '2px' }} />
                <Skeleton style={{ height: '0.75rem', width: '40px' }} />
              </div>
              <div className={styles.mobileCardActions}>
                <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
                <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
              </div>
            </div>
          </div>
        ))
      ) : items.length === 0 ? (
        <div
          style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}
        >
          No reservations found matching your criteria.
        </div>
      ) : (
        items.map((res) => (
          <div key={res.id} className={styles.mobileCardWrap}>
            <div className={styles.mobileCardHeader}>
              <div>
                <div className={styles.mobileCardTitle}>{res.guestName}</div>
                <div className={styles.mobileCardProperty}>
                  {res.property} <span className={styles.mobileCardUnit}>• {res.unit}</span>
                </div>
              </div>
              <div>{getStatusBadge(res.status)}</div>
            </div>

            <div className={styles.mobileCardGrid}>
              <div className={styles.mobileCardGridCol}>
                <span className={styles.mobileCardLabel}>Check-in / Out</span>
                <span className={styles.mobileCardValue}>{formatDate(res.checkIn)}</span>
                <span
                  className={styles.mobileCardValue}
                  style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}
                >
                  to {formatDate(res.checkOut)}
                </span>
              </div>
              <div
                className={styles.mobileCardGridCol}
                style={{ alignItems: 'flex-end', textAlign: 'right' }}
              >
                <span className={styles.mobileCardLabel}>Balance Due</span>
                <span className={styles.mobileCardValue} style={{ marginTop: '2px' }}>
                  {res.balanceDue > 0 ? (
                    <Badge variant="warning">{formatCurrency(res.balanceDue)} Due</Badge>
                  ) : (
                    <Badge variant="success">Paid</Badge>
                  )}
                </span>
              </div>
            </div>

            <div className={styles.mobileCardFooter}>
              <div className={styles.mobileCardMeta}>
                <span className={styles.mobileCardId}>{res.id}</span>
                {renderChannel(res.channel)}
              </div>
              <div className={styles.mobileCardActions}>
                <Button variant="secondary" size="icon" aria-label="View in Calendar">
                  <Calendar size={14} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="More actions">
                  <MoreHorizontal size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
