import { useEffect, useState } from 'react'
import { Lightbulb } from 'lucide-react'
import styles from './CoverageHero.module.css'
import { getCoverageCategory, type CoverageCategory } from '../utils'

interface CoverageHeroProps {
  coverage: number
  targetRoles: string[]
  summary: string
  nextBestAction?: {
    skillName: string
    coverageGain: number
  }
}

export function CoverageHero({ coverage, targetRoles, summary, nextBestAction }: CoverageHeroProps) {
  const [animatedCoverage, setAnimatedCoverage] = useState(0)
  const category: CoverageCategory = getCoverageCategory(coverage)

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => {
      setAnimatedCoverage(coverage)
    }, 100)
    return () => clearTimeout(timer)
  }, [coverage])

  const radius = 80
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedCoverage / 100) * circumference

  const targetRoleText = targetRoles.length > 0 
    ? targetRoles.join(', ')
    : 'your selected target roles'

  return (
    <section className={styles.hero}>
      <div className={styles.header}>
        <h1 className={styles.title}>Career Analytics</h1>
        <p className={styles.subtitle}>
          Track your readiness for {targetRoleText}.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.progressContainer}>
          <svg className={styles.progressSvg} viewBox="0 0 180 180">
            <circle
              className={styles.progressBackground}
              cx="90"
              cy="90"
              r={radius}
            />
            <circle
              className={styles.progressValue}
              cx="90"
              cy="90"
              r={radius}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset,
              }}
            />
          </svg>
          <div className={styles.progressText}>
            <span className={styles.percentage}>{coverage}%</span>
          </div>
        </div>

        <div className={styles.summary}>
          <span className={styles.category} data-category={category}>
            {category}
          </span>
          <p className={styles.explanation}>
            You're currently covering approximately {coverage}% of the weighted market demand for your selected target roles.
          </p>
          <div className={styles.assessment}>
            <p className={styles.summary}>{summary}</p>
          </div>
          {nextBestAction && (
            <div className={styles.nextBestAction}>
              <div className={styles.nbaIcon}>
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <p className={styles.nbaText}>
                <strong>Next Best Action:</strong> Learn <strong>{nextBestAction.skillName}</strong> to improve your market coverage by {nextBestAction.coverageGain.toFixed(1)}%.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
