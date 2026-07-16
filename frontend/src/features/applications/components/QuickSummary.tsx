import { Link } from 'react-router-dom'
import { ExternalLink, Calendar, Briefcase, BarChart, Clock } from 'lucide-react'
import type { Application } from '@/types/application'
import { MatchBadge, ApplicationStatusBadge } from '@/components/common/Badge'
import styles from './QuickSummary.module.css'

interface QuickSummaryProps {
  application: Application
}

export function QuickSummary({ application }: QuickSummaryProps) {
  const { opportunity, appliedAt, currentMatchPercentage, status } = application

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysSince = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / (1000 * 3600 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    return `${diff} days ago`
  }

  return (
    <div className={styles.summary}>
      <h2 className={styles.sectionTitle}>Quick Summary</h2>
      
      <div className={styles.items}>
        <div className={styles.item}>
          <Calendar className={styles.icon} />
          <div className={styles.content}>
            <span className={styles.label}>Applied Date</span>
            <span className={styles.value}>{formatDate(appliedAt)}</span>
          </div>
        </div>

        <div className={styles.item}>
          <Clock className={styles.icon} />
          <div className={styles.content}>
            <span className={styles.label}>Time Since Application</span>
            <span className={styles.value}>{getDaysSince(appliedAt)}</span>
          </div>
        </div>

        <div className={styles.item}>
          <Briefcase className={styles.icon} />
          <div className={styles.content}>
            <span className={styles.label}>Current Status</span>
            <div className={styles.statusBadgeWrapper}>
              <ApplicationStatusBadge status={status} />
            </div>
          </div>
        </div>

        <div className={styles.item}>
          <BarChart className={styles.icon} />
          <div className={styles.content}>
            <span className={styles.label}>Match Score</span>
            <MatchBadge score={currentMatchPercentage} className={styles.matchBadge} />
          </div>
        </div>
      </div>

      <Link to={`/opportunities/${opportunity.id}`} className={styles.link}>
        View Original Opportunity
        <ExternalLink className={styles.linkIcon} />
      </Link>
    </div>
  )
}
