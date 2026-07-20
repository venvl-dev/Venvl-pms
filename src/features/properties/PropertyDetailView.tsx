import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, BedDouble, Bath, Home, Plus } from 'lucide-react'
import { Button } from '@/components/core/Button'
import { Badge } from '@/components/core/Badge'
import { getPropertyId, type Property, type BookingChannel } from './mockProperties'
import styles from './PropertyDetailView.module.css'
import { Amenity } from '@/components/core/Aminites'

const getStatusBadge = (status: Property['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>
    case 'draft':
      return <Badge variant="secondary">Draft</Badge>
    case 'archived':
      return <Badge variant="outline">Archived</Badge>
  }
}

const CHANNEL_LABELS: Record<BookingChannel, string> = {
  airbnb: 'Airbnb',
  'booking.com': 'Booking.com',
  vrbo: 'Vrbo',
  expedia: 'Expedia',
  direct: 'Direct Booking',
}

const CHANNEL_COLORS: Record<BookingChannel, string> = {
  airbnb: '#FF5A5F',
  'booking.com': '#003580',
  vrbo: '#1668E3',
  expedia: '#FDB913',
  direct: '#16a34a',
}

function ChannelChip({ channel }: { channel: BookingChannel }) {
  return (
    <div className={styles.channelChip}>
      <span className={styles.channelIcon} style={{ background: CHANNEL_COLORS[channel] }}>
        {CHANNEL_LABELS[channel].charAt(0)}
      </span>
      <span className={styles.channelName}>{CHANNEL_LABELS[channel]}</span>
    </div>
  )
}
const dash = (v: number | null) => (v === null ? '-' : v)
const pct = (v: number | null) => (v === null ? '-' : `${v}%`)

function PriceRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.priceRow}>
      <span className={styles.priceLabel}>{label}:</span>
      <span className={styles.priceValue}>{value}</span>
    </div>
  )
}

function PolicyBlock({ channel, policy }: { channel: string; policy: string }) {
  return (
    <div className={styles.policyBlock}>
      <div className={styles.policyChannel}>{channel} cancellation policy</div>
      <div className={styles.policyText}>{policy}</div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}:</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}
  
export function PropertyDetailView() {
  const { propertyId } = useParams<{ propertyId: string }>()
  const navigate = useNavigate()
  const property = propertyId ? getPropertyId(propertyId) : undefined

  if (!property) {
    return (
      <div className={styles.page}>
        <Button variant="ghost" onClick={() => navigate('/properties')}>
          <ChevronLeft size={16} /> Back to Properties
        </Button>
        <div className={styles.notFound}>Property not found.</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Button variant="ghost" onClick={() => navigate('/properties')} className={styles.backBtn}>
        <ChevronLeft size={16} /> Back to Properties
      </Button>

      <header className={styles.header}>
        <div className={styles.gallery}>
          <img src={property.image} alt="" className={styles.hero} />
          <div className={styles.heroMinGroup}>
            <img src={property.image} alt="" className={styles.heroMin} />
            <img src={property.image} alt="" className={styles.heroMin} />
          </div>
        </div>

        <div className={styles.details}>
          <div className={styles.headerInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{property.name}</h1>
              {getStatusBadge(property.status)}
              <Button className={styles.editBtn}>
                <Plus size={16} /> Edit Property
              </Button>
            </div>
            <div className={styles.location}>
              <MapPin size={14} /> {property.location}
            </div>
            <div className={styles.id}>{property.id}</div>
          </div>

          <section className={styles.statGrid}>
            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <Home size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Unit Type</div>
                <div className={styles.statValue} style={{ textTransform: 'capitalize' }}>
                  {property.type}
                </div>
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <BedDouble size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Bedrooms</div>
                <div className={styles.statValue}>{property.bedrooms}</div>
              </div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statIcon}>
                <Bath size={18} />
              </div>
              <div>
                <div className={styles.statLabel}>Bathrooms</div>
                <div className={styles.statValue}>{property.bathrooms}</div>
              </div>
            </div>
          </section>
        </div>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>About this listing</h2>
            <details className={styles.descBox}>
              <summary className={styles.descSummary}>
                <span className={styles.descText}>{property.description}</span>
                <span className={styles.seeMore} />
              </summary>
            </details>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Additional info</h2>
            <div className={styles.policyGrid}>
              {property.additionalInfo.cancellationPolicies.map((p) => (
                <PolicyBlock key={p.channel} channel={p.channel} policy={p.policy} />
              ))}
            </div>
            <div className={styles.infoList}>
              <InfoRow label="Check-in instructions" value={property.additionalInfo.checkInInstructions} />
              <InfoRow label="Listing address" value={property.additionalInfo.listingAddress} />
              <InfoRow label="WiFi details" value={property.additionalInfo.wifiDetails} />
            </div>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Amenities</h2>
            {property.amenities.length > 0 ? (
              <div className={styles.amenityGrid}>
                {property.amenities.map((amenity) => (
                  <Amenity key={amenity} label={amenity} />
                ))}
              </div>
            ) : (
              <div className={styles.muted}>No amenities listed.</div>
            )}
          </section>

        
        </div>

        <aside className={styles.sideCol}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Prices</h2>
            <div className={styles.priceGrid}>
              <PriceRow label="Price" value={`${property.pricing.price} $`} />
              <PriceRow label="Price for extra person" value={property.pricing.priceForExtraPerson} />
              <PriceRow label="Weekly Discount" value={`${property.pricing.weeklyDiscount}%`} />
              <PriceRow label="Property rent tax %" value={pct(property.pricing.propertyRentTax)} />
              <PriceRow label="Apply price for extra person after" value={property.pricing.applyExtraPersonAfter} />
              <PriceRow label="Fixed guest tax per-person, per-night" value={dash(property.pricing.fixedGuestTaxPerNight)} />
              <PriceRow label="Fixed tax per reservation" value={dash(property.pricing.fixedTaxPerReservation)} />
              <PriceRow label="Monthly Discount" value={`${property.pricing.monthlyDiscount}%`} />
              <PriceRow label="Fixed nightly tax" value={dash(property.pricing.fixedNightlyTax)} />
              <PriceRow label="Refundable Damage Deposit fee" value={property.pricing.refundableDamageDeposit} />
            </div>
          </section>
   <section className={styles.card}>
            <h2 className={styles.cardTitle}>Connected Channels</h2>
            {property.channels.length > 0 ? (
              <div className={styles.channelList}>
                {property.channels.map((ch) => (
                  <ChannelChip key={ch} channel={ch} />
                ))}
              </div>
            ) : (
              <div className={styles.muted}>No channels connected.</div>
            )}
          </section>
        </aside>
       
      </div>
    </div>
  )
}
