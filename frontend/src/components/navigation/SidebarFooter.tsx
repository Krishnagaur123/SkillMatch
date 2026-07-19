import { LogOut, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import { useSidebar } from '@/app/providers/SidebarContext'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { ROUTES } from '@/constants/routes'
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

      {/* Clickable profile card navigates to Profile page */}
      <Link
        to={ROUTES.PROFILE}
        className={[styles.profileCard, collapsed ? styles.profileCardCollapsed : ''].filter(Boolean).join(' ')}
        aria-label="Go to your profile"
        title="View profile"
      >
        <Avatar initials="KG" size={collapsed ? 'sm' : 'md'} />
        {!collapsed && (
          <div className={styles.userInfo}>
            <span className={styles.userName}>Krishna Gaur</span>
            <span className={styles.userRole}>Member</span>
          </div>
        )}
      </Link>

      {/* Settings & Logout — separated from profile with spacing */}
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
    </footer>
  )
}
