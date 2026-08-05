export const ROUTES = {
  LANDING: '/',
  DASHBOARD: '/dashboard',
  RESUMES: '/resumes',
  RESUME_DETAIL: '/resumes/:resumeId',
  OPPORTUNITIES: '/opportunities',
  OPPORTUNITY_DETAIL: '/opportunities/:id',
  APPLICATIONS: '/applications',
  APPLICATION_DETAIL: '/applications/:id',
  ANALYTICS: '/analytics',
  COMPANIES: '/companies',
  COMPANY_DETAIL: '/companies/:id',
  PROFILE: '/profile',

  ADMIN_OPPORTUNITIES: '/admin/opportunities',

  AUTH: '/auth',
  AUTH_CALLBACK: '/auth/callback',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
