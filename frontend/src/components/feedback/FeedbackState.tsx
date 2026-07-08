import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, FolderOpen } from 'lucide-react'
import { Button } from '../common/Button'
import styles from './FeedbackState.module.css'

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  icon?: ReactNode
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, title, description, icon = <FolderOpen size={36} />, actionLabel, onAction, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.container, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </div>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {actionLabel && onAction && (
          <Button variant="secondary" size="sm" onClick={onAction} className={styles.actionBtn}>
            {actionLabel}
          </Button>
        )}
      </div>
    )
  }
)
EmptyState.displayName = 'EmptyState'

export interface ErrorStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  message: string
  onRetry?: () => void
}

export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ className, title = 'Something went wrong', message, onRetry, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.container, styles.errorContainer, className].filter(Boolean).join(' ')} {...props}>
        <div className={[styles.iconWrapper, styles.errorIconWrapper].join(' ')} aria-hidden="true">
          <AlertCircle size={36} />
        </div>
        <h3 className={styles.title}>{title}</h3>
        <p className={[styles.description, styles.errorMessage].join(' ')}>{message}</p>
        {onRetry && (
          <Button variant="primary" size="sm" onClick={onRetry} className={styles.actionBtn}>
            Retry
          </Button>
        )}
      </div>
    )
  }
)
ErrorState.displayName = 'ErrorState'
