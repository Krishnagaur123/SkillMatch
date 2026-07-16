import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Briefcase, Clock, ExternalLink, CheckCircle2, AlertTriangle, Info, Circle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { MatchScoreBadge } from './MatchScoreBadge'
import { SkillGroup } from './SkillGroup'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'

interface OpportunityCardProps {
  opportunity: OpportunityRecommendation
}

function deriveInsight(opp: OpportunityRecommendation): string {
  const { matchPercentage, missingRequiredSkills, missingPreferredSkills } = opp
  
  if (matchPercentage >= 90 && missingRequiredSkills.length === 0) {
    return 'Excellent match. All required skills covered.'
  }
  if (matchPercentage >= 75 && missingRequiredSkills.length === 0) {
    return 'Strong match. Review preferred skills before applying.'
  }
  if (missingRequiredSkills.length > 0) {
    const missingCount = missingRequiredSkills.length
    const firstMissing = missingRequiredSkills[0]
    if (missingCount === 1) {
      return `Good fit, but missing required skill: ${firstMissing}.`
    }
    return `Missing ${missingCount} required skills, including ${firstMissing}.`
  }
  if (missingPreferredSkills.length > 0) {
    return `Covers all requirements. Missing ${missingPreferredSkills.length} preferred skills.`
  }
  return 'Review the full skill profile to ensure a good fit.'
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const routerLocation = useLocation()
  const navigate = useNavigate()
  const {
    opportunityId,
    title,
    company,
    location,
    employmentType,
    experienceLevel,
    matchPercentage,
    matchedSkills,
    missingRequiredSkills,
    missingPreferredSkills,
    missingGoodToHaveSkills,
    applyUrl
  } = opportunity

  const insight = deriveInsight(opportunity)

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
        <div className="flex items-start gap-4 flex-1">
          <Link to={`/companies/${company.id}`} state={{ from: routerLocation.pathname }} className="shrink-0 group">
            <CompanyLogo
              src={company.logoUrl}
              name={company.name}
              className="w-12 h-12 rounded-md group-hover:ring-2 ring-primary/20 transition-all"
              iconClassName="w-6 h-6"
            />
          </Link>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg text-slate-900 dark:text-white line-clamp-1">
              {title}
            </h3>
            <Link 
              to={`/companies/${company.id}`} 
              state={{ from: routerLocation.pathname }}
              className="text-sm font-medium text-slate-600 hover:text-primary transition-colors dark:text-slate-400"
            >
              {company.name}
            </Link>
          </div>
        </div>
        
        <div className="shrink-0 hidden sm:block">
          <MatchScoreBadge score={matchPercentage} />
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-5">
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{location || 'Remote / Unknown'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{employmentType?.toLowerCase().replace('_', ' ') || 'Full time'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{experienceLevel?.toLowerCase() || 'Mid level'}</span>
          </div>
        </div>

        {/* Mobile match score */}
        <div className="sm:hidden flex items-center gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
           <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Match Score</span>
           <MatchScoreBadge score={matchPercentage} className="scale-75 origin-left" />
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">
            💡 {insight}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SkillGroup 
            title={
              <><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Skills You Have</>
            } 
            skills={matchedSkills} 
          />
          <SkillGroup 
            title={
              <><AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Required</>
            } 
            skills={missingRequiredSkills} 
            isMissing 
          />
          <SkillGroup 
            title={
              <><Info className="w-4 h-4 text-blue-500" /> Missing Preferred</>
            } 
            skills={missingPreferredSkills} 
            isMissing 
          />
          <SkillGroup 
            title={
              <><Circle className="w-4 h-4 text-slate-400" /> Good To Have</>
            } 
            skills={missingGoodToHaveSkills} 
            isMissing 
          />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => navigate(`/opportunities/${opportunityId}`)}
        >
          View Details
        </Button>
        {applyUrl && (
          <Button 
            className="flex-1 gap-2"
            onClick={() => window.open(applyUrl, '_blank', 'noopener,noreferrer')}
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
