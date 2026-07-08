import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { NAV_ITEMS } from '@/config/navigation'
import styles from './Breadcrumb.module.css'

export default function Breadcrumb() {
  const { pathname } = useLocation()

  const matched = NAV_ITEMS.find((item) => item.route === pathname)

  if (!matched) return null

  return (
    <nav aria-label="Breadcrumb" className={styles.root}>
      <ol className={styles.list} role="list">
        <li className={styles.item}>
          <Link to="/dashboard" className={styles.link}>
            Home
          </Link>
        </li>
        {matched.route !== '/dashboard' && (
          <>
            <li className={styles.separator} aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li className={styles.item}>
              <span className={styles.current} aria-current="page">
                {matched.title}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
