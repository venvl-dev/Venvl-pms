import { cx } from '@/lib/cx'
import styles from './MultiCalendarView.module.css'
import { parseDate } from './Constants'
import type { Property } from '@/features/properties/types'
import type { Reservation } from '@/features/reservations/types'

interface Props {
  baseDate: Date
  filteredUnits: Property[]
  unitReservations: Map<string, Reservation[]>
}

export function MonthView({ baseDate, filteredUnits, unitReservations }: Props) {
  const year = baseDate.getUTCFullYear()
  const month = baseDate.getUTCMonth()

  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const firstDayOfWeek = new Date(Date.UTC(year, month, 1)).getUTCDay()

  // Build calendar matrix (padding empty days)
  const gridCells = []
  for (let i = 0; i < firstDayOfWeek; i++) gridCells.push(null)
  for (let i = 1; i <= daysInMonth; i++) gridCells.push(new Date(Date.UTC(year, month, i)))

  return (
    <div className={cx(styles.monthViewWrap, 'no-scrollbar')}>
      <div className={styles.monthGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className={styles.monthHeader}>
            {d}
          </div>
        ))}

        {gridCells.map((date, idx) => {
          if (!date)
            return (
              <div key={`empty-${idx}`} className={cx(styles.monthCell, styles.monthCellEmpty)} />
            )

          // Aggregate Data Calculation
          let bookedCount = 0
          filteredUnits.forEach((u) => {
            const resList = unitReservations.get(u.id) || []
            const isBooked = resList.some((r) => {
              const cIn = parseDate(r.checkIn)
              const cOut = parseDate(r.checkOut)
              return date >= cIn && date < cOut
            })
            if (isBooked) bookedCount++
          })
          
          const now = new Date()
          const todayUTC = new Date(
            Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()),
          ).getTime()
          const isToday = date.getTime() === todayUTC

          return (
            <div key={idx} className={styles.monthCell}>
              <div className={cx(styles.monthDate, isToday && styles.monthDateToday)}>
                {date.getUTCDate()}
              </div>

              <div className={styles.monthData}>
                {bookedCount > 0 ? (
                  <div className={styles.monthDataBadge}>
                    {bookedCount} / {filteredUnits.length} Booked
                  </div>
                ) : (
                  <div className={cx(styles.monthDataBadge, styles.monthDataBadgeEmpty)}>
                    Available
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}