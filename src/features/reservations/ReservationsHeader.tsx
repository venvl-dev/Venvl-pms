import { useState, useRef, useEffect } from 'react'
import { Plus, ChevronDown, Download } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { cx } from '@/lib/cx'
import styles from './ReservationsView.module.css'

interface Props {
  isExporting: boolean
  onExport: (type: 'visible' | 'all') => void
}

export function ReservationsHeader({ isExporting, onExport }: Props) {
  const [showExportMenu, setShowExportMenu] = useState(false)
  const exportRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node))
        setShowExportMenu(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExport = (type: 'visible' | 'all') => {
    setShowExportMenu(false)
    onExport(type)
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Reservations</h1>
      <div className={styles.headerActions}>
        <div className={styles.customDropdown} ref={exportRef}>
          <Button
            variant="outline"
            onClick={() => setShowExportMenu(!showExportMenu)}
            disabled={isExporting}
          >
            <Download size={16} /> {isExporting ? 'Exporting...' : 'Export CSV'}
            <ChevronDown size={14} className="ml-2" />
          </Button>

          {showExportMenu && (
            <div className={cx(styles.customMenu, styles.alignRight)} style={{ width: '200px' }}>
              <div className={styles.customMenuItem} onClick={() => handleExport('visible')}>
                Export Current Page
              </div>
              <div className={styles.customMenuItem} onClick={() => handleExport('all')}>
                Export All Records
              </div>
            </div>
          )}
        </div>

        <Button>
          <Plus size={16} /> New Reservation
        </Button>
      </div>
    </header>
  )
}
