import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import styles from './Badge.module.css'

const badgeVariants = cva(styles.badge, {
  variants: {
    variant: {
      default: styles.variantDefault,
      secondary: styles.variantSecondary,
      outline: styles.variantOutline,
    },
  },
  defaultVariants: {
    variant: 'default',
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
    const statusClass =
      status === 'active' || status === 'success'
        ? styles.statusSuccess
        : status === 'pending' || status === 'warning'
        ? styles.statusWarning
        : status === 'error' || status === 'danger' || status === 'rejected'
        ? styles.statusError
        : styles.statusNeutral

    return (
      <span
        ref={ref}
        className={[styles.badge, styles.statusBadge, statusClass, className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span className={styles.statusDot} aria-hidden="true" />
        {children || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

export interface SkillBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  name: string
  isMissing?: boolean
  variant?: 'resume' | 'manual'
}

export const SkillBadge = forwardRef<HTMLSpanElement, SkillBadgeProps>(
  ({ className, name, isMissing = false, variant = 'manual', children, ...props }, ref) => {
    const variantClass = variant === 'resume' ? styles.skillResume : styles.skillManual
    return (
      <span
        ref={ref}
        className={[
          styles.badge,
          styles.skillBadge,
          isMissing ? styles.skillMissing : variantClass,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        role="button"
        tabIndex={0}
        {...props}
      >
        {name}
        {isMissing && <span className={styles.skillMissingText}>Missing</span>}
        {children}
      </span>
    )
  }
)
SkillBadge.displayName = 'SkillBadge'

export interface MatchBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  score: number
}

export const MatchBadge = forwardRef<HTMLSpanElement, MatchBadgeProps>(
  ({ className, score, ...props }, ref) => {
    const ratingClass =
      score >= 85 ? styles.matchHigh : score >= 60 ? styles.matchMid : styles.matchLow

    return (
      <span
        ref={ref}
        className={[styles.badge, styles.matchBadge, ratingClass, className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {score}% Match
      </span>
    )
  }
)
MatchBadge.displayName = 'MatchBadge'
