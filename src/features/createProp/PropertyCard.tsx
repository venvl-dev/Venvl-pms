import { IconButton } from '@/components/core/IconButton'
import { Icon } from '@/components/core/Icon'
import { Tag } from '@/components/core/Tag'
import { Button } from '@/components/core/ButtonProps'
import { PriceTag } from '@/components/core/PriceTag'
import styles from './PropertyCard.module.css'
import type { PropertyCardProps } from './types'

export function PropertyCard({
  image,
  title = 'Untitled stay',
  location = '',
  rating,
  price,
  currency = '$',
  unit = 'night',
  specs = [],
  badge,
}: PropertyCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.media}>
        {image && <img src={image} alt={title} className={styles.img} />}
        <div className={styles.mediaTop}>
          <span className={styles.ratingPill}>
            {rating != null && (
              <>
                <Icon name="star" size={14} color="var(--star)" filled />
                {Number(rating).toFixed(1)}
              </>
            )}
          </span>
          <span className={styles.favWrap}>
            <IconButton icon="heart" variant="soft" size="sm" active={false} ariaLabel="Save" />
          </span>
        </div>
        {badge && <span className={styles.badge}>{badge}</span>}
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h3 className={styles.title}>{title}</h3>
          {location && (
            <span className={styles.location}>
              <Icon name="map-pin" size={15} strokeWidth={2} color="var(--text-muted)" />
              {location}
            </span>
          )}
        </div>

        {specs.length > 0 && (
          <div className={styles.specs}>
            {specs.map((sp, i) => (
              <Tag key={i} icon={sp.icon} variant="tint">
                {sp.label}
              </Tag>
            ))}
          </div>
        )}

        <div className={styles.divider} />

        <div className={styles.footer}>
          <PriceTag
            amount={price ?? 0}
            currency={currency}
            unit={unit}
            note="incl. taxes & fees"
            size="sm"
          />
          <Button variant="primary" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}
