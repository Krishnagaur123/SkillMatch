import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './CompaniesToolbar.module.css'

export type SortOption = 'alphabetical' | 'match' | 'roles' | 'recent'
export type HiringStatusFilter = 'all' | 'active' | 'paused'

export interface CompaniesFilters {
  query: string
  industry: string
  location: string
  status: HiringStatusFilter
  sort: SortOption
}

interface CompaniesToolbarProps {
  filters: CompaniesFilters
  onFiltersChange: (filters: CompaniesFilters) => void
  availableIndustries: string[]
  availableLocations: string[]
}

export function CompaniesToolbar({
  filters,
  onFiltersChange,
  availableIndustries,
  availableLocations,
}: CompaniesToolbarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query)
  const debouncedQuery = useDebounce(localQuery, 300)

  // Update parent when debounced query changes
  useEffect(() => {
    if (debouncedQuery !== filters.query) {
      onFiltersChange({ ...filters, query: debouncedQuery })
    }
  }, [debouncedQuery, filters, onFiltersChange])

  // Sync local query if parent changes it (e.g. clear filters)
  useEffect(() => {
    // eslint-disable-next-line
    setLocalQuery(filters.query)
  }, [filters.query])

  return (
    <div className={styles.root}>
      <div className={styles.searchWrapper}>
        <Search className={styles.searchIcon} size={16} />
        <input
          type="text"
          placeholder="Search companies by name, industry..."
          className={styles.searchInput}
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          aria-label="Search companies"
        />
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={filters.industry}
          onChange={(e) => onFiltersChange({ ...filters, industry: e.target.value })}
          aria-label="Filter by industry"
        >
          <option value="">All Industries</option>
          {availableIndustries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.location}
          onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
          aria-label="Filter by location"
        >
          <option value="">All Locations</option>
          {availableLocations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as HiringStatusFilter })}
          aria-label="Filter by hiring status"
        >
          <option value="all">All Statuses</option>
          <option value="active">Actively Hiring</option>
          <option value="paused">Not Hiring</option>
        </select>

        <select
          className={styles.select}
          value={filters.sort}
          onChange={(e) => onFiltersChange({ ...filters, sort: e.target.value as SortOption })}
          aria-label="Sort companies"
        >
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="match">Highest Match</option>
          <option value="roles">Most Open Roles</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>
    </div>
  )
}
