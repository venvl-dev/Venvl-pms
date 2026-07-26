import styles from './MultiCalendarView.module.css'
import { FULL_MONTHS, type ViewMode } from './Constants'

interface Props {
  baseDate: Date
  setBaseDate: (date: Date) => void
  setViewMode: (mode: ViewMode) => void
}

export function YearView({ baseDate, setBaseDate, setViewMode }: Props) {
  const year = baseDate.getUTCFullYear()

  return (
    <div className={styles.monthViewWrap}>
      <div className={styles.yearGrid}>
        {FULL_MONTHS.map((monthName, idx) => {
          // For MVP mock, only July 2026 has data.
          const hasData = year === 2026 && idx === 6

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
              {hasData ? (
                <div
                  className={styles.yearData}
                  style={{ color: 'var(--success)', fontWeight: 600 }}
                >
                  Peak Season • 81% Occ
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