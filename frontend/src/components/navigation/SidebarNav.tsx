import type { NavItem } from '@/config/navigation'
import SidebarNavItem from './SidebarNavItem'
import styles from './SidebarNav.module.css'

interface SidebarNavProps {
  items: NavItem[]
}

export default function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav aria-label="Main navigation" className={styles.root}>
      <ul className={styles.list} role="list">
        {items.map((item) => (
          <SidebarNavItem
            key={item.id}
            title={item.title}
            icon={item.icon}
            route={item.route}
          />
        ))}
      </ul>
    </nav>
  )
}
