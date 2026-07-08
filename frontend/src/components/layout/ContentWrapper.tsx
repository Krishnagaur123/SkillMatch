import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './ContentWrapper.module.css'

export type ContentWrapperProps = HTMLAttributes<HTMLDivElement>

export const ContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={[styles.root, className].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ContentWrapper.displayName = 'ContentWrapper'

export default ContentWrapper
