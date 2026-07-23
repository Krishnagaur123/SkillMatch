import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, CSSProperties } from 'react'
import { SectionCard } from '@/components/layout'
import { SkillBadge, RemovableSkillBadge, Button } from '@/components/common'
import { Search, Loader2, X, Plus, BookOpen, AlertCircle } from 'lucide-react'
import { EmptyState } from '@/components/feedback'
import { 
  useUserSkills, 
  useAddUserSkill, 
  useRemoveUserSkill,
  useResumes,
  useResumeDetail,
  useSkillsCatalog 
} from '@/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import styles from './ProfileSkillsCard.module.css'

export function ProfileSkillsCard() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue, 300)
  
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [dropdownStyle, setDropdownStyle] = useState<CSSProperties>({})
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const inputWrapperRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data: manualSkillsData, isLoading: isLoadingManualSkills } = useUserSkills()
  const { data: resumes, isLoading: isLoadingResumes } = useResumes()
  const activeResume = resumes?.find(r => r.active)
  const { data: resumeDetail, isLoading: isLoadingResumeDetail } = useResumeDetail(activeResume?.id || '')
  
  const { mutate: addSkill, isPending: isAdding } = useAddUserSkill()
  const { mutate: removeSkill } = useRemoveUserSkill()

  const { data: catalog = [], isFetching } = useSkillsCatalog(debouncedSearch)

  const manualSkills = useMemo(() => manualSkillsData || [], [manualSkillsData])
  const resumeSkills = useMemo(() => resumeDetail?.skills || [], [resumeDetail?.skills])

  // Ensure no duplicates: resume skills take precedence
  const filteredManualSkills = useMemo(() => {
    const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()))
    return manualSkills.filter(s => !resumeSet.has(s.skillName.toLowerCase()))
  }, [manualSkills, resumeSkills])

  const isLoading = isLoadingManualSkills || isLoadingResumes || (!!activeResume && isLoadingResumeDetail)
  const totalSkills = resumeSkills.length + filteredManualSkills.length

  const availableSkills = useMemo(() => {
    const existingNames = new Set([
      ...resumeSkills.map(s => s.toLowerCase()),
      ...filteredManualSkills.map(s => s.skillName.toLowerCase())
    ])
    return catalog.map(skill => ({
      ...skill,
      exists: existingNames.has(skill.name.toLowerCase())
    }))
  }, [catalog, resumeSkills, filteredManualSkills])

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

  const handleSelectSkill = (skill: { id: string; name: string; exists: boolean }) => {
    setErrorMsg(null)
    if (skill.exists) {
      setErrorMsg(`"${skill.name}" is already in your skills.`)
      return
    }
    addSkill({ skillId: skill.id })
    setInputValue('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!shouldShowDropdown) {
      if (e.key === 'ArrowDown' && inputValue.trim().length > 0) {
        updateDropdownPosition()
        setIsOpen(true)
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

  const toggleSearch = () => {
    setIsSearchOpen(prev => {
      if (!prev) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      return !prev
    })
    setInputValue('')
    setIsOpen(false)
    setErrorMsg(null)
  }

  const headerActions = (
    <Button 
      variant={isSearchOpen ? "secondary" : "primary"}
      size="sm" 
      onClick={toggleSearch}
    >
      {isSearchOpen ? 'Cancel' : <><Plus size={16} /> Add Skill</>}
    </Button>
  )

  return (
    <SectionCard
      title="Skills"
      description="Manage the skills used for opportunity matching."
      actions={headerActions}
    >
      <div className={styles.card}>
        {isLoading ? (
          <div className={styles.skeletonContainer}>
            <div className={styles.skeletonRow}>
              {[...Array(4)].map((_, i) => <div key={i} className={styles.skeletonChip} />)}
            </div>
            <div className={styles.skeletonRow}>
              {[...Array(3)].map((_, i) => <div key={i} className={styles.skeletonChip} />)}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.statsRow}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>{totalSkills}</span>
                <span>Total Skills</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>{resumeSkills.length}</span>
                <span>Resume</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>{filteredManualSkills.length}</span>
                <span>Manual</span>
              </div>
            </div>

            {isSearchOpen && (
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
                      setErrorMsg(null)
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
                  {(isFetching || isAdding) ? (
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
                
                {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}

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
                          <Loader2 size={14} className={styles.spinner} />
                          <span>Searching…</span>
                        </div>
                      ) : availableSkills.length > 0 ? (
                        <ul className={styles.dropdownList}>
                          {availableSkills.map((skill, index) => (
                            <li
                              key={skill.id}
                              role="option"
                              aria-selected={index === highlightedIndex}
                              className={`${styles.dropdownItem} ${index === highlightedIndex ? styles.dropdownItemActive : ''} ${skill.exists ? styles.dropdownItemExisting : ''}`}
                              onMouseEnter={() => !skill.exists && setHighlightedIndex(index)}
                              onMouseDown={e => e.preventDefault()}
                              onClick={() => !skill.exists && handleSelectSkill(skill)}
                            >
                              <span>{skill.name}</span>
                              {skill.exists && <span style={{ fontSize: '0.75rem' }}>Already added</span>}
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

            <div className={styles.scrollArea}>
              {resumeSkills.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <BookOpen size={16} className={styles.searchIcon} />
                    Resume Skills
                  </div>
                  <div className={styles.badgeList}>
                    {resumeSkills.map(name => (
                      <div key={`resume-${name}`} className={styles.badgeEnter}>
                        <SkillBadge
                          name={name}
                          variant="resume"
                          title="Imported from your active resume"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  Manual Skills
                </div>
                {filteredManualSkills.length === 0 ? (
                  <div className={styles.emptyStateContainer}>
                    <EmptyState
                      icon={<AlertCircle size={32} />}
                      title="No manual skills added"
                      description="Add technologies that aren't present on your resume to improve opportunity matching and career analytics."
                    />
                  </div>
                ) : (
                  <div className={styles.badgeList}>
                    {filteredManualSkills.map(skill => (
                      <div key={`manual-${skill.skillId}`} className={styles.badgeEnter}>
                        <RemovableSkillBadge
                          name={skill.skillName}
                          variant="manual"
                          onRemove={() => removeSkill(skill.skillId)}
                          title="Added manually"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </SectionCard>
  )
}
