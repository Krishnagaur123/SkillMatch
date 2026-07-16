import { useParams, useNavigate } from 'react-router-dom'
import { PageContainer, PageContent } from '@/components/layout'
import { ApiErrorState } from '@/components/feedback'
import { useApplicationDetail, useUpdateApplication, useDeleteApplication } from '@/hooks/useApplications'
import { ApplicationHeader } from '@/features/applications/components/ApplicationHeader'
import { StatusProgress } from '@/features/applications/components/StatusProgress'
import { QuickSummary } from '@/features/applications/components/QuickSummary'
import { NextAction } from '@/features/applications/components/NextAction'
import { NotesEditor } from '@/features/applications/components/NotesEditor'
import { DangerZone } from '@/features/applications/components/DangerZone'
import type { ApplicationStatus } from '@/types/application'
import styles from './ApplicationDetailPage.module.css'

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: application, isLoading, error } = useApplicationDetail(id!)
  const { mutateAsync: updateApplication } = useUpdateApplication(id!)
  const { mutateAsync: deleteApplication } = useDeleteApplication()

  if (isLoading) {
    return (
      <PageContainer>
        <PageContent>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  if (error || !application) {
    return (
      <PageContainer>
        <PageContent>
          <ApiErrorState error={error || new Error('Application not found')} />
        </PageContent>
      </PageContainer>
    )
  }

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    await updateApplication({ status: newStatus, notes: application.notes })
  }

  const handleNotesChange = async (newNotes: string) => {
    await updateApplication({ status: application.status, notes: newNotes })
  }

  const handleDelete = async () => {
    await deleteApplication(application.applicationId)
    navigate('/applications')
  }

  return (
    <PageContainer>
      <PageContent>
        <div className={styles.container}>
          <ApplicationHeader 
            application={application} 
            onStatusChange={handleStatusChange} 
          />

          <div className={styles.contentGrid}>
            <div className={styles.mainColumn}>
              <div className={styles.progressCard}>
                <h2 className={styles.sectionTitleProgress}>Application Progress</h2>
                <StatusProgress status={application.status} />
              </div>

              <div className={styles.card}>
                <h2 className={styles.sectionTitle}>Notes & Feedback</h2>
                <NotesEditor
                  key={application.notes || 'empty'}
                  notes={application.notes || ''}
                  onSave={handleNotesChange}
                />
              </div>

              <div className={styles.dangerCard}>
                <DangerZone onDelete={handleDelete} />
              </div>
            </div>

            <div className={styles.sidebar}>
              <NextAction status={application.status} />
              <QuickSummary application={application} />
            </div>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}
