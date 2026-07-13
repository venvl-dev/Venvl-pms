import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/core/Card'
import { cx } from '@/lib/cx'
import styles from './OperationsList.module.css'

interface OperationsListProps<T> {
  title: string
  icon: LucideIcon
  items: T[]
  renderItem: (item: T, index: number) => ReactNode
}

export function OperationsList<T>({ 
  title, 
  icon: Icon, 
  items, 
  renderItem 
}: OperationsListProps<T>) {
  return (
    <Card className={styles.listCard}>
      <div className={styles.listHeader}>
        <div className={styles.listTitle}>
          <Icon size={16} />
          {title}
        </div>
        <div className={styles.listCount}>{items.length}</div>
      </div>
      
      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyBox}>Nothing scheduled</div>
        </div>
      ) : (
        <div className={cx(styles.listScroll, 'no-scrollbar')}>
          {items.map((item, index) => renderItem(item, index))}
        </div>
      )}
    </Card>
  )
}