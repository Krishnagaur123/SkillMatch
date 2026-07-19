import type { UseFormRegister, FieldErrors, UseFormResetField } from 'react-hook-form'
import { GraduationCap } from 'lucide-react'
import { EditableSection } from './EditableSection'
import { ProfileDisplayField } from './ProfileDisplayField'
import type { ProfileFormValues, ProfileFormOutput } from '../schemas/profileSchema'
import type { UserProfileDetail } from '../services/profileApi'
import styles from './FormSection.module.css'

interface EducationSectionProps {
  profile: UserProfileDetail | undefined
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  resetField: UseFormResetField<ProfileFormOutput>
}

export function EducationSection({ profile, register, errors, resetField }: EducationSectionProps) {
  const isEmpty =
    !profile?.institutionName &&
    !profile?.degreeName &&
    !profile?.fieldOfStudy &&
    !profile?.graduationYear &&
    !profile?.cgpa

  const handleCancel = () => {
    resetField('institutionName', { defaultValue: profile?.institutionName || undefined })
    resetField('degreeName', { defaultValue: profile?.degreeName || undefined })
    resetField('fieldOfStudy', { defaultValue: profile?.fieldOfStudy || undefined })
    resetField('graduationYear', { defaultValue: profile?.graduationYear || undefined })
    resetField('cgpa', { defaultValue: profile?.cgpa || undefined })
  }

  const viewContent = (
    <div className={styles.grid2}>
      <ProfileDisplayField label="Institution" value={profile?.institutionName} />
      <ProfileDisplayField label="Degree" value={profile?.degreeName} />
      <ProfileDisplayField label="Field of Study" value={profile?.fieldOfStudy} />
      <ProfileDisplayField label="Graduation Year" value={profile?.graduationYear} />
      <ProfileDisplayField label="CGPA" value={profile?.cgpa} />
    </div>
  )

  const editContent = (
    <div className={styles.grid2}>
      {/* Institution Name */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="institutionName">
          Institution Name
        </label>
        <input
          id="institutionName"
          type="text"
          className={styles.input}
          placeholder="e.g. Indian Institute of Technology Delhi"
          {...register('institutionName')}
        />
      </div>

      {/* Degree */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="degreeName">
          Degree
        </label>
        <input
          id="degreeName"
          type="text"
          className={styles.input}
          placeholder="e.g. Bachelor of Technology"
          {...register('degreeName')}
        />
      </div>

      {/* Field of Study */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="fieldOfStudy">
          Field of Study
        </label>
        <input
          id="fieldOfStudy"
          type="text"
          className={styles.input}
          placeholder="e.g. Computer Science and Engineering"
          {...register('fieldOfStudy')}
        />
      </div>

      {/* Graduation Year */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="graduationYear">
          Graduation Year
        </label>
        <input
          id="graduationYear"
          type="number"
          className={errors.graduationYear ? styles.inputError : styles.input}
          placeholder="e.g. 2024"
          min={1950}
          max={new Date().getFullYear() + 10}
          {...register('graduationYear')}
        />
        {errors.graduationYear && (
          <span className={styles.errorMsg} role="alert">
            {errors.graduationYear.message}
          </span>
        )}
      </div>

      {/* CGPA */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="cgpa">
          CGPA
        </label>
        <input
          id="cgpa"
          type="number"
          step="0.01"
          min={0}
          max={10}
          className={errors.cgpa ? styles.inputError : styles.input}
          placeholder="e.g. 8.5"
          {...register('cgpa')}
        />
        {errors.cgpa && (
          <span className={styles.errorMsg} role="alert">
            {errors.cgpa.message}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <EditableSection
      title="Education"
      icon={GraduationCap}
      isEmpty={isEmpty}
      viewContent={viewContent}
      editContent={editContent}
      onCancel={handleCancel}
    />
  )
}
