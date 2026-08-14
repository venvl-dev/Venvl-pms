import { Fragment } from 'react'
import { cx } from '@/lib/cx'
import styles from './MultiCalendarView.module.css'
import { parseDate, getChannelConfig } from './Constants'
import type { Property } from '@/features/properties/types'
import type { Reservation } from '@/features/reservations/types'

interface CalendarGridStyles extends React.CSSProperties {
  '--total-days'?: number
}

interface Props {
  dateArray: Date[]
  filteredUnits: Property[]
  unitReservations: Map<string, Reservation[]>
  scrollRef: React.RefObject<HTMLDivElement | null>
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void
  bufferSize: number
  onSelectReservation: (res: Reservation, rect: DOMRect) => void
}
export function DayView({
  dateArray,
  filteredUnits,
  unitReservations,
  scrollRef,
  onScroll,
  bufferSize,
  onSelectReservation
}: Props) {
  return (
    <div className={styles.calendarCard}>
      <div
        className={cx(styles.gridScroll, 'no-scrollbar')}
        ref={scrollRef}
        onScroll={onScroll}
      >
        <div
          className={styles.grid}
          style={{ '--total-days': bufferSize } as CalendarGridStyles}
        >
          <div className={cx(styles.stickyHeader, styles.stickyCol, styles.corner)}>Listings</div>

          {dateArray.map((date, i) => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            return (
              <div
                key={i}
                className={cx(styles.dateCell, styles.stickyHeader)}
                style={{ gridColumn: i + 2, gridRow: 1 }}
              >
                <span className={styles.dateDay}>{days[date.getUTCDay()]}</span>
                <span className={styles.dateNum}>{date.getUTCDate()}</span>
              </div>
            )
          })}

          {filteredUnits.map((unit, unitIndex) => {
            const gridRow = unitIndex + 2
            return (
              <Fragment key={unit.id}>
                <div
                  className={cx(styles.listingCell, styles.stickyCol)}
                  style={{ gridColumn: 1, gridRow }}
                >
                  <img src={unit.thumbnail??undefined} alt="" className={styles.listingImage} />
                  <div className={styles.listingInfo}>
                    <div className={styles.listingName}>{unit.title}</div>
                    <div className={styles.listingMeta}>
                      <span className={styles.statusDot} /> Active
                    </div>
                    <div className={styles.listingMeta}>{unit.bedrooms}BR • 4 Guests</div>
                  </div>
                </div>

                {dateArray.map((_, dayIndex) => (
                  <div
                    key={`empty-${dayIndex}`}
                    className={styles.emptyCellWrap}
                    style={{ gridColumn: dayIndex + 2, gridRow }}
                  >
                    <div className={styles.emptyCell}>
                     {unit.price ? `${unit.price}$` : '-'}
                    </div>
                  </div>
                ))}

                {unitReservations.get(unit.id)?.map((res) => {
                  const checkInDate = parseDate(res.checkIn)
                  const checkOutDate = parseDate(res.checkOut)
                  const startIndex = Math.floor(
                    (checkInDate.getTime() - dateArray[0].getTime()) / 86400000,
                  )
                  const duration = Math.floor(
                    (checkOutDate.getTime() - checkInDate.getTime()) / 86400000,
                  )

                  const isClippedLeft = startIndex < 0
                  const actualStartCol = isClippedLeft ? 2 : startIndex + 2

                  let actualSpan = duration
                  if (isClippedLeft) actualSpan = duration + startIndex
                  if (actualStartCol + actualSpan > bufferSize + 2)
                    actualSpan = bufferSize + 2 - actualStartCol

                  if (actualSpan <= 0) return null

                  const config = getChannelConfig(res.channel)

                  return (
                    <div
                      key={res.id}
                      className={styles.bookingWrap}
                      style={{
                        gridColumnStart: actualStartCol,
                        gridColumnEnd: `span ${actualSpan}`,
                        gridRow,
                      }}
                    >
                      <div
                        className={cx(
                          styles.pill,
                          config.style,
                          isClippedLeft && styles.pillClippedLeft,
                        )}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectReservation(res, e.currentTarget.getBoundingClientRect())
                        }}
                      >
                        <div className={styles.pillContent}>
                          <span className={styles.guestName}>{res.guestName}</span>
                          <span className={styles.guestCount}>2 Guests</span>
                        </div>
                        <div className={styles.channelIcon}>
                          <img src={config.logo} alt="" />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>
      </div>
    </div>
  )
}