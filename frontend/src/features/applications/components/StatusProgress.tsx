import type { ApplicationStatus } from '@/types/application'
import { Check } from 'lucide-react'
import clsx from 'clsx'
import styles from './StatusProgress.module.css'

interface StatusProgressProps {
  status: ApplicationStatus
}

export function StatusProgress({ status }: StatusProgressProps) {
  const steps: { key: ApplicationStatus; label: string }[] = [
    { key: 'APPLIED', label: 'Applied' },
    { key: 'ONLINE_ASSESSMENT', label: 'Online Assessment' },
    { key: 'INTERVIEW', label: 'Interview' },
    { key: 'OFFER', label: 'Offer' },
  ]

  const isTerminal = status === 'REJECTED' || status === 'WITHDRAWN'
  
  // Find the index of the current active step in the linear path
  const currentIndex = steps.findIndex(s => s.key === status)
  
  const getSummary = (status: ApplicationStatus) => {
    switch (status) {
      case 'APPLIED':
        return {
          title: 'Application submitted successfully.',
          subtitle: 'Waiting for recruiter response.'
        }
      case 'ONLINE_ASSESSMENT':
        return {
          title: 'Assessment stage.',
          subtitle: 'Complete the assigned evaluation.'
        }
      case 'INTERVIEW':
        return {
          title: 'Interview stage.',
          subtitle: 'Prepare for your upcoming interview.'
        }
      case 'OFFER':
        return {
          title: 'Offer received.',
          subtitle: 'Review your offer details.'
        }
      case 'REJECTED':
        return {
          title: 'This hiring process has concluded.',
          subtitle: ''
        }
      case 'WITHDRAWN':
        return {
          title: 'You have withdrawn this application.',
          subtitle: ''
        }
      default:
        return { title: '', subtitle: '' }
    }
  }

  const summary = getSummary(status)

  return (
    <div className={styles.wrapper}>
      <div className={styles.stepperContainer}>
        {steps.map((step, index) => {
          const isCurrent = status === step.key
          const isPast = !isTerminal && currentIndex > index
          
          const indicatorClass = isCurrent ? styles.indicatorCurrent : isPast ? styles.indicatorCompleted : styles.indicatorPending
          const dotClass = isCurrent ? styles.dotCurrent : isPast ? styles.dotCompleted : styles.dotPending
          const lineClass = isPast ? styles.lineCompleted : styles.linePending
          const labelClass = isCurrent ? styles.labelCurrent : isPast ? styles.labelCompleted : styles.labelPending

          return (
            <div key={step.key} className={styles.step}>
              <div className={styles.indicatorWrapper}>
                <div className={clsx(styles.indicator, indicatorClass)}>
                  {isPast ? <Check className={styles.checkIcon} /> : <div className={clsx(styles.dot, dotClass)} />}
                </div>
                {index < steps.length - 1 && <div className={clsx(styles.line, lineClass)} />}
              </div>
              <span className={clsx(styles.label, labelClass)}>{step.label}</span>
            </div>
          )
        })}
      </div>

      {isTerminal && (
        <div className={styles.terminalBadgeWrapper}>
          <span className={clsx(styles.terminalBadge, status === 'REJECTED' ? styles.badgeRejected : styles.badgeWithdrawn)}>
            <span className={styles.terminalDot} />
            {status === 'REJECTED' ? 'Application Closed' : 'Application Withdrawn'}
          </span>
        </div>
      )}

      <div className={styles.summaryBox}>
        <p className={styles.summaryTitle}>{summary.title}</p>
        {summary.subtitle && <p className={styles.summarySubtitle}>{summary.subtitle}</p>}
      </div>
    </div>
  )
}
