import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import type { ApplicationStatus } from '@/types/application'
import styles from './Badge.module.css'

const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      brand: styles.variantBrand,
      success: styles.variantSuccess,
      emerald: styles.variantEmerald,
      warning: styles.variantWarning,
      orange: styles.variantOrange,
      error: styles.variantError,
      neutral: styles.variantNeutral,
      purple: styles.variantPurple,
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[badgeVariants({ variant }), className].filter(Boolean).join(' ')}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'pending' | 'success' | 'warning' | 'error' | 'neutral' | 'purple' | 'brand' | string
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    let variant: 'success' | 'warning' | 'error' | 'brand' | 'neutral' | 'purple' = 'neutral'
    
    if (status === 'active' || status === 'success') variant = 'success'
    else if (status === 'pending' || status === 'warning') variant = 'warning'
    else if (status === 'error' || status === 'danger' || status === 'rejected') variant = 'error'
    else if (status === 'primary' || status === 'brand') variant = 'brand'
    else if (status === 'purple') variant = 'purple'
    
    return (
      <Badge ref={ref} variant={variant} className={className} {...props}>
        {children || status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

export const getApplicationStatusConfig = (status: ApplicationStatus | string) => {
  switch (status) {
    case 'APPLIED': return { label: 'Applied', state: 'brand' } // Slate/Blue
    case 'ONLINE_ASSESSMENT': return { label: 'Online Assessment', state: 'purple' }
    case 'INTERVIEW': return { label: 'Interview', state: 'warning' } // Orange
    case 'OFFER': return { label: 'Offer', state: 'success' } // Green
    case 'REJECTED': return { label: 'Rejected', state: 'error' } // Red
    case 'WITHDRAWN': return { label: 'Withdrawn', state: 'neutral' } // Gray
    default: return { label: status, state: 'neutral' }
  }
}

export interface ApplicationStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: ApplicationStatus | string
}

export const ApplicationStatusBadge = forwardRef<HTMLSpanElement, ApplicationStatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const config = getApplicationStatusConfig(status)
    return (
      <StatusBadge ref={ref} status={config.state} {...props}>
        {config.label}
      </StatusBadge>
    )
  }
)
ApplicationStatusBadge.displayName = 'ApplicationStatusBadge'

export interface SkillBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  name: string
  isMissing?: boolean
  variant?: 'resume' | 'manual'
}

export const SkillBadge = forwardRef<HTMLSpanElement, SkillBadgeProps>(
  ({ className, name, isMissing = false, variant = 'manual', children, ...props }, ref) => {
    const badgeVariant = isMissing ? 'neutral' : (variant === 'resume' ? 'success' : 'brand')
    return (
      <Badge ref={ref} variant={badgeVariant} className={className} {...props}>
        {name}
        {isMissing && <span style={{ fontSize: '0.625rem', marginLeft: '4px', textTransform: 'uppercase', fontWeight: 600 }}>Missing</span>}
        {children}
      </Badge>
    )
  }
)
SkillBadge.displayName = 'SkillBadge'

export interface MatchBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  score: number
}

export const MatchBadge = forwardRef<HTMLSpanElement, MatchBadgeProps>(
  ({ className, score, ...props }, ref) => {
    let variant: 'success' | 'emerald' | 'warning' | 'orange' | 'error' = 'error'

    if (score >= 90) variant = 'success'
    else if (score >= 75) variant = 'emerald'
    else if (score >= 60) variant = 'warning'
    else if (score >= 40) variant = 'orange'

    return (
      <Badge ref={ref} variant={variant} className={[styles.matchBadge, className].filter(Boolean).join(' ')} {...props}>
        {score}% Match
      </Badge>
    )
  }
)
MatchBadge.displayName = 'MatchBadge'
