import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Circle, Rocket, ChevronRight, Check } from 'lucide-react'
import { useUserProfile, useResumes } from '@/hooks'
import { ROUTES } from '@/constants/routes'
import styles from './GettingStartedCard.module.css'

interface ChecklistStep {
  id: string
  label: string
  description: string
  complete: boolean
  route: string
  hash?: string
}

export function GettingStartedCard() {
  const navigate = useNavigate()

  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  const { data: resumes, isLoading: resumesLoading } = useResumes()

  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(
    () => localStorage.getItem('onboardingCompleted') === 'true'
  )

  const hasResume = !!(resumes?.find((r) => r.active))
  const hasTargetRoles = (userProfile?.targetRoles?.length ?? 0) > 0

  const allComplete = hasResume && hasTargetRoles

  // Hide card permanently when user navigates away (component unmounts) while in success state
  useEffect(() => {
    if (allComplete && !isPermanentlyHidden) {
      return () => {
        localStorage.setItem('onboardingCompleted', 'true')
      }
    }
  }, [allComplete, isPermanentlyHidden])

  if (profileLoading || resumesLoading) return null
  if (isPermanentlyHidden) return null

  const handleSuccessAction = (route: string) => {
    localStorage.setItem('onboardingCompleted', 'true')
    setIsPermanentlyHidden(true)
    navigate(route)
  }

  if (allComplete) {
    return (
      <div className={styles.card} role="region" aria-label="Onboarding complete">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.iconSuccess}>
              🎉
            </span>
            <div>
              <h2 className={styles.title}>You're Ready!</h2>
              <p className={styles.subtitle}>Your Career Intelligence profile has been successfully set up.</p>
            </div>
          </div>
        </div>

        <div className={styles.successContent}>
          <p className={styles.successText}>You can now:</p>
          <ul className={styles.successList}>
            <li><Check size={16} className={styles.successCheck} /> View personalized Career Analytics</li>
            <li><Check size={16} className={styles.successCheck} /> Discover matching Opportunities</li>
            <li><Check size={16} className={styles.successCheck} /> Track your Applications</li>
          </ul>
        </div>

        <div className={styles.successActions}>
          <button
            type="button"
            className={styles.ctaPrimary}
            onClick={() => handleSuccessAction(ROUTES.ANALYTICS)}
          >
            View Career Analytics
          </button>
          <button
            type="button"
            className={styles.ctaSecondary}
            onClick={() => handleSuccessAction(ROUTES.OPPORTUNITIES)}
          >
            Browse Opportunities
          </button>
        </div>

        <div className={styles.tipSection}>
          <div className={styles.tipHeader}>
            <span className={styles.tipIcon}>💡</span>
            <span className={styles.tipTitle}>Tip</span>
          </div>
          <p className={styles.tipText}>
            Complete your profile (education, experience, links, and manual skills)
            to improve recommendation quality, opportunity matching, and career insights.
          </p>
          <button
            type="button"
            className={styles.tipAction}
            onClick={() => handleSuccessAction(ROUTES.PROFILE)}
          >
            Complete Profile →
          </button>
        </div>
      </div>
    )
  }

  const steps: ChecklistStep[] = [
    {
      id: 'resume',
      label: 'Upload Resume',
      description: 'Extract your skills automatically',
      complete: hasResume,
      route: ROUTES.RESUMES,
    },
    {
      id: 'roles',
      label: 'Add Target Roles',
      description: 'Personalize your opportunities and analytics',
      complete: hasTargetRoles,
      route: ROUTES.PROFILE,
      hash: '#target-roles',
    },
  ]

  const completedCount = steps.filter((s) => s.complete).length

  const nextStep = steps.find((s) => !s.complete)

  const handleContinue = () => {
    if (!nextStep) return
    if (nextStep.hash) {
      navigate(nextStep.route)
      // Scroll to anchor after navigation
      setTimeout(() => {
        const el = document.getElementById(nextStep.hash!.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      navigate(nextStep.route)
    }
  }

  const progressPct = Math.round((completedCount / steps.length) * 100)

  return (
    <div className={styles.card} role="region" aria-label="Getting started checklist">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.icon}>
            <Rocket size={18} />
          </span>
          <div>
            <h2 className={styles.title}>Getting Started</h2>
            <p className={styles.subtitle}>Let's build your Career Intelligence profile.</p>
          </div>
        </div>
        <div className={styles.progressBadge}>
          <span className={styles.progressCount}>{completedCount} of {steps.length}</span>
          <span className={styles.progressLabel}>completed</span>
        </div>
      </div>

      {/* Progress track */}
      <div className={styles.progressTrack} role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
        <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
      </div>

      {/* Checklist */}
      <ol className={styles.checklist} aria-label="Setup steps">
        {steps.map((step) => (
          <li
            key={step.id}
            className={`${styles.step} ${step.complete ? styles.stepDone : ''}`}
          >
            <span className={styles.stepIcon} aria-hidden="true">
              {step.complete
                ? <CheckCircle size={18} className={styles.iconDone} />
                : <Circle size={18} className={styles.iconPending} />
              }
            </span>
            <div className={styles.stepContent}>
              <span className={styles.stepLabel}>{step.label}</span>
              <span className={styles.stepDesc}>{step.description}</span>
            </div>
            {step === nextStep && (
              <span className={styles.nextBadge}>Next</span>
            )}
          </li>
        ))}
      </ol>

      {/* Footer */}
      <div className={styles.footer}>
        <p className={styles.estimate}>
          Estimated setup time: <strong>3 minutes</strong>
        </p>
        <button
          type="button"
          className={styles.cta}
          onClick={handleContinue}
          id="getting-started-continue-btn"
        >
          Continue Setup
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
