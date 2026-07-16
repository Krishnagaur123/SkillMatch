import { Link } from 'react-router-dom'
import { ChevronRight, MapPin, CalendarDays } from 'lucide-react'
import type { Application } from '@/types/application'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import { ApplicationStatusBadge, MatchBadge } from '@/components/common/Badge'
import styles from './ApplicationRow.module.css'

interface ApplicationRowProps {
  application: Application
}

export function ApplicationRow({ application }: ApplicationRowProps) {
  const { opportunity, status, appliedAt, currentMatchPercentage, applicationId } = application
  const { company } = opportunity

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <Link to={`/applications/${applicationId}`} className={styles.row}>
      <div className={styles.left}>
        <CompanyLogo name={company.name} src={company.logoUrl} className={styles.logo} />
        <div className={styles.details}>
          <h3 className={styles.title}>{opportunity.title}</h3>
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

      <div className={styles.center}>
        <div className={styles.dateInfo}>
          <CalendarDays className={styles.dateIcon} />
          <span className={styles.dateValue}>{formatDate(appliedAt)}</span>
        </div>
        <ApplicationStatusBadge status={status} />
      </div>

      <div className={styles.right}>
        <MatchBadge score={currentMatchPercentage} className={styles.matchBadge} />
        <div className={styles.viewDetails}>
          <span>View Details</span>
          <ChevronRight className={styles.chevron} />
        </div>
      </div>
    </Link>
  )
}
