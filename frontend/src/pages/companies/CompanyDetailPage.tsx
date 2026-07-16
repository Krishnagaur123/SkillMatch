import { useMemo, useRef } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { ApiErrorState } from '@/components/feedback'
import { SectionCard } from '@/components/layout'
import { useCompanyDetail } from '@/hooks/useCompanyDetail'
import { useRecommendedOpportunities } from '@/hooks/useOpportunities'
import {
  CompanyHero,
  CompanyMetrics,
  CompanyOverview,
  CompanyTechnologies,
  CompanyOpportunities,
  CompanyQuickFacts,
  CompanyCTA,
  CompanySkeleton,
} from '@/features/companies/detail'
import styles from './CompanyDetailPage.module.css'

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const opportunitiesRef = useRef<HTMLDivElement>(null)
  
  // Determine back navigation target. Default to companies list if no state is provided.
  const state = location.state as { from?: string } | null
  const backTarget = state?.from ?? '/companies'
  const backLabel = backTarget.includes('opportunities') ? 'Back to Opportunities' : 'Back to Companies'

  const { data: company, isLoading, error, refetch } = useCompanyDetail(id ?? '')

  // Reuse the existing recommended opportunities cache — filter by companyId client-side.
  // This avoids a new API endpoint while surfacing relevant data on the page.
  const { data: recommendedData } = useRecommendedOpportunities({ size: 50 })

  const companyOpportunities = useMemo(() => {
    if (!recommendedData?.content || !id) return []
    return recommendedData.content.filter((opp) => opp.company.id === id)
  }, [recommendedData, id])

  const handleViewOpportunities = () => {
    opportunitiesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <CompanySkeleton />
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className={styles.errorWrap}>
        <ApiErrorState error={error ?? new Error('Company not found')} onRetry={refetch} />
      </div>
    )
  }

  const openCount = company.openOpportunities ?? 0

  return (
    <main className={styles.root}>
      {/* Back navigation */}
      <nav className={styles.nav} aria-label="Breadcrumb">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
          onClick={() => navigate(backTarget)}
          aria-label={backLabel}
        >
          {backLabel}
        </Button>
      </nav>

      {/* Hero — identity, badges, CTAs */}
      <CompanyHero company={company} onViewOpportunities={handleViewOpportunities} />

      {/* Metrics row */}
      <CompanyMetrics company={company} opportunities={companyOpportunities} />

      {/* Two-column layout */}
      <div className={styles.mainGrid}>
        {/* ── Left column: main content ── */}
        <div className={styles.leftColumn}>
          <SectionCard title="About the Company">
            <CompanyOverview description={company.description} />
          </SectionCard>

          <SectionCard title="Technologies">
            <CompanyTechnologies opportunities={companyOpportunities} />
          </SectionCard>

          {/* Anchor target for "View Roles" CTA */}
          <div ref={opportunitiesRef}>
            <SectionCard
              title="Open Opportunities"
              description={
                openCount > 0
                  ? `${openCount} ${openCount === 1 ? 'role' : 'roles'} at ${company.name}`
                  : `No active listings at ${company.name}`
              }
            >
              <CompanyOpportunities
                opportunities={companyOpportunities}
                companyName={company.name}
              />
            </SectionCard>
          </div>
        </div>

        {/* ── Sidebar: facts + CTA ── */}
        <aside className={styles.sidebar} aria-label="Company sidebar">
          <SectionCard title="Quick Facts">
            <CompanyQuickFacts company={company} />
          </SectionCard>

          <SectionCard title="Get Started">
            <CompanyCTA company={company} onViewOpportunities={handleViewOpportunities} />
          </SectionCard>
        </aside>
      </div>
    </main>
  )
}
