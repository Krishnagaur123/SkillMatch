export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  RESUMES: '/resumes',
  RESUME_DETAIL: '/resumes/:resumeId',
  OPPORTUNITIES: '/opportunities',
  APPLICATIONS: '/applications',
  ANALYTICS: '/analytics',
  COMPANIES: '/companies',
  PROFILE: '/profile',
  AUTH_CALLBACK: '/auth/callback',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
