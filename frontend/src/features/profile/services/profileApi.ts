import { apiGet, apiPut } from '@/services/api'

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

export async function fetchProfileDetail(): Promise<UserProfileDetail> {
  return apiGet<UserProfileDetail>(PROFILE_BASE)
}

export async function updateProfileDetail(
  payload: UpdateProfileDetailPayload
): Promise<UserProfileDetail> {
  return apiPut<UserProfileDetail, UpdateProfileDetailPayload>(PROFILE_BASE, payload)
}

export async function fetchProfileCompletion(): Promise<ProfileCompletion> {
  return apiGet<ProfileCompletion>(`${PROFILE_BASE}/completion`)
}
