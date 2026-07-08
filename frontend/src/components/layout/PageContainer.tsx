import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './PageContainer.module.css'

export type PageContainerProps = HTMLAttributes<HTMLDivElement>

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
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
PageContainer.displayName = 'PageContainer'

export default PageContainer
