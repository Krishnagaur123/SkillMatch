import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MapPin, Briefcase, Clock, ExternalLink, CheckCircle2, AlertTriangle, Info, Circle } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { MatchScoreBadge } from './MatchScoreBadge'
import { SkillGroup } from './SkillGroup'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import { useApplicationTracking } from '@/hooks/useApplicationTracking'
import { ApplicationTrackingDialogs } from '@/features/applications/components/ApplicationTrackingDialogs'
import styles from './OpportunityCard.module.css'

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

  const {
    handleApplyClick,
    dialogState,
    handleConfirmContinue,
    handleConfirmCancel,
    handleTrackingYes,
    handleTrackingNo,
    handleViewExisting
  } = useApplicationTracking()

  const insight = deriveInsight(opportunity)

  return (
    <Card variant="interactive" className="flex flex-col h-full">
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
            <h3 className={`line-clamp-1 ${styles.title}`}>
              {title}
            </h3>
            <Link 
              to={`/companies/${company.id}`} 
              state={{ from: routerLocation.pathname }}
              className={styles.companyName}
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
        <div className={`flex items-center gap-4 text-sm flex-wrap ${styles.metaInfo}`}>
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
        <div className={`sm:hidden flex items-center gap-4 py-2 ${styles.mobileMatch}`}>
           <span className="text-sm font-semibold">Match Score</span>
           <MatchScoreBadge score={matchPercentage} className="scale-75 origin-left" />
        </div>

        <div className={styles.insightCard}>
          <p className={styles.insightText}>
            💡 {insight}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <SkillGroup 
            title={
              <><CheckCircle2 className={`w-4 h-4 ${styles.iconSuccess}`} /> Skills You Have</>
            } 
            skills={matchedSkills} 
          />
          <SkillGroup 
            title={
              <><AlertTriangle className={`w-4 h-4 ${styles.iconWarning}`} /> Missing Required</>
            } 
            skills={missingRequiredSkills} 
            isMissing 
          />
          <SkillGroup 
            title={
              <><Info className={`w-4 h-4 ${styles.iconInfo}`} /> Missing Preferred</>
            } 
            skills={missingPreferredSkills} 
            isMissing 
          />
          <SkillGroup 
            title={
              <><Circle className={`w-4 h-4 ${styles.iconNeutral}`} /> Good To Have</>
            } 
            skills={missingGoodToHaveSkills} 
            isMissing 
          />
        </div>
      </CardContent>

      <CardFooter className={`pt-4 flex items-center gap-3 ${styles.footer}`}>
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
            onClick={(e) => {
              e.preventDefault()
              handleApplyClick(opportunityId, applyUrl)
            }}
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
      
      <div onClick={(e) => e.preventDefault()}>
        <ApplicationTrackingDialogs
          dialogState={dialogState}
          onConfirmContinue={handleConfirmContinue}
          onConfirmCancel={handleConfirmCancel}
          onTrackingYes={handleTrackingYes}
          onTrackingNo={handleTrackingNo}
          onViewExisting={handleViewExisting}
        />
      </div>
    </Card>
  )
}
