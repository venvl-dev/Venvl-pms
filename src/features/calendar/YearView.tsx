import styles from './MultiCalendarView.module.css'
import { FULL_MONTHS, parseDate, type ViewMode } from './Constants'
import type { Property } from '@/features/properties/types'
import type { Reservation } from '@/features/reservations/types'

interface Props {
  baseDate: Date
  setBaseDate: (date: Date) => void
  setViewMode: (mode: ViewMode) => void
  filteredUnits: Property[]
  unitReservations: Map<string, Reservation[]>
}

export function YearView({ baseDate, setBaseDate, setViewMode, filteredUnits, unitReservations }: Props) {
  const year = baseDate.getUTCFullYear()

  return (
    <div className={styles.monthViewWrap}>
      <div className={styles.yearGrid}>
        {FULL_MONTHS.map((monthName, idx) => {
          // 1. Calculate Time Boundaries for this specific month
          const monthStart = new Date(Date.UTC(year, idx, 1)).getTime()
          const daysInMonth = new Date(Date.UTC(year, idx + 1, 0)).getUTCDate()
          const monthEnd = new Date(Date.UTC(year, idx, daysInMonth + 1)).getTime() // Exclusive end boundary

          // 2. Establish Total Capacity
          const totalAvailableNights = filteredUnits.length * daysInMonth
          let soldNights = 0

          // 3. Tally Sold Nights by finding reservation overlaps
          if (totalAvailableNights > 0) {
            filteredUnits.forEach((unit) => {
              const resList = unitReservations.get(unit.id) || []
              
              resList.forEach((res) => {
                const checkInTime = parseDate(res.checkIn).getTime()
                const checkOutTime = parseDate(res.checkOut).getTime()

                // Find the exact overlap window
                const overlapStart = Math.max(checkInTime, monthStart)
                const overlapEnd = Math.min(checkOutTime, monthEnd)

                // If the overlap is valid (end is after start), convert ms to days and add to total
                if (overlapStart < overlapEnd) {
                  soldNights += (overlapEnd - overlapStart) / 86400000 
                }
              })
            })
          }

          // 4. Calculate Final Occupancy Percentage
          const occupancy = totalAvailableNights > 0 
            ? Math.round((soldNights / totalAvailableNights) * 100) 
            : 0

          return (
            <div
              key={monthName}
              className={styles.yearCard}
              onClick={() => {
                const now = new Date()
                const isCurrentMonth = year === now.getFullYear() && idx === now.getMonth()
                const targetDay = isCurrentMonth ? now.getDate() : 1
                setBaseDate(new Date(Date.UTC(year, idx, targetDay)))
                setViewMode('month')
              }}
            >
              <div className={styles.yearMonthName}>{monthName}</div>              
              {occupancy > 0 ? (
                <div
                  className={styles.yearData}
                  style={{ 
                    color: 'var(--success)', 
                    fontWeight: occupancy >= 75 ? 600 : 400 
                  }}
                >
                  {occupancy >= 75 && 'Peak Season • '} {occupancy}% Occ
                </div>
              ) : (
                <div className={styles.yearData}>No Data</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}