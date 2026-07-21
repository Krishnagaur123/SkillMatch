import { Lightbulb } from 'lucide-react'
import type { ApplicationStatus } from '@/types/application'
import styles from './NextAction.module.css'

interface NextActionProps {
  status: ApplicationStatus
}

export function NextAction({ status }: NextActionProps) {
  const getActionDetails = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED': return { action: 'Waiting for recruiter response', desc: 'Typically recruiters respond within 1–2 weeks.' }
      case 'ONLINE_ASSESSMENT': return { action: 'Complete your assessment', desc: 'Check your email for the assessment link and complete it soon.' }
      case 'INTERVIEW': return { action: 'Prepare for your interview', desc: 'Review the job description and practice your answers.' }
      case 'OFFER': return { action: 'Review your offer', desc: 'Carefully evaluate the compensation and benefits package.' }
      case 'REJECTED': return { action: 'Continue applying', desc: 'Keep your momentum going by finding new opportunities.' }
      case 'WITHDRAWN': return { action: 'No further action', desc: 'You have successfully withdrawn your application.' }
      default: return { action: 'No action required', desc: '' }
    }
  }

  const details = getActionDetails(status)

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Lightbulb className={styles.icon} />
        </div>
        <h2 className={styles.title}>Next Action</h2>
      </div>
      <div className={styles.content}>
        <p className={styles.actionText}>{details.action}</p>
        {details.desc && <p className={styles.actionDesc}>{details.desc}</p>}
      </div>
    </div>
  )
}
