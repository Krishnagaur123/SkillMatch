import { Skeleton } from '@/components/feedback/Skeleton'
import { Card, CardContent, CardHeader } from '@/components/common/Card'
import styles from './CompanySkeleton.module.css'

export function CompanySkeleton() {
  return (
    <div className={styles.root}>
      {/* Hero skeleton */}
      <div className={styles.heroSk}>
        <div className={styles.identitySk}>
          <Skeleton className={styles.logoSk} />
          <div className={styles.metaSk}>
            <Skeleton className={styles.nameSk} />
            <div className={styles.badgesSkRow}>
              <Skeleton className={styles.badge1Sk} />
              <Skeleton className={styles.badge2Sk} />
            </div>
            <Skeleton className={styles.websiteSk} />
          </div>
        </div>
        <Skeleton className={styles.dividerSk} />
      </div>

      {/* Metrics row skeleton */}
      <div className={styles.metricsSk}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className={styles.metricCardSk} />
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className={styles.mainGrid}>
        {/* Left column */}
        <div className={styles.leftColumn}>
          {/* About card */}
          <Card padding="md">
            <CardHeader>
              <Skeleton className={styles.cardTitleSk} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardInner}>
                <Skeleton className={styles.line100} />
                <Skeleton className={styles.line92} />
                <Skeleton className={styles.line97} />
                <Skeleton className={styles.line85} />
              </div>
            </CardContent>
          </Card>

          {/* Technologies card */}
          <Card padding="md">
            <CardHeader>
              <Skeleton className={styles.techTitleSk} />
            </CardHeader>
            <CardContent>
              <div className={styles.techBadgesSk}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className={styles.techBadgeSk} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Opportunities card */}
          <Card padding="md">
            <CardHeader>
              <Skeleton className={styles.oppTitleSk} />
            </CardHeader>
            <CardContent>
              <div className={styles.cardInner}>
                <Skeleton className={styles.oppRowSk} />
                <Skeleton className={styles.oppRowSk} />
                <Skeleton className={styles.oppRowSk} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Quick Facts card */}
          <Card padding="md">
            <CardHeader>
              <Skeleton className={styles.factsTitleSk} />
            </CardHeader>
            <CardContent>
              <div className={styles.sidebarFactsSk}>
                {(['sv1', 'sv2', 'sv3', 'sv4', 'sv5'] as const).map((svClass) => (
                  <div key={svClass} className={styles.sidebarItem}>
                    <Skeleton className={styles.sidebarIconSk} />
                    <div className={styles.sidebarTextSk}>
                      <Skeleton className={styles.sidebarLabelSk} />
                      <Skeleton className={styles[svClass]} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA card */}
          <Card padding="md">
            <CardContent>
              <div className={styles.cardInner}>
                <Skeleton className={styles.ctaTitleSk} />
                <Skeleton className={styles.ctaLine1Sk} />
                <Skeleton className={styles.ctaLine2Sk} />
                <Skeleton className={styles.ctaBtn1Sk} />
                <Skeleton className={styles.ctaBtn2Sk} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
