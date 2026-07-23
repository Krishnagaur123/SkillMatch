import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface UserSkillResponse {
  skillId: string
  skillName: string
}

export interface AddUserSkillRequest {
  skillId: string
}

async function fetchUserSkills(): Promise<UserSkillResponse[]> {
  const response = await apiClient.get<UserSkillResponse[]>('/api/v1/users/skills')
  return response.data
}

async function addUserSkill(request: AddUserSkillRequest): Promise<UserSkillResponse> {
  const response = await apiClient.post<UserSkillResponse>('/api/v1/users/skills', request)
  return response.data
}

async function removeUserSkill(skillId: string): Promise<void> {
  await apiClient.delete(`/api/v1/users/skills/${skillId}`)
}

function invalidateDependentQueries(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
  void queryClient.invalidateQueries({ queryKey: queryKeys.users.skills() })
  void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
  void queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.recommended() })
  void queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() })
  void queryClient.invalidateQueries({ queryKey: ['profile', 'completion'] })
}

export function useUserSkills() {
  return useQuery<UserSkillResponse[], Error>({
    queryKey: queryKeys.users.skills(),
    queryFn: fetchUserSkills,
  })
}

export function useAddUserSkill() {
  const queryClient = useQueryClient()
  return useMutation<UserSkillResponse, Error, AddUserSkillRequest>({
    mutationFn: addUserSkill,
    onSuccess: (newSkill) => {
      queryClient.setQueryData<UserSkillResponse[]>(queryKeys.users.skills(), (old) => {
        if (!old) return [newSkill]
        return [...old, newSkill].sort((a, b) => a.skillName.localeCompare(b.skillName))
      })
      invalidateDependentQueries(queryClient)
    },
  })
}

export function useRemoveUserSkill() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: removeUserSkill,
    onSuccess: (_, deletedSkillId) => {
      queryClient.setQueryData<UserSkillResponse[]>(queryKeys.users.skills(), (old) => {
        if (!old) return old
        return old.filter(s => s.skillId !== deletedSkillId)
      })
      invalidateDependentQueries(queryClient)
    },
  })
}
