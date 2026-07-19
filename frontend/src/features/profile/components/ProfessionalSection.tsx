import type { UseFormRegister, FieldErrors, UseFormResetField } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import { EditableSection } from './EditableSection'
import { ProfileDisplayField } from './ProfileDisplayField'
import type { ProfileFormValues, ProfileFormOutput } from '../schemas/profileSchema'
import type { UserProfileDetail } from '../services/profileApi'
import styles from './FormSection.module.css'

interface ProfessionalSectionProps {
  profile: UserProfileDetail | undefined
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  resetField: UseFormResetField<ProfileFormOutput>
}

export function ProfessionalSection({ profile, register, errors, resetField }: ProfessionalSectionProps) {
  const isEmpty = !profile?.headline && !profile?.about

  const handleCancel = () => {
    resetField('headline', { defaultValue: profile?.headline || undefined })
    resetField('about', { defaultValue: profile?.about || undefined })
  }

  const viewContent = (
    <div className={styles.grid1}>
      <ProfileDisplayField label="Professional Headline" value={profile?.headline} />
      <ProfileDisplayField label="About" value={profile?.about} />
    </div>
  )

  const editContent = (
    <div className={styles.grid1}>
      {/* Headline */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="headline">
          Headline
        </label>
        <input
          id="headline"
          type="text"
          className={errors.headline ? styles.inputError : styles.input}
          placeholder="e.g. Backend Developer | Spring Boot | React"
          maxLength={120}
          {...register('headline')}
        />
        {errors.headline ? (
          <span className={styles.errorMsg} role="alert">
            {errors.headline.message}
          </span>
        ) : (
          <span className={styles.helperMsg}>
            A short line that describes your professional identity. Shown at the top of your profile.
          </span>
        )}
      </div>

      {/* About */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="about">
          About
        </label>
        <textarea
          id="about"
          className={errors.about ? styles.inputError : styles.textarea}
          placeholder="Write a short introduction about yourself and your career goals..."
          maxLength={1000}
          {...register('about')}
        />
        {errors.about ? (
          <span className={styles.errorMsg} role="alert">
            {errors.about.message}
          </span>
        ) : (
          <span className={styles.helperMsg}>
            Tell employers who you are, what you are passionate about, and what you are looking for.
          </span>
        )}
      </div>
    </div>
  )

  return (
    <EditableSection
      title="Professional"
      icon={Sparkles}
      isEmpty={isEmpty}
      viewContent={viewContent}
      editContent={editContent}
      onCancel={handleCancel}
    />
  )
}
