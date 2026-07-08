import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface UserProfileResponse {
  id: string
  name: string
  email: string
  profilePictureUrl?: string
  targetRoles: string[]
  resumeUploaded: boolean
  skillsCount: number
  educationCount: number
  experienceCount: number
  profileCompletionPercentage: number
}

async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>('/api/v1/users/me')
  return response.data
}

export function useUserProfile() {
  return useQuery<UserProfileResponse, Error>({
    queryKey: queryKeys.auth.me(),
    queryFn: fetchUserProfile,
  })
}
