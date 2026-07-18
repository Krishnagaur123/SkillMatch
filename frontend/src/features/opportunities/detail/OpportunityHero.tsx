import { MapPin, Briefcase, Clock, ExternalLink } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { MatchScoreBadge } from '../MatchScoreBadge'
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Link to={`/companies/${company.id}`} state={{ from: routerLocation.pathname }} className="shrink-0 group">
            <CompanyLogo
              src={company.logoUrl}
              name={company.name}
              className="w-16 h-16 md:w-20 md:h-20 rounded-xl group-hover:ring-2 ring-primary/20 transition-all shadow-sm"
              iconClassName="w-8 h-8"
            />
          </Link>
          <div className="flex flex-col gap-1.5 pt-1">
            <h1 className={`text-2xl md:text-3xl font-bold leading-tight ${styles.title}`}>
              {title}
            </h1>
            <Link 
              to={`/companies/${company.id}`}
              state={{ from: routerLocation.pathname }}
              className={`text-lg font-medium transition-colors ${styles.companyName}`}
            >
              {company.name}
            </Link>
          </div>
        </div>

        {/* Mobile action button & score */}
        <div className={`flex items-center justify-between md:hidden w-full pt-4 ${styles.mobileAction}`}>
          {matchPercentage !== undefined && (
            <MatchScoreBadge score={matchPercentage} />
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

      <div className={`flex items-center gap-4 text-sm md:text-base flex-wrap pb-6 ${styles.metaInfoContainer}`}>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${styles.metaBadge}`}>
          <MapPin className={`w-4 h-4 ${styles.metaIcon}`} />
          <span>{location || 'Remote / Unknown'}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${styles.metaBadge}`}>
          <Briefcase className={`w-4 h-4 ${styles.metaIcon}`} />
          <span className="capitalize">{employmentType?.toLowerCase().replace('_', ' ') || 'Full time'}</span>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${styles.metaBadge}`}>
          <Clock className={`w-4 h-4 ${styles.metaIcon}`} />
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
    </div>
  )
}
