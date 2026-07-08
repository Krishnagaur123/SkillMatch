import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { NAV_ITEMS } from '@/config/navigation'
import AppBrand from './AppBrand'
import SidebarNav from './SidebarNav'
import SidebarFooter from './SidebarFooter'
import styles from './Sidebar.module.css'

export default function Sidebar() {
  return (
    <aside className={styles.root} aria-label="Application sidebar">
      <div className={styles.header}>
        <Link to={ROUTES.DASHBOARD} className={styles.brandLink} aria-label="Go to dashboard">
          <AppBrand />
        </Link>
      </div>
      <SidebarNav items={NAV_ITEMS} />
      <SidebarFooter />
    </aside>
  )
}
