import { CheckCircle2, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import { Card } from '@/components/common/Card'
import styles from './MatchSummary.module.css'

interface MatchSummaryProps {
  match?: OpportunityRecommendation
}

export function MatchSummary({ match }: MatchSummaryProps) {
  if (!match) {
    return (
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <Lightbulb className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconInfo}`} />
          <div className="flex flex-col gap-1.5 pt-0.5">
            <h3 className="text-xl font-semibold text-[var(--text-heading)] m-0">Match Information Unavailable</h3>
            <p className="text-base text-[var(--text-secondary)] m-0">
              We couldn't load your personalized match score for this opportunity. Review the requirements below to determine if this is a good fit.
            </p>
          </div>
        </div>
      </Card>
    )
  }

  const { matchPercentage, missingRequiredSkills, missingPreferredSkills } = match

  let icon = <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconSuccess}`} />
  let title: string
  let description: string
  
  if (matchPercentage >= 90 && missingRequiredSkills.length === 0) {
    title = 'Excellent Match'
    description = 'You have all the required skills for this role. Consider applying!'
  } else if (matchPercentage >= 75 && missingRequiredSkills.length === 0) {
    title = 'Strong Match'
    description = 'You meet all core requirements. Review the preferred skills to see how you can stand out.'
    icon = <CheckCircle2 className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconSuccess}`} />
  } else if (missingRequiredSkills.length > 0) {
    const missingCount = missingRequiredSkills.length
    icon = <AlertTriangle className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconWarning}`} />
    if (missingCount === 1) {
      title = 'Good Fit, Missing One Requirement'
      description = `You are missing a required skill: ${missingRequiredSkills[0]}. Consider brushing up on this before applying.`
    } else {
      title = 'Needs Improvement'
      description = `You are missing ${missingCount} required skills, including ${missingRequiredSkills[0]}. Review the requirements carefully.`
    }
  } else if (missingPreferredSkills.length > 0) {
    title = 'Good Match'
    description = `You cover all requirements, but are missing ${missingPreferredSkills.length} preferred skills.`
    icon = <Info className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconBrand}`} />
  } else {
    title = 'Moderate Match'
    description = 'Review the full skill profile to ensure a good fit.'
    icon = <Info className={`w-6 h-6 shrink-0 mt-0.5 ${styles.iconBrand}`} />
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {icon}
        <div className="flex flex-col gap-1.5 pt-0.5">
          <h3 className="text-xl font-semibold text-[var(--text-heading)] m-0">
            {title}
          </h3>
          <p className="text-base text-[var(--text-secondary)] m-0">
            {description}
          </p>
        </div>
      </div>
    </Card>
  )
}
