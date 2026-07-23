import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { cx } from '@/lib/cx'
import styles from './PropertiesView.module.css'

interface Props {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  totalCount: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}

export function PropertiesPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
}: Props) {
  const [showRowsMenu, setShowRowsMenu] = useState(false)
  const rowsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rowsRef.current && !rowsRef.current.contains(event.target as Node)) setShowRowsMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
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
            <div
              className={cx(styles.customMenu, styles.alignTop)}
              style={{ minWidth: 'auto', width: '100%' }}
            >
              {[5, 10, 20, 50].map((num) => (
                <div
                  key={num}
                  className={styles.customMenuItem}
                  data-active={rowsPerPage === num}
                  onClick={() => {
                    onRowsPerPageChange(num)
                    onPageChange(1)
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
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </Button>

        <span className={styles.pageInfo}>
          {totalCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}-
          {Math.min(currentPage * rowsPerPage, totalCount)} of {totalCount}
        </span>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
