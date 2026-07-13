import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'
import { SubNav } from './SubNav'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
  return (
    <div className={styles.shell}>
      <TopNav />
      <SubNav />
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
