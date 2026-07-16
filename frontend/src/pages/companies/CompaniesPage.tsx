import { useMemo, useState } from 'react'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { ApiErrorState } from '@/components/feedback'
import { useCompanies, type CompanySummaryResponse } from '@/hooks/useCompanies'
import { useRecommendedOpportunities, type OpportunityRecommendation } from '@/hooks/useOpportunities'
import {
  CompaniesGrid,
  CompanyCard,
  CompaniesToolbar,
  CompaniesSkeleton,
  CompanyEmptyState,
  type CompaniesFilters,
} from '@/features/companies/list'
import styles from './CompaniesPage.module.css'

export interface CompanyListItem {
  company: CompanySummaryResponse
  averageMatch: number | null
  highestMatch: number | null
  topSkills: string[]
  hiringStatus: 'Active' | 'Paused'
}

export default function CompaniesPage() {
  const { data: companiesData, isLoading: companiesLoading, error: companiesError, refetch } = useCompanies()
  const { data: recommendedData, isLoading: recommendedLoading } = useRecommendedOpportunities({ size: 100 })

  const [filters, setFilters] = useState<CompaniesFilters>({
    query: '',
    industry: '',
    location: '',
    status: 'all',
    sort: 'alphabetical',
  })

  // Derive presentation model
  const items = useMemo<CompanyListItem[]>(() => {
    if (!companiesData) return []

    // Group recommended opportunities by company ID
    const oppsByCompany = new Map<string, OpportunityRecommendation[]>()
    if (recommendedData?.content) {
      for (const opp of recommendedData.content) {
        if (!oppsByCompany.has(opp.company.id)) {
          oppsByCompany.set(opp.company.id, [])
        }
        oppsByCompany.get(opp.company.id)!.push(opp)
      }
    }

    return companiesData.map(company => {
      const companyOpps = oppsByCompany.get(company.id) || []
      
      let averageMatch: number | null = null
      let highestMatch: number | null = null
      const topSkills: string[] = []

      if (companyOpps.length > 0) {
        const scores = companyOpps.map(o => o.matchPercentage)
        averageMatch = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        highestMatch = Math.max(...scores)

        // Count skill frequencies to determine top skills
        const skillCounts = new Map<string, number>()
        for (const opp of companyOpps) {
          const allSkills = [...opp.matchedSkills, ...opp.missingRequiredSkills]
          for (const s of allSkills) {
            skillCounts.set(s, (skillCounts.get(s) || 0) + 1)
          }
        }
        // Sort by frequency, then alphabetically
        const sortedSkills = Array.from(skillCounts.entries()).sort((a, b) => {
          if (b[1] !== a[1]) return b[1] - a[1]
          return a[0].localeCompare(b[0])
        })
        topSkills.push(...sortedSkills.slice(0, 5).map(e => e[0]))
      }

      return {
        company,
        averageMatch,
        highestMatch,
        topSkills,
        hiringStatus: company.openRolesCount > 0 ? 'Active' : 'Paused',
      }
    })
  }, [companiesData, recommendedData])

  // Extract unique industries and locations for filters
  const { availableIndustries, availableLocations } = useMemo(() => {
    const inds = new Set<string>()
    const locs = new Set<string>()
    if (companiesData) {
      companiesData.forEach(c => {
        if (c.industry) inds.add(c.industry)
        if (c.headquarters) locs.add(c.headquarters)
      })
    }
    return {
      availableIndustries: Array.from(inds).sort(),
      availableLocations: Array.from(locs).sort(),
    }
  }, [companiesData])

  // Apply filters and sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

    // Filtering
    if (filters.query) {
      const q = filters.query.toLowerCase()
      result = result.filter(item => 
        item.company.name.toLowerCase().includes(q) ||
        item.company.industry?.toLowerCase().includes(q) ||
        item.company.headquarters?.toLowerCase().includes(q)
      )
    }
    if (filters.industry) {
      result = result.filter(item => item.company.industry === filters.industry)
    }
    if (filters.location) {
      result = result.filter(item => item.company.headquarters === filters.location)
    }
    if (filters.status !== 'all') {
      const isHiring = filters.status === 'active'
      result = result.filter(item => (item.company.openRolesCount > 0) === isHiring)
    }

    // Sorting
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'alphabetical':
          return a.company.name.localeCompare(b.company.name)
        case 'match':
          return (b.averageMatch ?? -1) - (a.averageMatch ?? -1)
        case 'roles':
          return b.company.openRolesCount - a.company.openRolesCount
        case 'recent':
          // Mock recent sort (could use foundedYear or created date)
          return (b.company.foundedYear ?? 0) - (a.company.foundedYear ?? 0)
        default:
          return 0
      }
    })

    return result
  }, [items, filters])

  const isLoading = companiesLoading || recommendedLoading

  const handleClearFilters = () => {
    setFilters({
      query: '',
      industry: '',
      location: '',
      status: 'all',
      sort: 'alphabetical'
    })
  }

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        <PageHeader 
          title="Companies" 
          description="Discover organizations hiring in your field and see how your skills match." 
        />

        {isLoading ? (
          <CompaniesSkeleton />
        ) : companiesError ? (
          <div className={styles.errorWrap}>
            <ApiErrorState error={companiesError} onRetry={refetch} />
          </div>
        ) : items.length === 0 ? (
          <CompanyEmptyState type="no-companies" />
        ) : (
          <>
            <CompaniesToolbar
              filters={filters}
              onFiltersChange={setFilters}
              availableIndustries={availableIndustries}
              availableLocations={availableLocations}
            />

            {filteredAndSortedItems.length === 0 ? (
              <CompanyEmptyState 
                type={filters.query ? 'no-search-results' : 'no-filter-results'} 
                onClearFilters={handleClearFilters}
              />
            ) : (
              <CompaniesGrid>
                {filteredAndSortedItems.map(item => (
                  <CompanyCard key={item.company.id} item={item} />
                ))}
              </CompaniesGrid>
            )}
          </>
        )}
      </PageContent>
    </PageContainer>
  )
}
