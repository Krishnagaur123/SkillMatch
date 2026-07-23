import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { ApiErrorState } from '@/components/feedback'
import { useCareerAnalytics } from '@/hooks/useCareerAnalytics'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useResumes } from '@/hooks/useResumes'
import { CoverageHero } from '@/features/analytics/overview/CoverageHero'
import { LearningRoadmap } from '@/features/analytics/roadmap/LearningRoadmap'
import { MarketDemand } from '@/features/analytics/charts/MarketDemand'
import { StrengthsSection } from '@/features/analytics/strengths/StrengthsSection'
import { ResumeSuggestions } from '@/features/analytics/resume/ResumeSuggestions'
import { CareerInsights } from '@/features/analytics/insights/CareerInsights'
import { RecommendedNextStep } from '@/features/analytics/recommendation/RecommendedNextStep'
import { Map, TrendingUp, Award, FileText, Activity, CheckCircle, Circle, BarChart2, BookOpen, Target } from 'lucide-react'
import styles from './AnalyticsPage.module.css'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useCareerAnalytics()
  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  const { data: resumes, isLoading: resumesLoading } = useResumes()

  if (analyticsLoading || profileLoading || resumesLoading) {
    return (
      <PageContainer>
        <PageContent>
          <PageHeader 
            title="Career Analytics" 
            description="Career Intelligence Report"
          />
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  if (analyticsError) {
    return (
      <PageContainer>
        <PageContent>
          <PageHeader title="Career Analytics" description="Career Intelligence Report" />
          <ApiErrorState error={analyticsError} />
        </PageContent>
      </PageContainer>
    )
  }

  // Determine prerequisite state for contextual empty state
  const activeResume = resumes?.find(r => r.active)
  const hasResume = !!activeResume
  const hasTargetRoles = (userProfile?.targetRoles?.length ?? 0) > 0
  const missingPrerequisites = !hasResume || !hasTargetRoles

  if (missingPrerequisites) {
    const prereqs = [
      {
        id: 'resume',
        label: 'Resume Uploaded',
        done: hasResume,
        route: '/resumes',
        cta: 'Upload Resume',
      },
      {
        id: 'roles',
        label: 'Target Roles Selected',
        done: hasTargetRoles,
        route: '/profile',
        hash: '#target-roles',
        cta: 'Add Target Roles',
      },
    ]
    const nextPrereq = prereqs.find(p => !p.done)
    return (
      <PageContainer>
        <PageContent>
          <PageHeader title="Career Analytics" description="Career Intelligence Report" />
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <BarChart2 size={40} />
            </div>
            <h2 className={styles.emptyTitle}>Career Intelligence isn't available yet.</h2>
            <p className={styles.emptyDescription}>
              Complete the following to unlock personalized insights powered by your skills and target roles.
            </p>

            <ul className={styles.prereqList}>
              {prereqs.map(p => (
                <li key={p.id} className={`${styles.prereqItem} ${p.done ? styles.prereqDone : ''}`}>
                  {p.done
                    ? <CheckCircle size={16} className={styles.prereqIconDone} />
                    : <Circle size={16} className={styles.prereqIconPending} />
                  }
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>

            <div className={styles.unlockList}>
              <p className={styles.unlockTitle}>Complete the above to unlock:</p>
              <div className={styles.unlockItems}>
                {[
                  { icon: <BarChart2 size={14} />, label: 'Market Readiness Score' },
                  { icon: <Target size={14} />, label: 'Skill Gap Analysis' },
                  { icon: <BookOpen size={14} />, label: 'Learning Roadmap' },
                  { icon: <TrendingUp size={14} />, label: 'Career Insights' },
                ].map(item => (
                  <span key={item.label} className={styles.unlockChip}>
                    {item.icon}{item.label}
                  </span>
                ))}
              </div>
            </div>

            {nextPrereq && (
              <button
                type="button"
                className={styles.emptyAction}
                onClick={() => {
                  navigate(nextPrereq.route)
                  if (nextPrereq.hash) {
                    setTimeout(() => {
                      const el = document.getElementById(nextPrereq.hash!.slice(1))
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 300)
                  }
                }}
              >
                {nextPrereq.cta}
              </button>
            )}
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  if (!analytics) return null

  return (
    <PageContainer>
      <PageContent>
        <PageHeader 
          title="Career Analytics" 
          description="Career Intelligence Report" 
        />
        
        <div className={styles.container}>
          
          {/* Highest Emphasis */}
          <div className={styles.topSection}>
            <CoverageHero 
              coverage={analytics.coverage}
              resumeStatus={analytics.resumeInsights.length === 0 ? 'Resume Synced' : 'Needs Update'}
              learningRoadmap={analytics.learningRoadmap}
            />
          </div>

          <div className={styles.sectionCard} id="learning-roadmap">
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Map className={styles.sectionIcon} />
                  Learning Roadmap
                </h2>
                <p className={styles.sectionDescription}>Skills that provide the highest potential coverage gain for your target roles.</p>
              </div>
              <LearningRoadmap items={analytics.learningRoadmap} />
            </section>
          </div>

          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <TrendingUp className={styles.sectionIcon} />
                  Market Demand
                </h2>
                <p className={styles.sectionDescription}>Top 10 skills in demand across your target roles, weighted by frequency and importance.</p>
              </div>
              <MarketDemand skills={analytics.skillsInDemand} />
            </section>
          </div>

          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Award className={styles.sectionIcon} />
                  Current Strengths
                </h2>
                <p className={styles.sectionDescription}>These skills contribute the most to your overall career coverage.</p>
              </div>
              <StrengthsSection strengths={analytics.topStrengths} />
            </section>
          </div>

          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <FileText className={styles.sectionIcon} />
                  Resume Readiness
                </h2>
                <p className={styles.sectionDescription}>Skills present in your profile but missing from your active resume.</p>
              </div>
              <ResumeSuggestions insights={analytics.resumeInsights} />
            </section>
          </div>

          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <Activity className={styles.sectionIcon} />
                  Career Insights
                </h2>
              </div>
              <CareerInsights analytics={analytics} />
            </section>
          </div>

          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <RecommendedNextStep 
                analytics={analytics}
              />
            </section>
          </div>

        </div>
      </PageContent>
    </PageContainer>
  )
}
