import { Skeleton } from '@/components/feedback/Skeleton'
import { clsx } from 'clsx'
import styles from './CompaniesSkeleton.module.css'

export function CompaniesSkeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.toolbarSk}>
        <Skeleton className={styles.searchSk} />
        <div className={styles.filtersSk}>
          <Skeleton className={styles.filterSelectSk} />
          <Skeleton className={styles.filterSelectSk} />
          <Skeleton className={styles.filterSelectSk} />
          <Skeleton className={styles.filterSelectSk} />
        </div>
      </div>

      <div className={styles.gridSk}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.cardSk}>
            <div className={styles.cardHeaderSk}>
              <Skeleton className={styles.logoSk} />
              <div className={styles.metaSk}>
                <Skeleton className={styles.nameSk} />
                <div className={styles.badgeRowSk}>
                  <Skeleton className={styles.badgeSk} />
                  <Skeleton className={styles.badgeSk} />
                </div>
              </div>
            </div>

            <Skeleton className={clsx(styles.descLineSk, styles.descSk1)} />
            <Skeleton className={clsx(styles.descLineSk, styles.descSk2)} />

            <div className={styles.statsSk}>
              <div className={styles.statColSk}>
                <Skeleton className={styles.statLabelSk} />
                <Skeleton className={styles.statValSk} />
              </div>
              <div className={styles.statColSk}>
                <Skeleton className={styles.statLabelSk} />
                <Skeleton className={styles.statValSk} />
              </div>
              <div className={styles.statColSk}>
                <Skeleton className={styles.statLabelSk} />
                <Skeleton className={styles.statValSk} />
              </div>
            </div>

            <div className={styles.techSk}>
              <Skeleton className={styles.techLabelSk} />
              <div className={styles.techBadgesSk}>
                <Skeleton className={styles.techBadgeSk} />
                <Skeleton className={styles.techBadgeSk} />
                <Skeleton className={styles.techBadgeSk} />
                <Skeleton className={styles.techBadgeSk} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
