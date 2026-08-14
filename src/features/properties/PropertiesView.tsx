import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/core/Button'
import type { Property, BookingChannel } from './types'
import styles from './PropertiesView.module.css'
import { useNavigate } from 'react-router-dom'
import { useProperties } from './hooks'
import { ALL_COLUMNS } from './Constants'
import { PropertiesPagination } from './PropertiesPagination'
import { PropertiesMobileCards } from './PropertiesMobileCards'
import { PropertiesTable } from './PropertiesTable'
import { PropertiesToolbar } from './PropertiesToolbar'

export function PropertiesView() {
  const navigate = useNavigate()
  
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isError, refetch } = useProperties({
    page: currentPage,
    limit: rowsPerPage
  })

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ALL_COLUMNS.forEach((col) => (initial[col.id] = col.defaultVisible))
    return initial
  })

  const properties = useMemo(() => data?.data ?? [], [data?.data])
  const meta = data?.meta

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1)
  }, [totalPages, currentPage])

  const rootProperties = useMemo(() => {
    return properties.filter((prop) => {
      if (prop.structureType === 'child') return false 
      const searchLower = search.toLowerCase()
      const matchesSearch =
        prop.title?.toLowerCase().includes(searchLower) ||
        prop.id.toLowerCase().includes(searchLower) ||
        prop.children?.some(
          (child) =>
            child.title?.toLowerCase().includes(searchLower) ||
            child.id.toLowerCase().includes(searchLower)
        )

      const matchesStatus = statusFilter === 'all' || prop.status === statusFilter

      const matchesChannel =
        channelFilter === 'all' || prop.channelConnections?.includes(channelFilter as BookingChannel)

      return matchesSearch && matchesStatus && matchesChannel
    })
  }, [properties, search, statusFilter, channelFilter])

  const childrenMap = useMemo(() => {
    const map = new Map<string, Property[]>()
    
    rootProperties.forEach((prop) => {
      if (prop.children && prop.children.length > 0) {
        map.set(prop.id, prop.children)
      }
    })
    
    return map
  }, [rootProperties])

  const toggleColumn = (id: string) => {
    setVisibleCols((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Properties</h1>
        </header>
        <div
          className={styles.tableCard}
          style={{ padding: 'var(--space-8)', textAlign: 'center' }}
        >
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-4)' }}>
            Couldn't load properties.
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Properties</h1>
        <Button onClick={() => navigate('/properties/create-property')}>
          <Plus size={16} /> Add Property
        </Button>
      </header>
      <PropertiesToolbar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v)
          setCurrentPage(1)
        }}
        channelFilter={channelFilter}
        onChannelChange={(v) => {
          setChannelFilter(v)
          setCurrentPage(1)
        }}
        visibleCols={visibleCols}
        onToggleColumn={toggleColumn}
      />
      <PropertiesTable
        isLoading={isLoading}
        items={rootProperties}
        childrenMap={childrenMap}
        visibleCols={visibleCols}
        rowsPerPage={rowsPerPage}
        onOpen={(id) => navigate(`/properties/${id}`)}
      />
      <PropertiesMobileCards
        isLoading={isLoading}
        items={rootProperties}
        childrenMap={childrenMap}
        rowsPerPage={rowsPerPage}
        onOpen={(id) => navigate(`/properties/${id}`)}
      />
      <PropertiesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={meta?.total || 0}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  )
}