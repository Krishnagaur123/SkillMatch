import { Building2, MapPin, Briefcase, Clock, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MatchScoreBadge } from '../MatchScoreBadge'
import { Button } from '@/components/common/Button'
import type { OpportunityDetailResponse } from '@/hooks/useOpportunityDetail'

interface OpportunityHeroProps {
  opportunity: OpportunityDetailResponse
  matchPercentage?: number
}

export function OpportunityHero({ opportunity, matchPercentage }: OpportunityHeroProps) {
  const { title, company, location, employmentType, experienceLevel, applyUrl } = opportunity

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <Link to={`/companies/${company.id}`} className="shrink-0 group">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={`${company.name} logo`} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover border border-slate-100 group-hover:ring-2 ring-primary/20 transition-all shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:ring-2 ring-primary/20 transition-all shadow-sm">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
            )}
          </Link>
          <div className="flex flex-col gap-1.5 pt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {title}
            </h1>
            <Link 
              to={`/companies/${company.id}`} 
              className="text-lg font-medium text-primary hover:text-primary/80 transition-colors"
            >
              {company.name}
            </Link>
          </div>
        </div>

        {/* Mobile action button & score */}
        <div className="flex items-center justify-between md:hidden w-full pt-4 border-t border-slate-100 dark:border-slate-800">
          {matchPercentage !== undefined && (
            <MatchScoreBadge score={matchPercentage} />
          )}
          {applyUrl && (
            <Button 
              className="gap-2"
              onClick={() => window.open(applyUrl, '_blank', 'noopener,noreferrer')}
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm md:text-base text-slate-600 dark:text-slate-400 flex-wrap pb-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span>{location || 'Remote / Unknown'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
          <Briefcase className="w-4 h-4 text-slate-400" />
          <span className="capitalize">{employmentType?.toLowerCase().replace('_', ' ') || 'Full time'}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-100 dark:border-slate-700">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="capitalize">{experienceLevel?.toLowerCase() || 'Mid level'}</span>
        </div>
      </div>
    </div>
  )
}
