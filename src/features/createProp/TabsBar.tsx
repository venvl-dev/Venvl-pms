import styles from './CreateProperty.module.css'
import type { CreatePropertyTab } from './CreateProperty'

type tabsBarProps = {
  currentTab: CreatePropertyTab
  tabs: CreatePropertyTab[]
  completedTabs: CreatePropertyTab[]
}

export default function TabsBar({ completedTabs, currentTab, tabs }: tabsBarProps) {
  return (
    <div className={styles.tabsBar}>
      {tabs.map((tab) => (
        <div
          key={tab}
          className={`${styles.tab} ${completedTabs.includes(tab) || currentTab === tab ? styles.activeTab : ''}`}
        >
          <span>{tab}</span>
          <span className={styles.nextTab}>{tab !== 'Instructions' && '>>'}</span>
        </div>
      ))}
    </div>
  )
}
