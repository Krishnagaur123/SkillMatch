export const API_TIMEOUT_MS = 15_000

export const QUERY_STALE_TIME_MS = 60_000

export const QUERY_GC_TIME_MS = 300_000

export const PAGE_SIZE_DEFAULT = 20

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || ''

export const OAUTH2_GOOGLE_URL = `${API_BASE_URL}/oauth2/authorization/google`

export const AUTH_CALLBACK_PATH = '/auth/callback'
