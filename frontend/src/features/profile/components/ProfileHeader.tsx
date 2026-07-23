import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'
import { User, CheckCircle2, Camera, Edit2, Loader2 } from 'lucide-react'
import { useProfileDetail, useProfileCompletion } from '../hooks/useProfileHooks'
import { useUploadAvatar, useRemoveAvatar, useUpdateUserProfile } from '@/hooks/useUserProfile'
import { Skeleton } from '@/components/feedback'
import { toastSuccess, toastError } from '@/utils/toast'
import styles from './ProfileHeader.module.css'

const getInitialsBgColor = (name: string) => {
  const colors = ['#f87171', '#fb923c', '#fbbf24', '#a3e635', '#4ade80', '#2dd4bf', '#38bdf8', '#818cf8', '#a78bfa', '#e879f9', '#f43f5e']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function ProfileHeader() {
  const { data: profile, isLoading: isProfileLoading } = useProfileDetail()
  const { data: completion, isLoading: isCompletionLoading } = useProfileCompletion()

  const [isEditingName, setIsEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState('')
  const [localAvatarPreview, setLocalAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar()
  const { mutate: removeAvatar, isPending: isRemovingAvatar } = useRemoveAvatar()
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUserProfile()

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toastError('File too large', 'Avatar must be less than 5MB')
      return
    }
    
    const objectUrl = URL.createObjectURL(file)
    setLocalAvatarPreview(objectUrl)

    uploadAvatar(file, {
      onSuccess: () => {
        toastSuccess('Profile photo updated successfully')
      },
      onError: (err: any) => {
        setLocalAvatarPreview(null)
        const msg = err.response?.data?.message || 'Failed to update photo'
        toastError('Upload failed', msg)
      },
      onSettled: () => {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    })
  }

  const handleRemoveAvatar = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    removeAvatar(undefined, {
      onSuccess: () => {
        setLocalAvatarPreview(null)
        toastSuccess('Profile photo removed')
      },
      onError: () => toastError('Failed to remove photo')
    })
  }

  const handleEditNameStart = () => {
    setEditNameValue(profile?.name || '')
    setIsEditingName(true)
  }

  const handleEditNameSave = () => {
    const trimmed = editNameValue.trim().replace(/\s+/g, ' ')
    
    if (trimmed.length < 2 || trimmed.length > 60) {
      toastError('Invalid length', 'Display name must be between 2 and 60 characters.')
      return
    }

    // Requires at least one alphabetic character (supporting unicode via \p{L} in JS with /u flag)
    if (!/\p{L}/u.test(trimmed)) {
      toastError('Invalid format', 'Display name must contain at least one letter.')
      return
    }

    updateProfile({ name: trimmed }, {
      onSuccess: () => {
        toastSuccess('Display name updated successfully')
        setIsEditingName(false)
      },
      onError: (err: any) => {
        const msg = err.response?.data?.message || 'Failed to update display name'
        toastError('Update failed', msg)
      }
    })
  }

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

  const currentAvatarUrl = localAvatarPreview || profile.profilePictureUrl
  const initialsColor = getInitialsBgColor(profile.name)
  const isAvatarLoading = isUploadingAvatar || isRemovingAvatar

  return (
    <div className={styles.header}>
      <div 
        className={styles.avatar} 
        style={!currentAvatarUrl ? { backgroundColor: initialsColor } : undefined}
      >
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={`${profile.name}'s avatar`}
            className={styles.avatarImg}
            referrerPolicy="no-referrer"
          />
        ) : (
          <User size={32} className={styles.avatarIcon} aria-hidden="true" style={{ color: 'white' }} />
        )}

        <div className={styles.avatarOverlay} tabIndex={0} role="button" aria-label="Change Profile Photo">
          {isAvatarLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <div className={styles.avatarActions}>
              <Camera size={16} />
              <span>Change</span>
              {currentAvatarUrl && (
                <button 
                  className={styles.removeBtn} 
                  onClick={handleRemoveAvatar}
                  disabled={isAvatarLoading}
                >
                  Remove
                </button>
              )}
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            className={styles.fileInput} 
            accept="image/jpeg, image/png, image/webp" 
            onChange={handleAvatarChange}
            disabled={isAvatarLoading}
            title="Upload new photo"
          />
        </div>
      </div>
      <div className={styles.info}>
        {isEditingName ? (
          <div className={styles.nameForm}>
            <input
              type="text"
              className={styles.nameInput}
              value={editNameValue}
              onChange={(e) => setEditNameValue(e.target.value)}
              disabled={isUpdatingProfile}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditNameSave()
                if (e.key === 'Escape') setIsEditingName(false)
              }}
            />
            <button 
              className={styles.saveBtn} 
              onClick={handleEditNameSave}
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? 'Saving...' : 'Save'}
            </button>
            <button 
              className={styles.cancelBtn} 
              onClick={() => setIsEditingName(false)}
              disabled={isUpdatingProfile}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className={styles.nameWrapper}>
            <h2 className={styles.name}>{profile.name}</h2>
            <button className={styles.editBtn} onClick={handleEditNameStart} aria-label="Edit display name">
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>
        )}
        
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
