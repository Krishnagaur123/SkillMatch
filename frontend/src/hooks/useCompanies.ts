import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'

export interface CompanySummaryResponse {
  id: string
  name: string
  logoUrl?: string
  website?: string
  industry?: string
  headquarters?: string
  employeeCount?: number
  foundedYear?: number
  description?: string
  openRolesCount: number
}

async function fetchCompanies(): Promise<CompanySummaryResponse[]> {
  const { data } = await apiClient.get<CompanySummaryResponse[]>('/api/v1/companies')
  return data
}

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
