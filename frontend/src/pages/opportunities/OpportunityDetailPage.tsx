import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, AlertTriangle, Info, Circle } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ApiErrorState } from '@/components/feedback'
import { SkillGroup } from '@/features/opportunities/SkillGroup'
import { useOpportunityDetail, useOpportunityMatch } from '@/hooks/useOpportunityDetail'
import { 
  OpportunityDetailSkeleton, 
  OpportunityHero, 
  MatchSummary, 
  OpportunityDescription, 
  CompanyPreview, 
  StickyActionCard 
} from '@/features/opportunities/detail'

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: opportunity, isLoading, error, refetch } = useOpportunityDetail(id || '')
  
  // Try to find the match recommendation from cache
  const match = useOpportunityMatch(id || '')

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
          className="gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Opportunities
        </Button>
      </div>

      <OpportunityHero 
        opportunity={opportunity} 
        matchPercentage={match?.matchPercentage} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
        <div className="lg:col-span-2 flex flex-col gap-10">
          
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Match Analysis</h2>
            <MatchSummary match={match} />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Skills Breakdown</h2>
            <div className="flex flex-col gap-4">
              {match ? (
                <>
                  <SkillGroup 
                    title={<><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Skills You Have</>} 
                    skills={match.matchedSkills} 
                  />
                  <SkillGroup 
                    title={<><AlertTriangle className="w-4 h-4 text-amber-500" /> Missing Required</>} 
                    skills={match.missingRequiredSkills} 
                    isMissing 
                  />
                  <SkillGroup 
                    title={<><Info className="w-4 h-4 text-blue-500" /> Missing Preferred</>} 
                    skills={match.missingPreferredSkills} 
                    isMissing 
                  />
                  <SkillGroup 
                    title={<><Circle className="w-4 h-4 text-slate-400" /> Good To Have</>} 
                    skills={match.missingGoodToHaveSkills} 
                    isMissing 
                  />
                </>
              ) : (
                <>
                  <SkillGroup 
                    title={<><AlertTriangle className="w-4 h-4 text-slate-500" /> Required Skills</>} 
                    skills={opportunity.requiredSkills} 
                  />
                  <SkillGroup 
                    title={<><Info className="w-4 h-4 text-slate-500" /> Preferred Skills</>} 
                    skills={opportunity.preferredSkills} 
                  />
                  <SkillGroup 
                    title={<><Circle className="w-4 h-4 text-slate-500" /> Good To Have</>} 
                    skills={opportunity.goodToHaveSkills} 
                  />
                </>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">About the Role</h2>
            <OpportunityDescription description={opportunity.description} />
          </section>

          <section className="flex flex-col gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 lg:hidden">
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
