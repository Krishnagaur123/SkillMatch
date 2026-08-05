import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'
import type { PageResponse } from '@/types/api'
import type { EmploymentType, ExperienceLevel } from './useOpportunities'

export interface CompanySummaryResponse {
  id: string
  name: string
  logoUrl?: string
}

export interface AdminOpportunitySummaryResponse {
  id: string
  title: string
  company: CompanySummaryResponse
  location: string
  experienceLevel: ExperienceLevel
  employmentType: EmploymentType
  active?: boolean
}

export interface UseAdminOpportunitiesParams {
  page?: number
  size?: number
  sort?: string
}

async function fetchAdminOpportunities(params: UseAdminOpportunitiesParams): Promise<PageResponse<AdminOpportunitySummaryResponse>> {
  const urlParams = new URLSearchParams()
  if (params.page !== undefined) urlParams.append('page', params.page.toString())
  if (params.size !== undefined) urlParams.append('size', params.size.toString())
  if (params.sort) urlParams.append('sort', params.sort)

  const queryString = urlParams.toString()
  const url = `/api/v1/admin/opportunities${queryString ? `?${queryString}` : ''}`
  
  const response = await apiClient.get<PageResponse<AdminOpportunitySummaryResponse>>(url)
  return response.data
}

export function useAdminOpportunities(params: UseAdminOpportunitiesParams = {}) {
  return useQuery<PageResponse<AdminOpportunitySummaryResponse>, Error>({
    queryKey: queryKeys.opportunities.admin(params as Record<string, unknown>),
    queryFn: () => fetchAdminOpportunities(params),
  })
}
