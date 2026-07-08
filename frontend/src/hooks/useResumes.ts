import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'
import { apiPut, apiDelete, apiPost } from '@/services/api'
import { useAppMutation } from '@/lib/reactQuery'

export type ResumeStatus = 'UPLOADED' | 'TEXT_EXTRACTED' | 'ANALYZED' | 'FAILED'

export interface ResumeSummaryResponse {
  id: string
  title: string
  fileName: string
  status: ResumeStatus
  active: boolean
  uploadedAt: string
}

export interface ResumeDetailResponse {
  id: string
  title: string
  fileName: string
  fileSize: number
  status: ResumeStatus
  active: boolean
  uploadedAt: string
  skills: string[]
  educationCount: number
  experienceCount: number
}

async function fetchResumes(): Promise<ResumeSummaryResponse[]> {
  const response = await apiClient.get<ResumeSummaryResponse[]>('/api/v1/resumes')
  return response.data
}

export function useResumes() {
  return useQuery<ResumeSummaryResponse[], Error>({
    queryKey: queryKeys.resumes.all(),
    queryFn: fetchResumes,
  })
}

async function fetchResumeDetail(resumeId: string): Promise<ResumeDetailResponse> {
  const response = await apiClient.get<ResumeDetailResponse>(`/api/v1/resumes/${resumeId}`)
  return response.data
}

export function useResumeDetail(resumeId: string) {
  return useQuery<ResumeDetailResponse, Error>({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: () => fetchResumeDetail(resumeId),
    enabled: !!resumeId,
  })
}

export function useActivateResume() {
  return useAppMutation<unknown, Error, string>({
    mutationFn: (resumeId) => apiPut(`/api/v1/resumes/${resumeId}/activate`),
    invalidateKeys: [
      queryKeys.resumes.all(),
      queryKeys.auth.me(),
      queryKeys.analytics.career(),
    ],
    successMessage: 'Resume activated successfully.',
  })
}

export function useDeleteResume() {
  return useAppMutation<unknown, Error, string>({
    mutationFn: (resumeId) => apiDelete(`/api/v1/resumes/${resumeId}`),
    invalidateKeys: [
      queryKeys.resumes.all(),
      queryKeys.auth.me(),
      queryKeys.analytics.career(),
    ],
    successMessage: 'Resume deleted successfully.',
  })
}

export interface UploadResumeParams {
  file: File
  title?: string
}

export function useUploadResume() {
  return useAppMutation<unknown, Error, UploadResumeParams>({
    mutationFn: ({ file, title }) => {
      const formData = new FormData()
      formData.append('file', file)
      if (title) {
        formData.append('title', title)
      }
      return apiPost('/api/v1/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    },
    invalidateKeys: [
      queryKeys.resumes.all(),
      queryKeys.auth.me(),
      queryKeys.analytics.career(),
    ],
    successMessage: 'Resume uploaded successfully.',
  })
}
