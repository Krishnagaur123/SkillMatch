import { User, CheckCircle2 } from 'lucide-react'
import { useProfileDetail, useProfileCompletion } from '../hooks/useProfileHooks'
import { Skeleton } from '@/components/feedback'
import styles from './ProfileHeader.module.css'

export function ProfileHeader() {
  const { data: profile, isLoading: isProfileLoading } = useProfileDetail()
  const { data: completion, isLoading: isCompletionLoading } = useProfileCompletion()

  if (isProfileLoading || isCompletionLoading) {
    return (
      <div className={styles.header}>
        <Skeleton style={{ width: '64px', height: '64px', borderRadius: '50%' }} />
        <div className={styles.info}>
          <Skeleton style={{ width: '200px', height: '24px' }} />
          <Skeleton style={{ width: '300px', height: '16px', marginTop: '4px' }} />
          <Skeleton style={{ width: '150px', height: '16px', marginTop: '4px' }} />
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className={styles.header}>
      <div className={styles.avatar}>
        {profile.profilePictureUrl ? (
          <img
            src={profile.profilePictureUrl}
            alt={`${profile.name}'s avatar`}
            className={styles.avatarImg}
            referrerPolicy="no-referrer"
          />
        ) : (
          <User size={32} className={styles.avatarIcon} aria-hidden="true" />
        )}
      </div>
      <div className={styles.info}>
        <h2 className={styles.name}>{profile.name}</h2>
        
        {/* Headline */}
        {profile.headline ? (
          <p className={styles.headline}>{profile.headline}</p>
        ) : (
          <p className={styles.headlineEmpty}>Add a professional headline</p>
        )}

        <div className={styles.metaRow}>
          <p className={styles.email}>{profile.email}</p>
          {completion && (
            <div className={styles.badge}>
              <CheckCircle2 size={12} className={styles.badgeIcon} />
              <span>{completion.completionPercentage}% Complete</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
