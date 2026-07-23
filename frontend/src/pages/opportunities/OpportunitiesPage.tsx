import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState, ApiErrorState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { FileSearch, Target, ArrowRight } from 'lucide-react'

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

  const EXAMPLE_ROLES = [
    'Backend Engineer',
    'Software Engineer',
    'Java Developer',
    'Full Stack Developer',
    'Frontend Engineer',
    'DevOps Engineer',
  ]

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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '3rem 2rem',
            background: 'var(--surface-primary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)',
            textAlign: 'center',
            maxWidth: '520px',
            margin: '0 auto',
          }}>
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'color-mix(in srgb, var(--color-brand) 10%, transparent)',
              color: 'var(--color-brand)',
            }}>
              <Target size={28} />
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
                Choose your target roles
              </h2>
              <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Tell SkillMatch what you're aiming for to receive personalized job recommendations.
              </p>
            </div>

            {/* Example role chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {EXAMPLE_ROLES.map((role) => (
                <span
                  key={role}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.3125rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    background: 'var(--color-brand-50)',
                    color: 'var(--color-brand-700)',
                    border: '1px solid var(--color-brand-200)',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>

            <button
              type="button"
              id="opportunities-go-to-profile-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'white',
                background: 'var(--color-brand)',
                border: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
              }}
              onClick={() => {
                navigate(ROUTES.PROFILE)
                setTimeout(() => {
                  const el = document.getElementById('target-roles')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 300)
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.85')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
            >
              Go to Profile <ArrowRight size={16} />
            </button>
          </div>
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
