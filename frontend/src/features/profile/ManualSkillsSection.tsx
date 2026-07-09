import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { RemovableSkillBadge, SkillBadge } from '@/components/common'
import { Search, Loader2, X, Zap, AlertCircle } from 'lucide-react'
import { useSkillsCatalog } from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ProfileSection.module.css'

interface SkillEntry {
  skillId: string
  skillName: string
}

interface ManualSkillsSectionProps {
  isEditing: boolean
  skills: SkillEntry[]
  onSkillsChange: (skills: SkillEntry[]) => void
  resumeSkills?: string[]
  hasActiveResume?: boolean
  resumeCount?: number
  manualCount?: number
  onEditClick?: () => void
}

export function ManualSkillsSection({
  isEditing,
  skills,
  onSkillsChange,
  resumeSkills = [],
  hasActiveResume = false,
  resumeCount = 0,
  manualCount = 0,
  onEditClick,
}: ManualSkillsSectionProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 300)

  const { data: catalog = [], isFetching } = useSkillsCatalog(debouncedSearch)

  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const availableSkills = catalog.filter(
    skill => !skills.some(us => us.skillId === skill.id)
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
    if (skills.some(us => us.skillId === skill.id)) return
    onSkillsChange([...skills, { skillId: skill.id, skillName: skill.name }])
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleRemoveSkill = (skillId: string) => {
    onSkillsChange(skills.filter(us => us.skillId !== skillId))
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

  const sortedResumeSkills = [...resumeSkills].sort((a, b) => a.localeCompare(b))
  const sortedManualSkills = [...skills].sort((a, b) => a.skillName.localeCompare(b.skillName))
  const total = (resumeCount ?? 0) + (manualCount ?? 0)

  const emptyState = total === 0 ? (
    <div className={styles.emptyState}>
      <Zap size={20} className={styles.emptyStateIcon} />
      <div className={styles.emptyStateContent}>
        <span className={styles.emptyStateTitle}>No skills on profile</span>
        <span className={styles.emptyStateDesc}>
          Enhance your profile and opportunities by{' '}
          <Link to="/resumes" className={styles.inlineLink}>
            uploading a resume
          </Link>{' '}
          or adding skills manually below.
        </span>
      </div>
    </div>
  ) : null

  return (
    <SectionCard
      title="Effective Skills"
      description="Your complete skill profile combining resume extraction and manual additions."
    >
      <div className={`${styles.container}${isEditing ? ` ${styles.containerEditing}` : ''}`}>
        <div className={styles.statsSummary}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Effective Skills</span>
            <span className={styles.statValue}>{total}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Resume Skills</span>
            <span className={styles.statValue}>{resumeCount}</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Manual Skills</span>
            <span className={styles.statValue}>{manualCount}</span>
          </div>
        </div>

        {!hasActiveResume && (
          <div className={styles.emptyState}>
            <AlertCircle size={16} className={styles.emptyStateIcon} />
            <div className={styles.emptyStateContent}>
              <span className={styles.emptyStateTitle}>No active resume</span>
              <span className={styles.emptyStateDesc}>
                Upload and activate a resume in the{' '}
                <Link to="/resumes" className={styles.inlineLink}>
                  Resumes
                </Link>{' '}
                section to automatically populate resume skills.
              </span>
            </div>
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
          {total === 0 ? (
            emptyState
          ) : (
            <>
              {sortedResumeSkills.map(name =>
                isEditing ? (
                  <SkillBadge
                    key={`resume-${name}`}
                    name={name}
                    variant="resume"
                    title="Extracted from your active resume. Edit or replace your active resume to change this skill."
                  />
                ) : (
                  <span
                    key={`resume-${name}`}
                    className={styles.viewBadgeResume}
                    title="Extracted from your active resume. Edit or replace your active resume to change this skill."
                  >
                    {name}
                  </span>
                )
              )}

              {sortedManualSkills.map(us =>
                isEditing ? (
                  <RemovableSkillBadge
                    key={`manual-${us.skillId}`}
                    name={us.skillName}
                    variant="manual"
                    onRemove={() => handleRemoveSkill(us.skillId)}
                    title="Added manually."
                  />
                ) : (
                  <span
                    key={`manual-${us.skillId}`}
                    className={styles.viewBadgeManual}
                    title="Added manually."
                  >
                    {us.skillName}
                  </span>
                )
              )}

              {manualCount === 0 && !isEditing && onEditClick && (
                <button
                  type="button"
                  className={styles.addSkillAction}
                  onClick={onEditClick}
                >
                  + Add Manual Skills
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </SectionCard>
  )
}
