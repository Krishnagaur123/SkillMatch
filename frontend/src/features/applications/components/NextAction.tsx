import { Lightbulb } from 'lucide-react'
import type { ApplicationStatus } from '@/types/application'
import styles from './NextAction.module.css'

interface NextActionProps {
  status: ApplicationStatus
}

export function NextAction({ status }: NextActionProps) {
  const getActionText = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED': return 'Waiting for recruiter response'
      case 'ONLINE_ASSESSMENT': return 'Complete your assessment'
      case 'INTERVIEW': return 'Prepare for your interview'
      case 'OFFER': return 'Review your offer'
      case 'REJECTED': return 'Continue applying'
      case 'WITHDRAWN': return 'No further action'
      default: return 'No action required'
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Lightbulb className={styles.icon} />
        </div>
        <h2 className={styles.title}>Next Action</h2>
      </div>
      <p className={styles.actionText}>{getActionText(status)}</p>
    </div>
  )
}
