export const queryKeys = {
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  resumes: {
    all: () => ['resumes'] as const,
    detail: (id: string) => ['resumes', id] as const,
  },
  opportunities: {
    all: (params?: Record<string, unknown>) => ['opportunities', params] as const,
    detail: (id: string) => ['opportunities', id] as const,
    recommended: (params?: Record<string, unknown>) => ['opportunities', 'recommended', params] as const,
  },
  applications: {
    all: (params?: Record<string, unknown>) => ['applications', params] as const,
    detail: (id: string) => ['applications', id] as const,
  },
  analytics: {
    career: () => ['analytics', 'career'] as const,
  },
  companies: {
    detail: (id: string) => ['companies', id] as const,
  },
  users: {
    skills: () => ['users', 'skills'] as const,
  },
} as const
