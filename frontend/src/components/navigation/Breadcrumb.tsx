import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/config/navigation'
import styles from './Breadcrumb.module.css'

export default function Breadcrumb() {
  const { pathname } = useLocation()

  const matched = NAV_ITEMS.find((item) => item.route === pathname)

  if (!matched) return null

  return (
    <nav aria-label="Breadcrumb" className={styles.root}>
      <span className={styles.current} aria-current="page">
        {matched.title}
      </span>
    </nav>
  )
}
