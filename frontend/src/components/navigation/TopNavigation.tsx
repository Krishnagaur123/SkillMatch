import { Bell, Sun, PanelLeft, Menu } from 'lucide-react'
import Breadcrumb from './Breadcrumb'
import Avatar from './Avatar'
import { useSidebar } from '@/app/providers/SidebarContext'
import styles from './TopNavigation.module.css'

export default function TopNavigation() {
  const { toggleCollapsed, openDrawer } = useSidebar()

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
