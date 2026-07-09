import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface TargetRoleResponse {
  id: string
  name: string
}

export interface UpdateTargetRolesRequest {
  targetRoleIds: string[]
}

async function fetchAllTargetRoles(): Promise<TargetRoleResponse[]> {
  const response = await apiClient.get<TargetRoleResponse[]>('/api/v1/target-roles')
  return response.data
}

async function updateTargetRoles(request: UpdateTargetRolesRequest): Promise<TargetRoleResponse[]> {
  const response = await apiClient.put<TargetRoleResponse[]>('/api/v1/users/me/target-roles', request)
  return response.data
}

function invalidateDependentQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() })
  queryClient.invalidateQueries({ queryKey: queryKeys.users.targetRoles() })
  queryClient.invalidateQueries({ queryKey: queryKeys.analytics.career() })
  queryClient.invalidateQueries({ queryKey: queryKeys.opportunities.recommended() })
  queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all() })
}

export function useAllTargetRoles() {
  return useQuery<TargetRoleResponse[], Error>({
    queryKey: queryKeys.roles.all(),
    queryFn: fetchAllTargetRoles,
  })
}

export function useUpdateTargetRoles() {
  const queryClient = useQueryClient()
  return useMutation<TargetRoleResponse[], Error, UpdateTargetRolesRequest>({
    mutationFn: updateTargetRoles,
    onSuccess: () => {
      invalidateDependentQueries(queryClient)
    },
  })
}
