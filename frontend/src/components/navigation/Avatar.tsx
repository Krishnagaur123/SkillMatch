import { useState } from 'react'
import styles from './Avatar.module.css'

export interface AvatarProps {
  src?: string
  initials?: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
}

const SIZE_CLASS: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
}

export default function Avatar({ src, initials, size = 'md', online = false }: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const derived = initials?.slice(0, 2).toUpperCase() ?? '?'

  const showImage = src && !hasError

  return (
    <div className={[styles.wrapper, SIZE_CLASS[size]].join(' ')}>
      <div className={[styles.avatar, SIZE_CLASS[size]].join(' ')}>
        {showImage ? (
          <img
            src={src}
            alt={initials ? `Avatar for ${initials}` : 'Avatar'}
            className={styles.image}
            onError={() => setHasError(true)}
          />
        ) : (
          <span
            aria-label={initials ? `Avatar for ${initials}` : 'Avatar'}
            role="img"
          >
            {derived}
          </span>
        )}
      </div>
      {online && <div className={styles.onlineIndicator} aria-label="User is online" />}
    </div>
  )
}
