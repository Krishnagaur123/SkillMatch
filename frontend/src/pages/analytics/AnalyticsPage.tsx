import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Analytics" description="Insights on your career progression." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<BarChart3 size={36} />}
            title="Analytics Overview"
            description="Detailed analytics will appear here after parsing your experiences. Navigate to the dashboard for your active career overview."
            actionLabel="Go to Dashboard"
            onAction={() => navigate(ROUTES.DASHBOARD)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
