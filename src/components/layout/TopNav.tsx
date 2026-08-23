import { Link, useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import { sectionsFor, findModuleByPath, DEMO_ROLE } from '@/app/modules'
import { cx } from '@/lib/cx'
import styles from './TopNav.module.css'
import { useGetMe } from '@/features/settings/hooks'
import { Skeleton } from '@/components/core/Skeleton'

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function roleLabel(role: string) {
  return role
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function TopNav() {
  const { pathname } = useLocation()
  const sections = sectionsFor(DEMO_ROLE)
  const activeGroup = findModuleByPath(pathname)?.group
  const { data, isLoading } = useGetMe()
  const me=data?.data
  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand}>
        <img src="/images/venvl-mark.svg" alt="" className={styles.mark} />
        <span className={styles.brandName}>VENVL Go</span>
      </Link>

      <nav className={cx(styles.sections, 'no-scrollbar')}>
        {sections.map((s) => (
          <Link
            key={s.group}
            to={s.modules[0]!.path}
            className={cx(styles.pill, s.group === activeGroup && styles.pillActive)}
          >
            {s.group}
          </Link>
        ))}
      </nav>

    {isLoading ? (
  <>
    <Skeleton style={{ height: '1.5rem', width: '7rem', borderRadius: '999px' }} />
    <Skeleton style={{ height: '2rem', width: '8rem', borderRadius: '999px' }} />
  </>
) : (
  <>
    <span className={styles.orgChip}>{me?.organizationName}</span>
    <div className={styles.userChip}>
      <span className={styles.avatar}>{initialsOf(me?.name ?? '')}</span>
      <span className={styles.userMeta}>
        <span className={styles.userName}>{me?.name}</span>
        <span className={styles.userRole}>{roleLabel(me?.role ?? '')}</span>
      </span>
    </div>
  </>
)}


    </header>
  )
}
