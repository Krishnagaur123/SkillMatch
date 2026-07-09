import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api/client'
import { queryKeys } from '@/constants/queryKeys'

export interface SkillSummaryResponse {
  id: string
  name: string
}

async function fetchSkillsCatalog(query: string): Promise<SkillSummaryResponse[]> {
  const response = await apiClient.get<SkillSummaryResponse[]>('/api/v1/skills', {
    params: { query },
  })
  return response.data
}

export function useSkillsCatalog(query: string) {
  return useQuery<SkillSummaryResponse[], Error>({
    queryKey: queryKeys.skills.catalog(query),
    queryFn: () => fetchSkillsCatalog(query),
    enabled: true,
  })
}
