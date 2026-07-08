import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Card, CardContent } from './Card'
import type { CardProps } from './Card'
import styles from './StatCard.module.css'

export interface StatCardProps extends CardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  trend?: {
    value: string | number
    type: 'up' | 'down' | 'neutral'
  }
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, variant, padding, title, value, description, icon, trend, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} variant={variant} padding={padding} {...props}>
        <CardContent className={styles.container}>
          <div className={styles.topRow}>
            <span className={styles.title}>{title}</span>
            {icon && <div className={styles.icon}>{icon}</div>}
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.value}>{value}</span>
            {trend && (
              <span
                className={[
                  styles.trend,
                  trend.type === 'up'
                    ? styles.trendUp
                    : trend.type === 'down'
                    ? styles.trendDown
                    : styles.trendNeutral,
                ].join(' ')}
              >
                {trend.type === 'up' && '↑'}
                {trend.type === 'down' && '↓'}
                {trend.value}
              </span>
            )}
          </div>
          {description && <p className={styles.description}>{description}</p>}
        </CardContent>
      </Card>
    )
  }
)
StatCard.displayName = 'StatCard'

export const MetricCard = StatCard
