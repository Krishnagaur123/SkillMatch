import { Link } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { ApiErrorState } from '@/components/feedback'
import { useCareerAnalytics } from '@/hooks/useCareerAnalytics'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useResumes } from '@/hooks/useResumes'
import { CoverageHero } from '@/features/analytics/overview/CoverageHero'
import { CareerSnapshot } from '@/features/analytics/overview/CareerSnapshot'
import { KPIOverview } from '@/features/analytics/overview/KPIOverview'
import { LearningRoadmap } from '@/features/analytics/roadmap/LearningRoadmap'
import { MarketDemand } from '@/features/analytics/charts/MarketDemand'
import { StrengthsSection } from '@/features/analytics/strengths/StrengthsSection'
import { ResumeSuggestions } from '@/features/analytics/resume/ResumeSuggestions'
import { CareerInsights } from '@/features/analytics/insights/CareerInsights'
import { OverallRecommendation } from '@/features/analytics/recommendation/OverallRecommendation'
import { getOverallRecommendation, getCareerSnapshotSummary } from '@/features/analytics/utils'
import { Map, TrendingUp, Award, FileText, Activity, LayoutDashboard } from 'lucide-react'
import styles from './AnalyticsPage.module.css'

export default function AnalyticsPage() {
  const { data: analytics, isLoading: analyticsLoading, error: analyticsError } = useCareerAnalytics()
  const { data: userProfile, isLoading: profileLoading } = useUserProfile()
  const { data: resumes, isLoading: resumesLoading } = useResumes()

  if (analyticsLoading || profileLoading || resumesLoading) {
    return (
      <PageContainer>
        <PageHeader 
          title="Career Analytics" 
          description="Career Intelligence Report"
        />
        <PageContent>
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
        <PageHeader title="Career Analytics" description="Career Intelligence Report" />
        <PageContent>
          <ApiErrorState error={analyticsError} />
        </PageContent>
      </PageContainer>
    )
  }

  // Handle empty states gracefully
  if (!userProfile?.targetRoles || userProfile.targetRoles.length === 0) {
    return (
      <PageContainer>
        <PageHeader title="Career Analytics" description="Career Intelligence Report" />
        <PageContent>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Target Roles Required</h2>
            <p className={styles.emptyDescription}>
              Career Analytics requires at least one target role to compare your skills against market demand.
            </p>
            <Link to="/profile" className={styles.emptyAction}>Go to Profile</Link>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  const activeResume = resumes?.find(r => r.active)
  if (!activeResume) {
    return (
      <PageContainer>
        <PageHeader title="Career Analytics" description="Career Intelligence Report" />
        <PageContent>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Active Resume Required</h2>
            <p className={styles.emptyDescription}>
              Career Analytics works best when you have an active resume uploaded. We use this to analyze your skill coverage.
            </p>
            <Link to="/resumes" className={styles.emptyAction}>Go to Resume Management</Link>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  if (!analytics) {
    return null
  }

  const { recommendation, explanation } = getOverallRecommendation(
    analytics.coverage,
    analytics.resumeInsights.length > 0
  )

  const topLearningSkill = [...analytics.learningRoadmap]
    .sort((a, b) => b.estimatedCoverageGain - a.estimatedCoverageGain)[0]?.skillName

  const summary = getCareerSnapshotSummary(userProfile.targetRoles, topLearningSkill)

  return (
    <PageContainer>
      <PageHeader 
        title="Career Analytics" 
        description="Career Intelligence Report" 
      />
      
      <PageContent>
        <div className={styles.container}>
          
          {/* Highest Emphasis */}
          <div className={styles.topSection}>
            <CoverageHero 
              coverage={analytics.coverage} 
              targetRoles={userProfile.targetRoles} 
              summary={summary}
              nextBestAction={topLearningSkill ? {
                skillName: topLearningSkill,
                coverageGain: analytics.learningRoadmap[0].estimatedCoverageGain
              } : undefined}
            />
            <KPIOverview
              totalSkills={userProfile.skillsCount}
              targetRoles={userProfile.targetRoles.length}
              resumeStatus={analytics.resumeInsights.length === 0 ? 'Resume Synced' : 'Needs Update'}
              resumeGaps={analytics.resumeInsights.length}
            />
          </div>
          
          <div className={styles.sectionCard}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <LayoutDashboard className={styles.sectionIcon} />
                  Career Snapshot
                </h2>
              </div>
              <CareerSnapshot
                targetRoles={userProfile.targetRoles}
                coverage={analytics.coverage}
                resumeStatus={analytics.resumeInsights.length === 0 ? 'Resume Synced' : 'Needs Update'}
                nextLearningPriority={topLearningSkill}
                overallRecommendation={recommendation}
              />
            </section>
          </div>

          <div className={styles.sectionCard}>
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
              <OverallRecommendation 
                recommendation={recommendation}
                explanation={explanation}
              />
            </section>
          </div>

        </div>
      </PageContent>
    </PageContainer>
  )
}
