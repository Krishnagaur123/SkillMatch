import { useMemo } from 'react'
import type { Application } from '@/types/application'
import styles from './ApplicationsOverview.module.css'

interface ApplicationsOverviewProps {
  applications: Application[]
}

export function ApplicationsOverview({ applications }: ApplicationsOverviewProps) {
  const stats = useMemo(() => {
    let applied = 0
    let interview = 0
    let offer = 0
    let rejected = 0

    applications.forEach((app) => {
      switch (app.status) {
        case 'APPLIED':
        case 'ONLINE_ASSESSMENT':
          applied++
          break
        case 'INTERVIEW':
          interview++
          break
        case 'OFFER':
          offer++
          break
        case 'REJECTED':
        case 'WITHDRAWN':
          rejected++
          break
      }
    })

    return { applied, interview, offer, rejected }
  }, [applications])

  return (
    <div className={styles.grid}>
      <div className={styles.card} data-color="blue">
        <div className={styles.header}>
          <h3 className={styles.label}>Applied</h3>
          <span className={styles.count}>{stats.applied}</span>
        </div>
        <p className={styles.description}>
          {stats.applied === 1 ? 'Currently waiting' : 'Currently waiting'}
        </p>
      </div>
      
      <div className={styles.card} data-color="purple">
        <div className={styles.header}>
          <h3 className={styles.label}>Interview</h3>
          <span className={styles.count}>{stats.interview}</span>
        </div>
        <p className={styles.description}>
          {stats.interview > 0 ? 'Ongoing process' : 'No ongoing interviews'}
        </p>
      </div>
      
      <div className={styles.card} data-color="green">
        <div className={styles.header}>
          <h3 className={styles.label}>Offer</h3>
          <span className={styles.count}>{stats.offer}</span>
        </div>
        <p className={styles.description}>
          {stats.offer > 0 ? 'Active offers' : 'No active offers'}
        </p>
      </div>
      
      <div className={styles.card} data-color="red">
        <div className={styles.header}>
          <h3 className={styles.label}>Rejected</h3>
          <span className={styles.count}>{stats.rejected}</span>
        </div>
        <p className={styles.description}>
          Closed applications
        </p>
      </div>
    </div>
  )
}
