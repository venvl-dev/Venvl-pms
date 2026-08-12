import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import styles from './MultiCalendarView.module.css'
import { useNavigate } from 'react-router-dom'
import { ReservationPopover } from './ReservationPopover'

import { useProperties } from '@/features/properties/hooks'
import { useReservations } from '@/features/reservations/hooks'
import type { BookingChannel } from '@/types/domain'
import type { Reservation } from '@/features/reservations/types'

import { MONTHS, FULL_MONTHS, type ViewMode } from './Constants'
import { CalendarToolbar } from './CalendarToolBar'
import { DayView } from './DayView'
import { MonthView } from './MonthView'
import { YearView } from './YearView'
import type { Property } from '../properties/types'

export function MultiCalendarView() {
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('day')

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  
  const pendingAdjustmentRef = useRef<number>(0)
  const isShiftingRef = useRef<boolean>(false)

  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null)

  const scrollOriginRef = useRef<{ x: number; y: number } | null>(null)

  const handleSelectReservation = (res: Reservation, rect: DOMRect) => {
    setSelectedReservation(res)
    setPopoverAnchor(rect)
    if (scrollRef.current) {
      scrollOriginRef.current = {
        x: scrollRef.current.scrollLeft,
        y: scrollRef.current.scrollTop,
      }
    }
  }

  const closePopover = () => {
    setSelectedReservation(null)
    setPopoverAnchor(null)
    scrollOriginRef.current = null
  }

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
  const { data: propertiesResponse } = useProperties({ page: 1, limit: 100 })

  // Flatten the array so children immediately follow their parents in the grid
  const allBookableUnits = useMemo(() => {
    const rawData = propertiesResponse?.data ?? []
    const flatList: Property[] = [] // Using any[] temporarily or your Property[] type

    rawData.forEach((listing) => {
      // 1. Push the parent or single listing
      flatList.push(listing)
      
      // 2. If it has children, spread them right after the parent
      if (listing.children && listing.children.length > 0) {
        flatList.push(...listing.children)
      }
    })

    return flatList
  }, [propertiesResponse?.data])

  const typeOptions = useMemo(
    () => ['all', ...Array.from(new Set(allBookableUnits.map((u) => u.structureType)))],
    [allBookableUnits],
  )
   const locOptions = useMemo(
    () => [
      'all',
      ...Array.from(new Set(allBookableUnits.map((u) => u.city).filter((c): c is string => !!c))),
    ],
    [allBookableUnits],
  )

  const filteredUnits = useMemo(() => {
    return allBookableUnits.filter((u) => {
      const matchType = typeFilter === 'all' || u.structureType === typeFilter
      const matchLoc = locFilter === 'all' || u.city === locFilter
      const matchChan =
        channelFilter === 'all' || u.channelConnections.includes(channelFilter as BookingChannel)
      return matchType && matchLoc && matchChan
    })
  }, [allBookableUnits, typeFilter, locFilter, channelFilter])
  

  // 2. Day View Matrix Settings (Sliding Window)
  const COL_WIDTH = 120
  const BUFFER_SIZE = 60 // 60 days total in the DOM at any given time
  const PAST_BUFFER = 30 // Start the user perfectly in the middle
  const SHIFT_THRESHOLD = 15 // Trigger a shift when within 15 days of the edge
  const SHIFT_AMOUNT = 20 // Jump the calendar by 20 days at a time

  const dateArray = useMemo(() => {
    return Array.from({ length: BUFFER_SIZE }, (_, i) => {
      const d = new Date(baseDate)
      d.setUTCDate(baseDate.getUTCDate() - PAST_BUFFER + i)
      return d
    })
  }, [baseDate])

  const { data: reservationsResponse, isFetching } = useReservations({
    page: 1,
    limit: 100, 
    startDate: `${dateArray[0].toISOString().split('T')[0]}T00:00:00.000Z`,
    endDate: `${dateArray[dateArray.length - 1].toISOString().split('T')[0]}T23:59:59.999Z`,
  })

  const unitReservations = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    filteredUnits.forEach((u) => map.set(u.id, []))
    
    const liveReservations = reservationsResponse?.data ?? []
    
    liveReservations.forEach((res) => {
      const channel = res.customer?.ota || 'direct'
      
      if (channelFilter !== 'all' && channel !== channelFilter) return
      
      if (map.has(res.listingId)) {
        map.get(res.listingId)?.push(res)
      }
    })
    return map
  }, [filteredUnits, channelFilter, reservationsResponse?.data])

  const [visibleStartIndex, setVisibleStartIndex] = useState(PAST_BUFFER)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (viewMode !== 'day') return
    
    const scrollLeft = e.currentTarget.scrollLeft
    const scrollTop = e.currentTarget.scrollTop

    // 1. We still want to close the popover instantly if the user scrolls away
    if (selectedReservation && scrollOriginRef.current !== null) {
      const dx = Math.abs(scrollLeft - scrollOriginRef.current.x)
      const dy = Math.abs(scrollTop - scrollOriginRef.current.y)
      if (dx > 20 || dy > 20) {
        closePopover()
      }
    }

    // 2. Throttle the heavy state update so it doesn't crush the main thread
    if (scrollTimeoutRef.current) return // Skip if we are already waiting

    scrollTimeoutRef.current = setTimeout(() => {
      // Skip if a treadmill shift is already processing
      if (isShiftingRef.current) return

      const newIndex = Math.round(scrollLeft / COL_WIDTH)

      // Shift LEFT (Past)
      if (newIndex <= SHIFT_THRESHOLD) {
        isShiftingRef.current = true
        pendingAdjustmentRef.current = SHIFT_AMOUNT * COL_WIDTH
        setBaseDate((prev) => {
          const d = new Date(prev)
          d.setUTCDate(d.getUTCDate() - SHIFT_AMOUNT)
          return d
        })
        scrollTimeoutRef.current = null
        return
      }

      // Shift RIGHT (Future)
      if (newIndex >= BUFFER_SIZE - 10 - SHIFT_THRESHOLD) {
        isShiftingRef.current = true
        pendingAdjustmentRef.current = -SHIFT_AMOUNT * COL_WIDTH
        setBaseDate((prev) => {
          const d = new Date(prev)
          d.setUTCDate(d.getUTCDate() + SHIFT_AMOUNT)
          return d
        })
        scrollTimeoutRef.current = null
        return
      }

      setVisibleStartIndex((prevIndex) => (newIndex !== prevIndex ? newIndex : prevIndex))
      scrollTimeoutRef.current = null
    }, 100)
  }

  useLayoutEffect(() => {
    if (viewMode !== 'day' || !scrollRef.current) return

    if (pendingAdjustmentRef.current !== 0) {
      // Adjust scrollbar position silently to match new date offset
      scrollRef.current.scrollLeft += pendingAdjustmentRef.current
      pendingAdjustmentRef.current = 0
      setVisibleStartIndex(Math.round(scrollRef.current.scrollLeft / COL_WIDTH))
      
      // Release lock after browser renders the shift
      requestAnimationFrame(() => {
        isShiftingRef.current = false
      })
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
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = PAST_BUFFER * COL_WIDTH
      setVisibleStartIndex(PAST_BUFFER)
    }
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
          onSelectReservation={handleSelectReservation}
          isFetching={isFetching}
          visibleStartIndex={visibleStartIndex}
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
        <YearView baseDate={baseDate} setBaseDate={setBaseDate} setViewMode={setViewMode} filteredUnits={filteredUnits} unitReservations={unitReservations} />
      )}

      {selectedReservation && popoverAnchor && (
        <ReservationPopover
          reservation={selectedReservation}
          anchorRect={popoverAnchor}
          onClose={closePopover}
          onNavigate={() => {
            closePopover()
            navigate(`/reservations/${selectedReservation.id}`)
          }}
        />
      )}
    </div>
  )
}
