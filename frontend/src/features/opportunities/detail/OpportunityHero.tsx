import { MapPin, Briefcase, Clock, ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MatchBadge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import { useApplicationTracking } from '@/hooks/useApplicationTracking'
import { ApplicationTrackingDialogs } from '@/features/applications/components/ApplicationTrackingDialogs'
import styles from './OpportunityHero.module.css'
import type { OpportunityDetailResponse } from '@/hooks/useOpportunityDetail'

interface OpportunityHeroProps {
  opportunity: OpportunityDetailResponse
  matchPercentage?: number
}

import { Card } from '@/components/common/Card'

export function OpportunityHero({ opportunity, matchPercentage }: OpportunityHeroProps) {
  const routerLocation = useLocation()
  const { id, title, company, location, employmentType, experienceLevel, applyUrl } = opportunity

  const {
    handleApplyClick,
    dialogState,
    handleConfirmContinue,
    handleConfirmCancel,
    handleTrackingYes,
    handleTrackingNo,
    handleViewExisting
  } = useApplicationTracking()

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <Link to={`/companies/${company.id}`} state={{ from: routerLocation.pathname }} className="shrink-0 group">
            <CompanyLogo
              src={company.logoUrl}
              name={company.name}
              className="w-[72px] h-[72px] shadow-sm group-hover:ring-2 ring-accent/20 transition-all"
              iconClassName="w-8 h-8"
            />
          </Link>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight text-[var(--text-heading)] m-0">
              {title}
            </h1>
            <Link 
              to={`/companies/${company.id}`}
              state={{ from: routerLocation.pathname }}
              className={`text-lg text-[var(--text-secondary)] hover:text-[var(--color-brand)] transition-colors ${styles.companyName}`}
            >
              {company.name}
            </Link>
          </div>
        </div>

        {/* Mobile action button & score */}
        <div className={`flex items-center justify-between md:hidden w-full pt-4 ${styles.mobileAction}`}>
          {matchPercentage !== undefined && (
            <MatchBadge score={matchPercentage} />
          )}
          {applyUrl && (
            <Button 
              className="gap-2"
              onClick={() => handleApplyClick(id, applyUrl)}
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm md:text-base flex-wrap text-[var(--text-secondary)]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border-default)]">
          <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
          <span>{location || 'Remote'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border-default)]">
          <Briefcase className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="capitalize">{employmentType?.toLowerCase().replace('_', ' ') || 'Full time'}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[var(--surface-hover)] border border-[var(--border-default)]">
          <Clock className="w-4 h-4 text-[var(--text-muted)]" />
          <span className="capitalize">{experienceLevel?.toLowerCase() || 'Mid level'}</span>
        </div>
      </div>

      <ApplicationTrackingDialogs
        dialogState={dialogState}
        onConfirmContinue={handleConfirmContinue}
        onConfirmCancel={handleConfirmCancel}
        onTrackingYes={handleTrackingYes}
        onTrackingNo={handleTrackingNo}
        onViewExisting={handleViewExisting}
      />
    </Card>
  )
}
