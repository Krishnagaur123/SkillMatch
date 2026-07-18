import { ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { MatchScoreBadge } from '../MatchScoreBadge'
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
    <Card className={styles.stickyCard}>
      <CardContent className="p-6 flex flex-col gap-6">
        {match && (
          <div className={`flex flex-col gap-3 pb-6 ${styles.matchSection}`}>
            <h3 className={styles.title}>Match Score</h3>
            <MatchScoreBadge score={match.matchPercentage} />
          </div>
        )}

        <div className="flex flex-col gap-3">
          {opportunity.applyUrl && (
            <Button 
              size="lg"
              className="w-full gap-2 text-base shadow-sm"
              onClick={() => handleApplyClick(opportunity.id, opportunity.applyUrl)}
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>

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
