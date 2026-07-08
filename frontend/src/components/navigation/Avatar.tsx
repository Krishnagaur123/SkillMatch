interface AvatarProps {
  initials?: string
  size?: 'sm' | 'md'
}

const SIZE_CLASS: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'avatar--sm',
  md: 'avatar--md',
}

export default function Avatar({ initials, size = 'md' }: AvatarProps) {
  const derived = initials?.slice(0, 2).toUpperCase() ?? '?'

  return (
    <span
      className={['avatar', SIZE_CLASS[size]].join(' ')}
      aria-label={initials ? `Avatar for ${initials}` : 'Avatar'}
      role="img"
    >
      {derived}
    </span>
  )
}
