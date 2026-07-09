import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import { FileSearch, Target, RefreshCw, AlertTriangle } from 'lucide-react'

import { useUserProfile } from '@/hooks/useUserProfile'
import { useRecommendedOpportunities } from '@/hooks/useOpportunities'
import { useDebounce } from '@/hooks/useDebounce'
import { OpportunityFilters } from '@/features/opportunities/OpportunityFilters'
import { OpportunityCard } from '@/features/opportunities/OpportunityCard'
import { OpportunitySkeleton } from '@/features/opportunities/OpportunitySkeleton'

export default function OpportunitiesPage() {
  const navigate = useNavigate()
  
  // Local state for filters
  const [targetRoleId, setTargetRoleId] = useState<string>('')
  const [locationStr, setLocationStr] = useState<string>('')
  const [sort, setSort] = useState<string>('matchPercentage,desc')
  
  const debouncedLocation = useDebounce(locationStr, 300)

  // Use user profile to check if they have target roles at all
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile()

  const { 
    data: oppData, 
    isLoading: isOppLoading, 
    isError: isOppError,
    refetch 
  } = useRecommendedOpportunities({
    targetRoleId: targetRoleId || undefined,
    location: debouncedLocation || undefined,
    sort,
    page: 0, // Only page 0 for Phase 1 as requested in simple pagination
    size: 50 // Pull enough for discovery phase
  })

  const hasNoTargetRoles = !isProfileLoading && (!userProfile?.targetRoles || userProfile.targetRoles.length === 0)

  // Handlers
  const handleRetry = () => {
    void refetch()
  }

  // Derive counts
  const totalElements = oppData?.totalElements || 0
  const isFetchingData = isOppLoading || isProfileLoading

  return (
    <PageContainer>
      <PageContent className="flex flex-col gap-6">
        <PageHeader 
          title="Opportunities" 
          description="Explore intelligent job matches based on your skills and target roles." 
        />
        
        {hasNoTargetRoles ? (
          <EmptyState
            icon={<Target size={36} />}
            title="Configure Target Roles"
            description="We need to know what you're aiming for. Add target roles to your profile to get intelligent job recommendations."
            actionLabel="Update Profile"
            onAction={() => navigate(ROUTES.PROFILE)}
          />
        ) : (
          <>
            <OpportunityFilters
              location={locationStr}
              targetRoleId={targetRoleId}
              sort={sort}
              onLocationChange={setLocationStr}
              onTargetRoleChange={setTargetRoleId}
              onSortChange={setSort}
            />

            {!isFetchingData && !isOppError && (
              <div className="text-sm text-slate-500 font-medium px-1">
                Showing {totalElements} matching opportunit{totalElements === 1 ? 'y' : 'ies'}
              </div>
            )}

            {isFetchingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <OpportunitySkeleton key={i} />
                ))}
              </div>
            ) : isOppError ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm text-center px-4">
                <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Unable to load opportunities</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
                  There was a problem communicating with our servers. Please try again.
                </p>
                <Button onClick={handleRetry} className="gap-2">
                  <RefreshCw className="w-4 h-4" /> Retry
                </Button>
              </div>
            ) : oppData?.content.length === 0 ? (
              <EmptyState
                icon={<FileSearch size={36} />}
                title="No Matches Found"
                description="We couldn't find any opportunities matching your current filters. Try adjusting your target role or location."
                actionLabel="Clear Filters"
                onAction={() => {
                  setTargetRoleId('')
                  setLocationStr('')
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {oppData?.content.map((opp) => (
                  <OpportunityCard key={opp.opportunityId} opportunity={opp} />
                ))}
              </div>
            )}
          </>
        )}
      </PageContent>
    </PageContainer>
  )
}
