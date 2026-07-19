import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/constants/queryKeys'
import {
  fetchProfileDetail,
  fetchProfileCompletion,
  updateProfileDetail,
  type UserProfileDetail,
  type ProfileCompletion,
  type UpdateProfileDetailPayload,
} from '../services/profileApi'

// ── Query Key Extensions ──────────────────────────────────────────────────────

const profileDetailKey = () => ['profile', 'detail'] as const
const profileCompletionKey = () => ['profile', 'completion'] as const

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useProfileDetail() {
  return useQuery<UserProfileDetail, Error>({
    queryKey: profileDetailKey(),
    queryFn: fetchProfileDetail,
  })
}

export function useProfileCompletion() {
  return useQuery<ProfileCompletion, Error>({
    queryKey: profileCompletionKey(),
    queryFn: fetchProfileCompletion,
  })
}

export function useUpdateProfileDetail() {
  const queryClient = useQueryClient()
  return useMutation<UserProfileDetail, Error, UpdateProfileDetailPayload>({
    mutationFn: updateProfileDetail,
    onSuccess: (updated) => {
      // Immediately update the cached profile data
      queryClient.setQueryData(profileDetailKey(), updated)
      // Refetch completion since it depends on profile fields
      void queryClient.invalidateQueries({ queryKey: profileCompletionKey() })
      // Invalidate the legacy auth/me endpoint used by ProtectedLayout
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
    },
  })
}
