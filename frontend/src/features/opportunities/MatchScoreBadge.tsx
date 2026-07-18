import { Badge } from '@/components/common/Badge'
import styles from './MatchScoreBadge.module.css'

interface MatchScoreBadgeProps {
  score: number
  className?: string
}

export function MatchScoreBadge({ score, className }: MatchScoreBadgeProps) {
  let variant: 'success' | 'brand' | 'warning' | 'error' | 'neutral'
  let scoreClass: string

  if (score >= 90) {
    variant = 'success'
    scoreClass = styles.excellent
  } else if (score >= 75) {
    variant = 'brand'
    scoreClass = styles.strong
  } else if (score >= 60) {
    variant = 'warning'
    scoreClass = styles.moderate
  } else {
    variant = 'error'
    scoreClass = styles.weak
  }

  return (
    <Badge
      variant={variant}
      className={[styles.root, scoreClass, className].filter(Boolean).join(' ')}
    >
      <span className={styles.score}>{score}%</span>
      <span className={styles.label}>Match</span>
    </Badge>
  )
}
