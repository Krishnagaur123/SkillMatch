import type { UseFormRegister, UseFormResetField } from 'react-hook-form'
import { Briefcase } from 'lucide-react'
import { EditableSection } from './EditableSection'
import { ProfileDisplayField } from './ProfileDisplayField'
import type { ProfileFormValues, ProfileFormOutput } from '../schemas/profileSchema'
import type { UserProfileDetail } from '../services/profileApi'
import styles from './FormSection.module.css'

interface ExperienceSectionProps {
  profile: UserProfileDetail | undefined
  register: UseFormRegister<ProfileFormValues>
  resetField: UseFormResetField<ProfileFormOutput>
}

function formatExperienceLevel(level: string | null | undefined) {
  if (!level) return undefined
  const labels: Record<string, string> = {
    FRESHER: 'Fresher',
    ENTRY_LEVEL: 'Entry Level (1-3 yrs)',
    MID_LEVEL: 'Mid Level (3-5 yrs)',
    SENIOR: 'Senior (5-8 yrs)',
    LEAD: 'Lead / Architect (8+ yrs)',
    MANAGER: 'Manager',
    EXECUTIVE: 'Executive (VP/C-Level)',
  }
  return labels[level] || level
}

function formatWorkMode(mode: string | null | undefined) {
  if (!mode) return undefined
  const labels: Record<string, string> = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'Onsite',
  }
  return labels[mode] || mode
}

export function ExperienceSection({ profile, register, resetField }: ExperienceSectionProps) {
  const isEmpty =
    !profile?.experienceLevel &&
    !profile?.currentOrganization &&
    !profile?.preferredWorkMode

  const handleCancel = () => {
    resetField('experienceLevel', { defaultValue: profile?.experienceLevel || undefined })
    resetField('currentOrganization', { defaultValue: profile?.currentOrganization || undefined })
    resetField('preferredWorkMode', { defaultValue: profile?.preferredWorkMode || undefined })
    resetField('openToWork', { defaultValue: profile?.openToWork || false })
  }

  const viewContent = (
    <div className={styles.grid2}>
      <ProfileDisplayField 
        label="Experience Level" 
        value={formatExperienceLevel(profile?.experienceLevel)} 
      />
      <ProfileDisplayField 
        label="Current Organization" 
        value={profile?.currentOrganization} 
      />
      <ProfileDisplayField 
        label="Preferred Work Mode" 
        value={formatWorkMode(profile?.preferredWorkMode)} 
      />
      <ProfileDisplayField 
        label="Open to Work" 
        value={profile?.openToWork ? 'Yes' : 'No'} 
      />
    </div>
  )

  const editContent = (
    <div className={styles.grid2}>
      {/* Experience Level */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="experienceLevel">
          Experience Level
        </label>
        <select id="experienceLevel" className={styles.select} {...register('experienceLevel')}>
          <option value="">Select Level</option>
          <option value="FRESHER">Fresher</option>
          <option value="ENTRY_LEVEL">Entry Level (1-3 yrs)</option>
          <option value="MID_LEVEL">Mid Level (3-5 yrs)</option>
          <option value="SENIOR">Senior (5-8 yrs)</option>
          <option value="LEAD">Lead / Architect (8+ yrs)</option>
          <option value="MANAGER">Manager</option>
          <option value="EXECUTIVE">Executive (VP/C-Level)</option>
        </select>
      </div>

      {/* Current Organization */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="currentOrganization">
          Current Organization
        </label>
        <input
          id="currentOrganization"
          type="text"
          className={styles.input}
          placeholder="e.g. Acme Corp"
          {...register('currentOrganization')}
        />
      </div>

      {/* Preferred Work Mode */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="preferredWorkMode">
          Preferred Work Mode
        </label>
        <select id="preferredWorkMode" className={styles.select} {...register('preferredWorkMode')}>
          <option value="">Select Preference</option>
          <option value="REMOTE">Remote</option>
          <option value="HYBRID">Hybrid</option>
          <option value="ONSITE">Onsite</option>
        </select>
      </div>

      {/* Open To Work */}
      <div className={styles.field}>
        <label className={styles.label}>Open to Work</label>
        <div className={styles.switchRow} style={{ marginTop: '0.375rem' }}>
          <label className={styles.switch}>
            <input type="checkbox" {...register('openToWork')} />
            <span className={styles.switchTrack} />
            <span className={styles.switchThumb} />
          </label>
          <div className={styles.switchText}>
            <div className={styles.switchLabel}>Actively looking</div>
            <div className={styles.switchDesc}>Show recruiters you are open to opportunities</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <EditableSection
      title="Experience"
      icon={Briefcase}
      isEmpty={isEmpty}
      viewContent={viewContent}
      editContent={editContent}
      onCancel={handleCancel}
    />
  )
}
