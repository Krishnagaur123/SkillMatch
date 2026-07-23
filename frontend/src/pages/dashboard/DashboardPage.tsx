import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  TrendingUp,
  UploadCloud,
  ChevronRight,
  ClipboardList,
  Target,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  PageContainer,
  PageContent,
  DashboardSection,
  SectionCard,
} from '@/components/layout'
import {
  StatCard,
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
import { GettingStartedCard } from '@/features/dashboard/GettingStartedCard'
import { RecommendedNextStepCard } from '@/features/dashboard/RecommendedNextStepCard'
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

  // Bar chart tooltip
  const barTooltip = ({
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

  // Bar chart data — skills in demand
  const chartData =
    analytics?.skillsInDemand.map((item) => ({
      name: item.skillName,
      Demand: Math.round(item.marketDemand * 100),
      Importance: Math.round(item.marketImportance * 100),
    })) || []

  // Donut chart data — market coverage
  const coveragePct = analytics?.coverage ?? 0
  const donutData = [
    { name: 'Covered', value: coveragePct },
    { name: 'Missing', value: Math.max(0, 100 - coveragePct) },
  ]

  // Quick actions with icons
  const quickActions = [
    {
      title: 'Upload & Parse Resume',
      desc: 'Extract your skills from PDF/DOCX',
      route: ROUTES.RESUMES,
      icon: <UploadCloud size={16} />,
    },
    {
      title: 'Explore Job Matches',
      desc: 'View positions matching your target roles',
      route: ROUTES.OPPORTUNITIES,
      icon: <Briefcase size={16} />,
    },
    {
      title: 'Update Target Roles',
      desc: 'Re-align your market matches',
      route: ROUTES.PROFILE,
      icon: <Target size={16} />,
    },
    {
      title: 'View In-Demand Skills',
      desc: 'See which skills are trending',
      route: ROUTES.ANALYTICS,
      icon: <TrendingUp size={16} />,
    },
  ]

  // Derive priority level from marketDemand
  const getPriorityLabel = (demand: number): string => {
    if (demand >= 0.8) return 'High Impact'
    if (demand >= 0.6) return 'Recommended'
    if (demand >= 0.4) return 'Medium'
    return 'Optional'
  }

  const getPriorityClass = (demand: number): string => {
    if (demand >= 0.8) return styles.priorityCritical
    if (demand >= 0.6) return styles.priorityHigh
    if (demand >= 0.4) return styles.priorityMedium
    return styles.priorityLow
  }

  // Estimate learning time from marketImportance (heuristic)
  const getEstimatedHours = (importance: number): string => {
    const hours = Math.round(importance * 40)
    if (hours <= 4) return `~${hours}h`
    if (hours <= 16) return `~${hours}h`
    return `~${Math.round(hours / 8)} days`
  }

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        {/* Compact Welcome Banner */}
        <div className={styles.welcomeBanner}>
          {isLoading ? (
            <div className={styles.welcomeSkeleton}>
              <Skeleton variant="text" className={styles.skeletonWelcomeTitle} />
              <Skeleton variant="text" className={styles.skeletonWelcomeDesc} />
            </div>
          ) : (
            <div className={styles.welcomeInner}>
              <div>
                <h1 className={styles.greeting}>Welcome back, {user?.name || 'User'}</h1>
                <p className={styles.targetRoles}>
                  {targetRolesList.length > 0
                    ? targetRolesList.join(' · ')
                    : 'No target roles configured — update your profile to see analytics.'}
                </p>
              </div>
              <p className={styles.motivational}>
                Market readiness · Skill gaps · Active opportunities
              </p>
            </div>
          )}
        </div>

        {/* Getting Started — only shown during onboarding */}
        <GettingStartedCard />

        {/* KPI Cards */}
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
                  value={`${coveragePct}%`}
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
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Market Coverage — Donut Chart */}
            {isLoading ? (
              <CardSkeleton style={{ height: '280px' }} />
            ) : (
              <ChartCard
                variant="elevated"
                title="Market Coverage"
                description="Overall skill coverage against your target roles"
                height={220}
              >
                <div className={styles.donutWrapper}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        cx="50%"
                        cy="50%"
                        innerRadius="62%"
                        outerRadius="80%"
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        <Cell fill="var(--color-brand)" />
                        <Cell fill="var(--border-default)" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className={styles.donutCenter}>
                    <span className={styles.donutValue}>{coveragePct}%</span>
                    <span className={styles.donutLabel}>Market Ready</span>
                  </div>
                </div>
                <div className={styles.donutLegend}>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--color-brand)' }} />
                    Covered ({coveragePct}%)
                  </span>
                  <span className={styles.legendItem}>
                    <span className={styles.legendDot} style={{ backgroundColor: 'var(--border-default)' }} />
                    Missing ({Math.max(0, 100 - coveragePct)}%)
                  </span>
                </div>
              </ChartCard>
            )}

            {/* Skills in Demand — Bar Chart */}
            {isLoading ? (
              <CardSkeleton style={{ height: '300px' }} />
            ) : chartData.length === 0 ? (
              <EmptyState
                title="No target role data"
                description="Please configure your target roles to see market demand charts."
              />
            ) : (
              <ChartCard
                variant="elevated"
                title="Skills in Demand"
                description="Market demand vs importance for your target skills"
                height={260}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 40 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      angle={-35}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip content={barTooltip} cursor={{ fill: 'var(--surface-hover)' }} />
                    <Bar dataKey="Demand" fill="var(--color-brand)" radius={[3, 3, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="Importance" fill="var(--text-secondary)" radius={[3, 3, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Learning Priorities */}
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
                  {analytics.learningRoadmap.slice(0, 3).map((item) => {
                    // Fix: estimatedCoverageGain is already a decimal (e.g. 0.12 = 12%)
                    // Do NOT multiply by 100 again if the value is already a percentage
                    const gainPct = item.estimatedCoverageGain > 1
                      ? Math.round(item.estimatedCoverageGain)
                      : Math.round(item.estimatedCoverageGain * 100)

                    return (
                      <Link
                        key={item.skillName}
                        to={ROUTES.ANALYTICS}
                        className={styles.roadmapLink}
                      >
                        <article className={styles.priorityCard}>
                          <div className={styles.priorityCardHeader}>
                            <span className={styles.prioritySkillName}>{item.skillName}</span>
                            <span className={[styles.priorityBadge, getPriorityClass(item.marketDemand)].join(' ')}>
                              {getPriorityLabel(item.marketDemand)}
                            </span>
                          </div>

                          <div className={styles.priorityStats}>
                            <div className={styles.priorityStat}>
                              <span className={styles.priorityStatValue}>+{gainPct}%</span>
                              <span className={styles.priorityStatLabel}>Coverage Gain</span>
                            </div>
                            <div className={styles.priorityStat}>
                              <span className={styles.priorityStatValue}>{getEstimatedHours(item.marketImportance)}</span>
                              <span className={styles.priorityStatLabel}>Est. Time</span>
                            </div>
                          </div>

                          <div className={styles.priorityFooter}>
                            <span className={styles.priorityAction}>View in Analytics →</span>
                          </div>
                        </article>
                      </Link>
                    )
                  })}
                </div>
              )}
            </DashboardSection>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {/* Resume Overview */}
            <SectionCard
              title="Resume Overview"
              variant={activeResume ? 'interactive' : 'elevated'}
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
                  onAction={() => navigate(ROUTES.RESUMES)}
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

            {/* Recommended Next Step */}
            <RecommendedNextStepCard />

            {/* Quick Actions */}
            <SectionCard title="Quick Actions" variant="elevated" className={styles.quickActionsCard}>
              <div className={styles.actionsList}>
                {quickActions.map((act) => (
                  <Link key={act.title} to={act.route} className={styles.quickActionLink}>
                    <div className={styles.quickActionItem}>
                      <span className={styles.quickActionIcon}>{act.icon}</span>
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
