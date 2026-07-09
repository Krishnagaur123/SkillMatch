import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { RemovableSkillBadge } from '@/components/common'
import { Search, X, Target } from 'lucide-react'
import type { TargetRoleResponse } from '@/hooks/useTargetRoles'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ProfileSection.module.css'

interface TargetRolesSectionProps {
  isEditing: boolean
  roleIds: string[]
  onRoleIdsChange: (ids: string[]) => void
  allRoles: TargetRoleResponse[]
}

export function TargetRolesSection({
  isEditing,
  roleIds,
  onRoleIdsChange,
  allRoles,
}: TargetRolesSectionProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 200)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentRoles = allRoles.filter(role => roleIds.includes(role.id))

  const availableRoles = allRoles.filter(role => {
    const isNotSelected = !roleIds.includes(role.id)
    const matchesSearch = role.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    return isNotSelected && matchesSearch
  })

  const updateDropdownPosition = useCallback(() => {
    if (inputWrapperRef.current) {
      const rect = inputWrapperRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      })
    }
  }, [])

  const openDropdown = useCallback(() => {
    updateDropdownPosition()
    setIsOpen(true)
  }, [updateDropdownPosition])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      const inWrapper = inputWrapperRef.current?.contains(target) ?? false
      const inDropdown = dropdownRef.current?.contains(target) ?? false
      if (!inWrapper && !inDropdown) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const close = () => setIsOpen(false)
    window.addEventListener('scroll', close, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', close, { capture: true })
  }, [isOpen])

  const handleSelectRole = (roleId: string) => {
    if (roleIds.includes(roleId)) return
    onRoleIdsChange([...roleIds, roleId])
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRemoveRole = (roleId: string) => {
    onRoleIdsChange(roleIds.filter(id => id !== roleId))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        openDropdown()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev < availableRoles.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < availableRoles.length) {
        handleSelectRole(availableRoles[highlightedIndex].id)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const emptyState = isEditing ? (
    <p className={styles.emptyText}>
      Use the search above to find and add target roles.
    </p>
  ) : (
    <div className={styles.emptyState}>
      <Target size={20} className={styles.emptyStateIcon} />
      <div className={styles.emptyStateContent}>
        <span className={styles.emptyStateTitle}>No target roles configured</span>
        <span className={styles.emptyStateDesc}>
          Adding target roles helps SkillMatch surface relevant opportunities and improves your match scores.
        </span>
      </div>
    </div>
  )

  return (
    <SectionCard
      title="Target Roles"
      description="Roles you are targeting, used to optimize opportunity matching and alerts."
    >
      <div className={`${styles.container}${isEditing ? ` ${styles.containerEditing}` : ''}`}>
        {isEditing && (
          <div className={styles.searchWrapper} ref={inputWrapperRef}>
            <div className={styles.inputWrapper}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search roles to add…"
                value={inputValue}
                autoComplete="off"
                onChange={e => {
                  setInputValue(e.target.value)
                  setHighlightedIndex(-1)
                  openDropdown()
                }}
                onKeyDown={handleKeyDown}
                onFocus={openDropdown}
                onClick={openDropdown}
                role="combobox"
                aria-label="Search target roles"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-autocomplete="list"
              />
              {inputValue && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setInputValue('')
                    setHighlightedIndex(-1)
                    inputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {isOpen &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className={styles.dropdown}
                  style={dropdownStyle}
                  role="listbox"
                  aria-label="Target role suggestions"
                >
                  {availableRoles.length > 0 ? (
                    <ul className={styles.dropdownList}>
                      {availableRoles.map((role, index) => (
                        <li
                          key={role.id}
                          role="option"
                          aria-selected={index === highlightedIndex}
                          className={`${styles.dropdownItem}${index === highlightedIndex ? ` ${styles.dropdownItemActive}` : ''}`}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleSelectRole(role.id)}
                        >
                          {role.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.dropdownEmpty}>
                      {inputValue ? 'No matching roles found.' : 'All available roles are already selected.'}
                    </div>
                  )}
                </div>,
                document.body
              )}
          </div>
        )}

        <div className={styles.badgeList}>
          {currentRoles.length === 0
            ? emptyState
            : currentRoles.map(role =>
                isEditing ? (
                  <RemovableSkillBadge
                    key={role.id}
                    name={role.name}
                    onRemove={() => handleRemoveRole(role.id)}
                  />
                ) : (
                  <span key={role.id} className={styles.viewBadge}>
                    {role.name}
                  </span>
                )
              )}
        </div>
      </div>
    </SectionCard>
  )
}
