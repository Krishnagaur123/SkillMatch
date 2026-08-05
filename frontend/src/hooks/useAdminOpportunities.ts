import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export type OpportunityIngestionRequest = {
  companyId: string
  title: string
  description?: string
  location?: string
  workMode?: 'REMOTE' | 'ONSITE' | 'HYBRID'
  employmentType?: EmploymentType
  experienceLevel?: ExperienceLevel
  applyUrl?: string
  source?: string
  externalId?: string
  postedAt?: string
  expiresAt?: string
  active?: boolean
}

export function useCreateAdminOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: OpportunityIngestionRequest) => {
      const response = await apiClient.post('/api/v1/admin/opportunities', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities', 'admin'] })
    },
  })
}

export function useUpdateAdminOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: OpportunityIngestionRequest }) => {
      const response = await apiClient.put(`/api/v1/admin/opportunities/${id}`, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities', 'admin'] })
    },
  })
}

export function useDeleteAdminOpportunity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/api/v1/admin/opportunities/${id}`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities', 'admin'] })
    },
  })
}
