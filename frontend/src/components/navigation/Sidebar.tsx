import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'
import { ROUTES } from '@/constants/routes'
import { NAV_ITEMS } from '@/config/navigation'
import { useSidebar } from '@/app/providers/SidebarContext'
import { useUserProfile } from '@/hooks/useUserProfile'
import AppBrand from './AppBrand'
import SidebarNav from './SidebarNav'
import SidebarFooter from './SidebarFooter'
import styles from './Sidebar.module.css'

const SIDEBAR_EXPANDED_WIDTH = 256
const SIDEBAR_COLLAPSED_WIDTH = 64

export default function Sidebar() {
  const { collapsed } = useSidebar()
  const { data: profile } = useUserProfile()

  const navItems = [...NAV_ITEMS]
  if (profile?.isAdmin) {
    navItems.push({
      id: 'admin_opportunities',
      title: 'Opportunity Management',
      icon: Shield,
      route: ROUTES.ADMIN_OPPORTUNITIES,
    })
  }

  return (
    <motion.div
      className={styles.root}
      animate={{ width: collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      initial={false}
      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
      aria-label="Application sidebar"
    >
      <div className={[styles.header, collapsed ? styles.headerCollapsed : ''].filter(Boolean).join(' ')}>
        <Link to={ROUTES.DASHBOARD} className={styles.brandLink} aria-label="Go to dashboard">
          <AppBrand collapsed={collapsed} />
        </Link>
      </div>
      <SidebarNav items={navItems} />
      <SidebarFooter />
    </motion.div>
  )
}
