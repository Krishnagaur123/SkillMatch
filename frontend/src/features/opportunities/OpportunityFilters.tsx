import { useAllTargetRoles } from '@/hooks/useTargetRoles'

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
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="targetRole" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Role</label>
        <select 
          id="targetRole"
          value={targetRoleId} 
          onChange={(e) => onTargetRoleChange(e.target.value)}
          className="w-full h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="">All Roles</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="location" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</label>
        <input 
          id="location"
          type="text" 
          placeholder="e.g. Remote, New York" 
          value={location} 
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
      </div>

      <div className="flex flex-col w-full sm:w-1/3">
        <label htmlFor="sort" className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sort By</label>
        <select 
          id="sort"
          value={sort} 
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full h-10 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="matchPercentage,desc">Best Match</option>
          <option value="postedAt,desc">Most Recent</option>
        </select>
      </div>
    </div>
  )
}
