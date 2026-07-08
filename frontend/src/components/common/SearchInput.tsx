import { forwardRef, useState, useEffect } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './SearchInput.module.css'

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  onClear?: () => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, isLoading = false, onClear, placeholder = 'Search...', ...props }, ref) => {
    const handleClear = () => {
      onChange('')
      if (onClear) onClear()
    }

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <div className={styles.iconPrefix}>
          {isLoading ? (
            <Loader2 size={16} className={styles.spinner} />
          ) : (
            <Search size={16} className={styles.searchIcon} />
          )}
        </div>
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          aria-label={placeholder}
          {...props}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearBtn}
            aria-label="Clear search input"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export interface DebouncedSearchInputProps extends Omit<SearchInputProps, 'value'> {
  defaultValue?: string
  debounceDelay?: number
  onDebounce: (value: string) => void
}

export function DebouncedSearchInput({
  defaultValue = '',
  debounceDelay = 350,
  onDebounce,
  onChange,
  ...props
}: DebouncedSearchInputProps) {
  const [value, setValue] = useState(defaultValue)
  const [prevDefaultValue, setPrevDefaultValue] = useState(defaultValue)
  
  if (defaultValue !== prevDefaultValue) {
    setPrevDefaultValue(defaultValue)
    setValue(defaultValue)
  }

  const debouncedValue = useDebounce(value, debounceDelay)

  useEffect(() => {
    onDebounce(debouncedValue)
  }, [debouncedValue, onDebounce])

  const handleChange = (val: string) => {
    setValue(val)
    if (onChange) onChange(val)
  }

  return <SearchInput value={value} onChange={handleChange} {...props} />
}
