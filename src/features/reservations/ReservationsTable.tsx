import { Calendar, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Skeleton } from '@/components/core/Skeleton'
import { cx } from '@/lib/cx'
import type { Reservation } from './types'
import { getStatusBadge, formatDate, formatCurrency, renderChannel } from './Constants'
import styles from './ReservationsView.module.css'

interface Props {
  isLoading: boolean
  items: Reservation[]
  visibleCols: Record<string, boolean>
  rowsPerPage: number
  onOpen: (id: string) => void
}

export function ReservationsTable({ isLoading, items, visibleCols, rowsPerPage, onOpen }: Props) {
  const visibleColCount = Object.values(visibleCols).filter(Boolean).length

  return (
    <div className={styles.tableCard}>
      <div className={cx(styles.tableScroll, 'no-scrollbar')}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleCols.id && <th className={styles.th}>Booking ID</th>}
              {visibleCols.guest && <th className={styles.th}>Guest</th>}
              {visibleCols.dates && <th className={styles.th}>Check-in / Out</th>}
              {visibleCols.property && <th className={styles.th}>Property & Unit</th>}
              {visibleCols.channel && <th className={styles.th}>Channel</th>}
              {visibleCols.status && <th className={styles.th}>Status</th>}
              {visibleCols.amount && <th className={styles.th}>Total</th>}
              <th className={styles.th} style={{ textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, i) => (
                <tr key={`skeleton-${i}`} className={styles.tr}>
                  {visibleCols.id && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '80px' }} />
                    </td>
                  )}
                  {visibleCols.guest && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '120px' }} />
                    </td>
                  )}
                  {visibleCols.dates && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '100px' }} />
                      <Skeleton style={{ height: '1rem', width: '80px', marginTop: '4px' }} />
                    </td>
                  )}
                  {visibleCols.property && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '140px' }} />
                      <Skeleton style={{ height: '1rem', width: '60px', marginTop: '4px' }} />
                    </td>
                  )}
                  {visibleCols.channel && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '80px' }} />
                    </td>
                  )}
                  {visibleCols.status && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.5rem', width: '80px', borderRadius: '12px' }} />
                    </td>
                  )}
                  {visibleCols.amount && (
                    <td className={styles.td}>
                      <Skeleton style={{ height: '1.25rem', width: '60px' }} />
                    </td>
                  )}
                 
                  <td className={styles.td}>
                    <div className={styles.actionsCell}>
                      <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
                      <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
                    </div>
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColCount + 1}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-8)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  No reservations found matching your criteria.
                </td>
              </tr>
            ) : (
              items.map((res) => {
                return (
                <tr key={res.id} className={styles.tr}>
                  {visibleCols.id && (
                    <td className={styles.td}>
                      <span className={styles.cellSecondary}>{res.id}</span>
                    </td>
                  )}

                  {visibleCols.guest && (
                    <td
                      className={styles.td}
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      role="button"
                      onClick={() => onOpen(res.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onOpen(res.id)
                      }}
                    >
                 <div className={styles.cellPrimary}>{res.customer?.name || 'Unknown Guest'}</div>
                    </td>
                  )}
                  {visibleCols.dates && (
                    <td className={styles.td}>
                      <div className={styles.cellPrimary}>{formatDate(res.startDate)}</div>
                      <div className={styles.cellSecondary}>to {formatDate(res.endDate)}</div>
                    </td>
                  )}
                  {visibleCols.property && (
                    <td className={styles.td}>
                      <div className={styles.cellPrimary}>{res.listing?.name || 'Unknown Property'}</div>
                      <div className={styles.cellSecondary}>{res.listing?.location?.city || 'Unknown Unit'}</div>
                    </td>
                  )}
                  {visibleCols.channel && (
                    <td className={styles.td}>{renderChannel(res.customer?.ota || 'direct')}</td>
                  )}
                  {visibleCols.status && (
                    <td className={styles.td}>{getStatusBadge(res.status)}</td>
                  )}
                  {visibleCols.amount && (
                 <td className={styles.td}>{formatCurrency(res.amount || 0, res.currency)}</td>
                  )}
                  
                  <td className={styles.td}>
                    <div className={styles.actionsCell}>
                      <Button variant="secondary" size="icon" aria-label="View in Calendar">
                        <Calendar size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="More actions">
                        <MoreHorizontal size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
