import { useState, useRef, useEffect } from 'react'
import { Search, Filter, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { cx } from '@/lib/cx'
import { ALL_COLUMNS, STATUS_OPTIONS } from './Constants'
import styles from './ReservationsView.module.css'

interface Props {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  visibleCols: Record<string, boolean>
  onToggleColumn: (id: string) => void
}

export function ReservationsToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  visibleCols,
  onToggleColumn,
}: Props) {
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showColDropdown, setShowColDropdown] = useState(false)

  const statusRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node))
        setShowStatusMenu(false)
      if (colRef.current && !colRef.current.contains(event.target as Node))
        setShowColDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const activeStatusLabel = STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label

  return (
    <div className={styles.toolbar}>
      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <Input
            placeholder="Search by name or ID..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} className="text-muted-foreground" />
          <div className={styles.customDropdown} ref={statusRef}>
            <Button
              variant="outline"
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              style={{ width: '160px', justifyContent: 'space-between' }}
            >
              {activeStatusLabel} <ChevronDown size={14} className="text-muted-foreground" />
            </Button>
            {showStatusMenu && (
              <div className={styles.customMenu}>
                {STATUS_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={styles.customMenuItem}
                    data-active={statusFilter === opt.value}
                    onClick={() => {
                      onStatusChange(opt.value)
                      setShowStatusMenu(false)
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

      <div className={styles.actions}>
        <div className={styles.customDropdown} ref={colRef}>
          <Button variant="outline" onClick={() => setShowColDropdown(!showColDropdown)}>
            <SlidersHorizontal size={16} /> View
          </Button>
          {showColDropdown && (
            <div className={cx(styles.customMenu, styles.alignRight)} style={{ width: '220px' }}>
              {ALL_COLUMNS.map((col) => (
                <label
                  key={col.id}
                  className={styles.dropdownItem}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={visibleCols[col.id]}
                    onChange={() => onToggleColumn(col.id)}
                  />
                  {col.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
