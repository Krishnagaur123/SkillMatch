import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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

export interface UpdateUserProfileRequest {
  name?: string
  targetRoleIds?: string[]
}

async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>('/api/v1/users/me')
  return response.data
}

async function updateUserProfile(request: UpdateUserProfileRequest): Promise<UserProfileResponse> {
  const response = await apiClient.put<UserProfileResponse>('/api/v1/users/me', request)
  return response.data
}

export function useUserProfile() {
  return useQuery<UserProfileResponse, Error>({
    queryKey: queryKeys.auth.me(),
    queryFn: fetchUserProfile,
  })
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient()
  return useMutation<UserProfileResponse, Error, UpdateUserProfileRequest>({
    mutationFn: updateUserProfile,
    onSuccess: (newProfile) => {
      // Immediate optimistic cache update
      queryClient.setQueryData(queryKeys.auth.me(), newProfile)
      
      // Background refetch for eventual consistency
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.targetRoles() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.recommended() })
      void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() })
    },
  })
}
