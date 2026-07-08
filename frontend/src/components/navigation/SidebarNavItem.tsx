import { NavLink, useNavigate } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { useSidebar } from '@/app/providers/SidebarContext'
import styles from './SidebarNavItem.module.css'

interface SidebarNavItemProps {
  title: string
  icon: LucideIcon
  route: string
  disabled?: boolean
}

export default function SidebarNavItem({
  title,
  icon: Icon,
  route,
  disabled = false,
}: SidebarNavItemProps) {
  const { collapsed, closeDrawer } = useSidebar()
  const navigate = useNavigate()

  const handleClick = () => {
    closeDrawer()
    navigate(route)
  }

  if (disabled) {
    return (
      <li>
        <span
          className={[styles.item, styles.disabled, collapsed ? styles.collapsed : '']
            .filter(Boolean)
            .join(' ')}
          aria-disabled="true"
          title={collapsed ? title : undefined}
        >
          <Icon className={styles.icon} size={18} aria-hidden="true" />
          {!collapsed && <span className={styles.label}>{title}</span>}
        </span>
      </li>
    )
  }

  return (
    <li>
      <NavLink
        to={route}
        onClick={handleClick}
        title={collapsed ? title : undefined}
        className={({ isActive }) =>
          [styles.item, isActive ? styles.active : '', collapsed ? styles.collapsed : '']
            .filter(Boolean)
            .join(' ')
        }
        end={route === '/'}
      >
        <Icon className={styles.icon} size={18} aria-hidden="true" />
        {!collapsed && <span className={styles.label}>{title}</span>}
      </NavLink>
    </li>
  )
}
