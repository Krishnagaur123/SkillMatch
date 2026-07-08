import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { Briefcase } from 'lucide-react'

export default function OpportunitiesPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Opportunities" description="Explore job opportunities matched to your profile." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<Briefcase size={36} />}
            title="Configure Target Roles"
            description="Opportunities are calculated based on your target roles. Adjust your profile to see relevant matches."
            actionLabel="Update Target Roles"
            onAction={() => navigate(ROUTES.PROFILE)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
