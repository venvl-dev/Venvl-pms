import type { ReactNode } from 'react'
import { Card } from './Card'
import { cx } from '@/lib/cx'
import styles from './StatCard.module.css'
export interface StatDelta {
  value: string
  positive?: boolean
}
export interface StatCardProps {
  label: string
  value: string
  delta?: StatDelta
  icon?: ReactNode
  className?: string
}
export function StatCard({ label, value, delta, icon, className }: StatCardProps) {
  return (
    <Card className={className}>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.label}>{label}</span>
          {icon && <span className={styles.icon}>{icon}</span>}
        </div>
        <div className={styles.value}>{value}</div>
        {delta && (
          <div className={cx(styles.delta, delta.positive ? styles.up : styles.down)}>
            {delta.value}
          </div>
        )}
      </div>
    </Card>
  )
}
