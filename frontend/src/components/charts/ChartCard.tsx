import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card'
import type { CardProps } from '../common/Card'
import styles from './ChartCard.module.css'

export interface ChartCardProps extends CardProps {
  title: string
  description?: string
  actions?: ReactNode
  height?: number | string
}

export const ChartCard = forwardRef<HTMLDivElement, ChartCardProps>(
  ({ className, title, description, actions, height = 300, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} {...props}>
        <CardHeader className={styles.header}>
          <div className={styles.titleGroup}>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </CardHeader>
        <CardContent>
          <div className={styles.chartWrapper} style={{ height }}>
            {children}
          </div>
        </CardContent>
      </Card>
    )
  }
)
ChartCard.displayName = 'ChartCard'
