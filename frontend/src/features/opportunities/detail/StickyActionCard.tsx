import { ExternalLink } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { useApplicationTracking } from '@/hooks/useApplicationTracking'
import { ApplicationTrackingDialogs } from '@/features/applications/components/ApplicationTrackingDialogs'
import type { OpportunityDetailResponse } from '@/hooks/useOpportunityDetail'
import type { OpportunityRecommendation } from '@/hooks/useOpportunities'
import styles from './StickyActionCard.module.css'

interface StickyActionCardProps {
  opportunity: OpportunityDetailResponse
  match?: OpportunityRecommendation
}

export function StickyActionCard({ opportunity, match }: StickyActionCardProps) {
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
    <Card className="flex flex-col">
      <CardContent className="p-6 flex flex-col gap-6">
        {match && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold text-[var(--text-heading)] m-0">Match Score</h3>
            
            <div className="flex flex-col items-center py-4 bg-[var(--surface-hover)] rounded-xl border border-[var(--border-default)]">
              <span className="text-5xl font-bold text-[var(--color-brand)] mb-1">
                {match.matchPercentage}%
              </span>
              <span className="text-base font-medium text-[var(--text-secondary)]">
                {match.matchPercentage >= 90 ? 'Excellent Match' : match.matchPercentage >= 75 ? 'Strong Match' : match.matchPercentage >= 60 ? 'Moderate Match' : 'Weak Match'}
              </span>
              {/* Optional progress bar visual could go here, but large percentage satisfies the emphasis request directly */}
            </div>
          </div>
        )}
      </CardContent>

      {opportunity.applyUrl && (
        <CardFooter className="p-6 pt-0 mt-auto">
          <Button 
            size="lg"
            className="w-full gap-2 text-base shadow-sm"
            onClick={() => handleApplyClick(opportunity.id, opportunity.applyUrl!)}
          >
            Apply Now <ExternalLink className="w-4 h-4" />
          </Button>
        </CardFooter>
      )}

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
