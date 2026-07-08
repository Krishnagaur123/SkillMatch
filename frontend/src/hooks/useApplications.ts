import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export type ApplicationStatus =
  | 'APPLIED'
  | 'ONLINE_ASSESSMENT'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface CompanySummaryResponse {
  id: string
  name: string
  logoPictureUrl?: string
}

export interface OpportunityCardResponse {
  id: string
  title: string
  location: string
  company: CompanySummaryResponse
}

export interface ApplicationResponse {
  applicationId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  notes?: string
  opportunity: OpportunityCardResponse
  currentMatchPercentage: number
}

async function fetchApplications(): Promise<ApplicationResponse[]> {
  const response = await apiClient.get<ApplicationResponse[]>('/api/v1/applications')
  return response.data
}

export function useApplications() {
  return useQuery<ApplicationResponse[], Error>({
    queryKey: queryKeys.applications.all(),
    queryFn: fetchApplications,
  })
}
