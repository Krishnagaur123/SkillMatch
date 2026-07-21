import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sun, PanelLeft, Menu, ChevronDown, User, LogOut } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import Avatar from './Avatar'
import { useSidebar } from '@/app/providers/SidebarContext'
import { useTheme } from '@/app/providers/ThemeContext'
import { useAuth } from '@/features/auth/hooks/useAuth'
import styles from './TopNavigation.module.css'

export default function TopNavigation() {
  const { toggleCollapsed, openDrawer } = useSidebar()
  const { toggleTheme } = useTheme()
  const { logout, isLoggingOut } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <header className={styles.root} role="banner">
      <div className={styles.left}>
        <button
          type="button"
          className={[styles.iconBtn, styles.desktopOnly].join(' ')}
          onClick={toggleCollapsed}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <button
          type="button"
          className={[styles.iconBtn, styles.mobileOnly].join(' ')}
          onClick={openDrawer}
          aria-label="Open navigation menu"
          aria-haspopup="dialog"
        >
          <Menu size={18} />
        </button>
        <Breadcrumb />
      </div>
      <div className={styles.right}>
        <button type="button" className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle theme">
          <Sun size={18} />
        </button>
        
        <div className={styles.avatarDropdownWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.avatarTrigger}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            <Avatar initials="KG" size="sm" />
            <ChevronDown size={14} className={styles.avatarChevron} />
          </button>

          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownHeader}>
                <p className={styles.dropdownName}>Krishna Gaur</p>
                <p className={styles.dropdownEmail}>member@skillmatch.com</p>
              </div>
              <div className={styles.dropdownDivider} />
              
              <Link
                to="/profile"
                className={styles.dropdownItem}
                onClick={() => setIsDropdownOpen(false)}
              >
                <User size={14} className={styles.dropdownIcon} />
                Profile
              </Link>

              <div className={styles.dropdownDivider} />
              <button
                type="button"
                className={styles.dropdownItem}
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut size={14} className={styles.dropdownIcon} />
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
