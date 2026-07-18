import { forwardRef, type ReactNode } from 'react'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[styles.emptyState, className].filter(Boolean).join(' ')}
        {...props}
      >
        {icon && <div className={styles.iconWrapper}>{icon}</div>}
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {action && <div className={styles.actionWrapper}>{action}</div>}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'
