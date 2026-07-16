import { Link } from 'react-router-dom'
import { CheckCircle, FileText } from 'lucide-react'
import type { ResumeInsight } from '@/hooks/useCareerAnalytics'
import styles from './ResumeSuggestions.module.css'

interface ResumeSuggestionsProps {
  insights: ResumeInsight[]
}

export function ResumeSuggestions({ insights }: ResumeSuggestionsProps) {
  if (insights.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.successState}>
          <CheckCircle className={styles.successIcon} />
          <h3 className={styles.successTitle}>Resume Fully Synchronized</h3>
          <p className={styles.successDescription}>
            Great job! Your active resume includes all the important skills identified in your profile.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.suggestionState}>
        <div className={styles.badges}>
          {insights.map((insight) => (
            <span key={insight.skillName} className={styles.badge}>
              {insight.skillName}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/resumes" className={styles.button}>
            <FileText className="w-4 h-4" />
            Update Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
