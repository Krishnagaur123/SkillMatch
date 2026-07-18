import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserProfile, useUpdateUserProfile, useResumes, useApplications } from '@/hooks'
import { Skeleton, ApiErrorState } from '@/components/feedback'
import { Button } from '@/components/common'
import { CheckCircle, User, ExternalLink } from 'lucide-react'
import styles from './ProfileSummary.module.css'
import { SectionCard } from '@/components/layout'

export function ProfileSummary() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch,
  } = useUserProfile()
  const { data: resumes = [], isLoading: isLoadingResumes } = useResumes()
  const { data: applications = [], isLoading: isLoadingApplications } = useApplications()
  const { mutateAsync: updateProfileAsync } = useUpdateUserProfile()

  const [isEditingName, setIsEditingName] = useState(false)
  const [localName, setLocalName] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)

  const isLoading = isLoadingProfile || isLoadingResumes || isLoadingApplications

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <Skeleton style={{ height: '320px', borderRadius: 'var(--radius-lg)' }} />
        <Skeleton style={{ height: '320px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    )
  }

  if (profileError || !profile) {
    return <ApiErrorState error={profileError} onRetry={refetch} />
  }

  const activeResume = resumes.find(r => r.active)

  const handleEditName = () => {
    setLocalName(profile.name)
    setIsEditingName(true)
  }

  const handleSaveName = async () => {
    if (!localName.trim() || localName.trim() === profile.name) {
      setIsEditingName(false)
      return
    }
    setIsSavingName(true)
    try {
      await updateProfileAsync({ name: localName.trim() })
      setIsEditingName(false)
    } catch (error) {
      console.error('Failed to update name', error)
      alert('Failed to update name')
    } finally {
      setIsSavingName(false)
    }
  }



  const isResumeUploaded = !!activeResume
  const isSkillsAdded = profile.skillsCount > 0
  const isRolesSelected = (profile.targetRoles || []).length > 0
  const isExperienceAdded = profile.experienceCount > 0

  let completionCategory = 'Needs Attention'
  if (profile.profileCompletionPercentage >= 90) completionCategory = 'Excellent'
  else if (profile.profileCompletionPercentage >= 75) completionCategory = 'Good'
  else if (profile.profileCompletionPercentage >= 60) completionCategory = 'Fair'

  return (
    <div className={styles.grid}>
      <SectionCard
        title="Profile Information"
        description="Your professional details and overall stats."
      >
        <div className={styles.infoContent}>
          <div className={styles.identity}>
            <div className={styles.avatar}>
              <User size={26} className={styles.avatarIcon} />
            </div>
            <div className={styles.identityText}>
              {isEditingName ? (
                <div className={styles.nameEditRow}>
                  <input
                    type="text"
                    className={styles.nameInput}
                    value={localName}
                    onChange={e => setLocalName(e.target.value)}
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSaveName} disabled={isSavingName || !localName.trim()}>
                    {isSavingName ? 'Saving...' : 'Save'}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setIsEditingName(false)} disabled={isSavingName}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className={styles.nameRow}>
                  <span className={styles.name}>{profile.name}</span>
                  <button type="button" className={styles.editBtn} onClick={handleEditName}>
                    Edit
                  </button>
                </div>
              )}
              <span className={styles.email}>{profile.email}</span>
            </div>
          </div>

          <div className={styles.metaTable}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Active Resume</span>
              <span className={styles.metaValue}>
                {activeResume ? (
                  <Link to={`/resumes/${activeResume.id}`} className={styles.actionableLink}>
                    {activeResume.title || activeResume.fileName}
                    <ExternalLink size={12} className={styles.linkIcon} />
                  </Link>
                ) : (
                  <span className={styles.metaValueDim}>None uploaded</span>
                )}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Applications</span>
              <span className={styles.metaValue}>
                {applications.length > 0 ? (
                  <Link to="/applications" className={styles.actionableLink}>
                    {applications.length}
                    <ExternalLink size={12} className={styles.linkIcon} />
                  </Link>
                ) : (
                  <span className={styles.metaValueDim}>None</span>
                )}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Education</span>
              <span className={styles.metaValue}>
                {profile.educationCount === 0
                  ? 'None'
                  : `${profile.educationCount} ${profile.educationCount === 1 ? 'entry' : 'entries'}`}
              </span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Experience</span>
              <span className={styles.metaValue}>
                {profile.experienceCount === 0
                  ? 'None'
                  : `${profile.experienceCount} ${profile.experienceCount === 1 ? 'entry' : 'entries'}`}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Profile Completeness"
        description="Maximize completion for better opportunity matching."
      >
        <div className={styles.completenessContent}>
          <div className={styles.completenessHeader}>
            <span className={styles.completenessPercentage}>
              {profile.profileCompletionPercentage}%
            </span>
            <span className={styles.completenessCategory}>
              {completionCategory}
            </span>
          </div>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{ width: `${profile.profileCompletionPercentage}%` }}
            />
          </div>

          <div className={styles.checklist}>
            <div className={styles.checkGroup}>
              <div className={styles.checkGroupTitle}>Completed</div>
              <ul className={styles.checkListUl}>
                {isResumeUploaded && <li><CheckCircle size={14} className={styles.checkIconSuccess} /> Resume Uploaded</li>}
                {isRolesSelected && <li><CheckCircle size={14} className={styles.checkIconSuccess} /> Target Roles Selected</li>}
                {isSkillsAdded && <li><CheckCircle size={14} className={styles.checkIconSuccess} /> Skills Added</li>}
                {isExperienceAdded && <li><CheckCircle size={14} className={styles.checkIconSuccess} /> Experience Added</li>}
                {!isResumeUploaded && !isRolesSelected && !isSkillsAdded && !isExperienceAdded && (
                  <li className={styles.emptyLi}>Nothing yet</li>
                )}
              </ul>
            </div>

            <div className={styles.checkGroup}>
              <div className={styles.checkGroupTitle}>Remaining</div>
              <ul className={styles.checkListUl}>
                {!isResumeUploaded && <li><div className={styles.circleIcon} /> Upload Resume</li>}
                {!isRolesSelected && <li><div className={styles.circleIcon} /> Add Target Roles</li>}
                {!isSkillsAdded && <li><div className={styles.circleIcon} /> Add Skills</li>}
                {!isExperienceAdded && <li><div className={styles.circleIcon} /> Add Experience</li>}
                <li><div className={styles.circleIcon} /> Add Portfolio (Future)</li>
                <li><div className={styles.circleIcon} /> Connect LinkedIn (Future)</li>
              </ul>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
