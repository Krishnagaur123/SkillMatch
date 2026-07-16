import type { Application, ApplicationStatus } from '@/types/application'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import { MapPin } from 'lucide-react'
import { MatchBadge } from '@/components/common/Badge'
import styles from './ApplicationHeader.module.css'

interface ApplicationHeaderProps {
  application: Application
  onStatusChange: (status: ApplicationStatus) => void
}

export function ApplicationHeader({ application, onStatusChange }: ApplicationHeaderProps) {
  const { opportunity, status, currentMatchPercentage } = application
  const { company } = opportunity

  return (
    <div className={styles.header}>
      <div className={styles.mainInfo}>
        <CompanyLogo name={company.name} src={company.logoUrl} className={styles.logo} />
        <div className={styles.details}>
          <h1 className={styles.title}>{opportunity.title}</h1>
          <div className={styles.metaInfo}>
            <span className={styles.companyName}>{company.name}</span>
            <span className={styles.dot}>&middot;</span>
            <span className={styles.location}>
              <MapPin className={styles.metaIcon} />
              {opportunity.location || 'Remote'}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.actions}>
        <div className={styles.matchScore}>
          <span className={styles.matchLabel}>Match Score</span>
          <MatchBadge score={currentMatchPercentage} className={styles.matchBadge} />
        </div>
        <div className={styles.statusSelect}>
          <span className={styles.statusLabel}>Current Status</span>
          <select 
            value={status} 
            onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
            className={styles.select}
          >
            <option value="APPLIED">Applied</option>
            <option value="ONLINE_ASSESSMENT">Online Assessment</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>
      </div>
    </div>
  )
}
