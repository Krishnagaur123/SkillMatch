import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export type ResumeStatus = 'UPLOADED' | 'TEXT_EXTRACTED' | 'ANALYZED' | 'FAILED'

export interface ResumeSummaryResponse {
  id: string
  title: string
  fileName: string
  status: ResumeStatus
  active: boolean
  uploadedAt: string
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
