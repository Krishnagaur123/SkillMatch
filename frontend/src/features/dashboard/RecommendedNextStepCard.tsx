import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart2, CheckCircle2 } from 'lucide-react'
import { useProfileCompletion } from '@/features/profile'
import { ROUTES } from '@/constants/routes'
import styles from './RecommendedNextStepCard.module.css'

export function RecommendedNextStepCard() {
  const navigate = useNavigate()
  const { data: completion, isLoading } = useProfileCompletion()

  if (isLoading) return null

  const pct = Math.min(100, Math.round(completion?.completionPercentage ?? 0))
  const profileDone = pct >= 100

  const completionMessage =
    pct < 40 ? 'Just getting started — add your resume and target roles.' :
    pct < 70 ? 'Good progress — a few more details to go.' :
    pct < 100 ? 'Almost there — complete your profile to unlock full analytics.' :
    'Your profile is complete and fully optimised.'

  return (
    <div className={styles.card} role="complementary" aria-label="Recommended next step">
      <div className={styles.primarySection}>
        <div className={styles.label}>Recommended Next Step</div>
        <div className={styles.content}>
          <span className={styles.icon}>
            <BarChart2 size={20} />
          </span>
          <div className={styles.text}>
            <p className={styles.title}>View your Career Analytics</p>
            <p className={styles.description}>
              Your personalized insights are ready — see your market readiness and skill gaps.
            </p>
          </div>
        </div>
        <button
          type="button"
          className={styles.cta}
          onClick={() => navigate(ROUTES.ANALYTICS)}
          id="recommended-next-step-btn"
        >
          View Analytics
          <ArrowRight size={15} />
        </button>
      </div>

      <div className={styles.spacer} />

      <div className={styles.completionSection}>
        <div className={styles.completionHeader}>
          <span className={styles.completionLabel}>Profile Completion</span>
          {profileDone ? (
            <span className={styles.completionDone}>
              <CheckCircle2 size={13} />
              Complete
            </span>
          ) : (
            <span className={styles.completionPct}>{pct}%</span>
          )}
        </div>
        <div className={styles.progressTrack}>
          <div
            className={profileDone ? styles.progressBarDone : styles.progressBar}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className={styles.completionMsg}>{completionMessage}</p>
        {!profileDone && (
          <button
            type="button"
            className={styles.completionCta}
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            Complete Profile <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
