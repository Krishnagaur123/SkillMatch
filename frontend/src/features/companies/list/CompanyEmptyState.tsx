import { Building2, SearchX, FilterX } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'

export type EmptyStateType = 'no-companies' | 'no-search-results' | 'no-filter-results'

interface CompanyEmptyStateProps {
  type: EmptyStateType
  onClearFilters?: () => void
}

export function CompanyEmptyState({ type, onClearFilters }: CompanyEmptyStateProps) {
  let Icon = Building2
  let title = 'No companies available'
  let description = 'There are currently no companies registered in the system. Check back later.'

  if (type === 'no-search-results') {
    Icon = SearchX
    title = 'No companies match your search'
    description = "We couldn't find any companies matching your current search query. Try adjusting your search terms."
  } else if (type === 'no-filter-results') {
    Icon = FilterX
    title = 'No companies match your active filters'
    description = "We couldn't find any companies matching your current filters. Try removing some filters."
  }

  const action = (type === 'no-search-results' || type === 'no-filter-results') && onClearFilters ? (
    <Button variant="secondary" onClick={onClearFilters}>
      Clear Filters
    </Button>
  ) : undefined

  return (
    <EmptyState
      icon={<Icon />}
      title={title}
      description={description}
      action={action}
    />
  )
}
