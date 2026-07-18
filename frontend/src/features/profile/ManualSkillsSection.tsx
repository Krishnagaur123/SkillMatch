import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { RemovableSkillBadge, SkillBadge, Button } from '@/components/common'
import { Search, Loader2, X, Zap, AlertCircle } from 'lucide-react'
import { EmptyState } from '@/components/feedback'
import { useSkillsCatalog, useAddUserSkill, useRemoveUserSkill } from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ProfileSection.module.css'

interface SkillEntry {
  skillId: string
  skillName: string
}

interface ManualSkillsSectionProps {
  skills: SkillEntry[]
  resumeSkills?: string[]
  hasActiveResume?: boolean
  resumeCount?: number
}

const INITIAL_VISIBLE_COUNT = 15

export function ManualSkillsSection({
  skills,
  resumeSkills = [],
  hasActiveResume = false,
  resumeCount = 0,
}: ManualSkillsSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localSkills, setLocalSkills] = useState<SkillEntry[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const { mutateAsync: addSkillAsync } = useAddUserSkill()
  const { mutateAsync: removeSkillAsync } = useRemoveUserSkill()

  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 300)

  const { data: catalog = [], isFetching } = useSkillsCatalog(debouncedSearch)

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleEdit = () => {
    setLocalSkills([...skills])
    setIsEditing(true)
    setShowAll(true) // Always show all when editing
  }

  const handleCancel = () => {
    setIsEditing(false)
    setInputValue('')
    setIsOpen(false)
    setShowAll(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const originalSkillIds = new Set(skills.map(s => s.skillId))
      const currentSkillIds = new Set(localSkills.map(s => s.skillId))
      const toAdd = [...currentSkillIds].filter(id => !originalSkillIds.has(id))
      const toRemove = [...originalSkillIds].filter(id => !currentSkillIds.has(id))
      
      const promises: Promise<unknown>[] = []
      toAdd.forEach(id => promises.push(addSkillAsync({ skillId: id })))
      toRemove.forEach(id => promises.push(removeSkillAsync(id)))
      
      const results = await Promise.allSettled(promises)
      const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      
      if (failed.length > 0) {
        console.error('Failed to save some skills:', failed)
        alert('Some changes could not be saved. Please try again.')
      } else {
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const activeSkills = isEditing ? localSkills : skills

  const availableSkills = catalog.filter(
    skill => !activeSkills.some(us => us.skillId === skill.id)
  )

  const shouldShowDropdown = isOpen && inputValue.trim().length > 0

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

  const handleSelectSkill = (skill: { id: string; name: string }) => {
    if (activeSkills.some(us => us.skillId === skill.id)) return
    setLocalSkills([...localSkills, { skillId: skill.id, skillName: skill.name }])
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRemoveSkill = (skillId: string) => {
    setLocalSkills(localSkills.filter(us => us.skillId !== skillId))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShowDropdown) {
      if (e.key === 'ArrowDown') {
        if (inputValue.trim().length > 0) {
          updateDropdownPosition()
          setIsOpen(true)
        }
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev < availableSkills.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlightedIndex >= 0 && highlightedIndex < availableSkills.length) {
        handleSelectSkill(availableSkills[highlightedIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  const allChips = [
    ...resumeSkills.map(name => ({ type: 'resume', name, id: `resume-${name}` })),
    ...activeSkills.map(s => ({ type: 'manual', name: s.skillName, id: s.skillId }))
  ]

  const visibleChips = (isEditing || showAll) ? allChips : allChips.slice(0, INITIAL_VISIBLE_COUNT)
  const hiddenCount = allChips.length - visibleChips.length

  const emptyState = allChips.length === 0 ? (
    <div style={{ width: '100%' }}>
      <EmptyState
        icon={<Zap size={36} />}
        title="No skills on profile"
        description={
          <>
            Enhance your profile and opportunities by{' '}
            <Link to="/resumes" className={styles.inlineLink}>
              uploading a resume
            </Link>{' '}
            or adding skills manually below.
          </>
        }
      />
    </div>
  ) : null

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
      Manage
    </Button>
  )

  return (
    <SectionCard
      title="Skills"
      description="Your complete skill profile combining resume extraction and manual additions."
      actions={actions}
    >
      <div className={`${styles.container}${isEditing ? ` ${styles.containerEditing}` : ''}`}>
        <div className={styles.statsSummary}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Resume Skills</span>
            <span className={styles.statValue}>{resumeCount}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Manual Skills</span>
            <span className={styles.statValue}>{skills.length}</span>
          </div>
        </div>

        {!hasActiveResume && !isEditing && (
          <div style={{ width: '100%' }}>
            <EmptyState
              icon={<AlertCircle size={36} />}
              title="No active resume"
              description={
                <>
                  Upload and activate a resume in the{' '}
                  <Link to="/resumes" className={styles.inlineLink}>
                    Resumes
                  </Link>{' '}
                  section to automatically populate resume skills.
                </>
              }
            />
          </div>
        )}

        {isEditing && (
          <div className={styles.searchWrapper} ref={inputWrapperRef}>
            <div className={styles.inputWrapper}>
              <Search size={15} className={styles.searchIcon} />
              <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="Search skills to add…"
                value={inputValue}
                autoComplete="off"
                onChange={e => {
                  const value = e.target.value
                  setInputValue(value)
                  setHighlightedIndex(-1)
                  if (value.trim().length > 0) {
                    updateDropdownPosition()
                    setIsOpen(true)
                  } else {
                    setIsOpen(false)
                  }
                }}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-label="Search skills to add"
                aria-haspopup="listbox"
                aria-expanded={shouldShowDropdown}
                aria-autocomplete="list"
              />
              {isFetching ? (
                <Loader2 size={14} className={styles.spinner} />
              ) : inputValue && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    setInputValue('')
                    setIsOpen(false)
                    setHighlightedIndex(-1)
                    inputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {shouldShowDropdown &&
              createPortal(
                <div
                  ref={dropdownRef}
                  className={styles.dropdown}
                  style={dropdownStyle}
                  role="listbox"
                  aria-label="Skill suggestions"
                >
                  {isFetching ? (
                    <div className={styles.dropdownLoading}>
                      <Loader2 size={14} className={styles.dropdownSpinner} />
                      <span>Searching…</span>
                    </div>
                  ) : availableSkills.length > 0 ? (
                    <ul className={styles.dropdownList}>
                      {availableSkills.map((skill, index) => (
                        <li
                          key={skill.id}
                          role="option"
                          aria-selected={index === highlightedIndex}
                          className={`${styles.dropdownItem}${index === highlightedIndex ? ` ${styles.dropdownItemActive}` : ''}`}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleSelectSkill(skill)}
                        >
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.dropdownEmpty}>No matching skills found.</div>
                  )}
                </div>,
                document.body
              )}
          </div>
        )}

        <div className={styles.badgeList}>
          {allChips.length === 0 ? (
            emptyState
          ) : (
            <>
              {visibleChips.map(chip => {
                if (chip.type === 'resume') {
                  return isEditing ? (
                    <SkillBadge
                      key={`resume-${chip.name}`}
                      name={chip.name}
                      variant="resume"
                      title="Extracted from your active resume."
                    />
                  ) : (
                    <span
                      key={`resume-${chip.name}`}
                      className={styles.viewBadgeResume}
                      title="Extracted from your active resume."
                    >
                      {chip.name}
                    </span>
                  )
                } else {
                  return isEditing ? (
                    <RemovableSkillBadge
                      key={`manual-${chip.id}`}
                      name={chip.name}
                      variant="manual"
                      onRemove={() => handleRemoveSkill(chip.id)}
                      title="Added manually."
                    />
                  ) : (
                    <span
                      key={`manual-${chip.id}`}
                      className={styles.viewBadgeManual}
                      title="Added manually."
                    >
                      {chip.name}
                    </span>
                  )
                }
              })}
              
              {!isEditing && hiddenCount > 0 && (
                <button
                  type="button"
                  className={styles.addSkillAction}
                  onClick={() => setShowAll(true)}
                  style={{ border: '1px dashed var(--border-default)', color: 'var(--text-secondary)' }}
                >
                  + {hiddenCount} more
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </SectionCard>
  )
}
