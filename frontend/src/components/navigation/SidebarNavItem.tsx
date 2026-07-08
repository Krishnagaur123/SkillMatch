import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import styles from './SidebarNavItem.module.css'

interface SidebarNavItemProps {
  title: string
  icon: LucideIcon
  route: string
  disabled?: boolean
}

export default function SidebarNavItem({ title, icon: Icon, route, disabled = false }: SidebarNavItemProps) {
  if (disabled) {
    return (
      <li>
        <span className={[styles.item, styles.disabled].join(' ')} aria-disabled="true">
          <Icon className={styles.icon} size={18} />
          <span className={styles.label}>{title}</span>
        </span>
      </li>
    )
  }

  return (
    <li>
      <NavLink
        to={route}
        className={({ isActive }) => [styles.item, isActive ? styles.active : ''].filter(Boolean).join(' ')}
        end={route === '/'}
      >
        <Icon className={styles.icon} size={18} />
        <span className={styles.label}>{title}</span>
      </NavLink>
    </li>
  )
}
