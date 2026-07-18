import { useAllTargetRoles } from '@/hooks/useTargetRoles'
import { Card } from '@/components/common/Card'
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
    <Card className={`flex flex-col sm:flex-row items-center gap-4 ${styles.container}`}>
      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="targetRole" className={styles.label}>Target Role</label>
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
        <label htmlFor="location" className={styles.label}>Location</label>
        <Input 
          id="location"
          type="text" 
          placeholder="e.g. Remote, New York" 
          value={location} 
          onChange={(e) => onLocationChange(e.target.value)}
        />
      </div>

      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="sort" className={styles.label}>Sort By</label>
        <select 
          id="sort"
          value={sort} 
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.select}
        >
          <option value="matchPercentage,desc">Best Match</option>
          <option value="postedAt,desc">Most Recent</option>
        </select>
      </div>
    </Card>
  )
}
