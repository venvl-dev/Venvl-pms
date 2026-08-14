import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  CalendarDays,
  ChevronLeft,
  DoorOpen,
  Hash,
  MapPin,
  Moon,
  Receipt,
  User,
} from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import { Skeleton } from '@/components/core/Skeleton'
import { getPropertyId, getUnitLabels } from '@/features/properties/mockProperties'
import { formatCurrency, formatDate, getStatusBadge, renderChannel } from './Constants'
import { useReservationId } from './hooks'
import type { BookingChannel } from './types'
import styles from './ReservationDetails.module.css'

const CHANNEL_LABELS: Record<BookingChannel, string> = {
  airbnb: 'Airbnb',
  'booking.com': 'Booking.com',
  vrbo: 'Vrbo',
  expedia: 'Expedia',
  direct: 'Direct Booking',
}

const MS_PER_NIGHT = 1000 * 60 * 60 * 24

const countNights = (checkIn: string, checkOut: string) => {
  const nights = Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / MS_PER_NIGHT)
  return Number.isFinite(nights) && nights > 0 ? nights : 0
}

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}

function PriceRow({
  label,
  value,
  emphasis,
}: {
  label: string
  value: React.ReactNode
  emphasis?: boolean
}) {
  return (
    <div className={emphasis ? `${styles.priceRow} ${styles.priceRowTotal}` : styles.priceRow}>
      <span className={styles.priceLabel}>{label}</span>
      <span className={styles.priceValue}>{value}</span>
    </div>
  )
}

const ReservationDetails = () => {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const { data: reservation, isLoading, isError, refetch } = useReservationId(reservationId)

  const backButton = (
    <Button variant="ghost" onClick={() => navigate('/reservations')} className={styles.backBtn}>
      <ChevronLeft size={16} /> Back to Reservations
    </Button>
  )

  if (isLoading) {
    return (
      <div className={styles.page}>
        {backButton}
        <header className={styles.header}>
          <Skeleton className={styles.heroSkeleton} />
          <div className={styles.details}>
            <div className={styles.headerInfo}>
              <div className={styles.titleRow}>
                <Skeleton className={styles.titleSkeleton} />
                <Skeleton className={styles.statusSkeleton} />
              </div>
              <Skeleton className={styles.locationSkeleton} />
              <Skeleton className={styles.idSkeleton} />
            </div>
            <section className={styles.statGrid}>
              <Skeleton className={styles.statSkeleton} />
              <Skeleton className={styles.statSkeleton} />
              <Skeleton className={styles.statSkeleton} />
              <Skeleton className={styles.statSkeleton} />
            </section>
          </div>
        </header>
      </div>
    )
  }

  if (isError || !reservation) {
    return (
      <div className={styles.page}>
        {backButton}
        <div className={styles.notFound}>
          <p className={styles.muted}>Couldn't load this reservation.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </div>
    )
  }

  const labels = getUnitLabels(reservation.propertyId)
  const property = getPropertyId(reservation.propertyId)
  const nights = countNights(reservation.checkIn, reservation.checkOut)
  const paid = reservation.totalAmount - reservation.balanceDue
  const isPaid = reservation.balanceDue <= 0
  const nightlyRate = nights > 0 ? reservation.totalAmount / nights : reservation.totalAmount

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        {backButton}
        <div className={styles.topActions}>
          <Button variant="secondary" onClick={() => navigate('/calendar')}>
            <CalendarDays size={16} /> View in Calendar
          </Button>
          <Button>Manage Booking</Button>
        </div>
      </div>

      <header className={styles.header}>
        {property?.thumbnail  && <img src={property.thumbnail } alt="" className={styles.hero} />}

        <div className={styles.details}>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <span className={styles.avatar} aria-hidden>
                {initialsOf(reservation.guestName)}
              </span>
              <h1 className={styles.title}>{reservation.guestName}</h1>
              {getStatusBadge(reservation.status)}
              {isPaid ? (
                <Badge variant="success">Paid</Badge>
              ) : (
                <Badge variant="warning">{formatCurrency(reservation.balanceDue)} Due</Badge>
              )}
            </div>

            <div className={styles.metaRow}>
              <span className={styles.meta}>
                <Building2 size={14} /> {labels.property} · {labels.unit}
              </span>
              {property?.city && (
                <span className={styles.meta}>
                  <MapPin size={14} /> {property.city}
                </span>
              )}
              <span className={styles.meta}>
                <Hash size={14} /> {reservation.id}
              </span>
            </div>
          </div>

          <section className={styles.statGrid}>
            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <DoorOpen size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Check In</div>
                <div className={styles.statValue}>{formatDate(reservation.checkIn)}</div>
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <CalendarDays size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Check Out</div>
                <div className={styles.statValue}>{formatDate(reservation.checkOut)}</div>
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <Moon size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Nights</div>
                <div className={styles.statValue}>{nights}</div>
              </div>
            </div>

            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <Receipt size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Total</div>
                <div className={styles.statValue}>{formatCurrency(reservation.totalAmount)}</div>
              </div>
            </div>
          </section>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Stay</h2>

            <div className={styles.stayStrip}>
              <div className={styles.stayEnd}>
                <div className={styles.stayLabel}>Check in</div>
                <div className={styles.stayDate}>{formatDate(reservation.checkIn)}</div>
                <div className={styles.stayTime}>From 3:00 PM</div>
              </div>

              <div className={styles.stayBridge}>
                <span className={styles.stayNights}>
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <ArrowRight size={16} className={styles.stayArrow} />
              </div>

              <div className={styles.stayEnd}>
                <div className={styles.stayLabel}>Check out</div>
                <div className={styles.stayDate}>{formatDate(reservation.checkOut)}</div>
                <div className={styles.stayTime}>Until 11:00 AM</div>
              </div>
            </div>

            <div className={styles.infoList}>
              <InfoRow label="Property" value={labels.property} />
              <InfoRow label="Unit" value={labels.unit} />
              <InfoRow label="Unit ID" value={reservation.propertyId} />
              {property?.city && <InfoRow label="Location" value={property.city} />}
              {property && (
                <InfoRow
                  label="Layout"
                  value={`${property.bedrooms} bed · ${property.bathrooms} bath`}
                />
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Guest</h2>
            <div className={styles.guestRow}>
              <span className={styles.avatarLg} aria-hidden>
                {initialsOf(reservation.guestName)}
              </span>
              <div>
                <div className={styles.guestName}>{reservation.guestName}</div>
                <div className={styles.muted}>
                  <User size={13} /> Primary guest · Booking {reservation.id}
                </div>
              </div>
              <div className={styles.guestStatus}>{getStatusBadge(reservation.status)}</div>
            </div>
          </section>
        </div>

        <aside className={styles.sideCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Payment</h2>
            <div className={styles.priceGrid}>
              <PriceRow label="Nightly rate (avg)" value={formatCurrency(nightlyRate)} />
              <PriceRow
                label={`${nights} ${nights === 1 ? 'night' : 'nights'}`}
                value={formatCurrency(reservation.totalAmount)}
              />
              <PriceRow label="Amount paid" value={formatCurrency(paid)} />
              <PriceRow label="Balance due" value={formatCurrency(reservation.balanceDue)} />
              <PriceRow label="Total" value={formatCurrency(reservation.totalAmount)} emphasis />
            </div>
            <div className={styles.payState}>
              {isPaid ? (
                <Badge variant="success">Fully paid</Badge>
              ) : (
                <Badge variant="warning">{formatCurrency(reservation.balanceDue)} outstanding</Badge>
              )}
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Booking source</h2>
            <div className={styles.channelChip}>
              {renderChannel(reservation.channel)}
              <span className={styles.channelName}>{CHANNEL_LABELS[reservation.channel]}</span>
            </div>
            <div className={styles.infoList}>
              <InfoRow label="Booking ID" value={reservation.id} />
              <InfoRow label="Status" value={getStatusBadge(reservation.status)} />
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}

export default ReservationDetails
