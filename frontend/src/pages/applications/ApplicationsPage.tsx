import { useState, useMemo } from 'react'
import { PageContainer, PageContent } from '@/components/layout'
import { ApiErrorState } from '@/components/feedback'
import { useApplications } from '@/hooks/useApplications'
import { ApplicationsHero } from '@/features/applications/components/ApplicationsHero'
import { ApplicationsOverview } from '@/features/applications/components/ApplicationsOverview'
import { ApplicationsFilters } from '@/features/applications/components/ApplicationsFilters'
import { ApplicationsList } from '@/features/applications/components/ApplicationsList'
import { EmptyState } from '@/features/applications/components/EmptyState'
import type { ApplicationStatus } from '@/types/application'
import styles from './ApplicationsPage.module.css'

export default function ApplicationsPage() {
  const { data: applications, isLoading, error } = useApplications()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ApplicationStatus | ''>('')
  const [company, setCompany] = useState('')
  const [sort, setSort] = useState('recent')

  const filteredApplications = useMemo(() => {
    if (!applications) return []

    let result = [...applications]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (app) =>
          app.opportunity.company.name.toLowerCase().includes(q) ||
          app.opportunity.title.toLowerCase().includes(q)
      )
    }

    if (status) {
      result = result.filter((app) => app.status === status)
    }

    if (company) {
      result = result.filter((app) => app.opportunity.company.name === company)
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'recent') {
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
      }
      if (sort === 'oldest') {
        return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
      }
      if (sort === 'match-high') {
        return b.currentMatchPercentage - a.currentMatchPercentage
      }
      if (sort === 'match-low') {
        return a.currentMatchPercentage - b.currentMatchPercentage
      }
      return 0
    })

    return result
  }, [applications, search, status, company, sort])

  // Extract unique companies for filter
  const uniqueCompanies = useMemo(() => {
    if (!applications) return []
    const companies = new Set(applications.map((app) => app.opportunity.company.name))
    return Array.from(companies).sort()
  }, [applications])

  if (isLoading) {
    return (
      <PageContainer>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <PageContent>
          <ApiErrorState error={error} />
        </PageContent>
      </PageContainer>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <PageContainer>
        <PageContent>
          <div className={styles.emptyContainer}>
            <EmptyState />
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent>
        <div className={styles.container}>
          <ApplicationsHero applications={applications} />
          
          <ApplicationsOverview applications={applications} />

          <ApplicationsFilters
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            company={company}
            onCompanyChange={setCompany}
            sort={sort}
            onSortChange={setSort}
            companies={uniqueCompanies}
          />

          <ApplicationsList applications={filteredApplications} />
        </div>
      </PageContent>
    </PageContainer>
  )
}
