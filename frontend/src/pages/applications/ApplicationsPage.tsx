import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { ClipboardList } from 'lucide-react'

export default function ApplicationsPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Applications" description="Track your job application statuses." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<ClipboardList size={36} />}
            title="No Active Applications"
            description="You haven't tracked any job applications yet. Discover open matches to start submitting."
            actionLabel="Browse Opportunities"
            onAction={() => navigate(ROUTES.OPPORTUNITIES)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
