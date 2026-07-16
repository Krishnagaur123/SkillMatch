import { SearchInput } from '@/components/common/SearchInput'
import type { ApplicationStatus } from '@/types/application'
import styles from './ApplicationsFilters.module.css'

interface ApplicationsFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: ApplicationStatus | ''
  onStatusChange: (value: ApplicationStatus | '') => void
  company: string
  onCompanyChange: (value: string) => void
  sort: string
  onSortChange: (value: string) => void
  companies: string[]
}

export function ApplicationsFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  company,
  onCompanyChange,
  sort,
  onSortChange,
  companies
}: ApplicationsFiltersProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchContainer}>
        <SearchInput
          placeholder="Search roles or companies..."
          value={search}
          onChange={(value) => onSearchChange(value)}
          className={styles.search}
        />
      </div>
      <div className={styles.filtersContainer}>
        <select 
          className={styles.select}
          value={status} 
          onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | '')}
        >
          <option value="">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="ONLINE_ASSESSMENT">Online Assessment</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="WITHDRAWN">Withdrawn</option>
        </select>

        <select 
          className={styles.select}
          value={company} 
          onChange={(e) => onCompanyChange(e.target.value)}
        >
          <option value="">All Companies</option>
          {companies.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select 
          className={styles.select}
          value={sort} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="match-high">Highest Match</option>
          <option value="match-low">Lowest Match</option>
        </select>
      </div>
    </div>
  )
}
