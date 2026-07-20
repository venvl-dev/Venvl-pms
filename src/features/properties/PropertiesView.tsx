import { useState, useMemo, useRef, useEffect, Fragment } from 'react'
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Plus, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Globe,
  Calendar,
  ChevronUp
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
    'expedia': { color: '#FFC72C', initial: 'E' },
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
  
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set())
  
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ALL_COLUMNS.forEach(col => initial[col.id] = col.defaultVisible)
    return initial
  })

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

  const childrenMap = useMemo(() => {
    const map = new Map<string, Property[]>()
    MOCK_PROPERTIES.filter(p => p.type === 'child').forEach(child => {
      if (!child.parentId) return
      if (!map.has(child.parentId)) map.set(child.parentId, [])
      map.get(child.parentId)!.push(child)
    })
    return map
  }, [])

  const rootProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(prop => {
      if (prop.type === 'child') return false 

      const matchesSearch = prop.name.toLowerCase().includes(search.toLowerCase()) || 
                            prop.id.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || prop.status === statusFilter
      const matchesChannel = channelFilter === 'all' || prop.channels.includes(channelFilter as BookingChannel)
      
      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [search, statusFilter, channelFilter])

  const totalPages = Math.ceil(rootProperties.length / rowsPerPage) || 1
  const paginatedRoots = rootProperties.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1)
  }, [totalPages, currentPage])

  const toggleColumn = (id: string) => {
    setVisibleCols(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleExpand = (id: string) => {
    setExpandedParents(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
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

      {/* --- DESKTOP TABLE VIEW --- */}
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
              {paginatedRoots.length === 0 ? (
                <tr>
                  <td colSpan={Object.values(visibleCols).filter(Boolean).length + 1} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}>
                    No properties found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedRoots.map(prop => {
                  const isExpanded = expandedParents.has(prop.id)
                  const children = childrenMap.get(prop.id) || []

                  return (
                    <Fragment key={prop.id}>
                      <tr 
                        className={cx(styles.tr, prop.type === 'parent' && styles.rowParent)}
                        onClick={() => prop.type === 'parent' && toggleExpand(prop.id)}
                      >
                        {visibleCols.listing && (
                        <td className={styles.td}>
                            <div className={styles.listingCell}>
                              {prop.type === 'parent' ? (
                                <ChevronRightIcon 
                                  size={16} 
                                  className={cx(styles.expandIcon, isExpanded && styles.expandIconExpanded)} 
                                />
                              ) : (
                                <div style={{ width: '16px', marginRight: '0.25rem', flexShrink: 0 }} /> 
                              )}
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
                          <div className={styles.actionsCell} onClick={e => e.stopPropagation()}>
                            <Button variant="secondary" size="icon" aria-label="View in Calendar">
                              <Calendar size={14} />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="More actions">
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && children.map((child, index) => (
                        <tr 
                          key={child.id} 
                          className={cx(styles.tr, styles.rowChild, index === children.length - 1 && styles.lastChild)}
                        >
                          {visibleCols.listing && (
                            <td className={styles.td}>
                                <div className={styles.childListingCell}>
                                  <img src={child.image} alt="" className={styles.childThumbnail} />
                                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <div className={styles.cellPrimary}>{child.name}</div>
                                      <div className={styles.cellSecondary}>Unit ID: {child.id}</div>
                                  </div>
                                </div>
                            </td>
                          )}
                          
                          {visibleCols.id && (
                            <td className={styles.td}><span className={styles.cellSecondary}>{child.id}</span></td>
                          )}
                          
                          {visibleCols.type && (
                            <td className={styles.td}>
                              <span style={{ textTransform: 'capitalize' }} className={styles.cellSecondary}>{child.type}</span>
                            </td>
                          )}
                          
                          {visibleCols.capacity && (
                            <td className={styles.td}>
                              <div className={styles.cellPrimary}>{child.bedrooms} Bed</div>
                              <div className={styles.cellSecondary}>{child.bathrooms} Bath</div>
                            </td>
                          )}
                          
                          {visibleCols.location && (
                            <td className={styles.td}>
                              <span className={styles.cellSecondary}>{child.location}</span>
                            </td>
                          )}
                          
                          {visibleCols.channels && (
                            <td className={styles.td}>
                              {child.channels.length > 0 ? renderChannelCluster(child.channels) : <span className={styles.cellSecondary}>None</span>}
                            </td>
                          )}
                          
                          {visibleCols.status && (
                            <td className={styles.td}>{getStatusBadge(child.status)}</td>
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
                      ))}
                    </Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.mobileList}>
        {paginatedRoots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--muted-foreground)' }}>
            No properties found matching your criteria.
          </div>
        ) : (
          paginatedRoots.map(prop => {
            const isExpanded = expandedParents.has(prop.id)
            const children = childrenMap.get(prop.id) || []

            return (
              <div key={prop.id} className={styles.mobileCardWrap}>
                <div 
                  className={cx(prop.type === 'parent' && styles.isParent)}
                >
                  <div 
                    className={styles.mobileCardTop}
                    onClick={() => prop.type === 'parent' && toggleExpand(prop.id)}
                  >
                    <img src={prop.image} alt="" className={styles.mobileCardImage} />
                    
                    <div className={styles.mobileCardInfo}>
                      <div className={styles.mobileCardTitleRow}>
                        <div>
                          <div className={styles.mobileCardTitle}>{prop.name}</div>
                          <div className={styles.mobileCardSub}>{prop.location}</div>
                        </div>
                        {prop.type === 'parent' ? (
                          <ChevronRightIcon 
                            size={20} 
                            className={cx(styles.expandIcon, isExpanded && styles.expandIconExpanded)} 
                          />
                        ) : (
                          <Button variant="ghost" size="icon" style={{ width: '28px', height: '28px', margin: '-4px' }}>
                            <MoreHorizontal size={16} />
                          </Button>
                        )}
                      </div>
                      
                      <div className={styles.mobileCardMetrics}>
                        <div className={styles.mobileCardMetric}>
                          <span style={{ textTransform: 'capitalize' }}>{prop.type}</span>
                        </div>
                        <div className={styles.mobileCardMetric}>
                          • {prop.bedrooms} Bed, {prop.bathrooms} Bath
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mobileCardBottom}>
                    {prop.channels.length > 0 ? renderChannelCluster(prop.channels) : <span className={styles.mobileCardSub}>No channels</span>}
                    {getStatusBadge(prop.status)}
                  </div>
                </div>

                {isExpanded && children.length > 0 && (
                  <div className={styles.mobileChildren} onClick={e => e.stopPropagation()}>
                    {children.map((child, index) => (
                      <div key={child.id} className={cx(styles.mobileChildCard, index === children.length - 1 && styles.lastChild)}>
                        <img src={child.image} alt="" className={styles.mobileChildImage} />
                        
                        <div className={styles.mobileCardInfo}>
                          <div className={styles.mobileCardTitleRow}>
                            <div>
                              <div className={styles.mobileCardTitle}>{child.name}</div>
                              <div className={styles.mobileCardSub}>Unit ID: {child.id}</div>
                            </div>
                            <Button variant="ghost" size="icon" style={{ width: '24px', height: '24px', margin: '-4px' }}>
                              <MoreHorizontal size={14} />
                            </Button>
                          </div>
                          
                          <div className={styles.mobileCardMetrics} style={{ marginTop: '0.25rem', paddingTop: 0 }}>
                            <div className={styles.mobileCardMetric}>
                              {child.bedrooms} Bed
                            </div>
                            <div style={{ transform: 'scale(0.8)', transformOrigin: 'left center' }}>
                              {getStatusBadge(child.status)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
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
              {rowsPerPage} <ChevronUp size={12} className="text-muted-foreground" />
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
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <span className={styles.pageInfo}>
            {rootProperties.length === 0 ? 0 : ((currentPage - 1) * rowsPerPage) + 1}-
            {Math.min(currentPage * rowsPerPage, rootProperties.length)} of {rootProperties.length}
          </span>
          
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
  )
}