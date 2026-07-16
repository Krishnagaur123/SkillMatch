import { CheckCircle, FileText, Target } from 'lucide-react'
import type { Recommendation } from '../utils'
import styles from './OverallRecommendation.module.css'

interface OverallRecommendationProps {
  recommendation: Recommendation
  explanation: string
}

export function OverallRecommendation({ recommendation, explanation }: OverallRecommendationProps) {
  const getIcon = () => {
    switch (recommendation) {
      case 'Ready to Apply':
        return <CheckCircle className="w-8 h-8" />
      case 'Resume Update Recommended':
        return <FileText className="w-8 h-8" />
      case 'Continue Learning':
        return <Target className="w-8 h-8" />
    }
  }

  return (
    <div className={styles.container} data-recommendation={recommendation}>
      <div className={styles.icon} data-recommendation={recommendation}>
        {getIcon()}
      </div>
      <h2 className={styles.title}>{recommendation}</h2>
      <p className={styles.explanation}>{explanation}</p>
    </div>
  )
}
