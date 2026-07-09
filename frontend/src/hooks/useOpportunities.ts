import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'
import type { PageResponse } from '@/types/api'

interface CompanySummaryResponse {
  id: string
  name: string
  logoUrl?: string
}

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'EXECUTIVE'

export interface OpportunityRecommendation {
  opportunityId: string
  title: string
  company: CompanySummaryResponse
  location: string
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  matchPercentage: number
  matchedSkills: string[]
  missingRequiredSkills: string[]
  missingPreferredSkills: string[]
  missingGoodToHaveSkills: string[]
  applyUrl: string
}

export interface UseRecommendedOpportunitiesParams {
  targetRoleId?: string
  location?: string
  page?: number
  size?: number
  sort?: string
}

async function fetchRecommendedOpportunities(params: UseRecommendedOpportunitiesParams): Promise<PageResponse<OpportunityRecommendation>> {
  const urlParams = new URLSearchParams()
  if (params.targetRoleId) urlParams.append('targetRoleId', params.targetRoleId)
  if (params.location) urlParams.append('location', params.location)
  if (params.page !== undefined) urlParams.append('page', params.page.toString())
  if (params.size !== undefined) urlParams.append('size', params.size.toString())
  if (params.sort) urlParams.append('sort', params.sort)

  const queryString = urlParams.toString()
  const url = `/api/v1/opportunities/recommended${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient.get<PageResponse<OpportunityRecommendation>>(url)
  return response.data
}

export function useRecommendedOpportunities(params: UseRecommendedOpportunitiesParams) {
  return useQuery<PageResponse<OpportunityRecommendation>, Error>({
    queryKey: queryKeys.opportunities.recommended(params as Record<string, unknown>),
    queryFn: () => fetchRecommendedOpportunities(params),
  })
}
