import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { Building2 } from 'lucide-react'

export default function CompaniesPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Companies" description="Explore companies and their open roles." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<Building2 size={36} />}
            title="Explore Companies"
            description="A list of participating companies will appear here. Navigate to opportunities to see currently hiring offices."
            actionLabel="Browse Opportunities"
            onAction={() => navigate(ROUTES.OPPORTUNITIES)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
