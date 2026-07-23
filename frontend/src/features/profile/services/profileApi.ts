import { apiGet, apiPut } from '@/services/api'
import { API_BASE_URL } from '@/config/constants'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ExperienceLevel =
  | 'FRESHER'
  | 'ENTRY_LEVEL'
  | 'MID_LEVEL'
  | 'SENIOR'
  | 'LEAD'
  | 'MANAGER'
  | 'EXECUTIVE'

export type PreferredWorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE'

export interface UserProfileDetail {
  userId: string
  name: string
  email: string
  profilePictureUrl?: string | null
  headline?: string | null
  about?: string | null
  institutionName?: string | null
  degreeName?: string | null
  fieldOfStudy?: string | null
  graduationYear?: number | null
  cgpa?: number | null
  experienceLevel?: ExperienceLevel | null
  currentOrganization?: string | null
  phoneNumber?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  portfolioUrl?: string | null
  leetcodeUrl?: string | null
  codeforcesUrl?: string | null
  preferredWorkMode?: PreferredWorkMode | null
  openToWork?: boolean | null
}

export interface UpdateProfileDetailPayload {
  headline?: string | null
  about?: string | null
  institutionName?: string | null
  degreeName?: string | null
  fieldOfStudy?: string | null
  graduationYear?: number | null
  cgpa?: number | null
  experienceLevel?: ExperienceLevel | null
  currentOrganization?: string | null
  phoneNumber?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  linkedinUrl?: string | null
  githubUrl?: string | null
  portfolioUrl?: string | null
  leetcodeUrl?: string | null
  codeforcesUrl?: string | null
  preferredWorkMode?: PreferredWorkMode | null
  openToWork?: boolean | null
}

export interface ProfileCompletion {
  completionPercentage: number
  completedSections: string[]
  missingSections: string[]
  nextRecommendedAction: string
}

// ── API Functions ─────────────────────────────────────────────────────────────

const PROFILE_BASE = '/api/v1/profile'

const resolveAvatarUrl = (url?: string | null) => {
  if (!url) return undefined
  if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('blob:')) return url
  return `${API_BASE_URL}${url}`
}

export async function fetchProfileDetail(): Promise<UserProfileDetail> {
  const data = await apiGet<UserProfileDetail>(PROFILE_BASE)
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
}

export async function updateProfileDetail(
  payload: UpdateProfileDetailPayload
): Promise<UserProfileDetail> {
  const data = await apiPut<UserProfileDetail, UpdateProfileDetailPayload>(PROFILE_BASE, payload)
  data.profilePictureUrl = resolveAvatarUrl(data.profilePictureUrl)
  return data
}

export async function fetchProfileCompletion(): Promise<ProfileCompletion> {
  return apiGet<ProfileCompletion>(`${PROFILE_BASE}/completion`)
}
