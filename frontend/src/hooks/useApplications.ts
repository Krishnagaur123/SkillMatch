import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export interface CreateApplicationRequest {
  opportunityId: string
  status: ApplicationStatus
}

async function createApplication(request: CreateApplicationRequest): Promise<ApplicationResponse> {
  const response = await apiClient.post<ApplicationResponse>('/api/v1/applications', request)
  return response.data
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation<ApplicationResponse, Error, CreateApplicationRequest>({
    mutationFn: createApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
    },
  })
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus
  notes?: string
}

async function updateApplication({ id, request }: { id: string; request: UpdateApplicationRequest }): Promise<ApplicationResponse> {
  const response = await apiClient.put<ApplicationResponse>(`/api/v1/applications/${id}`, request)
  return response.data
}

export function useUpdateApplication(id: string) {
  const queryClient = useQueryClient()
  return useMutation<ApplicationResponse, Error, UpdateApplicationRequest>({
    mutationFn: (request) => updateApplication({ id, request }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.detail(id) })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
    },
  })
}

async function deleteApplication(id: string): Promise<void> {
  await apiClient.delete(`/api/v1/applications/${id}`)
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: deleteApplication,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.applications.all() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
    },
  })
}

async function fetchApplication(id: string): Promise<ApplicationResponse> {
  const response = await apiClient.get<ApplicationResponse>(`/api/v1/applications/${id}`)
  return response.data
}

export function useApplicationDetail(id: string) {
  return useQuery<ApplicationResponse, Error>({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => fetchApplication(id),
    enabled: !!id,
  })
}
