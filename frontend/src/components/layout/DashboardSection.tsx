import { forwardRef } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'
import { Section, SectionHeader, ContentWrapper } from './index'
import styles from './DashboardSection.module.css'

export interface DashboardSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: ReactNode
}

export const DashboardSection = forwardRef<HTMLDivElement, DashboardSectionProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <Section ref={ref} className={[styles.root, className].filter(Boolean).join(' ')} {...props}>
        <SectionHeader title={title} description={description} actions={actions} />
        <ContentWrapper className={styles.wrapper}>{children}</ContentWrapper>
      </Section>
    )
  }
)
DashboardSection.displayName = 'DashboardSection'
