import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import styles from './Skeleton.module.css'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular'
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rectangular', ...props }, ref) => {
    const variantClass =
      variant === 'text'
        ? styles.text
        : variant === 'circular'
        ? styles.circular
        : styles.rectangular

    return (
      <div
        ref={ref}
        className={[styles.skeleton, variantClass, className].filter(Boolean).join(' ')}
        {...props}
      />
    )
  }
)
Skeleton.displayName = 'Skeleton'

export type CardSkeletonProps = HTMLAttributes<HTMLDivElement>

export const CardSkeleton = forwardRef<HTMLDivElement, CardSkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.cardSkeleton, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.cardHeaderSkeleton}>
          <Skeleton variant="circular" className={styles.avatarMock} />
          <div className={styles.headerTextMock}>
            <Skeleton variant="text" className={styles.titleMock} />
            <Skeleton variant="text" className={styles.subtitleMock} />
          </div>
        </div>
        <div className={styles.cardBodySkeleton}>
          <Skeleton variant="rectangular" className={styles.bodyBlockMock} />
          <Skeleton variant="text" className={styles.bodyLineMock} />
        </div>
      </div>
    )
  }
)
CardSkeleton.displayName = 'CardSkeleton'

export interface TableSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rows?: number
  columns?: number
}

export const TableSkeleton = forwardRef<HTMLDivElement, TableSkeletonProps>(
  ({ className, rows = 5, columns = 4, ...props }, ref) => {
    const rowArray = Array.from({ length: rows })
    const colArray = Array.from({ length: columns })

    return (
      <div ref={ref} className={[styles.tableSkeleton, className].filter(Boolean).join(' ')} {...props}>
        <div className={styles.tableHeaderMock}>
          {colArray.map((_, idx) => (
            <Skeleton key={idx} variant="text" className={styles.tableHeaderCellMock} />
          ))}
        </div>
        <div className={styles.tableBodyMock}>
          {rowArray.map((_, rIdx) => (
            <div key={rIdx} className={styles.tableRowMock}>
              {colArray.map((_, cIdx) => (
                <Skeleton key={cIdx} variant="text" className={styles.tableCellMock} />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }
)
TableSkeleton.displayName = 'TableSkeleton'
