import type { UseFormRegister, FieldErrors, UseFormResetField } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import { EditableSection } from './EditableSection'
import { ProfileDisplayField } from './ProfileDisplayField'
import type { ProfileFormValues, ProfileFormOutput } from '../schemas/profileSchema'
import type { UserProfileDetail } from '../services/profileApi'
import styles from './FormSection.module.css'

interface ContactSectionProps {
  profile: UserProfileDetail | undefined
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  resetField: UseFormResetField<ProfileFormOutput>
}

export function ContactSection({ profile, register, errors, resetField }: ContactSectionProps) {
  const isEmpty =
    !profile?.phoneNumber &&
    !profile?.city &&
    !profile?.state &&
    !profile?.country

  const handleCancel = () => {
    resetField('phoneNumber', { defaultValue: profile?.phoneNumber || undefined })
    resetField('city', { defaultValue: profile?.city || undefined })
    resetField('state', { defaultValue: profile?.state || undefined })
    resetField('country', { defaultValue: profile?.country || undefined })
  }

  const viewContent = (
    <div className={styles.grid2}>
      <ProfileDisplayField label="Phone" value={profile?.phoneNumber} />
      <ProfileDisplayField label="City" value={profile?.city} />
      <ProfileDisplayField label="State / Province" value={profile?.state} />
      <ProfileDisplayField label="Country" value={profile?.country} />
    </div>
  )

  const editContent = (
    <div className={styles.grid2}>
      {/* Phone Number */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          className={errors.phoneNumber ? styles.inputError : styles.input}
          placeholder="e.g. +1 234 567 8900"
          {...register('phoneNumber')}
        />
        {errors.phoneNumber && (
          <span className={styles.errorMsg} role="alert">
            {errors.phoneNumber.message}
          </span>
        )}
      </div>

      {/* City */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="city">
          City
        </label>
        <input
          id="city"
          type="text"
          className={styles.input}
          placeholder="e.g. San Francisco"
          {...register('city')}
        />
      </div>

      {/* State */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="state">
          State / Province
        </label>
        <input
          id="state"
          type="text"
          className={styles.input}
          placeholder="e.g. California"
          {...register('state')}
        />
      </div>

      {/* Country */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="country">
          Country
        </label>
        <input
          id="country"
          type="text"
          className={styles.input}
          placeholder="e.g. United States"
          {...register('country')}
        />
      </div>
    </div>
  )

  return (
    <EditableSection
      title="Contact"
      icon={MapPin}
      isEmpty={isEmpty}
      viewContent={viewContent}
      editContent={editContent}
      onCancel={handleCancel}
    />
  )
}
