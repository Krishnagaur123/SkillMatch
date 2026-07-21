import type { SkillDemandItem } from '@/hooks/useCareerAnalytics'
import { Award } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import styles from './StrengthsSection.module.css'

interface StrengthsSectionProps {
  strengths: SkillDemandItem[]
}

export function StrengthsSection({ strengths }: StrengthsSectionProps) {
  // Ordered by backend contribution (priority score)
  const sortedStrengths = strengths

  if (sortedStrengths.length === 0) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.badges}>
        {sortedStrengths.map((skill) => (
          <Badge key={skill.skillName} variant="neutral" className={styles.badge}>
            <Award className="w-3 h-3 mr-1" />
            {skill.skillName}
          </Badge>
        ))}
      </div>
    </div>
  )
}
