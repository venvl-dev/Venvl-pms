import { useState } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  Wallet, 
  LogIn, 
  LogOut, 
  CalendarDays, 
  Home,
  X
} from 'lucide-react'
import { Card } from '@/components/core/Card'
import { StatCard } from '@/components/core/StatCard'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import { cx } from '@/lib/cx'
import styles from './DashboardView.module.css'

import { MOCK_DASHBOARD_DATA as MOCK_DATA } from './mockData'
import { OperationsList } from './OperationsList'

export function DashboardView() {
  const [showBanner, setShowBanner] = useState(true)

  return (
    <div className={styles.page}>    
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Welcome back, {MOCK_DATA.user.name}</h1>
          <Badge variant="success">MVP</Badge>
          <span className={styles.meta}>PRD §7.17</span>
        </div>
        <p className={styles.subtitle}>
          Today across your portfolio — arrivals, departures, and what needs attention.
        </p>
      </header>

      {showBanner && (
        <section className={styles.hero}>
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600" 
            alt="Architectural interior" 
            className={styles.heroImage} 
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className={styles.heroClose}
            onClick={() => setShowBanner(false)}
            aria-label="Dismiss banner"
          >
            <X />
          </Button>
          <div className={styles.heroContent}>
            <span className={styles.heroBadge}>Get Started</span>
            <h2 className={styles.heroTitle}>Bring your portfolio online</h2>
            <p className={styles.heroDesc}>
              Add properties and units, then publish to your done-for-you direct booking site.
            </p>
            <div>
              <Button variant="secondary">Add a property</Button>
            </div>
          </div>
        </section>
      )}

      <section className={styles.grid4}>
        <Card className={styles.occCard}>
          <svg className={styles.occChart} viewBox="0 0 36 36">
            <path className={styles.occBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path 
              className={styles.occProgress} 
              strokeDasharray={`${MOCK_DATA.metrics.occupancy}, 100`} 
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
            />
          </svg>
          <div className={styles.occInfo}>
            <span className={styles.occValue}>{MOCK_DATA.metrics.occupancy}%</span>
            <span className={styles.occLabel}>Occupancy (30d)</span>
          </div>
        </Card>

        <StatCard 
          label="ADR" 
          value={`$${MOCK_DATA.metrics.adr}`} 
          icon={<TrendingUp size={16}/>} 
        />
        <StatCard 
          label="RevPAR (30d)" 
          value={`$${MOCK_DATA.metrics.revpar}`} 
          icon={<Calendar size={16}/>} 
        />
        <StatCard 
          label="Revenue (30d)" 
          value={`$${MOCK_DATA.metrics.revenue}`} 
          icon={<Wallet size={16}/>} 
        />
      </section>

      <section className={styles.grid4}>        
        <OperationsList
          title="Arrivals"
          icon={LogIn}
          items={MOCK_DATA.operations.arrivals}
          renderItem={(item) => (
            <div key={item.id} className={styles.row}>
              <div>
                <div className={styles.rowPrimary}>{item.guest}</div>
                <div className={styles.rowSecondary}>{item.property}</div>
              </div>
              <div className={styles.rowTrailing}>{item.unit}</div>
            </div>
          )}
        />

        <OperationsList
          title="Departures"
          icon={LogOut}
          items={MOCK_DATA.operations.departures}
          renderItem={(item) => (
            <div key={item.id} className={styles.row}>
              <div>
                <div className={styles.rowPrimary}>{item.guest}</div>
                <div className={styles.rowSecondary}>{item.property}</div>
              </div>
              <div className={styles.rowTrailing}>{item.unit}</div>
            </div>
          )}
        />

        <OperationsList
          title="Upcoming"
          icon={CalendarDays}
          items={MOCK_DATA.operations.upcomingReservations}
          renderItem={(item) => (
            <div key={item.id} className={styles.row}>
              <div>
                <div className={styles.rowPrimary}>{item.guest}</div>
                <div className={styles.rowSecondary}>{item.property}</div>
              </div>
              <div className={styles.rowTrailing}>In {item.daysUntil} days</div>
            </div>
          )}
        />

        <OperationsList
          title="Staying"
          icon={Home}
          items={MOCK_DATA.operations.stayingGuests}
          renderItem={(item) => (
            <div key={item.id} className={styles.row}>
              <div>
                <div className={styles.rowPrimary}>{item.guest}</div>
                <div className={styles.rowSecondary}>{item.property}</div>
              </div>
              <div className={styles.rowTrailing}>{item.nightsLeft} nights left</div>
            </div>
          )}
        />

      </section>

      <Card className={styles.attentionCard}>
        <div className={styles.listHeader}>
          <div className={styles.listTitle}>Needs attention</div>
          <div className={styles.listCount} style={{ background: 'var(--warning)', color: 'var(--card)' }}>
            {MOCK_DATA.needsAttention.length}
          </div>
        </div>
        <div className={cx(styles.attentionScroll, 'no-scrollbar')}>
          {MOCK_DATA.needsAttention.map((item) => (
            <div key={item.id} className={styles.row} style={{ alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <span className={styles.rowPrimary}>{item.guest}</span>
                <span className={styles.rowSecondary} style={{ marginTop: 0 }}>{item.property}</span>
              </div>
              <Badge variant="warning">${item.balance} due</Badge>
            </div>
          ))}
        </div>
      </Card>

    </div>
  )
}