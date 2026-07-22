import { useState, useRef, useEffect } from 'react'
import {
  Search, Filter, SlidersHorizontal, Plus, Calendar, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Badge } from '@/components/core/Badge'
import { Skeleton } from '@/components/core/Skeleton'
import { cx } from '@/lib/cx'
import styles from './ReservationsView.module.css'

import { useReservations } from './hooks'
import type { Reservation } from './types'

const ALL_COLUMNS = [
  { id: 'id', label: 'Booking ID', defaultVisible: false },
  { id: 'guest', label: 'Guest Name', defaultVisible: true },
  { id: 'dates', label: 'Check-in / Out', defaultVisible: true },
  { id: 'property', label: 'Property & Unit', defaultVisible: true },
  { id: 'channel', label: 'Channel', defaultVisible: false },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'amount', label: 'Total', defaultVisible: false },
  { id: 'balance', label: 'Balance Due', defaultVisible: true },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'checked_out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
]

const formatDate = (dateStr: string) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateStr))
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

const getStatusBadge = (status: Reservation['status']) => {
  switch (status) {
    case 'confirmed': return <Badge variant="info">Confirmed</Badge>
    case 'checked_in': return <Badge variant="success">Checked In</Badge>
    case 'checked_out': return <Badge variant="secondary">Checked Out</Badge>
    case 'cancelled': return <Badge variant="destructive">Cancelled</Badge>
  }
}

export function ReservationsView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showRowsMenu, setShowRowsMenu] = useState(false)
  const [showColDropdown, setShowColDropdown] = useState(false)
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ALL_COLUMNS.forEach(col => initial[col.id] = col.defaultVisible)
    return initial
  })

  const statusRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setShowStatusMenu(false)
      if (rowsRef.current && !rowsRef.current.contains(event.target as Node)) setShowRowsMenu(false)
      if (colRef.current && !colRef.current.contains(event.target as Node)) setShowColDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: response, isLoading } = useReservations({
    page: currentPage,
    limit: rowsPerPage,
    search,
    status: statusFilter
  })

  const reservations = response?.data ?? []
  const meta = response?.meta ?? { totalCount: 0, totalPages: 1, currentPage: 1, limit: rowsPerPage }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1) 
  }

  const toggleColumn = (id: string) => {
    setVisibleCols(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const activeStatusLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label
  const visibleColCount = Object.values(visibleCols).filter(Boolean).length

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Reservations</h1>
        <Button><Plus size={16} /> New Reservation</Button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <Input 
              placeholder="Search by name or ID..." 
              className={styles.searchInput}
              value={search}
              onChange={handleSearchChange}
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
                  {STATUS_OPTIONS.map(opt => (
                    <div 
                      key={opt.value}
                      className={styles.customMenuItem}
                      data-active={statusFilter === opt.value}
                      onClick={() => {
                        setStatusFilter(opt.value)
                        setShowStatusMenu(false)
                        setCurrentPage(1) 
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
                {ALL_COLUMNS.map(col => (
                  <label key={col.id} className={styles.dropdownItem} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input 
                      type="checkbox" 
                      className={styles.checkbox}
                      checked={visibleCols[col.id]}
                      onChange={() => toggleColumn(col.id)}
                    />
                    {col.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DESKTOP TABLE VIEW --- */}
      <div className={styles.tableCard}>
        <div className={cx(styles.tableScroll, 'no-scrollbar')}>
          <table className={styles.table}>
            <thead>
              <tr>
                {visibleCols.id && <th className={styles.th}>Booking ID</th>}
                {visibleCols.guest && <th className={styles.th}>Guest</th>}
                {visibleCols.dates && <th className={styles.th}>Check-in / Out</th>}
                {visibleCols.property && <th className={styles.th}>Property & Unit</th>}
                {visibleCols.channel && <th className={styles.th}>Channel</th>}
                {visibleCols.status && <th className={styles.th}>Status</th>}
                {visibleCols.amount && <th className={styles.th}>Total</th>}
                {visibleCols.balance && <th className={styles.th}>Balance</th>}
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: rowsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className={styles.tr}>
                    {visibleCols.id && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '80px' }}/></td>}
                    {visibleCols.guest && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '120px' }}/></td>}
                    {visibleCols.dates && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '100px' }}/><Skeleton style={{ height: '1rem', width: '80px', marginTop: '4px' }}/></td>}
                    {visibleCols.property && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '140px' }}/><Skeleton style={{ height: '1rem', width: '60px', marginTop: '4px' }}/></td>}
                    {visibleCols.channel && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '80px' }}/></td>}
                    {visibleCols.status && <td className={styles.td}><Skeleton style={{ height: '1.5rem', width: '80px', borderRadius: '12px' }}/></td>}
                    {visibleCols.amount && <td className={styles.td}><Skeleton style={{ height: '1.25rem', width: '60px' }}/></td>}
                    {visibleCols.balance && <td className={styles.td}><Skeleton style={{ height: '1.5rem', width: '70px', borderRadius: '12px' }}/></td>}
                    <td className={styles.td}><div className={styles.actionsCell}><Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }}/><Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }}/></div></td>
                  </tr>
                ))
              ) : reservations.length === 0 ? (
                <tr>
                  <td colSpan={visibleColCount + 1} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}>
                    No reservations found matching your criteria.
                  </td>
                </tr>
              ) : (
                reservations.map(res => (
                  <tr key={res.id} className={styles.tr}>
                    {visibleCols.id && <td className={styles.td}><span className={styles.cellSecondary}>{res.id}</span></td>}
                    {visibleCols.guest && (
                      <td className={styles.td}>
                        <div className={styles.cellPrimary}>{res.guestName}</div>
                      </td>
                    )}
                    {visibleCols.dates && (
                      <td className={styles.td}>
                        <div className={styles.cellPrimary}>{formatDate(res.checkIn)}</div>
                        <div className={styles.cellSecondary}>to {formatDate(res.checkOut)}</div>
                      </td>
                    )}
                    {visibleCols.property && (
                      <td className={styles.td}>
                        <div className={styles.cellPrimary}>{res.property}</div>
                        <div className={styles.cellSecondary}>{res.unit}</div>
                      </td>
                    )}
                    {visibleCols.channel && (
                      <td className={styles.td}>
                        <span style={{ textTransform: 'capitalize', fontSize: 'var(--text-xs)' }}>{res.channel}</span>
                      </td>
                    )}
                    {visibleCols.status && <td className={styles.td}>{getStatusBadge(res.status)}</td>}
                    {visibleCols.amount && <td className={styles.td}>{formatCurrency(res.totalAmount)}</td>}
                    {visibleCols.balance && (
                      <td className={styles.td}>
                        {res.balanceDue > 0 ? (
                          <Badge variant="warning">{formatCurrency(res.balanceDue)} Due</Badge>
                        ) : (
                          <Badge variant="success">Paid</Badge>
                        )}
                      </td>
                    )}
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Button variant="secondary" size="icon" aria-label="View in Calendar">
                          <Calendar size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label="More actions">
                          <MoreHorizontal size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- MOBILE CARD VIEW --- */}
      <div className={styles.mobileList}>
        {isLoading ? (
          Array.from({ length: rowsPerPage }).map((_, i) => (
            <div key={`mob-skeleton-${i}`} className={styles.mobileCardWrap}>
              <div className={styles.mobileCardHeader}>
                <div>
                  <Skeleton style={{ height: '1.25rem', width: '120px', marginBottom: '4px' }} />
                  <Skeleton style={{ height: '1rem', width: '160px' }} />
                </div>
                <Skeleton style={{ height: '1.5rem', width: '80px', borderRadius: '12px' }} />
              </div>
              <div className={styles.mobileCardGrid}>
                <div className={styles.mobileCardGridCol}>
                  <Skeleton style={{ height: '10px', width: '80px', marginBottom: '4px' }} />
                  <Skeleton style={{ height: '1.25rem', width: '100px', marginBottom: '2px' }} />
                  <Skeleton style={{ height: '1rem', width: '80px' }} />
                </div>
                <div className={styles.mobileCardGridCol} style={{ alignItems: 'flex-end' }}>
                  <Skeleton style={{ height: '10px', width: '60px', marginBottom: '4px' }} />
                  <Skeleton style={{ height: '1.5rem', width: '70px', borderRadius: '12px' }} />
                </div>
              </div>
              <div className={styles.mobileCardFooter}>
                <div className={styles.mobileCardMeta}>
                  <Skeleton style={{ height: '1rem', width: '60px', marginBottom: '2px' }} />
                  <Skeleton style={{ height: '0.75rem', width: '40px' }} />
                </div>
                <div className={styles.mobileCardActions}>
                  <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
                  <Skeleton style={{ height: '32px', width: '32px', borderRadius: '8px' }} />
                </div>
              </div>
            </div>
          ))
        ) : reservations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}>
            No reservations found matching your criteria.
          </div>
        ) : (
          reservations.map(res => (
            <div key={res.id} className={styles.mobileCardWrap}>
              <div className={styles.mobileCardHeader}>
                <div>
                  <div className={styles.mobileCardTitle}>{res.guestName}</div>
                  <div className={styles.mobileCardProperty}>
                    {res.property} <span className={styles.mobileCardUnit}>• {res.unit}</span>
                  </div>
                </div>
                <div>{getStatusBadge(res.status)}</div>
              </div>

              <div className={styles.mobileCardGrid}>
                <div className={styles.mobileCardGridCol}>
                  <span className={styles.mobileCardLabel}>Check-in / Out</span>
                  <span className={styles.mobileCardValue}>{formatDate(res.checkIn)}</span>
                  <span className={styles.mobileCardValue} style={{ fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' }}>
                    to {formatDate(res.checkOut)}
                  </span>
                </div>
                <div className={styles.mobileCardGridCol} style={{ alignItems: 'flex-end', textAlign: 'right' }}>
                  <span className={styles.mobileCardLabel}>Balance Due</span>
                  <span className={styles.mobileCardValue} style={{ marginTop: '2px' }}>
                    {res.balanceDue > 0 ? (
                      <Badge variant="warning">{formatCurrency(res.balanceDue)} Due</Badge>
                    ) : (
                      <Badge variant="success">Paid</Badge>
                    )}
                  </span>
                </div>
              </div>

              <div className={styles.mobileCardFooter}>
                <div className={styles.mobileCardMeta}>
                  <span className={styles.mobileCardId}>{res.id}</span>
                  <span className={styles.mobileCardChannel}>{res.channel}</span>
                </div>
                <div className={styles.mobileCardActions}>
                  <Button variant="secondary" size="icon" aria-label="View in Calendar">
                    <Calendar size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="More actions">
                    <MoreHorizontal size={14} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.pagination}>
        <div className={styles.rowsPerPage}>
          <span className={styles.pageInfo}>Rows per page</span>
          
          <div className={styles.customDropdown} ref={rowsRef}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowRowsMenu(!showRowsMenu)}
              style={{ width: '64px', justifyContent: 'space-between' }}
            >
              {rowsPerPage} <ChevronDown size={12} className="text-muted-foreground" />
            </Button>
            {showRowsMenu && (
              <div className={cx(styles.customMenu, styles.alignTop)} style={{ minWidth: 'auto', width: '100%' }}>
                {[5, 10, 20, 50].map(num => (
                  <div 
                    key={num}
                    className={styles.customMenuItem}
                    data-active={rowsPerPage === num}
                    onClick={() => {
                      setRowsPerPage(num)
                      setCurrentPage(1)
                      setShowRowsMenu(false)
                    }}
                    style={{ textAlign: 'center' }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.pageControls}>
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === 1 || isLoading}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className={styles.pageInfo}>
            {meta.totalCount === 0 ? 0 : ((currentPage - 1) * rowsPerPage) + 1}-
            {Math.min(currentPage * rowsPerPage, meta.totalCount)} of {meta.totalCount}
          </span>
          
          <Button 
            variant="outline" 
            size="icon" 
            disabled={currentPage === meta.totalPages || meta.totalPages === 0 || isLoading}
            onClick={() => setCurrentPage(p => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}