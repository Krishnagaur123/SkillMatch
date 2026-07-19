import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState, ApiErrorState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { FileSearch, Target } from 'lucide-react'

import { useUserProfile } from '@/hooks/useUserProfile'
import { useRecommendedOpportunities } from '@/hooks/useOpportunities'
import { useDebounce } from '@/hooks/useDebounce'
import { OpportunityFilters } from '@/features/opportunities/OpportunityFilters'
import { OpportunityCard } from '@/features/opportunities/OpportunityCard'
import { OpportunitySkeleton } from '@/features/opportunities/OpportunitySkeleton'
import styles from './OpportunitiesPage.module.css'

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
            <div className="flex flex-col gap-2">
              <OpportunityFilters
                location={locationStr}
                targetRoleId={targetRoleId}
                sort={sort}
                onLocationChange={setLocationStr}
                onTargetRoleChange={setTargetRoleId}
                onSortChange={setSort}
              />

              {!isFetchingData && !isOppError && (
                <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">
                    {totalElements} opportunit{totalElements === 1 ? 'y' : 'ies'} found
                  </span>
                  <span className="text-[var(--border-default)]">|</span>
                  <span>
                    Sorted by {sort === 'matchPercentage,desc' ? 'Best Match' : 'Most Recent'}
                  </span>
                </div>
              )}
            </div>

            {isFetchingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <OpportunitySkeleton key={i} />
                ))}
              </div>
            ) : isOppError ? (
              <ApiErrorState 
                error={new Error('Unable to load opportunities')} 
                onRetry={handleRetry} 
              />
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
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
