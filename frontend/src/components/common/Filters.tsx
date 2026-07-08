import { forwardRef } from 'react'
import type { HTMLAttributes, ButtonHTMLAttributes, SelectHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import styles from './Filters.module.css'

export type FilterBarProps = HTMLAttributes<HTMLDivElement>

export const FilterBar = forwardRef<HTMLDivElement, FilterBarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.bar, className].filter(Boolean).join(' ')} {...props}>
        {children}
      </div>
    )
  }
)
FilterBar.displayName = 'FilterBar'

export interface FilterGroupProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
}

export const FilterGroup = forwardRef<HTMLDivElement, FilterGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    return (
      <div ref={ref} className={[styles.group, className].filter(Boolean).join(' ')} {...props}>
        {label && <span className={styles.groupLabel}>{label}</span>}
        <div className={styles.groupContent}>{children}</div>
      </div>
    )
  }
)
FilterGroup.displayName = 'FilterGroup'

export interface ChipFilterProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
  onToggle: () => void
  count?: number
}

export const ChipFilter = forwardRef<HTMLButtonElement, ChipFilterProps>(
  ({ className, active, onToggle, count, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onToggle}
        className={[
          styles.chip,
          active ? styles.chipActive : '',
          className,
        ].filter(Boolean).join(' ')}
        aria-pressed={active}
        {...props}
      >
        <span>{children}</span>
        {count !== undefined && count > 0 && (
          <span className={styles.chipCount}>{count}</span>
        )}
      </button>
    )
  }
)
ChipFilter.displayName = 'ChipFilter'

export interface SortDropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>
  value: string
  onSortChange: (value: string) => void
}

export const SortDropdown = forwardRef<HTMLSelectElement, SortDropdownProps>(
  ({ className, options, value, onSortChange, ...props }, ref) => {
    return (
      <div className={styles.selectWrapper}>
        <select
          ref={ref}
          value={value}
          onChange={(e) => onSortChange(e.target.value)}
          className={[styles.select, className].filter(Boolean).join(' ')}
          aria-label="Sort options"
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)
SortDropdown.displayName = 'SortDropdown'

export interface ResetFiltersProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onReset: () => void
  hasFilters: boolean
}

export const ResetFilters = forwardRef<HTMLButtonElement, ResetFiltersProps>(
  ({ className, onReset, hasFilters, ...props }, ref) => {
    if (!hasFilters) return null

    return (
      <button
        ref={ref}
        type="button"
        onClick={onReset}
        className={[styles.reset, className].filter(Boolean).join(' ')}
        aria-label="Reset all filters"
        {...props}
      >
        <X size={14} />
        <span>Reset Filters</span>
      </button>
    )
  }
)
ResetFilters.displayName = 'ResetFilters'
