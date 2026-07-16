import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import PageSpinner from '@/components/feedback/PageSpinner'
import PublicLayout from '@/app/layouts/PublicLayout'
import ProtectedLayout from '@/app/layouts/ProtectedLayout'

const LandingPage = lazy(() => import('@/pages/landing/LandingPage'))
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const ResumesPage = lazy(() => import('@/pages/resumes/ResumesPage'))
const ResumeDetailPage = lazy(() => import('@/pages/resumes/ResumeDetailPage'))
const OpportunitiesPage = lazy(() => import('@/pages/opportunities/OpportunitiesPage'))
const OpportunityDetailPage = lazy(() => import('@/pages/opportunities/OpportunityDetailPage'))
const ApplicationsPage = lazy(() => import('@/pages/applications/ApplicationsPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const CompaniesPage = lazy(() => import('@/pages/companies/CompaniesPage'))
const CompanyDetailPage = lazy(() => import('@/pages/companies/CompanyDetailPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/NotFoundPage'))

export default function AppRouter() {
  return (
    <Suspense fallback={<PageSpinner />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.LANDING} element={<LandingPage />} />
        </Route>

        <Route element={<ProtectedLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.RESUMES} element={<ResumesPage />} />
          <Route path={ROUTES.RESUME_DETAIL} element={<ResumeDetailPage />} />
          <Route path={ROUTES.OPPORTUNITIES} element={<OpportunitiesPage />} />
          <Route path={ROUTES.OPPORTUNITY_DETAIL} element={<OpportunityDetailPage />} />
          <Route path={ROUTES.APPLICATIONS} element={<ApplicationsPage />} />
          <Route path={ROUTES.ANALYTICS} element={<AnalyticsPage />} />
          <Route path={ROUTES.COMPANIES} element={<CompaniesPage />} />
          <Route path={ROUTES.COMPANY_DETAIL} element={<CompanyDetailPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  )
}
