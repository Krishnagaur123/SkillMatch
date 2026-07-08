import { LogOut } from 'lucide-react'
import Avatar from './Avatar'
import { useSidebar } from '@/app/providers/SidebarContext'
import styles from './SidebarFooter.module.css'

export default function SidebarFooter() {
  const { collapsed } = useSidebar()

  return (
    <footer className={styles.root}>
      <div className={styles.divider} role="separator" />
      <div className={[styles.user, collapsed ? styles.collapsed : ''].filter(Boolean).join(' ')}>
        <Avatar initials="SM" size="sm" />
        {!collapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>User</span>
            <span className={styles.userRole}>Member</span>
          </div>
        )}
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
