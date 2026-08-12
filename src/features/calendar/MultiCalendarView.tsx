import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MultiCalendarView.module.css'

import { CalendarToolbar } from './CalendarToolBar'
import { DayView } from './DayView'
import { MonthView } from './MonthView'
import { YearView } from './YearView'
import { ReservationPopover } from './ReservationPopover'

import { useCalendarData } from './useCalendarData'
import { useCalendarGrid } from './useCalendarGrid'
import { useReservationSelection } from './useReservationSelection'

export function MultiCalendarView() {
  const navigate = useNavigate()

  // 1. Grid & Timeline
  const scrollActivityCallbackRef = useRef<((x: number, y: number) => void) | null>(null)
  const grid = useCalendarGrid((x, y) => scrollActivityCallbackRef.current?.(x, y))

  // 2. Popover Selection 
  const selection = useReservationSelection(grid.scrollRef)
  scrollActivityCallbackRef.current = selection.handleScrollActivity

  // 3. API Data & Filters
  const startDate = `${grid.dateArray[0].toISOString().split('T')[0]}T00:00:00.000Z`
  const endDate = `${grid.dateArray[grid.dateArray.length - 1].toISOString().split('T')[0]}T23:59:59.999Z`
  
  const data = useCalendarData(startDate, endDate)

  return (
    <div className={styles.page}>
      <CalendarToolbar
        viewMode={grid.viewMode}
        setViewMode={grid.setViewMode}
        onPrev={grid.handlePrev}
        onNext={grid.handleNext}
        onToday={grid.handleToday}
        rangeText={grid.rangeText}
        typeFilter={data.typeFilter}
        setTypeFilter={data.setTypeFilter}
        typeOptions={data.typeOptions}
        locFilter={data.locFilter}
        setLocFilter={data.setLocFilter}
        locOptions={data.locOptions}
        channelFilter={data.channelFilter}
        setChannelFilter={data.setChannelFilter}
      />

      {grid.viewMode === 'day' && (
        <DayView
          dateArray={grid.dateArray}
          filteredUnits={data.filteredUnits}
          unitReservations={data.unitReservations}
          scrollRef={grid.scrollRef}
          onScroll={grid.handleScroll}
          bufferSize={grid.bufferSize}
          onSelectReservation={selection.handleSelectReservation}
          isFetching={data.isFetching}
          visibleStartIndex={grid.visibleStartIndex}
        />
      )}

      {grid.viewMode === 'month' && (
        <MonthView
          baseDate={grid.baseDate}
          filteredUnits={data.filteredUnits}
          unitReservations={data.unitReservations}
        />
      )}

      {grid.viewMode === 'year' && (
        <YearView
          baseDate={grid.baseDate}
          setBaseDate={grid.setBaseDate}
          setViewMode={grid.setViewMode}
          filteredUnits={data.filteredUnits}
          unitReservations={data.unitReservations}
        />
      )}

      {selection.selectedReservation && selection.popoverAnchor && (
        <ReservationPopover
          reservation={selection.selectedReservation}
          anchorRect={selection.popoverAnchor}
          onClose={selection.closePopover}
          onNavigate={() => {
            selection.closePopover()
            navigate(`/reservations/${selection.selectedReservation!.id}`)
          }}
        />
      )}
    </div>
  )
}