

export type CoverageCategory = 'Excellent' | 'Good' | 'Needs Improvement' | 'Low Coverage'

export function getCoverageCategory(coverage: number): CoverageCategory {
  if (coverage >= 85) return 'Excellent'
  if (coverage >= 70) return 'Good'
  if (coverage >= 55) return 'Needs Improvement'
  return 'Low Coverage'
}

export type ImpactPriority = 'High Impact' | 'Medium Impact' | 'Low Impact'

export function getImpactPriority(coverageGain: number): ImpactPriority {
  if (coverageGain >= 10) return 'High Impact'
  if (coverageGain >= 5) return 'Medium Impact'
  return 'Low Impact'
}

export type Recommendation = 'Ready to Apply' | 'Resume Update Recommended' | 'Continue Learning'

export function getOverallRecommendation(
  coverage: number,
  hasResumeGaps: boolean
): { recommendation: Recommendation; explanation: string } {
  if (coverage >= 75 && !hasResumeGaps) {
    return {
      recommendation: 'Ready to Apply',
      explanation: 'Your market coverage is strong and your resume is fully synchronized with your profile. You are in a highly competitive position to apply for roles.',
    }
  }

  if (coverage >= 75 && hasResumeGaps) {
    return {
      recommendation: 'Resume Update Recommended',
      explanation: 'Your profile has strong market coverage, but important skills are missing from your active resume. Update your resume to ensure recruiters see your full potential.',
    }
  }

  return {
    recommendation: 'Continue Learning',
    explanation: 'Focus on improving your market coverage by learning high-impact skills before applying for roles. A coverage of 75% or higher is recommended.',
  }
}

export function getCareerSnapshotSummary(
  targetRoles: string[],
  topLearningSkill: string | undefined
): string {
  const primaryRole = targetRoles[0] || 'your target roles'
  
  if (topLearningSkill) {
    return `You're currently closest to becoming competitive for ${primaryRole}. Improving ${topLearningSkill} would provide your largest increase in market readiness.`
  }
  
  return `You're currently closest to becoming competitive for ${primaryRole}.`
}
