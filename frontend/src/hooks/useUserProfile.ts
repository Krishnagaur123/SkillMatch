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
  isAdmin?: boolean
}

export interface UpdateUserProfileRequest {
  name?: string
  targetRoleIds?: string[]
}

import { API_BASE_URL } from '@/config/constants'

const resolveAvatarUrl = (url?: string) => {
  if (!url) return undefined
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
  // If API_BASE_URL is empty (e.g. same origin production), it just returns the relative URL
  return `${API_BASE_URL}${url}`
}

async function fetchUserProfile(): Promise<UserProfileResponse> {
  const response = await apiClient.get<UserProfileResponse>('/api/v1/users/me')
  const data = response.data
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
}

async function updateUserProfile(request: UpdateUserProfileRequest): Promise<UserProfileResponse> {
  const response = await apiClient.put<UserProfileResponse>('/api/v1/users/me', request)
  const data = response.data
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
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
      void queryClient.invalidateQueries({ queryKey: ['profile', 'detail'] })
    },
  })
}

async function uploadAvatarApi(file: File): Promise<UserProfileResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post<UserProfileResponse>('/api/v1/users/me/avatar', formData, {
    headers: {
      'Content-Type': undefined,
    },
  })
  const data = response.data
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
}

async function removeAvatarApi(): Promise<UserProfileResponse> {
  const response = await apiClient.delete<UserProfileResponse>('/api/v1/users/me/avatar')
  const data = response.data
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation<UserProfileResponse, Error, File>({
    mutationFn: uploadAvatarApi,
    onSuccess: (newProfile) => {
      queryClient.setQueryData(queryKeys.auth.me(), newProfile)
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
      void queryClient.invalidateQueries({ queryKey: ['profile', 'detail'] })
    },
  })
}

export function useRemoveAvatar() {
  const queryClient = useQueryClient()
  return useMutation<UserProfileResponse, Error, void>({
    mutationFn: removeAvatarApi,
    onSuccess: (newProfile) => {
      queryClient.setQueryData(queryKeys.auth.me(), newProfile)
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
      void queryClient.invalidateQueries({ queryKey: ['profile', 'detail'] })
    },
  })
}
