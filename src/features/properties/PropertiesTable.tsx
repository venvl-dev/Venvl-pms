import { Fragment } from 'react'
import { ChevronRight as ChevronRightIcon, Calendar, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Skeleton } from '@/components/core/Skeleton'
import { cx } from '@/lib/cx'
import type { Property } from './types'
import { ALL_COLUMNS, getStatusBadge, renderChannelCluster } from './Constants'
import styles from './PropertiesView.module.css'

interface Props {
  isLoading: boolean
  items: Property[]
  childrenMap: Map<string, Property[]>
  visibleCols: Record<string, boolean>
  rowsPerPage: number
  onOpen: (id: string) => void
}

export function PropertiesTable({
  isLoading,
  items,
  childrenMap,
  visibleCols,
  rowsPerPage,
  onOpen,
}: Props) {
  const skeletonRows = Array.from({ length: rowsPerPage }).map((_, i) => (
    <tr key={`sk-${i}`} className={styles.tr}>
      {ALL_COLUMNS.filter((c) => visibleCols[c.id]).map((c) => (
        <td key={c.id} className={styles.td}>
          <Skeleton style={{ height: '1rem', width: '70%' }} />
        </td>
      ))}
      <td className={styles.td}>
        <Skeleton style={{ height: '2rem', width: '2rem', marginLeft: 'auto' }} />
      </td>
    </tr>
  ))

  return (
    <div className={styles.tableCard}>
      <div className={cx(styles.tableScroll, 'no-scrollbar')}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleCols.listing && <th className={styles.th}>Listing</th>}
              {visibleCols.id && <th className={styles.th}>Property ID</th>}
              {visibleCols.type && <th className={styles.th}>Unit Type</th>}
              {visibleCols.capacity && <th className={styles.th}>Beds/Baths</th>}
              {visibleCols.location && <th className={styles.th}>Location</th>}
              {visibleCols.channels && <th className={styles.th}>Channels</th>}
              {visibleCols.status && <th className={styles.th}>Status</th>}
              <th className={styles.th} style={{ textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              skeletonRows
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.values(visibleCols).filter(Boolean).length + 1}
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-8)',
                    color: 'var(--muted-foreground)',
                  }}
                >
                  No properties found matching your criteria.
                </td>
              </tr>
            ) : (
              items.map((prop) => {
                const children = childrenMap.get(prop.id) || []

                return (
                  <Fragment key={prop.id}>
                    <tr
                      className={cx(styles.tr, prop.type === 'parent' && styles.rowParent)}
                      style={{ cursor: 'pointer' }}
                      tabIndex={0}
                      role="button"
                      onClick={() => onOpen(prop.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onOpen(prop.id)
                      }}
                    >
                      {visibleCols.listing && (
                        <td className={styles.td}>
                          <div className={styles.listingCell}>
                            {prop.type === 'parent' ? (
                              <ChevronRightIcon
                                size={16}
                                className={cx(styles.expandIcon, styles.expandIconExpanded)}
                              />
                            ) : (
                              <div style={{ width: '16px', marginRight: '0.25rem', flexShrink: 0 }} />
                            )}

                            <img src={prop.image} alt="" className={styles.thumbnail} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <div className={styles.cellPrimary}>{prop.name}</div>
                              <div className={styles.cellSecondary}>{prop.location}</div>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleCols.id && (
                        <td className={styles.td}>
                          <span className={styles.cellSecondary}>{prop.id}</span>
                        </td>
                      )}

                      {visibleCols.type && (
                        <td className={styles.td}>
                          <span style={{ textTransform: 'capitalize' }} className={styles.cellPrimary}>
                            {prop.type}
                          </span>
                        </td>
                      )}

                      {visibleCols.capacity && (
                        <td className={styles.td}>
                          <div className={styles.cellPrimary}>{prop.bedrooms} Bed</div>
                          <div className={styles.cellSecondary}>{prop.bathrooms} Bath</div>
                        </td>
                      )}

                      {visibleCols.location && (
                        <td className={styles.td}>
                          <span className={styles.cellSecondary}>{prop.location}</span>
                        </td>
                      )}

                      {visibleCols.channels && (
                        <td className={styles.td}>
                          {prop.channels.length > 0 ? (
                            renderChannelCluster(prop.channels)
                          ) : (
                            <span className={styles.cellSecondary}>None</span>
                          )}
                        </td>
                      )}

                      {visibleCols.status && (
                        <td className={styles.td}>{getStatusBadge(prop.status)}</td>
                      )}

                      <td className={styles.td}>
                        <div className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                          <Button variant="secondary" size="icon" aria-label="View in Calendar">
                            <Calendar size={14} />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label="More actions">
                            <MoreHorizontal size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>

                    {children.map((child, index) => (
                      <tr
                        key={child.id}
                        className={cx(
                          styles.tr,
                          styles.rowChild,
                          index === children.length - 1 && styles.lastChild,
                        )}
                        style={{ cursor: 'pointer' }}
                        tabIndex={0}
                        role="button"
                        onClick={() => onOpen(child.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onOpen(child.id)
                        }}
                      >
                        {visibleCols.listing && (
                          <td className={styles.td}>
                            <div className={styles.childListingCell}>
                              <img src={child.image} alt="" className={styles.childThumbnail} />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className={styles.cellPrimary}>{child.name}</div>
                                <div className={styles.cellSecondary}>Unit ID: {child.id}</div>
                              </div>
                            </div>
                          </td>
                        )}

                        {visibleCols.id && (
                          <td className={styles.td}>
                            <span className={styles.cellSecondary}>{child.id}</span>
                          </td>
                        )}

                        {visibleCols.type && (
                          <td className={styles.td}>
                            <span
                              style={{ textTransform: 'capitalize' }}
                              className={styles.cellSecondary}
                            >
                              {child.type}
                            </span>
                          </td>
                        )}

                        {visibleCols.capacity && (
                          <td className={styles.td}>
                            <div className={styles.cellPrimary}>{child.bedrooms} Bed</div>
                            <div className={styles.cellSecondary}>{child.bathrooms} Bath</div>
                          </td>
                        )}

                        {visibleCols.location && (
                          <td className={styles.td}>
                            <span className={styles.cellSecondary}>{child.location}</span>
                          </td>
                        )}

                        {visibleCols.channels && (
                          <td className={styles.td}>
                            {child.channels.length > 0 ? (
                              renderChannelCluster(child.channels)
                            ) : (
                              <span className={styles.cellSecondary}>None</span>
                            )}
                          </td>
                        )}

                        {visibleCols.status && (
                          <td className={styles.td}>{getStatusBadge(child.status)}</td>
                        )}

                        <td className={styles.td}>
                          <div className={styles.actionsCell} onClick={(e) => e.stopPropagation()}>
                            <Button variant="secondary" size="icon" aria-label="View in Calendar">
                              <Calendar size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="More actions">
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
