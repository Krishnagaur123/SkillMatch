import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Briefcase,
  TrendingUp,
  UploadCloud,
  ChevronRight,
  ClipboardList,
  Target,
  MapPin,
  ArrowRight,
} from 'lucide-react'
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
  MatchBadge,
} from '@/components/common'
import {
  CardSkeleton,
  Skeleton,
  EmptyState,
  ErrorState,
} from '@/components/feedback'
import { CompanyLogo } from '@/components/common/CompanyLogo'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useCareerAnalytics } from '@/hooks/useCareerAnalytics'
import { useResumes } from '@/hooks/useResumes'
import { useApplications } from '@/hooks/useApplications'
import { useRecommendedOpportunities } from '@/hooks/useOpportunities'
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

  const {
    data: opportunitiesData,
    isLoading: opportunitiesLoading,
  } = useRecommendedOpportunities({
    size: 3,
    sort: 'matchPercentage,desc',
  })

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
  const coveragePct = analytics?.coverage ?? 0
  const topOpportunities = opportunitiesData?.content.slice(0, 3) ?? []

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

  const formatEmploymentType = (type: string) =>
    type?.toLowerCase().replace('_', ' ') || 'Full time'

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
        <DashboardSection title="Overview" description="Your core career indicators at a glance." className={styles.overviewSection}>
          {isLoading ? (
            <div className={styles.kpiGrid}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : (
            <div className={styles.kpiGrid}>
              <a href={ROUTES.ANALYTICS} className={styles.kpiLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.ANALYTICS) }}>
                <StatCard
                  variant="interactive"
                  title="Market Coverage"
                  value={`${coveragePct}%`}
                  description="Match score against target role postings"
                  icon={<TrendingUp size={20} />}
                  trend={{ value: 'Live', type: 'up' }}
                />
              </a>
              <a href={ROUTES.OPPORTUNITIES} className={styles.kpiLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.OPPORTUNITIES) }}>
                <StatCard
                  variant="interactive"
                  title="Matching Opportunities"
                  value={opportunitiesData?.totalElements ?? 0}
                  description="Opportunities matched to your target roles"
                  icon={<Briefcase size={20} />}
                />
              </a>
              <a href={ROUTES.RESUMES} className={styles.kpiLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.RESUMES) }}>
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
              </a>
              <a href={ROUTES.APPLICATIONS} className={styles.kpiLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.APPLICATIONS) }}>
                <StatCard
                  variant="interactive"
                  title="Applications Tracked"
                  value={applications?.length || 0}
                  description="Active pipeline tracking entries"
                  icon={<ClipboardList size={20} />}
                />
              </a>
            </div>
          )}
        </DashboardSection>

        {/* Resume Overview + Recommended Next Step */}
        <div className={styles.resumePanel}>
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
                    <span className={styles.metaLabel}>Parsed Experiences</span>
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
                  <a href={ROUTES.RESUMES} className={styles.actionLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.RESUMES) }}>
                    <PrimaryButton size="sm" className={styles.actionBtn}>
                      <UploadCloud size={16} /> Upload New
                    </PrimaryButton>
                  </a>
                  <a href={ROUTES.RESUMES} className={styles.actionLink} onClick={(e) => { e.preventDefault(); navigate(ROUTES.RESUMES) }}>
                    <SecondaryButton size="sm" className={styles.actionBtn}>
                      Manage Resumes
                    </SecondaryButton>
                  </a>
                </div>
              </div>
            )}
          </SectionCard>

          <div className={styles.nextStepWrapper}>
            <RecommendedNextStepCard />
          </div>
        </div>

        {/* Quick Actions */}
        <SectionCard title="Quick Actions" variant="elevated" className={styles.quickActionsCard}>
          <div className={styles.actionsList}>
            {quickActions.map((act) => (
              <a key={act.title} href={act.route} className={styles.quickActionLink} onClick={(e) => { e.preventDefault(); navigate(act.route) }}>
                <div className={styles.quickActionItem}>
                  <span className={styles.quickActionIcon}>{act.icon}</span>
                  <div className={styles.quickActionText}>
                    <span className={styles.quickActionTitle}>{act.title}</span>
                    <span className={styles.quickActionDesc}>{act.desc}</span>
                  </div>
                  <ChevronRight size={16} className={styles.quickActionArrow} />
                </div>
              </a>
            ))}
          </div>
        </SectionCard>

        {/* Your Top Opportunities */}
        <SectionCard
          title="Your Top Opportunities"
          description="Your strongest current matches."
          variant="elevated"
          className={styles.opportunitiesCard}
        >
          {opportunitiesLoading ? (
            <div className={styles.opportunitiesGrid}>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : topOpportunities.length === 0 ? (
            <EmptyState
              title="No opportunities found"
              description="Configure your target roles and upload a resume to see matched opportunities."
              actionLabel="Go to Profile"
              onAction={() => navigate(ROUTES.PROFILE)}
            />
          ) : (
            <div className={styles.opportunitiesModule}>
              <div className={styles.opportunitiesGrid}>
                {topOpportunities.map((opp) => (
                  <div key={opp.opportunityId} className={styles.opportunityMiniCard}>
                    <div className={styles.miniCardHeader}>
                      <CompanyLogo
                        src={opp.company.logoUrl}
                        name={opp.company.name}
                        className={styles.miniCardLogo}
                      />
                      <div className={styles.miniCardTitles}>
                        <span className={styles.miniCardTitle}>{opp.title}</span>
                        <span className={styles.miniCardCompany}>{opp.company.name}</span>
                      </div>
                      <MatchBadge score={opp.matchPercentage} className={styles.miniCardBadge} />
                    </div>
                    <div className={styles.miniCardMeta}>
                      <span className={styles.miniCardMetaItem}>
                        <MapPin size={12} />
                        {opp.location || 'Remote'}
                      </span>
                      <span className={styles.miniCardMetaItem}>
                        <Briefcase size={12} />
                        {formatEmploymentType(opp.employmentType)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.opportunitiesOverlay}>
                <button
                  type="button"
                  className={styles.exploreBtn}
                  onClick={() => navigate(ROUTES.OPPORTUNITIES)}
                  aria-label="Explore all opportunities"
                >
                  Explore Opportunities <ArrowRight size={16} />
                </button>
              </div>

              <div className={styles.exploreMobileFallback}>
                <button
                  type="button"
                  className={styles.exploreBtnMobile}
                  onClick={() => navigate(ROUTES.OPPORTUNITIES)}
                >
                  Explore all opportunities <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </SectionCard>
      </PageContent>
    </PageContainer>
  )
}
