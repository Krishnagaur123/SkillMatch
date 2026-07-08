import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface LearningRoadmapItem {
  skillName: string
  marketDemand: number
  marketImportance: number
  estimatedCoverageGain: number
}

export interface SkillDemandItem {
  skillName: string
  marketDemand: number
  marketImportance: number
}

export interface ResumeInsight {
  skillName: string
  marketDemand: number
  marketImportance: number
  estimatedCoverageGain: number
}

export interface CareerAnalyticsResponse {
  coverage: number
  learningRoadmap: LearningRoadmapItem[]
  skillsInDemand: SkillDemandItem[]
  topStrengths: SkillDemandItem[]
  resumeInsights: ResumeInsight[]
}

async function fetchCareerAnalytics(): Promise<CareerAnalyticsResponse> {
  const response = await apiClient.get<CareerAnalyticsResponse>('/api/v1/analytics/career')
  return response.data
}

export function useCareerAnalytics() {
  return useQuery<CareerAnalyticsResponse, Error>({
    queryKey: queryKeys.analytics.career(),
    queryFn: fetchCareerAnalytics,
  })
}
