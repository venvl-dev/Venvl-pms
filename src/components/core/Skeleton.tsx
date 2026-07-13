import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './Skeleton.module.css'
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx(styles.skeleton, className)} {...props} />
}
