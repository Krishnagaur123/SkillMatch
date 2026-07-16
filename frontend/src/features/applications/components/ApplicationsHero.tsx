import { useMemo } from 'react'
import type { Application } from '@/types/application'
import styles from './ApplicationsHero.module.css'

interface ApplicationsHeroProps {
  applications: Application[]
}

export function ApplicationsHero({ applications }: ApplicationsHeroProps) {
  const stats = useMemo(() => {
    let active = 0
    let interview = 0
    let offer = 0
    applications.forEach(app => {
      if (app.status === 'APPLIED' || app.status === 'ONLINE_ASSESSMENT') active++
      if (app.status === 'INTERVIEW') interview++
      if (app.status === 'OFFER') offer++
    })
    return { total: applications.length, active, interview, offer }
  }, [applications])

  return (
    <div className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.title}>Applications</h1>
        <p className={styles.description}>
          Track every application from submission to offer in one place.
        </p>
      </div>
      <div className={styles.right}>
        <div className={styles.chip}>
          <span className={styles.chipValue}>{stats.total}</span>
          <span className={styles.chipLabel}>Total</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.chipValue}>{stats.active}</span>
          <span className={styles.chipLabel}>Active</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.chipValue}>{stats.interview}</span>
          <span className={styles.chipLabel}>Interviews</span>
        </div>
        <div className={styles.chip}>
          <span className={styles.chipValue}>{stats.offer}</span>
          <span className={styles.chipLabel}>Offers</span>
        </div>
      </div>
    </div>
  )
}
