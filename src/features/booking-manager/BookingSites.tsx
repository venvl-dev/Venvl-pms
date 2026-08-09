import { Button } from '@/components/core/Button'
import styles from './ChannelManager.module.css'
import { Badge } from '@/components/core/Badge'
import { Plus, Trash2, Pause, Share, Ellipsis, Globe } from 'lucide-react'
import { cx } from '@/lib/cx'
import { ALL_BOOKING_COLUMNS, SITES_DATA } from './Constants'

export default function BookingSites() {
  return (
    <div className={styles.page}>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Booking Sites</h1>
            <Badge variant="success">MVP</Badge>
            <span className={styles.meta}>PRD $7.9</span>
          </div>
          <p className={styles.subtitle}>
            Done-for-you branded direct-booking sites, one engine, many domains.
          </p>
        </header>
        <Button className={styles.addChannelButton}>
          <Plus size={16} />
          Add Site
        </Button>
      </div>
      <div className={styles.tableCard}>
        <div className={cx(styles.scrollbar, 'no-scrollbar')}>
          <table className={styles.table}>
            <thead>
              <tr>
                {ALL_BOOKING_COLUMNS.map((col) => (
                  <th key={col} className={styles.th}>
                    {col}
                  </th>
                ))}
                <th className={styles.th} style={{ textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {SITES_DATA.map((site) => (
                <tr key={site.domain}>
                  <td className={styles.td}>
                    <div className={styles.channel_td}>
                      <Badge variant="success" style={{ padding: '3px' }}>
                        <Globe />
                      </Badge>
                      {site.domain}
                      {site.primary && (
                        <Badge
                          className={cx(styles.badgeTd, styles.siteBadgeTd)}
                          variant={site.primary ? 'success' : 'warning'}
                        >
                          {site.primary && 'Primary'}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <Badge
                      className={styles.badgeTd}
                      variant={site.primary ? 'success' : 'warning'}
                    >
                      <div
                        style={{
                          backgroundColor: site.statusBool ? 'var(--primary)' : 'var(--warning)',
                        }}
                        className={styles.badgeSignal}
                      ></div>{' '}
                      {site.status}
                    </Badge>
                  </td>
                  <td
                    className={styles.td}
                    style={{ color: 'var(--muted-foreground)', fontWeight: '500', opacity: '0.8' }}
                  >
                    {site.currency}
                  </td>
                  <td className={styles.td}>
                    <Badge
                      style={{
                        padding: (site.liveListings ?? 0) > 9 ? '5px 8px' : '5px 10px',
                        borderRadius: '50px',
                      }}
                      variant="success"
                    >
                      {site.liveListings ?? 0}
                    </Badge>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.tableActions}>
                      <Button variant="outline">
                        {site.statusBool ? (
                          <>
                            <Pause /> Suspend
                          </>
                        ) : (
                          <>
                            <Share /> Publish
                          </>
                        )}
                      </Button>
                      <Button variant="outline">
                        <Ellipsis />
                      </Button>
                      <Button
                        className={styles.trashButton}
                        style={{ padding: '5px 10px' }}
                        variant="outline"
                      >
                        <Trash2 size={16} color="#ff3838" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className={styles.mobileChannels}>
        {SITES_DATA.map((site) => (
          <div key={site.domain} className={styles.mobileChannelCard}>
            <div className={styles.mobileCardHeader}>
              <Badge className={styles.badgeTd} variant={site.primary ? 'success' : 'warning'}>
                <div
                  style={{
                    backgroundColor: site.statusBool ? 'var(--primary)' : 'var(--warning)',
                  }}
                  className={styles.badgeSignal}
                ></div>{' '}
                {site.status}
              </Badge>
              <div className={styles.mobileHeaderSitesActions}>
                <Button style={{ padding: '5px 10px' }} variant="outline">
                  <Ellipsis />
                </Button>
                <Button
                  className={styles.trashButton}
                  style={{ padding: '5px 10px' }}
                  variant="outline"
                >
                  <Trash2 size={16} color="#ff3838" />
                </Button>
              </div>
            </div>
            <div
              style={{ justifyContent: 'flex-start', color: 'black' }}
              className={styles.channel_td}
            >
              <Badge variant="success" style={{ padding: '3px' }}>
                <Globe />
              </Badge>
              {site.domain}
              {site.primary && (
                <Badge
                  className={cx(styles.badgeTd, styles.siteBadgeTd)}
                  variant={site.primary ? 'success' : 'warning'}
                >
                  {site.primary && 'Primary'}
                </Badge>
              )}
            </div>
            <div className={styles.channel_td}>
              <p>Currency</p>
              <p>{site.currency}</p>
            </div>
            <div className={styles.channel_td}>
              <p>Live Listings</p>
              <p>{site.liveListings ?? 0}</p>
            </div>
            <Button variant="outline">
              {site.statusBool ? (
                <>
                  <Pause /> Suspend
                </>
              ) : (
                <>
                  <Share /> Publish
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
