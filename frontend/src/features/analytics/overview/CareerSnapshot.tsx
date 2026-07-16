import { Briefcase, Target, FileText, Lightbulb, CheckCircle } from 'lucide-react'
import styles from './CareerSnapshot.module.css'
import type { Recommendation } from '../utils'

interface CareerSnapshotProps {
  targetRoles: string[]
  coverage: number
  resumeStatus: string
  nextLearningPriority?: string
  overallRecommendation: Recommendation
}

export function CareerSnapshot({
  targetRoles,
  coverage,
  resumeStatus,
  nextLearningPriority,
  overallRecommendation
}: CareerSnapshotProps) {
  return (
    <section className={styles.snapshot}>
      <div className={styles.metrics}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Briefcase className={styles.icon} />
            <span className={styles.metricLabel}>Primary Role</span>
          </div>
          <span className={styles.metricValue}>{targetRoles[0] || 'None Selected'}</span>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Target className={styles.icon} />
            <span className={styles.metricLabel}>Career Coverage</span>
          </div>
          <span className={styles.metricValue} data-highlight="true">{coverage}%</span>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <FileText className={styles.icon} />
            <span className={styles.metricLabel}>Resume Status</span>
          </div>
          <span className={styles.metricValue}>{resumeStatus}</span>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Lightbulb className={styles.icon} />
            <span className={styles.metricLabel}>Next Learning Priority</span>
          </div>
          <span className={styles.metricValue}>{nextLearningPriority || 'None'}</span>
        </div>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <CheckCircle className={styles.icon} />
            <span className={styles.metricLabel}>Recommendation</span>
          </div>
          <span className={styles.metricValue}>{overallRecommendation}</span>
        </div>
      </div>
    </section>
  )
}
