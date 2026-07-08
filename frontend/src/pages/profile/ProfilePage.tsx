import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { User } from 'lucide-react'

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Profile" description="Manage your personal information and skills." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<User size={36} />}
            title="Profile Settings"
            description="Manage your profile information and career settings. Return to the dashboard to monitor progress."
            actionLabel="Return to Dashboard"
            onAction={() => navigate(ROUTES.DASHBOARD)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
