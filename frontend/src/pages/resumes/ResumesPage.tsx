import { useNavigate } from 'react-router-dom'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { EmptyState } from '@/components/feedback'
import { ROUTES } from '@/constants/routes'
import { UploadCloud } from 'lucide-react'

export default function ResumesPage() {
  const navigate = useNavigate()

  return (
    <PageContainer>
      <PageContent>
        <PageHeader title="Resumes" description="Manage your resumes and CV versions." />
        <div style={{ marginTop: '2rem' }}>
          <EmptyState
            icon={<UploadCloud size={36} />}
            title="Upload Your Resume"
            description="Upload and analyze your primary resume file to unlock career matched roles and analytics insights on your profile dashboard."
            actionLabel="Return to Dashboard"
            onAction={() => navigate(ROUTES.DASHBOARD)}
          />
        </div>
      </PageContent>
    </PageContainer>
  )
}
