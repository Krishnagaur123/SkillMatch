import type { UseFormRegister, FieldErrors, UseFormResetField } from 'react-hook-form'
import { Link as LinkIcon } from 'lucide-react'
import { EditableSection } from './EditableSection'
import { ProfileDisplayField } from './ProfileDisplayField'
import type { ProfileFormValues, ProfileFormOutput } from '../schemas/profileSchema'
import type { UserProfileDetail } from '../services/profileApi'
import styles from './FormSection.module.css'

interface ProfessionalLinksSectionProps {
  profile: UserProfileDetail | undefined
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  resetField: UseFormResetField<ProfileFormOutput>
}

export function ProfessionalLinksSection({ profile, register, errors, resetField }: ProfessionalLinksSectionProps) {
  const isEmpty =
    !profile?.linkedinUrl &&
    !profile?.githubUrl &&
    !profile?.portfolioUrl &&
    !profile?.leetcodeUrl &&
    !profile?.codeforcesUrl

  const handleCancel = () => {
    resetField('linkedinUrl', { defaultValue: profile?.linkedinUrl || undefined })
    resetField('githubUrl', { defaultValue: profile?.githubUrl || undefined })
    resetField('portfolioUrl', { defaultValue: profile?.portfolioUrl || undefined })
    resetField('leetcodeUrl', { defaultValue: profile?.leetcodeUrl || undefined })
    resetField('codeforcesUrl', { defaultValue: profile?.codeforcesUrl || undefined })
  }

  const viewContent = (
    <div className={styles.grid2}>
      <ProfileDisplayField label="LinkedIn" value={profile?.linkedinUrl} isUrl />
      <ProfileDisplayField label="GitHub" value={profile?.githubUrl} isUrl />
      <ProfileDisplayField label="Portfolio" value={profile?.portfolioUrl} isUrl />
      <ProfileDisplayField label="LeetCode" value={profile?.leetcodeUrl} isUrl />
      <ProfileDisplayField label="Codeforces" value={profile?.codeforcesUrl} isUrl />
    </div>
  )

  const editContent = (
    <div className={styles.grid2}>
      {/* LinkedIn */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="linkedinUrl">
          LinkedIn
        </label>
        <input
          id="linkedinUrl"
          type="url"
          className={errors.linkedinUrl ? styles.inputError : styles.input}
          placeholder="https://linkedin.com/in/username"
          {...register('linkedinUrl')}
        />
        {errors.linkedinUrl ? (
          <span className={styles.errorMsg} role="alert">
            {errors.linkedinUrl.message}
          </span>
        ) : (
          <span className={styles.linkHelper}>Required for better recruiter matching.</span>
        )}
      </div>

      {/* GitHub */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="githubUrl">
          GitHub
        </label>
        <input
          id="githubUrl"
          type="url"
          className={errors.githubUrl ? styles.inputError : styles.input}
          placeholder="https://github.com/username"
          {...register('githubUrl')}
        />
        {errors.githubUrl ? (
          <span className={styles.errorMsg} role="alert">
            {errors.githubUrl.message}
          </span>
        ) : (
          <span className={styles.linkHelper}>Adding GitHub helps recruiters review your projects.</span>
        )}
      </div>

      {/* Portfolio */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="portfolioUrl">
          Portfolio
        </label>
        <input
          id="portfolioUrl"
          type="url"
          className={errors.portfolioUrl ? styles.inputError : styles.input}
          placeholder="https://mywebsite.com"
          {...register('portfolioUrl')}
        />
        {errors.portfolioUrl ? (
          <span className={styles.errorMsg} role="alert">
            {errors.portfolioUrl.message}
          </span>
        ) : (
          <span className={styles.linkHelper}>Share your personal website if available.</span>
        )}
      </div>

      {/* LeetCode */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="leetcodeUrl">
          LeetCode
        </label>
        <input
          id="leetcodeUrl"
          type="url"
          className={errors.leetcodeUrl ? styles.inputError : styles.input}
          placeholder="https://leetcode.com/u/username"
          {...register('leetcodeUrl')}
        />
        {errors.leetcodeUrl && (
          <span className={styles.errorMsg} role="alert">
            {errors.leetcodeUrl.message}
          </span>
        )}
      </div>

      {/* Codeforces */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="codeforcesUrl">
          Codeforces
        </label>
        <input
          id="codeforcesUrl"
          type="url"
          className={errors.codeforcesUrl ? styles.inputError : styles.input}
          placeholder="https://codeforces.com/profile/username"
          {...register('codeforcesUrl')}
        />
        {errors.codeforcesUrl && (
          <span className={styles.errorMsg} role="alert">
            {errors.codeforcesUrl.message}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <EditableSection
      title="Professional Links"
      icon={LinkIcon}
      isEmpty={isEmpty}
      viewContent={viewContent}
      editContent={editContent}
      onCancel={handleCancel}
    />
  )
}
