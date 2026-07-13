import { useLocation } from 'react-router-dom'
import { findModuleByPath } from '@/app/modules'
import styles from './ModulePlaceholder.module.css'

export function ModulePlaceholder() {
  const { pathname } = useLocation()
  const activeModule = findModuleByPath(pathname)
  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>{activeModule?.title ?? 'Not found'}</h1>
      <p className={styles.desc}>
        This is the {activeModule?.title ?? 'unknown'} page — routing works. Real content comes
        later.
      </p>
    </div>
  )
}
