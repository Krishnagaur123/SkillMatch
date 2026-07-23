import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { RemovableSkillBadge, Button } from '@/components/common'
import { Search, X, Plus, Target } from 'lucide-react'
import { EmptyState } from '@/components/feedback'
import { useUserProfile, useUpdateUserProfile, useAllTargetRoles } from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ProfileSkillsCard.module.css'

const MAX_ROLES = 5

const SUGGESTED_ROLES = [
  'Backend Engineer',
  'Software Engineer',
  'Java Developer',
  'Backend Developer',
  'Full Stack Developer',
  'SDE',
  'Machine Learning Engineer',
  'Frontend Engineer',
  'DevOps Engineer',
  'Data Engineer',
]

export function ProfileTargetRolesCard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 200)

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile()
  const { data: allRoles = [], isLoading: isLoadingRoles } = useAllTargetRoles()
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateUserProfile()

  const currentRoleNames: string[] = useMemo(
    () => userProfile?.targetRoles ?? [],
    [userProfile?.targetRoles]
  )

  // Filtered suggestions based on search + not already selected
  const availableRoles = useMemo(() => {
    const search = debouncedSearch.toLowerCase()
    return allRoles.filter(
      (role) =>
        !currentRoleNames.includes(role.name) &&
        (search === '' || role.name.toLowerCase().includes(search))
    )
  }, [allRoles, currentRoleNames, debouncedSearch])

  const isAtMax = currentRoleNames.length >= MAX_ROLES

  // ── Dropdown positioning ─────────────────────────────────────────────────────

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node
      const inWrapper = inputWrapperRef.current?.contains(target) ?? false
      const inDropdown = dropdownRef.current?.contains(target) ?? false
      if (!inWrapper && !inDropdown) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  // Close on scroll
  useEffect(() => {
    if (!isOpen) return
    const close = () => setIsOpen(false)
    window.addEventListener('scroll', close, { capture: true, passive: true })
    return () => window.removeEventListener('scroll', close, { capture: true })
  }, [isOpen])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleAddRole = (roleName: string) => {
    if (currentRoleNames.includes(roleName)) return
    if (isAtMax) return
    const newRoleNames = [...currentRoleNames, roleName]
    const newRoleIds = allRoles
      .filter((r) => newRoleNames.includes(r.name))
      .map((r) => r.id)
    updateProfile({ targetRoleIds: newRoleIds })
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRemoveRole = (roleName: string) => {
    const newRoleNames = currentRoleNames.filter((n) => n !== roleName)
    const newRoleIds = allRoles
      .filter((r) => newRoleNames.includes(r.name))
      .map((r) => r.id)
    updateProfile({ targetRoleIds: newRoleIds })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        updateDropdownPosition()
        setIsOpen(true)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < availableRoles.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < availableRoles.length) {
        handleAddRole(availableRoles[highlightedIndex].name)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      return !prev
    })
    setInputValue('')
    setIsOpen(false)
  }

  const isLoading = isLoadingProfile || isLoadingRoles

  const headerActions = (
    <Button
      variant={isSearchOpen ? 'secondary' : 'primary'}
      size="sm"
      onClick={toggleSearch}
      disabled={isAtMax && !isSearchOpen}
      title={isAtMax ? 'Maximum 5 target roles reached' : undefined}
    >
      {isSearchOpen ? 'Cancel' : <><Plus size={16} /> Add Role</>}
    </Button>
  )

  return (
    <SectionCard
      id="target-roles"
      title="Target Roles"
      description="Manage the roles used to personalize your opportunities and analytics."
      actions={headerActions}
    >
      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonRow}>
              {[...Array(3)].map((_, i) => <div key={i} className={styles.skeletonChip} />)}
            </div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{currentRoleNames.length}</span>
                <span>of {MAX_ROLES} roles selected</span>
              </div>
            </div>

            {/* Inline search */}
            {isSearchOpen && (
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
                    onChange={(e) => {
                      const value = e.target.value
                      setInputValue(value)
                      setHighlightedIndex(-1)
                      updateDropdownPosition()
                      setIsOpen(true)
                    }}
                    onFocus={() => {
                      updateDropdownPosition()
                      setIsOpen(true)
                    }}
                    onKeyDown={handleKeyDown}
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
                      onMouseDown={(e) => e.preventDefault()}
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
                              className={`${styles.dropdownItem} ${index === highlightedIndex ? styles.dropdownItemActive : ''}`}
                              onMouseEnter={() => setHighlightedIndex(index)}
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => handleAddRole(role.name)}
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

            {/* Max roles hint */}
            {isAtMax && (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>
                Maximum of {MAX_ROLES} target roles reached. Remove a role to add another.
              </p>
            )}

            {/* Suggested roles when empty and not searching */}
            {currentRoleNames.length === 0 && !isSearchOpen && (
              <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Popular roles to get started:
                </p>
                <div className={styles.badgeList}>
                  {SUGGESTED_ROLES.slice(0, 5).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleAddRole(role)}
                      disabled={isUpdating}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.3125rem 0.6875rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        border: '1px dashed var(--border-default)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.12s ease',
                      }}
                      onMouseEnter={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--color-brand)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--color-brand)'
                        ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--color-brand-50)'
                      }}
                      onMouseLeave={(e) => {
                        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-default)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)'
                        ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                      }}
                    >
                      + {role}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Role chips */}
            {currentRoleNames.length === 0 ? (
              <div className={styles.emptyStateContainer}>
                <EmptyState
                  icon={<Target size={32} />}
                  title="No target roles selected"
                  description="Add target roles to unlock opportunity matching, career analytics, and a personalized learning roadmap."
                />
              </div>
            ) : (
              <div className={styles.badgeList}>
                {currentRoleNames.map((name) => (
                  <div key={name} className={styles.badgeEnter}>
                    <RemovableSkillBadge
                      name={name}
                      onRemove={() => handleRemoveRole(name)}
                      title="Remove this target role"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </SectionCard>
  )
}
