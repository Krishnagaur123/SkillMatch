export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  RESUMES: '/resumes',
  OPPORTUNITIES: '/opportunities',
  APPLICATIONS: '/applications',
  ANALYTICS: '/analytics',
  COMPANIES: '/companies',
  PROFILE: '/profile',
  AUTH_CALLBACK: '/auth/callback',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
