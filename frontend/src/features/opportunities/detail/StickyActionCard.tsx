import { useNavigate } from 'react-router-dom'
import { ExternalLink, BookmarkPlus, ArrowRight, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { MatchScoreBadge } from '../MatchScoreBadge'
import { useApplications, useCreateApplication } from '@/hooks/useApplications'
import type { OpportunityDetailResponse } from '@/hooks/useOpportunityDetail'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'

interface StickyActionCardProps {
  opportunity: OpportunityDetailResponse
  match?: OpportunityRecommendation
}

export function StickyActionCard({ opportunity, match }: StickyActionCardProps) {
  const navigate = useNavigate()
  
  // Application tracking state
  const { data: applications = [] } = useApplications()
  const { mutate: createApplication, isPending: isCreating } = useCreateApplication()

  const existingApplication = applications.find(app => app.opportunity.id === opportunity.id)

  const handleTrackApplication = () => {
    createApplication({
      opportunityId: opportunity.id,
      status: 'APPLIED',
    })
  }

  return (
    <Card className="sticky top-6 border-slate-200 shadow-sm dark:border-slate-800">
      <CardContent className="p-6 flex flex-col gap-6">
        {match && (
          <div className="flex flex-col gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">Match Score</h3>
            <MatchScoreBadge score={match.matchPercentage} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {opportunity.applyUrl && (
            <Button 
              size="lg"
              className="w-full gap-2 text-base shadow-sm"
              onClick={() => window.open(opportunity.applyUrl, '_blank', 'noopener,noreferrer')}
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          )}

          {existingApplication ? (
            <Button 
              size="lg"
              variant="secondary"
              className="w-full gap-2 text-base border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
              onClick={() => navigate('/applications')}
            >
              View Application <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              size="lg"
              variant="secondary"
              className="w-full gap-2 text-base"
              onClick={handleTrackApplication}
              disabled={isCreating}
            >
              {isCreating ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Tracking...</>
              ) : (
                <><BookmarkPlus className="w-4 h-4" /> Track Application</>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
