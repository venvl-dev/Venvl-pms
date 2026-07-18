import type { ReactNode } from 'react'
import { MessageCircle, Globe, Wallet } from 'lucide-react'
import styles from './AuthLayout.module.css'

const FEATURES = [
  { icon: MessageCircle, title: 'WhatsApp-first', desc: 'Talk to guests where they already are.' },
  { icon: Globe, title: 'Done-for-you sites', desc: 'Branded direct booking, set up for you.' },
  { icon: Wallet, title: 'EGP rails', desc: 'Local payments — Paymob, Fawry, Kashier.' },
]

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.hero}>
        <div className={styles.brand}>
          <span className={styles.logo}>V</span>
          <div>
            <div className={styles.brandName}>VENVL Go</div>
            <div className={styles.brandSub}>PMS Dashboard</div>
          </div>
        </div>

        <h1 className={styles.headline}>The property management platform built for Egypt.</h1>

        <ul className={styles.features}>
          {FEATURES.map((f) => (
            <li key={f.title} className={styles.feature}>
              <span className={styles.featureIcon}>
                <f.icon size={18} />
              </span>
              <div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.formPane}>
        <div className={styles.formInner}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </main>
    </div>
  )
}
