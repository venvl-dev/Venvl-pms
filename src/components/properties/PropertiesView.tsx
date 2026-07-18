import { useState, useMemo, useRef, useEffect } from 'react'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Input } from '@/components/core/Input'
import { Badge } from '@/components/core/Badge'
import { cx } from '@/lib/cx'
import { MOCK_PROPERTIES, type Property, type BookingChannel } from './mockProperties'
import styles from './PropertiesView.module.css'

const ALL_COLUMNS = [
  { id: 'listing', label: 'Listing', defaultVisible: true },
  { id: 'id', label: 'Property ID', defaultVisible: false },
  { id: 'type', label: 'Unit Type', defaultVisible: true },
  { id: 'capacity', label: 'Beds/Baths', defaultVisible: false },
  { id: 'location', label: 'Location', defaultVisible: true },
  { id: 'channels', label: 'Channels', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Draft' },
  { value: 'archived', label: 'Archived' },
]

const CHANNEL_OPTIONS = [
  { value: 'all', label: 'All Channels' },
  { value: 'direct', label: 'Direct Booking' },
  { value: 'airbnb', label: 'Airbnb' },
  { value: 'booking.com', label: 'Booking.com' },
  { value: 'vrbo', label: 'Vrbo' },
]

const getStatusBadge = (status: Property['status']) => {
  switch (status) {
    case 'active': return <Badge variant="success">Active</Badge>
    case 'draft': return <Badge variant="secondary">Draft</Badge>
    case 'archived': return <Badge variant="outline">Archived</Badge>
  }
}

const renderChannelCluster = (channels: BookingChannel[]) => {
  const config: Record<BookingChannel, { color: string, initial: string }> = {
    'airbnb': { color: '#FF5A5F', initial: 'A' },
    'booking.com': { color: '#003580', initial: 'B' },
    'vrbo': { color: '#00266b', initial: 'V' },
    'direct': { color: 'var(--primary)', initial: 'D' },
  }

  return (
    <div className={styles.channelCluster}>
      {channels.map((ch) => (
        <div 
          key={ch} 
          className={styles.channelDot} 
          style={{ backgroundColor: config[ch].color }}
          title={ch}
        >
          {config[ch].initial}
        </div>
      ))}
    </div>
  )
}

export function PropertiesView() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [showChannelMenu, setShowChannelMenu] = useState(false)
  const [showRowsMenu, setShowRowsMenu] = useState(false)
  const [showColDropdown, setShowColDropdown] = useState(false)
  
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ALL_COLUMNS.forEach(col => initial[col.id] = col.defaultVisible)
    return initial
  })

  // Refs for outside clicks
  const statusRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<HTMLDivElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)
  const colRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) setShowStatusMenu(false)
      if (channelRef.current && !channelRef.current.contains(event.target as Node)) setShowChannelMenu(false)
      if (rowsRef.current && !rowsRef.current.contains(event.target as Node)) setShowRowsMenu(false)
      if (colRef.current && !colRef.current.contains(event.target as Node)) setShowColDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredData = useMemo(() => {
    return MOCK_PROPERTIES.filter(prop => {
      const matchesSearch = prop.name.toLowerCase().includes(search.toLowerCase()) || 
                            prop.id.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || prop.status === statusFilter
      const matchesChannel = channelFilter === 'all' || prop.channels.includes(channelFilter as BookingChannel)
      
      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [search, statusFilter, channelFilter])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  const toggleColumn = (id: string) => {
    setVisibleCols(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const activeStatusLabel = STATUS_OPTIONS.find(o => o.value === statusFilter)?.label
  const activeChannelLabel = CHANNEL_OPTIONS.find(o => o.value === channelFilter)?.label

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Properties</h1>
        <Button><Plus size={16} /> Add Property</Button>
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <Search size={16} className={styles.searchIcon} />
            <Input 
              placeholder="Search by name or ID..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} className="text-muted-foreground" />
            
            <div className={styles.customDropdown} ref={statusRef}>
              <Button 
                variant="outline" 
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                style={{ width: '150px', justifyContent: 'space-between' }}
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

            <div className={styles.customDropdown} ref={channelRef}>
              <Button 
                variant="outline" 
                onClick={() => setShowChannelMenu(!showChannelMenu)}
                style={{ width: '160px', justifyContent: 'space-between' }}
              >
                {activeChannelLabel} <ChevronDown size={14} className="text-muted-foreground" />
              </Button>
              {showChannelMenu && (
                <div className={styles.customMenu}>
                  {CHANNEL_OPTIONS.map(opt => (
                    <div 
                      key={opt.value}
                      className={styles.customMenuItem}
                      data-active={channelFilter === opt.value}
                      onClick={() => {
                        setChannelFilter(opt.value)
                        setShowChannelMenu(false)
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
              <div className={cx(styles.customMenu, styles.alignRight)} style={{ width: '200px' }}>
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

      <div className={styles.tableCard}>
        <div className={cx(styles.tableScroll, 'no-scrollbar')}>
          <table className={styles.table}>
            <thead>
              <tr>
                {visibleCols.listing && <th className={styles.th}>Listing</th>}
                {visibleCols.id && <th className={styles.th}>Property ID</th>}
                {visibleCols.type && <th className={styles.th}>Unit Type</th>}
                {visibleCols.capacity && <th className={styles.th}>Beds/Baths</th>}
                {visibleCols.location && <th className={styles.th}>Location</th>}
                {visibleCols.channels && <th className={styles.th}>Channels</th>}
                {visibleCols.status && <th className={styles.th}>Status</th>}
                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleCols).filter(Boolean).length + 1} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}>
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map(prop => (
                  <tr key={prop.id} className={styles.tr}>
                    {visibleCols.listing && (
                    <td className={styles.td}>
                        <div className={styles.listingCell}>
                        <img src={prop.image} alt="" className={styles.thumbnail} />
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className={styles.cellPrimary}>{prop.name}</div>
                            <div className={styles.cellSecondary}>{prop.location}</div>
                        </div>
                        </div>
                    </td>
                    )}
                    
                    {visibleCols.id && (
                      <td className={styles.td}><span className={styles.cellSecondary}>{prop.id}</span></td>
                    )}
                    
                    {visibleCols.type && (
                      <td className={styles.td}>
                        <span style={{ textTransform: 'capitalize' }} className={styles.cellPrimary}>{prop.type}</span>
                      </td>
                    )}
                    
                    {visibleCols.capacity && (
                      <td className={styles.td}>
                        <div className={styles.cellPrimary}>{prop.bedrooms} Bed</div>
                        <div className={styles.cellSecondary}>{prop.bathrooms} Bath</div>
                      </td>
                    )}
                    
                    {visibleCols.location && (
                      <td className={styles.td}>
                        <span className={styles.cellSecondary}>{prop.location}</span>
                      </td>
                    )}
                    
                    {visibleCols.channels && (
                      <td className={styles.td}>
                        {prop.channels.length > 0 ? renderChannelCluster(prop.channels) : <span className={styles.cellSecondary}>None</span>}
                      </td>
                    )}
                    
                    {visibleCols.status && (
                      <td className={styles.td}>{getStatusBadge(prop.status)}</td>
                    )}

                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Button variant="secondary" size="icon" aria-label="View in Calendar">
                          <Calendar size={14} />
                        </Button>
                        <Button variant="secondary" size="icon" aria-label="View Booking Site">
                          <Globe size={14} />
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

        <div className={styles.pagination}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
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
            <span className={styles.pageInfo}>
              {filteredData.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage) + 1}-
              {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length}
            </span>
            <div className={styles.buttons}>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}