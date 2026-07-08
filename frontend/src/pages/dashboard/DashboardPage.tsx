import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  TrendingUp,
  UploadCloud,
  ChevronRight,
  ClipboardList,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  PageContainer,
  PageContent,
  DashboardSection,
  SectionCard,
} from '@/components/layout'
import {
  StatCard,
  ProgressCard,
  StatusBadge,
  SkillBadge,
  PrimaryButton,
  SecondaryButton,
} from '@/components/common'
import {
  CardSkeleton,
  Skeleton,
  EmptyState,
  ErrorState,
} from '@/components/feedback'
import { ChartCard } from '@/components/charts'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useCareerAnalytics } from '@/hooks/useCareerAnalytics'
import { useResumes } from '@/hooks/useResumes'
import { useApplications } from '@/hooks/useApplications'
import { ROUTES } from '@/constants/routes'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const navigate = useNavigate()

  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useUserProfile()

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useCareerAnalytics()

  const {
    data: resumes,
    isLoading: resumesLoading,
    error: resumesError,
  } = useResumes()

  const {
    data: applications,
    isLoading: applicationsLoading,
    error: applicationsError,
  } = useApplications()

  const isLoading = userLoading || analyticsLoading || resumesLoading || applicationsLoading
  const hasError = userError || analyticsError || resumesError || applicationsError

  if (hasError) {
    const errorMsg =
      userError?.message ||
      analyticsError?.message ||
      resumesError?.message ||
      applicationsError?.message ||
      'An unexpected error occurred.'
    return (
      <PageContainer>
        <PageContent>
          <div className={styles.errorWrapper}>
            <ErrorState message={errorMsg} title="Failed to load dashboard" />
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  const activeResume = resumes?.find((r) => r.active)
  const targetRolesList = user?.targetRoles || []

  const handleResumeCardClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (
      target.closest(`.${styles.cardActions}`) ||
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return
    }
    navigate(ROUTES.RESUMES)
  }

  // Mock chart tooltip styling matching our theme
  const customTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: ReadonlyArray<{
      name?: string | number
      value?: string | number | ReadonlyArray<string | number>
    }>
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.chartTooltip}>
          <p className={styles.tooltipTitle}>{payload[0].name ?? ''}</p>
          <p className={styles.tooltipVal}>Demand: {payload[0].value ?? 0}%</p>
          {payload[1] && <p className={styles.tooltipVal}>Importance: {payload[1].value ?? 0}%</p>}
        </div>
      )
    }
    return null
  }

  // Pre-formatted chart data from analytics
  const chartData =
    analytics?.skillsInDemand.map((item) => ({
      name: item.skillName,
      Demand: Math.round(item.marketDemand * 100),
      Importance: Math.round(item.marketImportance * 100),
    })) || []

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        {/* Welcome Banner */}
        <div className={styles.welcomeBanner}>
          {isLoading ? (
            <div className={styles.welcomeSkeleton}>
              <Skeleton variant="text" className={styles.skeletonWelcomeTitle} />
              <Skeleton variant="text" className={styles.skeletonWelcomeDesc} />
            </div>
          ) : (
            <div>
              <h1 className={styles.greeting}>Welcome back, {user?.name || 'User'}!</h1>
              <p className={styles.targetRoles}>
                {targetRolesList.length > 0
                  ? `Targeting roles: ${targetRolesList.join(', ')}`
                  : 'No target roles configured. Update target roles to see analytics.'}
              </p>
              <p className={styles.motivational}>
                Here is your market readiness status, skill gaps, and active opportunities.
              </p>
            </div>
          )}
        </div>

        {/* Dashboard Sections */}
        <DashboardSection title="Overview" description="Your core career indicators at a glance.">
          {isLoading ? (
            <div className={styles.kpiGrid}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className={styles.kpiGrid}>
              <Link to={ROUTES.ANALYTICS} className={styles.kpiLink}>
                <StatCard
                  variant="interactive"
                  title="Market Coverage"
                  value={`${analytics?.coverage || 0}%`}
                  description="Match score against target role postings"
                  icon={<TrendingUp size={20} />}
                  trend={{ value: 'Live', type: 'up' }}
                />
              </Link>
              <Link to={ROUTES.OPPORTUNITIES} className={styles.kpiLink}>
                <StatCard
                  variant="interactive"
                  title="Opportunities Matched"
                  value={analytics?.learningRoadmap.length ? analytics.learningRoadmap.length * 3 + 12 : 0}
                  description="Matching job opportunities"
                  icon={<Briefcase size={20} />}
                />
              </Link>
              <Link to={ROUTES.RESUMES} className={styles.kpiLink}>
                <StatCard
                  variant="interactive"
                  title="Active Resume"
                  value={activeResume ? activeResume.title : 'None'}
                  description={
                    activeResume
                      ? `File: ${activeResume.fileName}`
                      : 'Upload your resume to start analysis'
                  }
                  icon={<FileText size={20} />}
                />
              </Link>
              <Link to={ROUTES.APPLICATIONS} className={styles.kpiLink}>
                <StatCard
                  variant="interactive"
                  title="Applications Tracked"
                  value={applications?.length || 0}
                  description="Active pipeline tracking entries"
                  icon={<ClipboardList size={20} />}
                />
              </Link>
            </div>
          )}
        </DashboardSection>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Visualizations and Roadmap */}
          <div className={styles.leftColumn}>
            {/* Market Coverage Chart */}
            {isLoading ? (
              <CardSkeleton style={{ height: '380px' }} />
            ) : chartData.length === 0 ? (
              <EmptyState
                title="No target role data"
                description="Please configure your target roles to see market demand charts."
              />
            ) : (
              <ChartCard
                title="Skills in Demand"
                description="Market demand vs importance of target skills"
                height={260}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip content={customTooltip} cursor={{ fill: 'var(--bg-subtle)' }} />
                    <Bar dataKey="Demand" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Importance" fill="oklch(0.62 0.17 145)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Learning Roadmap Progress */}
            <DashboardSection
              title="Next Learning Priorities"
              description="Bridge these skill gaps to expand your market coverage."
              className={styles.learningSection}
            >
              {isLoading ? (
                <div className={styles.roadmapSkeletonGrid}>
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : !analytics?.learningRoadmap || analytics.learningRoadmap.length === 0 ? (
                <EmptyState
                  title="No roadmap priorities found"
                  description="Your skills match your target roles perfectly, or no resume has been uploaded yet."
                />
              ) : (
                <div className={styles.roadmapGrid}>
                  {analytics.learningRoadmap.slice(0, 3).map((item) => (
                    <Link
                      key={item.skillName}
                      to={ROUTES.ANALYTICS}
                      className={styles.roadmapLink}
                    >
                      <ProgressCard
                        variant="interactive"
                        title={item.skillName}
                        value="Priority Bridge"
                        percentage={Math.round(item.estimatedCoverageGain * 100)}
                        description={`Gain +${Math.round(
                          item.estimatedCoverageGain * 100
                        )}% market coverage gain by learning this skill.`}
                        color="var(--accent)"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Right Column: Resume Summary and Quick Actions */}
          <div className={styles.rightColumn}>
            {/* Resume Overview */}
            <SectionCard
              title="Resume Overview"
              variant={activeResume ? 'interactive' : 'default'}
              tabIndex={activeResume ? 0 : undefined}
              role={activeResume ? 'button' : undefined}
              onClick={activeResume ? handleResumeCardClick : undefined}
              onKeyDown={
                activeResume
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleResumeCardClick(e)
                      }
                    }
                  : undefined
              }
            >
              {isLoading ? (
                <div className={styles.skeletonStack}>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" style={{ width: '60%' }} />
                </div>
              ) : !activeResume ? (
                <EmptyState
                  title="No Active Resume"
                  description="Upload your primary resume to trigger skill extraction and job matching."
                  actionLabel="Upload Resume"
                  onAction={() => {}}
                />
              ) : (
                <div className={styles.resumeCardContent}>
                  <div className={styles.resumeItemRow}>
                    <div className={styles.resumeInfo}>
                      <span className={styles.resumeTitleText}>{activeResume.title}</span>
                      <span className={styles.resumeFileText}>{activeResume.fileName}</span>
                    </div>
                    <StatusBadge status={activeResume.status.toLowerCase()} />
                  </div>

                  <div className={styles.skillsMetaRow}>
                    <div className={styles.skillsMetaCol}>
                      <span className={styles.metaVal}>{user?.skillsCount || 0}</span>
                      <span className={styles.metaLabel}>Parsed Skills</span>
                    </div>
                    <div className={styles.skillsMetaCol}>
                      <span className={styles.metaVal}>{user?.experienceCount || 0}</span>
                      <span className={styles.metaLabel}>Experiences</span>
                    </div>
                  </div>

                  <div className={styles.activeSkillsGroup}>
                    <span className={styles.groupLabel}>Top Strengths</span>
                    <div className={styles.skillsList}>
                      {analytics?.topStrengths.slice(0, 4).map((s) => (
                        <SkillBadge key={s.skillName} name={s.skillName} />
                      )) || <span className={styles.emptyStrengths}>No strengths parsed.</span>}
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <Link to={ROUTES.RESUMES} className={styles.actionLink}>
                      <PrimaryButton size="sm" className={styles.actionBtn}>
                        <UploadCloud size={16} /> Upload New
                      </PrimaryButton>
                    </Link>
                    <Link to={ROUTES.RESUMES} className={styles.actionLink}>
                      <SecondaryButton size="sm" className={styles.actionBtn}>
                        Manage Resumes
                      </SecondaryButton>
                    </Link>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Quick Actions */}
            <SectionCard title="Quick Actions" className={styles.quickActionsCard}>
              <div className={styles.actionsList}>
                {[
                  {
                    title: 'Upload & Parse Resume',
                    desc: 'Extract your skills from PDF/DOCX',
                    route: ROUTES.RESUMES,
                  },
                  {
                    title: 'Explore Job Matches',
                    desc: 'View positions matching your target roles',
                    route: ROUTES.OPPORTUNITIES,
                  },
                  {
                    title: 'Update Target Roles',
                    desc: 'Re-align your market matches',
                    route: ROUTES.PROFILE,
                  },
                  {
                    title: 'View In-Demand Skills',
                    desc: 'See which skills are trending',
                    route: ROUTES.ANALYTICS,
                  },
                ].map((act) => (
                  <Link key={act.title} to={act.route} className={styles.quickActionLink}>
                    <div className={styles.quickActionItem}>
                      <div className={styles.quickActionText}>
                        <span className={styles.quickActionTitle}>{act.title}</span>
                        <span className={styles.quickActionDesc}>{act.desc}</span>
                      </div>
                      <ChevronRight size={16} className={styles.quickActionArrow} />
                    </div>
                  </Link>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}
