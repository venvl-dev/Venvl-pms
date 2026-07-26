import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import styles from './MultiCalendarView.module.css'

import { MOCK_PROPERTIES } from '@/features/properties/mockProperties'
import { MOCK_RESERVATIONS } from '@/features/reservations/mockReservations'
import type { BookingChannel } from '@/types/domain'
import type { Reservation } from '@/features/reservations/types'

import { MONTHS, FULL_MONTHS, type ViewMode } from './Constants'
import { CalendarToolbar } from './CalendarToolBar'
import { DayView } from './DayView'
import { MonthView } from './MonthView'
import { YearView } from './YearView'

export function MultiCalendarView() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('day')

  // The central date context
  const [baseDate, setBaseDate] = useState(() => {
    const now = new Date()
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  })

  // Filter States
  const [typeFilter, setTypeFilter] = useState('all')
  const [locFilter, setLocFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  // 1. Data Preparation & Filtering
  const allBookableUnits = useMemo(() => MOCK_PROPERTIES, [])

  const typeOptions = useMemo(
    () => ['all', ...Array.from(new Set(allBookableUnits.map((u) => u.type)))],
    [allBookableUnits],
  )
  const locOptions = useMemo(
    () => ['all', ...Array.from(new Set(allBookableUnits.map((u) => u.location)))],
    [allBookableUnits],
  )

  const filteredUnits = useMemo(() => {
    return allBookableUnits.filter((u) => {
      const matchType = typeFilter === 'all' || u.type === typeFilter
      const matchLoc = locFilter === 'all' || u.location === locFilter
      const matchChan = channelFilter === 'all' || u.channels.includes(channelFilter as BookingChannel)
      return matchType && matchLoc && matchChan
    })
  }, [allBookableUnits, typeFilter, locFilter, channelFilter])

  // Attach reservations to filtered units securely
  const unitReservations = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    filteredUnits.forEach((u) => map.set(u.id, []))

    // Distributed deterministically for the mock
    MOCK_RESERVATIONS.forEach((res, index) => {
      if (channelFilter !== 'all' && res.channel !== channelFilter) return

      const targetUnit = allBookableUnits[index % allBookableUnits.length]
      if (targetUnit && map.has(targetUnit.id)) {
        map.get(targetUnit.id)?.push(res)
      }
    })
    return map
  }, [filteredUnits, allBookableUnits, channelFilter])

  // 2. Day View Matrix Settings
  const COL_WIDTH = 120
  const BUFFER_SIZE = 120
  const PAST_BUFFER = 30

  const dateArray = useMemo(() => {
    return Array.from({ length: BUFFER_SIZE }, (_, i) => {
      const d = new Date(baseDate)
      d.setUTCDate(baseDate.getUTCDate() - PAST_BUFFER + i)
      return d
    })
  }, [baseDate])

  const [visibleStartIndex, setVisibleStartIndex] = useState(PAST_BUFFER)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (viewMode !== 'day') return
    const scrollLeft = e.currentTarget.scrollLeft
    const newIndex = Math.round(scrollLeft / COL_WIDTH)
    if (newIndex !== visibleStartIndex) setVisibleStartIndex(newIndex)
  }

  useLayoutEffect(() => {
    if (viewMode === 'day' && scrollRef.current) {
      scrollRef.current.scrollLeft = PAST_BUFFER * COL_WIDTH
      setVisibleStartIndex(PAST_BUFFER)
    }
  }, [viewMode, baseDate])

  // 3. Navigation Handlers
  const handlePrev = () => {
    if (viewMode === 'day') {
      scrollRef.current?.scrollBy({ left: -(COL_WIDTH * 10), behavior: 'smooth' })
    } else if (viewMode === 'month') {
      setBaseDate((d) => {
        const nd = new Date(d)
        nd.setUTCMonth(nd.getUTCMonth() - 1)
        return nd
      })
    } else {
      setBaseDate((d) => {
        const nd = new Date(d)
        nd.setUTCFullYear(nd.getUTCFullYear() - 1)
        return nd
      })
    }
  }

  const handleNext = () => {
    if (viewMode === 'day') {
      scrollRef.current?.scrollBy({ left: COL_WIDTH * 10, behavior: 'smooth' })
    } else if (viewMode === 'month') {
      setBaseDate((d) => {
        const nd = new Date(d)
        nd.setUTCMonth(nd.getUTCMonth() + 1)
        return nd
      })
    } else {
      setBaseDate((d) => {
        const nd = new Date(d)
        nd.setUTCFullYear(nd.getUTCFullYear() + 1)
        return nd
      })
    }
  }

  const handleToday = () => {
    const now = new Date()
    setBaseDate(new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())))
  }

  // Dynamic Range Text Generator
  const getRangeText = () => {
    if (viewMode === 'year') return `${baseDate.getUTCFullYear()}`
    if (viewMode === 'month')
      return `${FULL_MONTHS[baseDate.getUTCMonth()]} ${baseDate.getUTCFullYear()}`

    const safeIndex = Math.min(Math.max(visibleStartIndex, 0), BUFFER_SIZE - 10)
    const startD = dateArray[safeIndex]
    const endD = dateArray[safeIndex + 9] 
    if (!startD || !endD) return ''

    if (startD.getUTCMonth() === endD.getUTCMonth()) {
      return `${startD.getUTCDate()} - ${endD.getUTCDate()} ${MONTHS[startD.getUTCMonth()]} ${startD.getUTCFullYear()}`
    }
    return `${startD.getUTCDate()} ${MONTHS[startD.getUTCMonth()]} - ${endD.getUTCDate()} ${MONTHS[endD.getUTCMonth()]}`
  }

  return (
    <div className={styles.page}>
      <CalendarToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        rangeText={getRangeText()}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        typeOptions={typeOptions}
        locFilter={locFilter}
        setLocFilter={setLocFilter}
        locOptions={locOptions}
        channelFilter={channelFilter}
        setChannelFilter={setChannelFilter}
      />

      {viewMode === 'day' && (
        <DayView
          dateArray={dateArray}
          filteredUnits={filteredUnits}
          unitReservations={unitReservations}
          scrollRef={scrollRef}
          onScroll={handleScroll}
          bufferSize={BUFFER_SIZE}
        />
      )}
      {viewMode === 'month' && (
        <MonthView
          baseDate={baseDate}
          filteredUnits={filteredUnits}
          unitReservations={unitReservations}
        />
      )}
      {viewMode === 'year' && (
        <YearView baseDate={baseDate} setBaseDate={setBaseDate} setViewMode={setViewMode} />
      )}
    </div>
  )
}