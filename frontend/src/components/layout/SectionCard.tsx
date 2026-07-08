import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../common/Card'
import type { CardProps } from '../common/Card'

export interface SectionCardProps extends CardProps {
  title: string
  description?: string
  actions?: ReactNode
}

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  ({ className, variant, padding, title, description, actions, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={className} variant={variant} padding={padding} {...props}>
        <CardHeader
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {actions && <div style={{ flexShrink: 0 }}>{actions}</div>}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    )
  }
)
SectionCard.displayName = 'SectionCard'
