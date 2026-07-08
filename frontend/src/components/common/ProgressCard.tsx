import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Card, CardContent } from './Card'
import type { CardProps } from './Card'
import styles from './ProgressCard.module.css'

export interface ProgressCardProps extends CardProps {
  title: string
  value: string | number
  percentage: number
  description?: string
  icon?: ReactNode
  color?: string
}

export const ProgressCard = forwardRef<HTMLDivElement, ProgressCardProps>(
  ({ className, variant, padding, title, value, percentage, description, icon, color = 'var(--accent)', ...props }, ref) => {
    // Clamp percentage between 0 and 100
    const clampedPercentage = Math.min(100, Math.max(0, percentage))

    return (
      <Card ref={ref} className={className} variant={variant} padding={padding} {...props}>
        <CardContent className={styles.container}>
          <div className={styles.topRow}>
            <span className={styles.title}>{title}</span>
            {icon && <div className={styles.icon}>{icon}</div>}
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.value}>{value}</span>
            <span className={styles.percentage}>{clampedPercentage}%</span>
          </div>
          <div className={styles.progressTrack} aria-label={`${clampedPercentage}% progress`}>
            <div
              className={styles.progressFill}
              style={{
                width: `${clampedPercentage}%`,
                backgroundColor: color,
              }}
            />
          </div>
          {description && <p className={styles.description}>{description}</p>}
        </CardContent>
      </Card>
    )
  }
)
ProgressCard.displayName = 'ProgressCard'
