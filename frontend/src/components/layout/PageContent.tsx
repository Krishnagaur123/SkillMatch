import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './PageContent.module.css'

export type PageContentProps = HTMLAttributes<HTMLDivElement>

export const PageContent = forwardRef<HTMLDivElement, PageContentProps>(
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
PageContent.displayName = 'PageContent'

export default PageContent
