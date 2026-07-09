import { useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'
import type { EmploymentType, ExperienceLevel, OpportunityRecommendation } from './useOpportunities'
import type { PageResponse } from '@/types/api'

export interface OpportunityDetailCompanySummary {
  id: string
  name: string
  logoUrl?: string
}


export interface OpportunityDetailResponse {
  id: string
  title: string
  company: OpportunityDetailCompanySummary
  location: string
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  description: string
  applyUrl: string
  source: string
  postedAt: string
  expiresAt: string
  active: boolean
  requiredSkills: string[]
  preferredSkills: string[]
  goodToHaveSkills: string[]
  targetRoles: string[]
}

async function fetchOpportunityDetail(id: string): Promise<OpportunityDetailResponse> {
  const response = await apiClient.get<OpportunityDetailResponse>(`/api/v1/opportunities/${id}`)
  return response.data
}

export function useOpportunityDetail(id: string) {
  return useQuery<OpportunityDetailResponse, Error>({
    queryKey: queryKeys.opportunities.detail(id),
    queryFn: () => fetchOpportunityDetail(id),
    enabled: !!id,
  })
}

/**
 * Searches the React Query cache for the OpportunityRecommendation matching the given ID.
 * This is used to display the personalized match percentage and matched skills on the detail page
 * without requiring a new backend calculation endpoint.
 */
export function useOpportunityMatch(id: string): OpportunityRecommendation | undefined {
  const queryClient = useQueryClient()
  
  // Search across all queries matching ['opportunities', 'recommended']
  const queries = queryClient.getQueriesData<PageResponse<OpportunityRecommendation>>({
    queryKey: ['opportunities', 'recommended']
  })

  for (const [, data] of queries) {
    if (data && data.content) {
      const match = data.content.find(opp => opp.opportunityId === id)
      if (match) return match
    }
  }

  return undefined
}
