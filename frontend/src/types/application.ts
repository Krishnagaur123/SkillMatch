export type ApplicationStatus = 'APPLIED' | 'ONLINE_ASSESSMENT' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN'

export interface CompanySummary {
  id: string
  name: string
  logoUrl?: string
}

export interface OpportunityCard {
  id: string
  title: string
  location: string
  company: CompanySummary
}

export interface Application {
  applicationId: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  notes?: string
  opportunity: OpportunityCard
  currentMatchPercentage: number
}

export interface CreateApplicationRequest {
  opportunityId: string
}

export interface UpdateApplicationRequest {
  status: ApplicationStatus
  notes?: string
}
