import { useState, useMemo, useRef, useLayoutEffect, useEffect, Fragment } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/core/Button'
// import { Badge } from '@/components/core/Badge'
// import { StatCard } from '@/components/core/StatCard'
import { cx } from '@/lib/cx'
import styles from './MultiCalendarView.module.css'

import { MOCK_PROPERTIES } from '@/features/properties/mockProperties'
import { MOCK_RESERVATIONS, type Reservation } from '@/features/reservations/mockReservations'
import type { BookingChannel } from '@/types/domain'

type ViewMode = 'day' | 'month' | 'year'

interface CalendarGridStyles extends React.CSSProperties {
  '--total-days'?: number;
}

// Standardization helpers
const parseDate = (d: string) => new Date(`${d}T00:00:00Z`)
// const formatDateStr = (d: Date) => d.toISOString().split('T')[0]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const getChannelConfig = (channel: BookingChannel) => {
  if (channel === 'airbnb') return { style: styles.channel_airbnb, icon: 'a' }
  if (channel === 'booking.com') return { style: styles.channel_booking_com, icon: 'B.' }
  return { style: styles.channel_direct, icon: 'D' }
}

const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'direct', label: 'Direct Booking' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking.com', label: 'Booking.com' },
  { value: 'vrbo', label: 'Vrbo' },
  { value: 'expedia', label: 'Expedia' },
]

export function MultiCalendarView() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  
  // The central date context (Defaults to July 20 2026 to align with mock data)
  const [baseDate, setBaseDate] = useState(() => new Date('2026-07-20T00:00:00Z'))
  
  // Filter States
  const [typeFilter, setTypeFilter] = useState('all')
  const [locFilter, setLocFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')

  // Dropdown UI states
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [showLocMenu, setShowLocMenu] = useState(false)
  const [showChanMenu, setShowChanMenu] = useState(false)

  const typeRef = useRef<HTMLDivElement>(null)
  const locRef = useRef<HTMLDivElement>(null)
  const chanRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeRef.current && !typeRef.current.contains(e.target as Node)) setShowTypeMenu(false)
      if (locRef.current && !locRef.current.contains(e.target as Node)) setShowLocMenu(false)
      if (chanRef.current && !chanRef.current.contains(e.target as Node)) setShowChanMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 1. Data Preparation & Filtering
  const allBookableUnits = useMemo(() => MOCK_PROPERTIES, [])
  
  const typeOptions = useMemo(() => ['all', ...Array.from(new Set(allBookableUnits.map(u => u.type)))], [allBookableUnits])
  const locOptions = useMemo(() => ['all', ...Array.from(new Set(allBookableUnits.map(u => u.location)))], [allBookableUnits])

  const filteredUnits = useMemo(() => {
    return allBookableUnits.filter(u => {
      const matchType = typeFilter === 'all' || u.type === typeFilter
      const matchLoc = locFilter === 'all' || u.location === locFilter
      const matchChan = channelFilter === 'all' || u.channels.includes(channelFilter as BookingChannel)
      return matchType && matchLoc && matchChan
    })
  }, [allBookableUnits, typeFilter, locFilter, channelFilter])

  // Attach reservations to filtered units securely
  const unitReservations = useMemo(() => {
    const map = new Map<string, Reservation[]>()
    filteredUnits.forEach(u => map.set(u.id, []))

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


  // 2. Day View Matrix Generation (120 days total buffer)
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

  // Scroll Tracking for Dynamic Range Label
  const [visibleStartIndex, setVisibleStartIndex] = useState(PAST_BUFFER)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (viewMode !== 'day') return
    const scrollLeft = e.currentTarget.scrollLeft
    const newIndex = Math.round(scrollLeft / COL_WIDTH)
    if (newIndex !== visibleStartIndex) setVisibleStartIndex(newIndex)
  }

  // Ensure scroll sits exactly at 'Today' when jumping around in Day view
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
      setBaseDate(d => { const nd = new Date(d); nd.setUTCMonth(nd.getUTCMonth() - 1); return nd })
    } else {
      setBaseDate(d => { const nd = new Date(d); nd.setUTCFullYear(nd.getUTCFullYear() - 1); return nd })
    }
  }

  const handleNext = () => {
    if (viewMode === 'day') {
      scrollRef.current?.scrollBy({ left: (COL_WIDTH * 10), behavior: 'smooth' })
    } else if (viewMode === 'month') {
      setBaseDate(d => { const nd = new Date(d); nd.setUTCMonth(nd.getUTCMonth() + 1); return nd })
    } else {
      setBaseDate(d => { const nd = new Date(d); nd.setUTCFullYear(nd.getUTCFullYear() + 1); return nd })
    }
  }

  const handleToday = () => {
    // Jump to the Mock anchor so data remains visible
    setBaseDate(new Date('2026-07-20T00:00:00Z'))
  }

  // Dynamic Range Text Generator
  const getRangeText = () => {
    if (viewMode === 'year') return `${baseDate.getUTCFullYear()}`
    if (viewMode === 'month') return `${FULL_MONTHS[baseDate.getUTCMonth()]} ${baseDate.getUTCFullYear()}`
    
    // Day View: Calculate based on what is physically visible via scroll state
    const safeIndex = Math.min(Math.max(visibleStartIndex, 0), BUFFER_SIZE - 10)
    const startD = dateArray[safeIndex]
    const endD = dateArray[safeIndex + 9] // Show 10 days
    if (!startD || !endD) return ''

    if (startD.getUTCMonth() === endD.getUTCMonth()) {
      return `${startD.getUTCDate()} - ${endD.getUTCDate()} ${MONTHS[startD.getUTCMonth()]} ${startD.getUTCFullYear()}`
    }
    return `${startD.getUTCDate()} ${MONTHS[startD.getUTCMonth()]} - ${endD.getUTCDate()} ${MONTHS[endD.getUTCMonth()]}`
  }


  // 4. Renderers
  const renderDayView = () => {
    return (
      <div className={styles.calendarCard}>
        <div className={cx(styles.gridScroll, 'no-scrollbar')} ref={scrollRef} onScroll={handleScroll}>
          <div 
            className={styles.grid} 
            style={{ '--total-days': BUFFER_SIZE } as CalendarGridStyles}
          >
            <div className={cx(styles.stickyHeader, styles.stickyCol, styles.corner)}>Listings</div>
            
            {dateArray.map((date, i) => {
              const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
              return (
                <div key={i} className={cx(styles.dateCell, styles.stickyHeader)} style={{ gridColumn: i + 2, gridRow: 1 }}>
                  <span className={styles.dateDay}>{days[date.getUTCDay()]}</span>
                  <span className={styles.dateNum}>{date.getUTCDate()}</span>
                </div>
              )
            })}

            {filteredUnits.map((unit, unitIndex) => {
              const gridRow = unitIndex + 2
              return (
                <Fragment key={unit.id}>
                  <div className={cx(styles.listingCell, styles.stickyCol)} style={{ gridColumn: 1, gridRow }}>
                    <img src={unit.image} alt="" className={styles.listingImage} />
                    <div className={styles.listingInfo}>
                      <div className={styles.listingName}>{unit.name}</div>
                      <div className={styles.listingMeta}>
                        <span className={styles.statusDot} /> Active
                      </div>
                      <div className={styles.listingMeta}>
                        {unit.bedrooms}BR • 4 Guests
                      </div>
                    </div>
                  </div>

                  {dateArray.map((_, dayIndex) => (
                    <div key={`empty-${dayIndex}`} className={styles.emptyCellWrap} style={{ gridColumn: dayIndex + 2, gridRow }}>
                      <div className={styles.emptyCell}>
                        120$
                      </div>
                    </div>
                  ))}

                  {unitReservations.get(unit.id)?.map(res => {
                    const checkInDate = parseDate(res.checkIn)
                    const checkOutDate = parseDate(res.checkOut)
                    const startIndex = Math.floor((checkInDate.getTime() - dateArray[0].getTime()) / 86400000)
                    const duration = Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / 86400000)
                    
                    const isClippedLeft = startIndex < 0
                    const actualStartCol = isClippedLeft ? 2 : startIndex + 2
                    
                    let actualSpan = duration
                    if (isClippedLeft) actualSpan = duration + startIndex 
                    if (actualStartCol + actualSpan > BUFFER_SIZE + 2) actualSpan = (BUFFER_SIZE + 2) - actualStartCol

                    if (actualSpan <= 0) return null 

                    const config = getChannelConfig(res.channel)

                    return (
                      <div 
                        key={res.id} 
                        className={styles.bookingWrap}
                        style={{ gridColumnStart: actualStartCol, gridColumnEnd: `span ${actualSpan}`, gridRow }}
                      >
                        <div className={cx(styles.pill, config.style, isClippedLeft && styles.pillClippedLeft)}>
                          <div className={styles.pillContent}>
                            <span className={styles.guestName}>{res.guestName}</span>
                            <span className={styles.guestCount}>2 Guests</span>
                          </div>
                          <div className={styles.channelIcon}>{config.icon}</div>
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

  const renderMonthView = () => {
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
             <div key={d} className={styles.monthHeader}>{d}</div>
          ))}
          
          {gridCells.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className={cx(styles.monthCell, styles.monthCellEmpty)} />

            // Aggregate Data Calculation
            let bookedCount = 0
            filteredUnits.forEach(u => {
              const resList = unitReservations.get(u.id) || []
              const isBooked = resList.some(r => {
                const cIn = parseDate(r.checkIn)
                const cOut = parseDate(r.checkOut)
                return date >= cIn && date < cOut 
              })
              if (isBooked) bookedCount++
            })

            const isToday = date.getTime() === new Date('2026-07-20T00:00:00Z').getTime() // Mock today

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

  const renderYearView = () => {
    const year = baseDate.getUTCFullYear()
    
    return (
      <div className={styles.monthViewWrap}>
        <div className={styles.yearGrid}>
          {FULL_MONTHS.map((monthName, idx) => {
            // For MVP mock, only July 2026 has data.
            const hasData = (year === 2026 && idx === 6)
            
            return (
              <div 
                key={monthName} 
                className={styles.yearCard}
                onClick={() => {
                  setBaseDate(new Date(Date.UTC(year, idx, 20)))
                  setViewMode('month')
                }}
              >
                <div className={styles.yearMonthName}>{monthName}</div>
                {hasData ? (
                  <div className={styles.yearData} style={{ color: 'var(--success)', fontWeight: 600 }}>
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


  return (
    <div className={styles.page}>
      {/* <header className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Multi-calendar</h1>
            <Badge variant="success">MVP</Badge>
            <span className={styles.subtitle} style={{ fontSize: '11px', marginTop: 0 }}>PRD 7.3</span>
          </div>
          <p className={styles.subtitle}>
            Availability across every unit. Click an open day to create a booking.
          </p>
        </div>
        <div className={styles.metrics}>
          <StatCard label="Listings" value={filteredUnits.length.toString()} className={styles.statBox} />
          <StatCard label="Occupancy" value="81%" delta={{ value: " 2%", positive: true }} />
          <StatCard label="Revenue" value="$42.2K" delta={{ value: " 2%", positive: true }} />
        </div>
      </header> */}

      <div className={styles.toolbar}>
        <div className={styles.navGroup}>
          <Button variant="outline" size="icon" style={{ height: '32px', width: '32px' }} onClick={handlePrev}>
            <ChevronLeft size={16}/>
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>Today</Button>
          <Button variant="outline" size="icon" style={{ height: '32px', width: '32px' }} onClick={handleNext}>
            <ChevronRight size={16}/>
          </Button>
          
          <span className={styles.dateRange}>
            {getRangeText()}
          </span>

          <div className={styles.segmentControl}>
            {(['day', 'month', 'year'] as const).map(mode => (
              <button 
                key={mode}
                className={styles.segmentBtn}
                data-active={viewMode === mode}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filters}>
          <div className={styles.customDropdown} ref={typeRef}>
            <Button variant="outline" size="sm" onClick={() => setShowTypeMenu(!showTypeMenu)}>
              {typeFilter === 'all' ? 'All Types' : typeFilter} <ChevronDown size={14} className="ml-2"/>
            </Button>
            {showTypeMenu && (
              <div className={styles.customMenu}>
                {typeOptions.map(opt => (
                  <div 
                    key={opt} className={styles.customMenuItem} data-active={typeFilter === opt}
                    onClick={() => { setTypeFilter(opt); setShowTypeMenu(false) }}
                  >
                    <span style={{ textTransform: 'capitalize' }}>{opt === 'all' ? 'All Types' : opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.customDropdown} ref={locRef}>
            <Button variant="outline" size="sm" onClick={() => setShowLocMenu(!showLocMenu)}>
              {locFilter === 'all' ? 'All Locations' : locFilter.split(',')[0]} <ChevronDown size={14} className="ml-2"/>
            </Button>
            {showLocMenu && (
              <div className={styles.customMenu}>
                {locOptions.map(opt => (
                  <div 
                    key={opt} className={styles.customMenuItem} data-active={locFilter === opt}
                    onClick={() => { setLocFilter(opt); setShowLocMenu(false) }}
                  >
                    {opt === 'all' ? 'All Locations' : opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.customDropdown} ref={chanRef}>
            <Button variant="outline" size="sm" onClick={() => setShowChanMenu(!showChanMenu)}>
              {CHANNEL_OPTIONS.find(c => c.value === channelFilter)?.label} <ChevronDown size={14} className="ml-2"/>
            </Button>
            {showChanMenu && (
              <div className={styles.customMenu}>
                {CHANNEL_OPTIONS.map(opt => (
                  <div 
                    key={opt.value} className={styles.customMenuItem} data-active={channelFilter === opt.value}
                    onClick={() => { setChannelFilter(opt.value); setShowChanMenu(false) }}
                  >
                    {opt.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the active view mode */}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'year' && renderYearView()}
      
    </div>
  )
}