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
  onOpen: (id: string) => void
}

const mobileSkeletonCards = Array.from({ length: 5 }).map((_, i) => (
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

export function PropertiesMobileCards({ isLoading, items, childrenMap, onOpen }: Props) {
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
              <div className={cx(prop.type === 'parent' && styles.isParent)}>
                <div className={styles.mobileCardTop} onClick={() => onOpen(prop.id)}>
                  <img src={prop.image} alt="" className={styles.mobileCardImage} />

                  <div className={styles.mobileCardInfo}>
                    <div className={styles.mobileCardTitleRow}>
                      <div>
                        <div className={styles.mobileCardTitle}>{prop.name}</div>
                        <div className={styles.mobileCardSub}>{prop.location}</div>
                      </div>
                      {prop.type === 'parent' ? (
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
                        <span style={{ textTransform: 'capitalize' }}>{prop.type}</span>
                      </div>
                      <div className={styles.mobileCardMetric}>
                        • {prop.bedrooms} Bed, {prop.bathrooms} Bath
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.mobileCardBottom}>
                  {prop.channels.length > 0 ? (
                    renderChannelCluster(prop.channels)
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
                      <img src={child.image} alt="" className={styles.mobileChildImage} />

                      <div className={styles.mobileCardInfo}>
                        <div className={styles.mobileCardTitleRow}>
                          <div>
                            <div className={styles.mobileCardTitle}>{child.name}</div>
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
