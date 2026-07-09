import { CheckCircle2, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'

interface MatchSummaryProps {
  match?: OpportunityRecommendation
}

export function MatchSummary({ match }: MatchSummaryProps) {
  if (!match) {
    return (
      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 flex gap-4 items-start">
        <Lightbulb className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-slate-900 dark:text-white">Match Information Unavailable</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            We couldn't load your personalized match score for this opportunity. Review the requirements below to determine if this is a good fit.
          </p>
        </div>
      </div>
    )
  }

  const { matchPercentage, missingRequiredSkills, missingPreferredSkills } = match

  let icon = <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
  let title: string
  let description: string
  
  if (matchPercentage >= 90 && missingRequiredSkills.length === 0) {
    title = 'Excellent Match'
    description = 'You have all the required skills for this role. Consider applying!'
  } else if (matchPercentage >= 75 && missingRequiredSkills.length === 0) {
    title = 'Strong Match'
    description = 'You meet all core requirements. Review the preferred skills to see how you can stand out.'
    icon = <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
  } else if (missingRequiredSkills.length > 0) {
    const missingCount = missingRequiredSkills.length
    icon = <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
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
    icon = <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
  } else {
    title = 'Moderate Match'
    description = 'Review the full skill profile to ensure a good fit.'
    icon = <Info className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-700/50 flex gap-4 items-start">
      {icon}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}
