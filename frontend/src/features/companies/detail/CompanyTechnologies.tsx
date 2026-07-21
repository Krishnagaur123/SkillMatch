import { useMemo } from 'react'
import { CheckCircle2, ThumbsUp, Lightbulb } from 'lucide-react'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import styles from './CompanyTechnologies.module.css'

interface CompanyTechnologiesProps {
  opportunities: OpportunityRecommendation[]
}

interface SkillGroup {
  label: string
  skills: string[]
  badgeClass: string
  icon: React.ReactNode
}

export function CompanyTechnologies({ opportunities }: CompanyTechnologiesProps) {
  const groups = useMemo<SkillGroup[]>(() => {
    if (opportunities.length === 0) return []

    const required = new Set<string>()
    const preferred = new Set<string>()
    const goodToHave = new Set<string>()

    for (const opp of opportunities) {
      // matchedSkills = skills user has that are required; missingRequiredSkills = skills user lacks
      // Together they represent the full required skill set for this role.
      for (const s of opp.matchedSkills) required.add(s)
      for (const s of opp.missingRequiredSkills) required.add(s)
      for (const s of opp.missingPreferredSkills) preferred.add(s)
      for (const s of opp.missingGoodToHaveSkills) goodToHave.add(s)
    }

    // De-duplicate: preferred/good-to-have should not repeat required
    for (const s of required) {
      preferred.delete(s)
      goodToHave.delete(s)
    }
    for (const s of preferred) {
      goodToHave.delete(s)
    }

    const result: SkillGroup[] = []
    if (required.size > 0) {
      result.push({
        label: 'Required',
        skills: Array.from(required).sort(),
        badgeClass: `${styles.badgeBase} ${styles.badgeRequired}`,
        icon: <CheckCircle2 size={14} className={styles.groupIcon} />
      })
    }
    if (preferred.size > 0) {
      result.push({
        label: 'Preferred',
        skills: Array.from(preferred).sort(),
        badgeClass: `${styles.badgeBase} ${styles.badgePreferred}`,
        icon: <ThumbsUp size={14} className={styles.groupIcon} />
      })
    }
    if (goodToHave.size > 0) {
      result.push({
        label: 'Good to Have',
        skills: Array.from(goodToHave).sort(),
        badgeClass: `${styles.badgeBase} ${styles.badgeMuted}`,
        icon: <Lightbulb size={14} className={styles.groupIcon} />
      })
    }

    return result
  }, [opportunities])

  if (groups.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>
          Visit the Opportunities page to load skill data for this company.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {groups.map((group) => (
        <div key={group.label} className={styles.group}>
          <div className={styles.groupHeader}>
            {group.icon}
            <span className={styles.groupLabel}>{group.label}</span>
          </div>
          <div className={styles.badgeWrap}>
            {group.skills.map((skill) => (
              <span key={skill} className={group.badgeClass}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
