import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, Circle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Card } from '@/components/common/Card'
import { ApiErrorState } from '@/components/feedback'
import { SkillGroup } from '@/features/opportunities/SkillGroup'
import { useOpportunityDetail, useOpportunityMatch } from '@/hooks/useOpportunityDetail'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import { 
  OpportunityDetailSkeleton, 
  OpportunityHero, 
  MatchSummary, 
  OpportunityDescription, 
  CompanyPreview, 
  StickyActionCard 
} from '@/features/opportunities/detail'
import styles from './OpportunityDetailPage.module.css'

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  
  const { data: opportunity, isLoading, error, refetch } = useOpportunityDetail(id || '')
  
  // Get match from routing state first (reliable), fallback to cache
  const routerMatch = location.state?.match as OpportunityRecommendation | undefined
  const cacheMatch = useOpportunityMatch(id || '')
  const match = routerMatch || cacheMatch

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-6 animate-in fade-in duration-500">
        <OpportunityDetailSkeleton />
      </div>
    )
  }

  if (error || !opportunity) {
    return (
      <div className="w-full max-w-6xl mx-auto py-12">
        <ApiErrorState error={error || new Error('Opportunity not found')} onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto py-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/opportunities')}
          className={`gap-2 ${styles.backButton}`}
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Button>
      </div>

      <OpportunityHero 
        opportunity={opportunity} 
        matchPercentage={match?.matchPercentage} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          <MatchSummary match={match} />

          <Card className="p-6 flex flex-col gap-5">
            <h2 className="text-xl font-semibold text-[var(--text-heading)] m-0">Skills Breakdown</h2>
            <div className="flex flex-col gap-4">
              {match ? (
                <>
                  <SkillGroup 
                    title={<><CheckCircle2 className={`w-4 h-4 ${styles.iconSuccess}`} /> Skills You Have</>} 
                    skills={match.matchedSkills} 
                  />
                  <SkillGroup 
                    title={<><AlertTriangle className={`w-4 h-4 ${styles.iconWarning}`} /> Missing Required</>} 
                    skills={match.missingRequiredSkills} 
                    isMissing 
                  />
                  <SkillGroup 
                    title={<><Info className={`w-4 h-4 ${styles.iconBrand}`} /> Missing Preferred</>} 
                    skills={match.missingPreferredSkills} 
                    isMissing 
                  />
                  <SkillGroup 
                    title={<><Circle className={`w-4 h-4 ${styles.iconNeutral}`} /> Good To Have</>} 
                    skills={match.missingGoodToHaveSkills} 
                    isMissing 
                  />
                </>
              ) : (
                <>
                  <SkillGroup 
                    title={<><AlertTriangle className={`w-4 h-4 ${styles.iconNeutral}`} /> Required Skills</>} 
                    skills={opportunity.requiredSkills} 
                  />
                  <SkillGroup 
                    title={<><Info className={`w-4 h-4 ${styles.iconNeutral}`} /> Preferred Skills</>} 
                    skills={opportunity.preferredSkills} 
                  />
                  <SkillGroup 
                    title={<><Circle className={`w-4 h-4 ${styles.iconNeutral}`} /> Good To Have</>} 
                    skills={opportunity.goodToHaveSkills} 
                  />
                </>
              )}
            </div>
          </Card>

          <OpportunityDescription description={opportunity.description} />

          <section className={`flex flex-col gap-4 pt-4 lg:hidden ${styles.mobileCompanyPreview}`}>
            <CompanyPreview company={opportunity.company} />
          </section>

        </div>

        <div className="hidden lg:block lg:col-span-1">
          <div className="flex flex-col gap-6 sticky top-6">
            <StickyActionCard opportunity={opportunity} match={match} />
            <CompanyPreview company={opportunity.company} />
          </div>
        </div>
      </div>
    </div>
  )
}
