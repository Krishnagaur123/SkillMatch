import { LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { useSidebar } from '@/app/providers/SidebarContext'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './SidebarFooter.module.css'

export default function SidebarFooter() {
  const { collapsed } = useSidebar()
  const { logout, isLoggingOut } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <footer className={styles.root}>
      <div className={styles.divider} role="separator" />
      <div className={[styles.userContainer, collapsed ? styles.collapsed : ''].filter(Boolean).join(' ')}>
        <div className={styles.userInfoWrapper}>
          <Avatar initials="KG" size={collapsed ? "sm" : "md"} />
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>Krishna Gaur</span>
              <span className={styles.userRole}>Member</span>
            </div>
          )}
        </div>
        
        {!collapsed && (
          <div className={styles.userActions}>
            <Link to="/settings" className={styles.actionBtn} aria-label="Settings" title="Settings">
              <Settings size={14} />
              <span>Settings</span>
            </Link>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        )}

        {collapsed && (
          <button
            type="button"
            className={styles.collapsedLogoutBtn}
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </footer>
  )
}
