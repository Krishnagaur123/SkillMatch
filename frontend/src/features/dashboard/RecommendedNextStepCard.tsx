import { useNavigate } from 'react-router-dom'
import { ArrowRight, UploadCloud, Target, UserCheck, BarChart2, Briefcase, Sparkles } from 'lucide-react'
import { useUserProfile, useResumes, useCareerAnalytics } from '@/hooks'
import { ROUTES } from '@/constants/routes'
import styles from './RecommendedNextStepCard.module.css'

interface NextStep {
  icon: React.ReactNode
  title: string
  description: string
  cta: string
  route: string
  hash?: string
}

export function RecommendedNextStepCard() {
  const navigate = useNavigate()

  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  const { data: resumes, isLoading: resumesLoading } = useResumes()
  const { data: analytics, isLoading: analyticsLoading } = useCareerAnalytics()

  if (profileLoading || resumesLoading || analyticsLoading) return null

  const hasResume = !!(resumes?.find((r) => r.active))
  const hasTargetRoles = (userProfile?.targetRoles?.length ?? 0) > 0
  const profileComplete = (userProfile?.profileCompletionPercentage ?? 0) >= 80
  const analyticsReady = !!(analytics && hasResume && hasTargetRoles)

  // Priority-ordered recommendation logic
  let step: NextStep

  if (!hasResume) {
    step = {
      icon: <UploadCloud size={20} />,
      title: 'Upload your resume',
      description: 'Extract your skills automatically and unlock career insights.',
      cta: 'Go to Resumes',
      route: ROUTES.RESUMES,
    }
  } else if (!hasTargetRoles) {
    step = {
      icon: <Target size={20} />,
      title: 'Choose your target roles',
      description: "Tell SkillMatch what you're aiming for to get personalized analytics and matches.",
      cta: 'Add Target Roles',
      route: ROUTES.PROFILE,
      hash: '#target-roles',
    }
  } else if (!profileComplete) {
    step = {
      icon: <UserCheck size={20} />,
      title: 'Complete your profile',
      description: 'A complete profile unlocks better matching and all analytics features.',
      cta: 'Update Profile',
      route: ROUTES.PROFILE,
    }
  } else if (analyticsReady) {
    step = {
      icon: <BarChart2 size={20} />,
      title: 'View your Career Analytics',
      description: 'Your personalized insights are ready — see your market readiness and skill gaps.',
      cta: 'View Analytics',
      route: ROUTES.ANALYTICS,
    }
  } else if (hasResume && hasTargetRoles && profileComplete) {
    step = {
      icon: <Briefcase size={20} />,
      title: 'Browse matching opportunities',
      description: 'Explore positions matched to your skills and target roles.',
      cta: 'Browse Opportunities',
      route: ROUTES.OPPORTUNITIES,
    }
  } else {
    step = {
      icon: <Sparkles size={20} />,
      title: 'Keep improving your profile',
      description: 'Add more skills and experiences to improve your match scores.',
      cta: 'View Profile',
      route: ROUTES.PROFILE,
    }
  }

  const handleClick = () => {
    if (step.hash) {
      navigate(step.route)
      setTimeout(() => {
        const el = document.getElementById(step.hash!.slice(1))
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    } else {
      navigate(step.route)
    }
  }

  return (
    <div className={styles.card} role="complementary" aria-label="Recommended next step">
      <div className={styles.label}>Recommended Next Step</div>
      <div className={styles.content}>
        <span className={styles.icon}>{step.icon}</span>
        <div className={styles.text}>
          <p className={styles.title}>{step.title}</p>
          <p className={styles.description}>{step.description}</p>
        </div>
      </div>
      <button
        type="button"
        className={styles.cta}
        onClick={handleClick}
        id="recommended-next-step-btn"
      >
        {step.cta}
        <ArrowRight size={15} />
      </button>
    </div>
  )
}
