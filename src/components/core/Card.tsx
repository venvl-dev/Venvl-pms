import type { HTMLAttributes } from 'react'
import { cx } from '@/lib/cx'
import styles from './Card.module.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.card, className)} {...props}>
      {children}
    </div>
  )
}
export function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.header, className)} {...props}>
      {children}
    </div>
  )
}
export function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.title, className)} {...props}>
      {children}
    </div>
  )
}
export function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.description, className)} {...props}>
      {children}
    </div>
  )
}
export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.content, className)} {...props}>
      {children}
    </div>
  )
}
export function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <div className={cx(styles.footer, className)} {...props}>
      {children}
    </div>
  )
}
