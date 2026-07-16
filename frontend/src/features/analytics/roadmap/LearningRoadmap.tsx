import type { LearningRoadmapItem as RoadmapItemType } from '@/hooks/useCareerAnalytics'
import { getImpactPriority } from '../utils'
import styles from './LearningRoadmap.module.css'

interface LearningRoadmapProps {
  items: RoadmapItemType[]
}

export function LearningRoadmap({ items }: LearningRoadmapProps) {
  // Ensure items are strictly sorted by estimatedCoverageGain descending
  const sortedItems = [...items].sort((a, b) => b.estimatedCoverageGain - a.estimatedCoverageGain)

  if (sortedItems.length === 0) {
    return null
  }

  return (
    <div className={styles.roadmap}>
      {sortedItems.map((item, index) => {
        const priority = getImpactPriority(item.estimatedCoverageGain)
        
        return (
          <div key={item.skillName} className={styles.item}>
            <div className={styles.mainInfo}>
              <span className={styles.rankBadge}>#{index + 1}</span>
              <span className={styles.skillName}>{item.skillName}</span>
              <span className={styles.priorityBadge} data-priority={priority}>
                {priority}
              </span>
            </div>
            
            <div className={styles.metrics}>
              <div className={styles.metricSecondary} title="Frequency of this skill in market demand">
                <span className={styles.metricLabel}>Demand</span>
                <span className={styles.metricValue}>
                  {Math.round(item.marketDemand)}%
                </span>
              </div>
              <div className={styles.metricSecondary} title="Weighted importance of this skill">
                <span className={styles.metricLabel}>Importance</span>
                <span className={styles.metricValue}>
                  {Math.round(item.marketImportance)}%
                </span>
              </div>
              <div className={styles.metricPrimary} title="Estimated increase to your overall market coverage">
                <span className={styles.metricLabel}>Coverage Gain</span>
                <span className={`${styles.metricValue} ${styles.gainValue}`}>
                  +{item.estimatedCoverageGain.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
