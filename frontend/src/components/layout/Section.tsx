import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './Section.module.css'

export type SectionProps = HTMLAttributes<HTMLDivElement>

export const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </section>
    )
  }
)
Section.displayName = 'Section'

export default Section
