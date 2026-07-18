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
      warning: styles.variantWarning,
      error: styles.variantError,
      neutral: styles.variantNeutral,
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
  status: 'active' | 'pending' | 'success' | 'warning' | 'error' | 'neutral' | string
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    let variant: 'success' | 'warning' | 'error' | 'brand' | 'neutral' = 'neutral'
    
    if (status === 'active' || status === 'success') variant = 'success'
    else if (status === 'pending' || status === 'warning') variant = 'warning'
    else if (status === 'error' || status === 'danger' || status === 'rejected') variant = 'error'
    else if (status === 'primary') variant = 'brand'
    
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
    case 'APPLIED': return { label: 'Applied', state: 'neutral' }
    case 'ONLINE_ASSESSMENT': return { label: 'Online Assessment', state: 'warning' }
    case 'INTERVIEW': return { label: 'Interview', state: 'primary' }
    case 'OFFER': return { label: 'Offer', state: 'success' }
    case 'REJECTED': return { label: 'Rejected', state: 'danger' }
    case 'WITHDRAWN': return { label: 'Withdrawn', state: 'muted' }
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
    const variant = score >= 85 ? 'success' : score >= 60 ? 'warning' : 'error'

    return (
      <Badge ref={ref} variant={variant} className={className} {...props}>
        {score}% Match
      </Badge>
    )
  }
)
MatchBadge.displayName = 'MatchBadge'
