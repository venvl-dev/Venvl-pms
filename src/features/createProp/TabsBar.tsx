import styles from './CreateProperty.module.css'
import type { CreatePropertyTab } from './types'
import { Icon } from '@/components/core/Icon'

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
          className={`${styles.tab} ${currentTab === tab ? styles.activeTab : ''} ${completedTabs.slice(0, completedTabs.length - 1).includes(tab) && styles.doneTab}`}
        >
          <Icon
            className={styles.tabIcon}
            name={completedTabs.slice(0, completedTabs.length - 1).includes(tab) ? 'donetab' : tab}
          />
          <span>{tab}</span>
        </div>
      ))}
    </div>
  )
}
