import { useAllTargetRoles } from '@/hooks/useTargetRoles'
import { Input } from '@/components/common/Input'
import styles from './OpportunityFilters.module.css'

interface OpportunityFiltersProps {
  location: string
  targetRoleId: string
  sort: string
  onLocationChange: (val: string) => void
  onTargetRoleChange: (val: string) => void
  onSortChange: (val: string) => void
}

export function OpportunityFilters({
  location,
  targetRoleId,
  sort,
  onLocationChange,
  onTargetRoleChange,
  onSortChange
}: OpportunityFiltersProps) {
  const { data: roles } = useAllTargetRoles()

  return (
    <div className={`flex flex-col gap-4 ${styles.container}`}>


      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex flex-col w-full sm:w-1/3">
          <label htmlFor="targetRole" className="sr-only">Target Role</label>
          <select 
            id="targetRole"
            value={targetRoleId} 
            onChange={(e) => onTargetRoleChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Roles</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col w-full sm:w-1/3">
          <label htmlFor="location" className="sr-only">Location</label>
          <Input 
            id="location"
            type="text" 
            placeholder="Location (e.g. Remote, New York)" 
            value={location} 
            onChange={(e) => onLocationChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full sm:w-1/3">
          <label htmlFor="sort" className="sr-only">Sort By</label>
          <select 
            id="sort"
            value={sort} 
            onChange={(e) => onSortChange(e.target.value)}
            className={styles.select}
          >
            <option value="matchPercentage,desc">Sort by: Best Match</option>
            <option value="postedAt,desc">Sort by: Most Recent</option>
          </select>
        </div>
      </div>
    </div>
  )
}
