import { X } from 'lucide-react'
import { SkillBadge, type SkillBadgeProps } from './Badge'
import styles from './RemovableSkillBadge.module.css'

export interface RemovableSkillBadgeProps extends SkillBadgeProps {
  onRemove?: () => void
}

export function RemovableSkillBadge({ onRemove, className, ...props }: RemovableSkillBadgeProps) {
  if (!onRemove) {
    return <SkillBadge className={className} {...props} />
  }

  return (
    <SkillBadge className={[styles.withRemove, className].filter(Boolean).join(' ')} {...props}>
      <button
        type="button"
        className={styles.removeButton}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        aria-label={`Remove ${props.name}`}
      >
        <X size={14} />
      </button>
    </SkillBadge>
  )
}
