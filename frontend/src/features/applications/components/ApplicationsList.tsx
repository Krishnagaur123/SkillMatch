import type { Application } from '@/types/application'
import { ApplicationRow } from './ApplicationRow'
import styles from './ApplicationsList.module.css'

interface ApplicationsListProps {
  applications: Application[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No applications match your filters.</p>
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {applications.map((app) => (
        <ApplicationRow key={app.applicationId} application={app} />
      ))}
    </div>
  )
}
