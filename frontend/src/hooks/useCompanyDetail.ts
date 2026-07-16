import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface CompanyDetailResponse {
  id: string
  name: string
  logoUrl?: string
  website?: string
  industry?: string
  headquarters?: string
  employeeCount?: number
  foundedYear?: number
  description?: string
  openOpportunities: number
}

async function fetchCompanyDetail(id: string): Promise<CompanyDetailResponse> {
  const response = await apiClient.get<CompanyDetailResponse>(`/api/v1/companies/${id}`)
  return response.data
}

export function useCompanyDetail(id: string) {
  return useQuery<CompanyDetailResponse, Error>({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => fetchCompanyDetail(id),
    enabled: !!id,
  })
}
