import { NavLink, useLocation } from 'react-router-dom'
import { sectionsFor, findModuleByPath, DEMO_ROLE } from '@/app/modules'
import { cx } from '@/lib/cx'
import styles from './SubNav.module.css'

export function SubNav() {
  const { pathname } = useLocation()
  const activeGroup = findModuleByPath(pathname)?.group
  const section = sectionsFor(DEMO_ROLE).find((s) => s.group === activeGroup)

  if (!section || section.modules.length <= 1) return null

  return (
    <div className={cx(styles.row, 'no-scrollbar')}>
      {section.modules.map((m) => (
        <NavLink
          key={m.key}
          to={m.path}
          end={m.path === '/'}
          className={({ isActive }) => cx(styles.tab, isActive && styles.tabActive)}
        >
          <m.icon className={styles.icon} />
          {m.title}
        </NavLink>
      ))}
    </div>
  )
}
