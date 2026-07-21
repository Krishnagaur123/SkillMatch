import { ArrowRight, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CareerAnalyticsResponse } from '@/hooks/useCareerAnalytics'
import styles from './RecommendedNextStep.module.css'

interface RecommendedNextStepProps {
  analytics: CareerAnalyticsResponse
}

export function RecommendedNextStep({ analytics }: RecommendedNextStepProps) {
  // Get top learning priority
  const topLearning = [...analytics.learningRoadmap]
    .sort((a, b) => b.estimatedCoverageGain - a.estimatedCoverageGain)[0]

  if (!topLearning) {
    return (
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Lightbulb className={styles.icon} />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>You are fully optimized</h2>
          <p className={styles.explanation}>
            You currently cover all top skills for your target roles. Great job!
          </p>
        </div>
        <div className={styles.actions}>
          <Link to="/opportunities" className={styles.primaryButton}>
            View Matching Opportunities <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Lightbulb className={styles.icon} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>Recommended Next Step</h2>
        
        <div className={styles.skillBox}>
          <span className={styles.label}>Learn</span>
          <span className={styles.skillName}>{topLearning.skillName}</span>
        </div>

        <div className={styles.metricsRow}>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Coverage Gain</span>
            <span className={styles.metricValuePrimary}>+{topLearning.estimatedCoverageGain.toFixed(1)}%</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.metricLabel}>Market Demand</span>
            <span className={styles.metricValueSecondary}>{topLearning.marketDemand}%</span>
          </div>
        </div>

        <div className={styles.whyBox}>
          <span className={styles.whyLabel}>Why?</span>
          <span className={styles.whyText}>Highest impact skill for your target roles.</span>
        </div>
      </div>

      <div className={styles.actions}>
        <Link to="/opportunities" className={styles.primaryButton}>
          View Matching Opportunities <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
