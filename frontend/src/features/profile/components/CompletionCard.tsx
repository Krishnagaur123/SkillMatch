import { CheckCircle } from 'lucide-react'
import { SectionCard } from '@/components/layout'
import { Skeleton } from '@/components/feedback'
import { useProfileCompletion } from '../hooks/useProfileHooks'
import styles from './CompletionCard.module.css'

// ── Radial ring ───────────────────────────────────────────────────────────────

const RADIUS = 40
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function ringColor(pct: number): string {
  if (pct <= 30) return '#EF4444' // red
  if (pct <= 60) return '#F59E0B' // orange
  if (pct <= 80) return '#EAB308' // yellow
  return '#10B981' // green
}

interface RingProps {
  percentage: number
}

function RadialRing({ percentage }: RingProps) {
  const clampedPct = Math.min(100, Math.max(0, percentage))
  const offset = CIRCUMFERENCE - (clampedPct / 100) * CIRCUMFERENCE
  const color = ringColor(clampedPct)

  return (
    <div className={styles.ringWrapper}>
      <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
        <g className={styles.ring}>
          <circle className={styles.ringTrack} cx="48" cy="48" r={RADIUS} />
          <circle
            className={styles.ringProgress}
            cx="48"
            cy="48"
            r={RADIUS}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            stroke={color}
          />
        </g>
      </svg>
      <div className={styles.ringLabel}>
        <span className={styles.ringPct}>{clampedPct}</span>
        <span className={styles.ringUnit}>%</span>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function CompletionCard() {
  const { data: completion, isLoading } = useProfileCompletion()

  if (isLoading) {
    return (
      <SectionCard title="Profile Completion" description="Track your profile completeness.">
        <Skeleton style={{ height: '200px', borderRadius: 'var(--radius-md)' }} />
      </SectionCard>
    )
  }

  if (!completion) return null

  const { completionPercentage, completedSections, missingSections, nextRecommendedAction } =
    completion

  return (
    <SectionCard
      title="Profile Completion"
      description="Complete your profile to improve opportunity matching."
    >
      <div className={styles.card}>
        {/* Ring + next action */}
        <div className={styles.header}>
          <RadialRing percentage={completionPercentage} />
          <div className={styles.info}>
            <span className={styles.label}>
              Complete {missingSections.length} more section{missingSections.length === 1 ? '' : 's'}
            </span>
            <div className={styles.nextActionWrapper}>
              <span className={styles.nextStepLabel}>Next Recommended Step</span>
              <p className={styles.nextAction}>{nextRecommendedAction}</p>
              <span className={styles.timeEstimate}>Typically takes 2 minutes</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        {(completedSections.length > 0 || missingSections.length > 0) && (
          <div className={styles.divider} />
        )}

        {/* Checklist */}
        <div className={styles.checklist}>
          {completedSections.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupTitle}>Completed</div>
              <ul className={styles.items}>
                {completedSections.map((section) => (
                  <li key={section} className={styles.itemDone}>
                    <CheckCircle size={13} className={styles.itemIcon} aria-hidden="true" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {missingSections.length > 0 && (
            <div className={styles.group}>
              <div className={styles.groupTitle}>Remaining</div>
              <ul className={styles.items}>
                {missingSections.map((section) => (
                  <li key={section} className={styles.item}>
                    <span className={styles.itemCircle} aria-hidden="true" />
                    {section}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  )
}
