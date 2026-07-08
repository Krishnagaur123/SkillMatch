import { LogOut } from 'lucide-react'
import Avatar from './Avatar'
import styles from './SidebarFooter.module.css'

export default function SidebarFooter() {
  return (
    <footer className={styles.root}>
      <div className={styles.divider} role="separator" />
      <div className={styles.user}>
        <Avatar initials="SM" size="sm" />
        <div className={styles.userInfo}>
          <span className={styles.userName}>User</span>
          <span className={styles.userRole}>Member</span>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </footer>
  )
}
