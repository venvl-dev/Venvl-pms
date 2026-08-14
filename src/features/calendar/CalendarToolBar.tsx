import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/core/Button'
// import { cx } from '@/lib/cx'
import styles from './MultiCalendarView.module.css'
import { CHANNEL_OPTIONS, type ViewMode } from './Constants'

interface Props {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  rangeText: string

  typeFilter: string
  setTypeFilter: (v: string) => void
  typeOptions: string[]

  locFilter: string
  setLocFilter: (v: string) => void
  locOptions: string[]

  channelFilter: string
  setChannelFilter: (v: string) => void
}

export function CalendarToolbar({
  viewMode,
  setViewMode,
  onPrev,
  onNext,
  onToday,
  rangeText,
  typeFilter,
  setTypeFilter,
  typeOptions,
  locFilter,
  setLocFilter,
  locOptions,
  channelFilter,
  setChannelFilter,
}: Props) {
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

  return (
    <div className={styles.toolbar}>
      <div className={styles.navGroup}>
        <Button
          variant="outline"
          size="icon"
          style={{ height: '32px', width: '32px' }}
          onClick={onPrev}
        >
          <ChevronLeft size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={onToday}>
          Today
        </Button>
        <Button
          variant="outline"
          size="icon"
          style={{ height: '32px', width: '32px' }}
          onClick={onNext}
        >
          <ChevronRight size={16} />
        </Button>

        <span className={styles.dateRange}>{rangeText}</span>

        <div className={styles.segmentControl}>
          {(['day', 'month', 'year'] as const).map((mode) => (
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
            {typeFilter === 'all' ? 'All Types' : typeFilter}{' '}
            <ChevronDown size={14} className="ml-2" />
          </Button>
          {showTypeMenu && (
            <div className={styles.customMenu}>
              {typeOptions.map((opt) => (
                <div
                  key={opt}
                  className={styles.customMenuItem}
                  data-active={typeFilter === opt}
                  onClick={() => {
                    setTypeFilter(opt)
                    setShowTypeMenu(false)
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>
                    {opt === 'all' ? 'All Types' : opt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.customDropdown} ref={locRef}>
          <Button variant="outline" size="sm" onClick={() => setShowLocMenu(!showLocMenu)}>
            {locFilter === 'all' ? 'All Locations' : locFilter.split(',')[0]}{' '}
            <ChevronDown size={14} className="ml-2" />
          </Button>
          {showLocMenu && (
            <div className={styles.customMenu}>
              {locOptions.map((opt) => (
                <div
                  key={opt}
                  className={styles.customMenuItem}
                  data-active={locFilter === opt}
                  onClick={() => {
                    setLocFilter(opt)
                    setShowLocMenu(false)
                  }}
                >
                  {opt === 'all' ? 'All Locations' : opt}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.customDropdown} ref={chanRef}>
          <Button variant="outline" size="sm" onClick={() => setShowChanMenu(!showChanMenu)}>
            {CHANNEL_OPTIONS.find((c) => c.value === channelFilter)?.label}{' '}
            <ChevronDown size={14} className="ml-2" />
          </Button>
          {showChanMenu && (
            <div className={styles.customMenu}>
              {CHANNEL_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  className={styles.customMenuItem}
                  data-active={channelFilter === opt.value}
                  onClick={() => {
                    setChannelFilter(opt.value)
                    setShowChanMenu(false)
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}