import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { CardSkeleton, TableSkeleton } from './Skeleton'
import styles from './Loader.module.css'

export type LoaderProps = HTMLAttributes<HTMLDivElement>

export const InlineLoader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.inlineLoader, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.spinner} />
        <span className={styles.text}>Loading...</span>
      </div>
    )
  }
)
InlineLoader.displayName = 'InlineLoader'

export const SectionLoader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.sectionLoader, className].filter(Boolean).join(' ')} {...props}>
        <InlineLoader />
      </div>
    )
  }
)
SectionLoader.displayName = 'SectionLoader'

export const PageLoader = forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.pageLoader, className].filter(Boolean).join(' ')} {...props}>
        <InlineLoader />
      </div>
    )
  }
)
PageLoader.displayName = 'PageLoader'

export const CardLoader = CardSkeleton
export const TableLoader = TableSkeleton
