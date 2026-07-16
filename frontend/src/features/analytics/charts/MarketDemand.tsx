import { useEffect, useState } from 'react'
import type { SkillDemandItem } from '@/hooks/useCareerAnalytics'
import styles from './MarketDemand.module.css'

interface MarketDemandProps {
  skills: SkillDemandItem[]
}

export function MarketDemand({ skills }: MarketDemandProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Limit to top 10
  const topSkills = skills.slice(0, 10)

  if (topSkills.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      {topSkills.map((skill) => (
        <div key={skill.skillName} className={styles.item}>
          <span className={styles.skillName} title={skill.skillName}>
            {skill.skillName}
          </span>
          <div className={styles.bars}>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Hiring Demand</span>
              <div className={styles.barTrack} title={`Hiring Demand: ${Math.round(skill.marketDemand)}%`}>
                <div
                  className={styles.barFill}
                  data-type="demand"
                  style={{ width: animated ? `${Math.min(skill.marketDemand, 100)}%` : '0%' }}
                />
              </div>
              <span className={styles.barValue}>{Math.round(skill.marketDemand)}%</span>
            </div>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Industry Importance</span>
              <div className={styles.barTrack} title={`Industry Importance: ${Math.round(skill.marketImportance)}%`}>
                <div
                  className={styles.barFill}
                  data-type="importance"
                  style={{ width: animated ? `${Math.min(skill.marketImportance, 100)}%` : '0%' }}
                />
              </div>
              <span className={styles.barValue}>{Math.round(skill.marketImportance)}%</span>
            </div>
          </div>
        </div>
      ))}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} data-type="demand" />
          <span className={styles.legendLabel}>Hiring Demand</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} data-type="importance" />
          <span className={styles.legendLabel}>Industry Importance</span>
        </div>
      </div>
    </div>
  )
}
