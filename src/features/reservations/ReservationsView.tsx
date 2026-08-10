import { useEffect, useState } from 'react'
import { Button } from '@/components/core/Button'
import styles from './ReservationsView.module.css'
import { useExportAll, useReservations } from './hooks'
import { toast } from 'sonner'
import { ALL_COLUMNS } from './Constants'
import { exportReservationsCsv } from './exportCsv'
import { ReservationsHeader } from './ReservationsHeader'
import { ReservationsPagination } from './ReservationPagination'
import { ReservationsMobileCards } from './ReservationsMobileCards'
import { ReservationsTable } from './ReservationsTable'
import { ReservationsToolbar } from './ReservationsToolbar'
import { useNavigate } from 'react-router-dom'

export function ReservationsView() {
  const navigate = useNavigate()
  
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState(search)
  const [statusFilter, setStatusFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    ALL_COLUMNS.forEach((col) => (initial[col.id] = col.defaultVisible))
    return initial
  })

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useReservations({
    page: currentPage,
    limit: rowsPerPage,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
    ...(sourceFilter !== 'all' ? { source: sourceFilter } : {}),
    ...(startDate ? { startDate: `${startDate}T00:00:00.000Z` } : {}),
    ...(endDate ? { endDate: `${endDate}T23:59:59.999Z` } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  })

  const { mutateAsync: fetchAllForExport, isPending: isExportingAll } = useExportAll()
  
  const reservations = response?.data ?? []
  
  const totalCount = response?.meta?.total ?? 0
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1

  const toggleColumn = (id: string) => {
    setVisibleCols((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleExportCSV = async (type: 'visible' | 'all') => {
    try {
      await exportReservationsCsv(type, {
        visibleRows: reservations,
        fetchAll: fetchAllForExport,
      })
    } catch (error) {
      console.error('Failed to export reservations:', error)
      toast.error('Export failed. Please try again.')
    }
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <h1 className={styles.title}>Reservations</h1>
        </header>
        <div
          className={styles.tableCard}
          style={{ padding: 'var(--space-8)', textAlign: 'center' }}
        >
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-4)' }}>
            Couldn't load reservations.
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
      <ReservationsHeader isExporting={isExportingAll} onExport={handleExportCSV} />
      <ReservationsToolbar
        search={search}
        onSearchChange={(v) => {
          setSearch(v)
          setCurrentPage(1)
        }}
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v)
          setCurrentPage(1)
        }}
        sourceFilter={sourceFilter}
        onSourceChange={(v) => {
          setSourceFilter(v)
          setCurrentPage(1)
        }}
        startDate={startDate}
        onStartDateChange={(v) => {
          setStartDate(v)
          setCurrentPage(1)
        }}
        endDate={endDate}
        onEndDateChange={(v) => {
          setEndDate(v)
          setCurrentPage(1)
        }}
        visibleCols={visibleCols}
        onToggleColumn={toggleColumn}
      />
      <ReservationsTable
        isLoading={isLoading}
        items={reservations}
        visibleCols={visibleCols}
        rowsPerPage={rowsPerPage}
        onOpen={(id) => navigate(`/reservations/${id}`)}
      />
      <ReservationsMobileCards
        isLoading={isLoading}
        items={reservations}
        rowsPerPage={rowsPerPage}
        onOpen={(id) => navigate(`/reservations/${id}`)}
      />
      <ReservationsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        isLoading={isLoading}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={setRowsPerPage}
      />
    </div>
  )
}