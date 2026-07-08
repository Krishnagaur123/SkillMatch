import { Bell, Sun } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import Avatar from './Avatar'
import styles from './TopNavigation.module.css'

export default function TopNavigation() {
  return (
    <header className={styles.root} role="banner">
      <div className={styles.left}>
        <Breadcrumb />
      </div>
      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Toggle theme">
          <Sun size={18} />
        </button>
        <div className={styles.avatarWrapper} aria-label="User menu">
          <Avatar initials="SM" size="sm" />
        </div>
      </div>
    </header>
  )
}
