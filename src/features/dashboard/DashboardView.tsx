import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Calendar,
  Wallet,
  LogIn,
  LogOut,
  CalendarDays,
  Home,
  X,
  CheckCircle
} from 'lucide-react'
import { Card } from '@/components/core/Card'
import { StatCard } from '@/components/core/StatCard'
import { Badge } from '@/components/core/Badge'
import { Button } from '@/components/core/Button'
import styles from './DashboardView.module.css'
import { OperationsList } from './OperationsList'
import { ReservationDrawer } from './ReservationDrawer'
import { ReservationRow } from './ReservationRow'
import { MOCK_DASHBOARD_DATA as MOCK_DATA } from './mockData'

import { useReservations } from '@/features/reservations/hooks'
import type { Reservation } from '@/features/reservations/types'

const CHANNEL_COLORS: Record<string, string> = {
  airbnb: '#ff385c',
  'booking': '#003580',
  vrbo: '#00aaff',
  expedia: '#F1CF31',
  direct: 'var(--primary)',
}

export function DashboardView() {
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(true)
  
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)

  const { startDate, endDate, todayStr } = useMemo(() => {
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0]

    const past = new Date(now)
    past.setDate(now.getDate() - 14) 

    const future = new Date(now)
    future.setDate(now.getDate() + 30) 

    return {
      todayStr,
      startDate: `${past.toISOString().split('T')[0]}T00:00:00.000Z`,
      endDate: `${future.toISOString().split('T')[0]}T23:59:59.999Z`
    }
  }, [])

  const { data: resResponse } = useReservations({
    page: 1,
    limit: 100,
    startDate,
    endDate
  })

  const liveReservations = useMemo(() => resResponse?.data ?? [], [resResponse?.data])

  const { arrivals, departures, staying, upcoming } = useMemo(() => {
    const arr: Reservation[] = []
    const dep: Reservation[] = []
    const stay: Reservation[] = []
    const upc: Reservation[] = []

    liveReservations.forEach((res) => {
      const checkIn = res.startDate.split('T')[0]
      const checkOut = res.endDate.split('T')[0]

      if (checkIn === todayStr) arr.push(res)
      if (checkOut === todayStr) dep.push(res)
      if (checkIn < todayStr && checkOut > todayStr) stay.push(res)
      if (checkIn > todayStr) upc.push(res)
    })

    upc.sort((a, b) => a.startDate.localeCompare(b.startDate))

    return { arrivals: arr, departures: dep, staying: stay, upcoming: upc }
  }, [liveReservations, todayStr])

  const channelDistribution = useMemo(() => {
    if (liveReservations.length === 0) return []

    const counts: Record<string, number> = {}
    liveReservations.forEach((res) => {
      const channel = res.customer?.ota || 'direct'
      counts[channel] = (counts[channel] || 0) + 1
    })

    const total = liveReservations.length
    return Object.entries(counts)
      .map(([channel, count]) => ({
        channel,
        count,
        percentage: (count / total) * 100,
        color: CHANNEL_COLORS[channel] || 'var(--muted-foreground)',
      }))
      .sort((a, b) => b.percentage - a.percentage)
  }, [liveReservations])

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Welcome back, {MOCK_DATA.user.name}</h1>
          <Badge variant="success">MVP</Badge>
          <span className={styles.meta}>{todayStr}</span>
        </div>
        <p className={styles.subtitle}>
          Today across your portfolio
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
              <Button variant="default">Add a property</Button>
            </div>
          </div>
        </section>
      )}

      <section className={styles.channelSection}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
          Active Portfolio Channel Mix
        </div>
        <div className={styles.channelBar}>
          {channelDistribution.map((item) => (
            <div
              key={item.channel}
              className={styles.channelSegment}
              style={{ width: `${item.percentage}%`, background: item.color }}
            />
          ))}
        </div>
        <div className={styles.channelLegend}>
          {channelDistribution.map((item) => (
            <div key={item.channel} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: item.color }} />
              <span style={{ textTransform: 'capitalize' }}>{item.channel}</span>
              <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                {Math.round(item.percentage)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.metricsGrid}>
        <Card className={styles.occCard}>
          <svg className={styles.occChart} viewBox="0 0 36 36">
            <path className={styles.occBg} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={styles.occProgress} strokeDasharray={`${MOCK_DATA.metrics.occupancy}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div className={styles.occInfo}>
            <span className={styles.occValue}>{MOCK_DATA.metrics.occupancy}%</span>
            <span className={styles.occLabel}>Occupancy (30d)</span>
          </div>
        </Card>
        <StatCard label="ADR" value={`$${MOCK_DATA.metrics.adr}`} icon={<TrendingUp size={16}/>} />
        <StatCard label="RevPAR (30d)" value={`$${MOCK_DATA.metrics.revpar}`} icon={<Calendar size={16}/>} />
        <StatCard label="Revenue (30d)" value={`$${MOCK_DATA.metrics.revenue}`} icon={<Wallet size={16}/>} />
        <StatCard label="Check-ins (30d)" value={MOCK_DATA.metrics.checkIns} icon={<LogIn size={16}/>} />
        <StatCard label="Confirmed (30d)" value={MOCK_DATA.metrics.confirmed} icon={<CheckCircle size={16}/>} />
      </section>

      <section className={styles.operationsGrid}>
        <OperationsList
          title="Arrivals"
          icon={LogIn}
          items={arrivals}
          renderItem={(item) => (
            <ReservationRow key={item.id} item={item} onClick={setSelectedRes} />
          )}
        />
        <OperationsList
          title="Departures"
          icon={LogOut}
          items={departures}
          renderItem={(item) => (
            <ReservationRow key={item.id} item={item} onClick={setSelectedRes} />
          )}
        />
        <OperationsList
          title="Staying"
          icon={Home}
          items={staying}
          renderItem={(item) => (
            <ReservationRow key={item.id} item={item} onClick={setSelectedRes} />
          )}
        />
        <OperationsList
          title="Upcoming"
          icon={CalendarDays}
          items={upcoming}
          renderItem={(item) => (
            <ReservationRow key={item.id} item={item} onClick={setSelectedRes} />
          )}
        />
      </section>

      {selectedRes && (
        <ReservationDrawer
          reservation={selectedRes}
          onClose={() => setSelectedRes(null)}
          onNavigate={() => {
            navigate(`/reservations/${selectedRes.id}`)
            setSelectedRes(null)
          }}
        />
      )}
    </div>
  )
}