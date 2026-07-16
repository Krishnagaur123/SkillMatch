import { TrendingUp, Lightbulb, CheckCircle, Target } from 'lucide-react'
import type { CareerAnalyticsResponse } from '@/hooks/useCareerAnalytics'
import styles from './CareerInsights.module.css'

interface CareerInsightsProps {
  analytics: CareerAnalyticsResponse
}

export function CareerInsights({ analytics }: CareerInsightsProps) {
  const insights = []

  // 1. Strongest market skill
  if (analytics.topStrengths.length > 0) {
    insights.push({
      id: 'strength',
      icon: <TrendingUp className="w-5 h-5" />,
      type: 'positive',
      text: `Your strongest market skill is ${analytics.topStrengths[0].skillName}.`
    })
  }

  // 2. Highest-impact learning opportunity
  const topLearning = [...analytics.learningRoadmap].sort((a, b) => b.estimatedCoverageGain - a.estimatedCoverageGain)[0]
  if (topLearning) {
    insights.push({
      id: 'learning',
      icon: <Lightbulb className="w-5 h-5" />,
      type: 'action',
      text: `Learning ${topLearning.skillName} could improve your market coverage by ${topLearning.estimatedCoverageGain.toFixed(1)}%.`
    })
  }

  // 3. Resume synchronization status
  if (analytics.resumeInsights.length === 0) {
    insights.push({
      id: 'resume',
      icon: <CheckCircle className="w-5 h-5" />,
      type: 'positive',
      text: 'Your resume is fully synchronized with your profile.'
    })
  } else {
    insights.push({
      id: 'resume',
      icon: <Target className="w-5 h-5" />,
      type: 'action',
      text: `Adding ${analytics.resumeInsights.length} missing profile skills to your resume will improve recruiter visibility.`
    })
  }

  // 4. Coverage summary
  if (analytics.coverage >= 75) {
    insights.push({
      id: 'coverage',
      icon: <TrendingUp className="w-5 h-5" />,
      type: 'positive',
      text: 'Your overall coverage puts you in a highly competitive bracket for your target roles.'
    })
  }

  return (
    <div className={styles.grid}>
      {insights.slice(0, 4).map((insight) => (
        <div key={insight.id} className={styles.card}>
          <div className={styles.iconWrapper} data-type={insight.type}>
            {insight.icon}
          </div>
          <p className={styles.text}>{insight.text}</p>
        </div>
      ))}
    </div>
  )
}
