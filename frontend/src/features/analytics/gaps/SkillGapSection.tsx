import type { LearningRoadmapItem } from '@/hooks/useCareerAnalytics'
import styles from './SkillGapSection.module.css'

interface SkillGapSectionProps {
  gaps: LearningRoadmapItem[]
}

function getGapPriority(gain: number): 'Critical' | 'High' | 'Medium' {
  if (gain >= 10) return 'Critical'
  if (gain >= 5) return 'High'
  return 'Medium'
}

export function SkillGapSection({ gaps }: SkillGapSectionProps) {
  const sortedGaps = [...gaps].sort((a, b) => b.estimatedCoverageGain - a.estimatedCoverageGain)

  if (sortedGaps.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <p className={styles.explanation}>
        These skills are missing from your profile. Learning them provides the largest potential increase to your overall market coverage.
      </p>
      <div className={styles.gaps}>
        {sortedGaps.map((skill) => {
          const priority = getGapPriority(skill.estimatedCoverageGain)
          return (
            <div key={skill.skillName} className={styles.item}>
              <div className={styles.skillInfo}>
                <span className={styles.skillName}>{skill.skillName}</span>
                <span className={styles.priorityBadge} data-priority={priority}>
                  {priority}
                </span>
              </div>
              <span className={styles.gain}>Potential Coverage Gain +{skill.estimatedCoverageGain.toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
