import { Link, useLocation } from 'react-router-dom'
import { Search, Bell } from 'lucide-react'
import { sectionsFor, findModuleByPath, DEMO_ROLE } from '@/app/modules'
import { cx } from '@/lib/cx'
import styles from './TopNav.module.css'

export function TopNav() {
  const { pathname } = useLocation()
  const sections = sectionsFor(DEMO_ROLE)
  const activeGroup = findModuleByPath(pathname)?.group

  return (
    <header className={styles.bar}>
      <Link to="/" className={styles.brand}>
        <img src="images\venvl-mark.svg" alt="" className={styles.mark} />
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

      <div className={styles.cluster}>
        <button type="button" className={styles.iconBtn} aria-label="Search"><Search /></button>
        <button type="button" className={styles.iconBtn} aria-label="Notifications"><Bell /></button>
        <span className={styles.orgChip}>Nile View Rentals</span>
        <div className={styles.userChip}>
          <span className={styles.avatar}>SH</span>
          <span className={styles.userMeta}>
            <span className={styles.userName}>Sara Hassan</span>
            <span className={styles.userRole}>Org admin</span>
          </span>
        </div>
      </div>
    </header>
  )
}
