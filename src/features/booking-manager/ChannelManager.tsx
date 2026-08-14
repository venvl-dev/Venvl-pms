import { Button } from '@/components/core/Button'
import styles from './ChannelManager.module.css'
import { Badge } from '@/components/core/Badge'
import { Plus, Link2, Unlink, Trash2 } from 'lucide-react'
import { cx } from '@/lib/cx'
import { ALL_COLUMNS, CHANNELS_DATA } from './Constants'

export default function ChannelManager() {
  return (
    <div className={styles.page}>
      <div className={styles.headerContainer}>
        <header className={styles.header}>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>Channel Manager</h1>
            <Badge variant="success">MVP</Badge>
            <span className={styles.meta}>PRD $7.5</span>
          </div>
          <p className={styles.subtitle}>
            OTAs connectivity via Channex, connect channels and keep availability in sync.
          </p>
        </header>
        <Button className={styles.addChannelButton}>
          <Plus size={16} />
          Connect Channel
        </Button>
      </div>

      <div className={styles.tableCard}>
        <div className={cx(styles.scrollbar, 'no-scrollbar')}>
          <table className={styles.table}>
            <thead>
              <tr>
                {ALL_COLUMNS.map((col) => (
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
              {CHANNELS_DATA.map((ch) => (
                <tr key={ch.channel}>
                  <td className={styles.td}>
                    <div className={styles.channel_td}>
                      <img src={ch.logo} alt={ch.channel} />
                      {ch.channel}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <Badge className={styles.badgeTd} variant={ch.status ? 'success' : 'warning'}>
                      <div
                        style={{ backgroundColor: ch.status ? 'var(--primary)' : 'var(--warning)' }}
                        className={styles.badgeSignal}
                      ></div>{' '}
                      {ch.status ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </td>
                  <td
                    className={styles.td}
                    style={{ color: 'var(--muted-foreground)', fontWeight: '500', opacity: '0.8' }}
                  >
                    {ch.channex ? ch.channex : <hr style={{ width: '30px' }} />}
                  </td>
                  <td
                    className={styles.td}
                    style={{ color: 'var(--muted-foreground)', fontWeight: '500', opacity: '0.8' }}
                  >
                    {ch.last_synced ? ch.last_synced : <hr style={{ width: '30px' }} />}
                  </td>
                  <td className={styles.td}>
                    <div className={styles.tableActions}>
                      <Button variant="outline">
                        {ch.status ? (
                          <>
                            <Unlink /> Disconnect
                          </>
                        ) : (
                          <>
                            <Link2 /> Connect
                          </>
                        )}
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
        {CHANNELS_DATA.map((ch) => (
          <div key={ch.channel} className={styles.mobileChannelCard}>
            <div className={styles.mobileCardHeader}>
              <Badge className={styles.badgeTd} variant={ch.status ? 'success' : 'warning'}>
                <div
                  style={{ backgroundColor: ch.status ? 'var(--primary)' : 'var(--warning)' }}
                  className={styles.badgeSignal}
                ></div>{' '}
                {ch.status ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button
                className={styles.trashButton}
                style={{ padding: '5px 10px' }}
                variant="outline"
              >
                <Trash2 size={16} color="#ff3838" />
              </Button>
            </div>
            <div
              style={{ justifyContent: 'flex-start', color: 'black' }}
              className={styles.channel_td}
            >
              <img src={ch.logo} alt={ch.channel} />
              {ch.channel}
            </div>
            <div className={styles.channel_td}>
              <p>Channex ID</p>
              {ch.channex ? <p>{ch.channex}</p> : <hr style={{ width: '20px' }} />}
            </div>
            <div className={styles.channel_td}>
              <p>Last Synced</p>
              {ch.last_synced ? <p>{ch.last_synced}</p> : <hr style={{ width: '20px' }} />}
            </div>
            <Button variant="outline">
              {ch.status ? (
                <>
                  <Unlink /> Disconnect
                </>
              ) : (
                <>
                  <Link2 /> Connect
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
