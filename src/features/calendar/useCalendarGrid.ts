import { useState, useMemo, useRef, useLayoutEffect } from 'react'
import { MONTHS, FULL_MONTHS, type ViewMode } from './Constants'

// Day View Matrix Settings
const COL_WIDTH = 120
const BUFFER_SIZE = 60
const PAST_BUFFER = 30
const SHIFT_THRESHOLD = 15
const SHIFT_AMOUNT = 20

export function useCalendarGrid(onScrollActivity?: (scrollLeft: number, scrollTop: number) => void) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pendingAdjustmentRef = useRef<number>(0)
  const isShiftingRef = useRef<boolean>(false)

  const [baseDate, setBaseDate] = useState(() => {
    const now = new Date()
    return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
  })

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
    const scrollTop = e.currentTarget.scrollTop

    if (onScrollActivity) {
      onScrollActivity(scrollLeft, scrollTop)
    }

    if (scrollTimeoutRef.current) return

    scrollTimeoutRef.current = setTimeout(() => {
      if (isShiftingRef.current) return
      
      const newIndex = Math.round(scrollLeft / COL_WIDTH)
      
      // Shift LEFT 
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
      
      // Shift RIGHT 
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
      scrollRef.current.scrollLeft += pendingAdjustmentRef.current
      pendingAdjustmentRef.current = 0
      setVisibleStartIndex(Math.round(scrollRef.current.scrollLeft / COL_WIDTH))
      
      requestAnimationFrame(() => {
        isShiftingRef.current = false
      })
    }
  }, [viewMode, baseDate])

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

  return {
    viewMode,
    setViewMode,
    baseDate,
    setBaseDate,
    dateArray,
    scrollRef,
    handleScroll,
    visibleStartIndex,
    handlePrev,
    handleNext,
    handleToday,
    rangeText: getRangeText(),
    bufferSize: BUFFER_SIZE
  }
}