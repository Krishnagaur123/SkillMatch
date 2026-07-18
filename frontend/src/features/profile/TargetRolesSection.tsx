import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { RemovableSkillBadge } from '@/components/common'
import { Search, X, Target } from 'lucide-react'
import { EmptyState } from '@/components/feedback'
import type { TargetRoleResponse } from '@/hooks/useTargetRoles'
import { useDebounce } from '@/hooks/useDebounce'
import { useUpdateUserProfile } from '@/hooks'
import { Button } from '@/components/common'
import styles from './ProfileSection.module.css'

interface TargetRolesSectionProps {
  allRoles: TargetRoleResponse[]
  currentRoleNames: string[]
}

export function TargetRolesSection({
  allRoles,
  currentRoleNames,
}: TargetRolesSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localRoleNames, setLocalRoleNames] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const { mutateAsync: updateProfileAsync } = useUpdateUserProfile()

  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 200)
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleEdit = () => {
    setLocalRoleNames([...currentRoleNames])
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setInputValue('')
    setIsOpen(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const targetRoleIds = localRoleNames
        .map(name => allRoles.find(r => r.name === name)?.id)
        .filter(Boolean) as string[]
        
      await updateProfileAsync({ targetRoleIds })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update roles', error)
      alert('Failed to update target roles')
    } finally {
      setIsSaving(false)
    }
  }

  const activeRoleNames = isEditing ? localRoleNames : currentRoleNames
  const currentRoles = activeRoleNames

  const availableRoles = allRoles.filter(role => {
    const isNotSelected = !activeRoleNames.includes(role.name)
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

  const handleSelectRole = (roleName: string) => {
    if (localRoleNames.includes(roleName)) return
    setLocalRoleNames([...localRoleNames, roleName])
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRemoveRole = (roleName: string) => {
    setLocalRoleNames(localRoleNames.filter(name => name !== roleName))
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
        handleSelectRole(availableRoles[highlightedIndex].name)
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
    <div style={{ width: '100%' }}>
      <EmptyState
        icon={<Target size={36} />}
        title="No target roles configured"
        description="Adding target roles helps SkillMatch surface relevant opportunities and improves your match scores."
      />
    </div>
  )

  const actions = isEditing ? (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button size="sm" onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save'}
      </Button>
      <Button variant="secondary" size="sm" onClick={handleCancel} disabled={isSaving}>
        Cancel
      </Button>
    </div>
  ) : (
    <Button variant="secondary" size="sm" onClick={handleEdit}>
      Edit
    </Button>
  )

  return (
    <SectionCard
      title="Target Roles"
      description="Roles you are targeting, used to optimize opportunity matching and alerts."
      actions={actions}
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
                          onClick={() => handleSelectRole(role.name)}
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
            : currentRoles.map(roleName =>
                isEditing ? (
                  <RemovableSkillBadge
                    key={roleName}
                    name={roleName}
                    onRemove={() => handleRemoveRole(roleName)}
                  />
                ) : (
                  <span key={roleName} className={styles.viewBadge}>
                    {roleName}
                  </span>
                )
              )}
        </div>
      </div>
    </SectionCard>
  )
}
