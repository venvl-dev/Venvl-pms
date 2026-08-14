import { ChevronRight as ChevronRightIcon, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Skeleton } from '@/components/core/Skeleton'
import { cx } from '@/lib/cx'
import type { Property } from './types'
import { getStatusBadge, renderChannelCluster } from './Constants'
import styles from './PropertiesView.module.css'

interface Props {
  isLoading: boolean
  items: Property[]
  childrenMap: Map<string, Property[]>
  rowsPerPage: number
  onOpen: (id: string) => void
}

export function PropertiesMobileCards({ isLoading, items, childrenMap, rowsPerPage, onOpen }: Props) {
    const mobileSkeletonCards = Array.from({ length: rowsPerPage }).map((_, i) => (
    <div key={`sk-${i}`} className={styles.mobileCardWrap}>
      <div className={styles.mobileCardTop}>
        <Skeleton className={styles.mobileCardImage} />
        <div className={styles.mobileCardInfo}>
          <Skeleton style={{ height: '0.9rem', width: '65%' }} />
          <Skeleton style={{ height: '0.75rem', width: '45%', marginTop: '0.35rem' }} />
        </div>
      </div>
      <div className={styles.mobileCardBottom}>
        <Skeleton style={{ height: '1.5rem', width: '70px' }} />
        <Skeleton style={{ height: '1.5rem', width: '60px' }} />
      </div>
    </div>
  ))

  return (
    <div className={styles.mobileList}>
      {isLoading ? (
        mobileSkeletonCards
      ) : items.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-8)',
            color: 'var(--muted-foreground)',
          }}
        >
          No properties found matching your criteria.
        </div>
      ) : (
        items.map((prop) => {
          const children = childrenMap.get(prop.id) || []

          return (
            <div key={prop.id} className={styles.mobileCardWrap}>
              <div className={cx(prop.structureType === 'parent' && styles.isParent)}>
                <div className={styles.mobileCardTop} onClick={() => onOpen(prop.id)}>
                  <img src={prop.thumbnail || undefined} alt="" className={styles.mobileCardImage} />

                  <div className={styles.mobileCardInfo}>
                    <div className={styles.mobileCardTitleRow}>
                      <div>
                        <div className={styles.mobileCardTitle}>{prop.title}</div>
                        <div className={styles.mobileCardSub}>{prop.city || 'No city'}</div>
                      </div>
                      {prop.structureType === 'parent' ? (
                        <ChevronRightIcon
                          size={20}
                          className={cx(styles.expandIcon, styles.expandIconExpanded)}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          style={{ width: '28px', height: '28px', margin: '-4px' }}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      )}
                    </div>

                    <div className={styles.mobileCardMetrics}>
                      <div className={styles.mobileCardMetric}>
                        <span style={{ textTransform: 'capitalize' }}>{prop.structureType}</span>
                      </div>
                      <div className={styles.mobileCardMetric}>
                        • {prop.bedrooms} Bed, {prop.bathrooms} Bath
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.mobileCardBottom}>
                  {(prop.channelConnections || []).length > 0 ? (
                    renderChannelCluster(prop.channelConnections)
                  ) : (
                    <span className={styles.mobileCardSub}>No channels</span>
                  )}
                  {getStatusBadge(prop.status)}
                </div>
              </div>

              {children.length > 0 && (
                <div className={styles.mobileChildren}>
                  {children.map((child, index) => (
                    <div
                      key={child.id}
                      className={cx(
                        styles.mobileChildCard,
                        index === children.length - 1 && styles.lastChild,
                      )}
                      onClick={() => onOpen(child.id)}
                    >
                      <img src={child.thumbnail || undefined} alt="" className={styles.mobileChildImage} />

                      <div className={styles.mobileCardInfo}>
                        <div className={styles.mobileCardTitleRow}>
                          <div>
                            <div className={styles.mobileCardTitle}>{child.title}</div>
                            <div className={styles.mobileCardSub}>Unit ID: {child.id}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            style={{ width: '24px', height: '24px', margin: '-4px' }}
                          >
                            <MoreHorizontal size={14} />
                          </Button>
                        </div>

                        <div
                          className={styles.mobileCardMetrics}
                          style={{ marginTop: '0.25rem', paddingTop: 0 }}
                        >
                          <div className={styles.mobileCardMetric}>{child.bedrooms} Bed</div>
                          <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                            {getStatusBadge(child.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}
