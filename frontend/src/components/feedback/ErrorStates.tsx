import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { Lock, WifiOff, FileSearch } from 'lucide-react'
import { ErrorState, EmptyState } from './FeedbackState'
import { extractApiError } from '@/services/api/errors'

export interface ErrorStateBaseProps extends HTMLAttributes<HTMLDivElement> {
  onRetry?: () => void
}

export interface ApiErrorStateProps extends ErrorStateBaseProps {
  error: unknown
  title?: string
}

export const ApiErrorState = forwardRef<HTMLDivElement, ApiErrorStateProps>(
  ({ error, title = 'API Error', onRetry, ...props }, ref) => {
    const message = extractApiError(error)
    return (
      <ErrorState
        ref={ref}
        title={title}
        message={message}
        onRetry={onRetry}
        {...props}
      />
    )
  }
)
ApiErrorState.displayName = 'ApiErrorState'

export const NetworkErrorState = forwardRef<HTMLDivElement, ErrorStateBaseProps>(
  ({ onRetry, ...props }, ref) => {
    return (
      <EmptyState
        ref={ref}
        icon={<WifiOff size={36} className="text-destructive" />}
        title="Network Connection Error"
        description="Could not connect to the service. Please check your internet connection or try again."
        actionLabel={onRetry ? 'Retry Connection' : undefined}
        onAction={onRetry}
        {...props}
      />
    )
  }
)
NetworkErrorState.displayName = 'NetworkErrorState'

export interface PermissionDeniedStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const PermissionDeniedState = forwardRef<HTMLDivElement, PermissionDeniedStateProps>(
  (
    {
      title = 'Permission Denied',
      description = 'You do not have the required permissions to access this resource.',
      actionLabel,
      onAction,
      ...props
    },
    ref
  ) => {
    return (
      <EmptyState
        ref={ref}
        icon={<Lock size={36} style={{ color: 'var(--text-muted)' }} />}
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={onAction}
        {...props}
      />
    )
  }
)
PermissionDeniedState.displayName = 'PermissionDeniedState'

export interface ResourceNotFoundStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export const ResourceNotFoundState = forwardRef<HTMLDivElement, ResourceNotFoundStateProps>(
  (
    {
      title = 'Resource Not Found',
      description = 'The resource you are looking for does not exist or has been removed.',
      actionLabel,
      onAction,
      ...props
    },
    ref
  ) => {
    return (
      <EmptyState
        ref={ref}
        icon={<FileSearch size={36} style={{ color: 'var(--text-muted)' }} />}
        title={title}
        description={description}
        actionLabel={actionLabel}
        onAction={onAction}
        {...props}
      />
    )
  }
)
ResourceNotFoundState.displayName = 'ResourceNotFoundState'
