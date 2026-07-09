import { Link } from 'react-router-dom'
import { useUserProfile, useResumes, useApplications, useUserSkills } from '@/hooks'
import { ProgressCard } from '@/components/common'
import { Skeleton, ApiErrorState } from '@/components/feedback'
import { CheckCircle, AlertCircle, User, ExternalLink } from 'lucide-react'
import styles from './ProfileSummary.module.css'

interface ProfileSummaryProps {
  isEditing?: boolean
  localName?: string
  onNameChange?: (name: string) => void
}

export function ProfileSummary({ isEditing, localName, onNameChange }: ProfileSummaryProps) {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch,
  } = useUserProfile()
  const { data: resumes = [], isLoading: isLoadingResumes } = useResumes()
  const { data: applications = [], isLoading: isLoadingApplications } = useApplications()
  const { data: manualSkills = [], isLoading: isLoadingSkills } = useUserSkills()

  const isLoading = isLoadingProfile || isLoadingResumes || isLoadingApplications || isLoadingSkills

  if (isLoading) {
    return (
      <div className={styles.grid}>
        <Skeleton style={{ height: '220px', borderRadius: 'var(--radius-lg)' }} />
        <Skeleton style={{ height: '220px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    )
  }

  if (profileError || !profile) {
    return <ApiErrorState error={profileError} onRetry={refetch} />
  }

  const activeResume = resumes.find(r => r.active)
  const manualCount = manualSkills.length
  const resumeCount = profile.skillsCount // From backend: number of skills extracted from active resume
  const totalEffectiveSkills = resumeCount + manualCount

  let completionLabel = 'Needs Improvement'
  let completionDescription = 'Upload an active resume and configure target roles to reach 100%.'
  if (profile.profileCompletionPercentage >= 100) {
    completionLabel = 'Complete'
    completionDescription = 'Your profile is fully complete — this maximizes opportunity matching accuracy.'
  } else if (profile.profileCompletionPercentage >= 70) {
    completionLabel = 'Excellent'
    completionDescription = 'Almost there — complete a few remaining steps to maximize match accuracy.'
  }

  const isComplete = profile.profileCompletionPercentage >= 100

  const skillsValue =
    totalEffectiveSkills === 0
      ? '0'
      : resumeCount > 0 && manualCount > 0
      ? `${totalEffectiveSkills} (${resumeCount} from resume, ${manualCount} manual)`
      : resumeCount > 0
      ? `${resumeCount} from resume`
      : `${manualCount} manual`

  const activeResumeDisplay = activeResume ? (
    <Link to={`/resumes/${activeResume.id}`} className={styles.actionableLink}>
      {activeResume.title || activeResume.fileName}
      <ExternalLink size={12} className={styles.linkIcon} />
    </Link>
  ) : (
    <span className={styles.metaValueDim}>None uploaded</span>
  )

  const applicationsDisplay = applications.length > 0 ? (
    <Link to="/applications" className={styles.actionableLink}>
      {applications.length}
      <ExternalLink size={12} className={styles.linkIcon} />
    </Link>
  ) : (
    <span className={styles.metaValueDim}>None</span>
  )

  return (
    <div className={styles.grid}>
      <div className={styles.infoCard}>
        <div className={styles.identity}>
          <div className={styles.avatar}>
            <User size={26} className={styles.avatarIcon} />
          </div>
          <div className={styles.identityText}>
            {isEditing && onNameChange ? (
              <input 
                type="text"
                className={styles.nameInput}
                value={localName}
                onChange={e => onNameChange(e.target.value)}
                placeholder="Your Name"
                autoFocus
              />
            ) : (
              <span className={styles.name}>{profile.name}</span>
            )}
            <span className={styles.email} title="Email cannot be changed (OAuth managed)">
              {profile.email} {isEditing && <span className={styles.readOnlyTag}>(Read-only)</span>}
            </span>
          </div>
        </div>

        <div className={styles.metaTable}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Active Resume</span>
            <span className={styles.metaValue}>{activeResumeDisplay}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Effective Skills</span>
            <span className={styles.metaValue}>{skillsValue}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Applications</span>
            <span className={styles.metaValue}>{applicationsDisplay}</span>
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

      <div className={styles.completenessCard}>
        <ProgressCard
          title="Profile Completeness"
          value={completionLabel}
          percentage={profile.profileCompletionPercentage}
          description={completionDescription}
          icon={
            isComplete ? (
              <CheckCircle size={18} className={styles.iconSuccess} />
            ) : (
              <AlertCircle size={18} className={styles.iconWarning} />
            )
          }
        />
      </div>
    </div>
  )
}
