import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
  FileCode,
  Trash2,
  Check,
  User,
  Settings,
} from 'lucide-react'
import {
  PageContainer,
  PageContent,
  SectionCard,
} from '@/components/layout'
import {
  StatCard,
  Button,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
  SkillBadge,
  ConfirmationDialog,
} from '@/components/common'
import {
  PageLoader,
  ResourceNotFoundState,
} from '@/components/feedback'
import {
  useResumeDetail,
  useActivateResume,
  useDeleteResume,
} from '@/hooks/useResumes'
import { ROUTES } from '@/constants/routes'
import styles from './ResumeDetailPage.module.css'

export default function ResumeDetailPage() {
  const { resumeId } = useParams<{ resumeId: string }>()
  const navigate = useNavigate()

  const { data: resume, isLoading, error, refetch } = useResumeDetail(resumeId || '')

  const activateMutation = useActivateResume()
  const deleteMutation = useDeleteResume()

  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleActivate = () => {
    if (!resumeId) return
    activateMutation.mutate(resumeId, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  const handleDeleteConfirm = () => {
    if (!resumeId) return
    deleteMutation.mutate(resumeId, {
      onSuccess: () => {
        navigate(ROUTES.RESUMES)
      },
    })
  }

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return <PageLoader />
  }

  if (error || !resume) {
    return (
      <PageContainer>
        <PageContent>
          <div className={styles.backWrapper}>
            <Link to={ROUTES.RESUMES} className={styles.backLink}>
              <ArrowLeft size={16} /> Back to Resumes
            </Link>
          </div>
          <ResourceNotFoundState
            title="Resume Not Found"
            description="The resume details you are looking for could not be found or retrieved."
            actionLabel="Return to Resumes"
            onAction={() => navigate(ROUTES.RESUMES)}
          />
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        {/* Navigation & Header */}
        <div className={styles.headerArea}>
          <Link to={ROUTES.RESUMES} className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Resume Management
          </Link>

          <div className={styles.titleWrapper}>
            <div className={styles.titleInfo}>
              <FileText className={styles.docIcon} size={28} />
              <div>
                <h1 className={styles.title}>{resume.title || 'Untitled Resume'}</h1>
                <p className={styles.subtitle}>File: {resume.fileName}</p>
              </div>
            </div>

            <div className={styles.badgeRow}>
              <StatusBadge status={resume.status.toLowerCase()} />
              {resume.active && (
                <span className={styles.activeBadge}>
                  <Check size={12} /> Active CV
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Summary Cards Grid */}
        <div className={styles.kpiGrid}>
          <StatCard
            title="Parsed Skills"
            value={resume.skills.length}
            description="Identified core competencies"
            icon={<CheckCircle size={20} />}
          />
          <StatCard
            title="Work Experiences"
            value={resume.experienceCount}
            description="Parsed professional entries"
            icon={<User size={20} />}
          />
          <StatCard
            title="Education Entries"
            value={resume.educationCount}
            description="Degrees & certificates"
            icon={<FileCode size={20} />}
          />
          <StatCard
            title="Active Match Status"
            value={resume.active ? 'Active' : 'Inactive'}
            description={
              resume.active
                ? 'Used for matching analytics'
                : 'Not used in matches'
            }
            icon={<Settings size={20} />}
          />
        </div>

        {/* Main Content Details Grid */}
        <div className={styles.mainGrid}>
          {/* Left Column: Extracted Skills */}
          <div className={styles.leftColumn}>
            <SectionCard
              title="Extracted Skills"
              description="These skills were parsed directly from your resume text index. Select any skill to view matches (future detail view)."
            >
              {resume.skills.length === 0 ? (
                <p className={styles.emptyText}>No skills were parsed from this resume copy.</p>
              ) : (
                <div className={styles.skillsWrapper}>
                  {resume.skills.map((skill) => (
                    <SkillBadge key={skill} name={skill} />
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* Right Column: Actions and Insights */}
          <div className={styles.rightColumn}>
            {/* Related Actions */}
            <SectionCard title="Resume Actions">
              <div className={styles.actionsList}>
                {!resume.active && (
                  <PrimaryButton
                    className={styles.actionBtn}
                    onClick={handleActivate}
                    disabled={activateMutation.isPending || resume.status === 'FAILED'}
                  >
                    <Check size={16} /> Set as Active CV
                  </PrimaryButton>
                )}
                <Link to={ROUTES.PROFILE} className={styles.actionLink}>
                  <SecondaryButton className={styles.actionBtn}>
                    Configure Target Roles
                  </SecondaryButton>
                </Link>
                <Button
                  variant="secondary"
                  className={[styles.actionBtn, styles.deleteBtn].join(' ')}
                  onClick={() => setDeleteOpen(true)}
                  disabled={deleteMutation.isPending || resume.active}
                >
                  <Trash2 size={16} /> Delete Resume Version
                </Button>
              </div>
            </SectionCard>

            {/* Resume Insights */}
            <SectionCard title="Resume Insights">
              <div className={styles.insightsList}>
                {resume.status === 'ANALYZED' && (
                  <div className={styles.insightItem}>
                    <CheckCircle className={styles.insightSuccessIcon} size={18} />
                    <div className={styles.insightText}>
                      <span className={styles.insightTitle}>Parsed Successfully</span>
                      <span className={styles.insightDesc}>
                        Resume syntax index matches general parsed structures cleanly.
                      </span>
                    </div>
                  </div>
                )}
                {resume.active ? (
                  <div className={styles.insightItem}>
                    <CheckCircle className={styles.insightSuccessIcon} size={18} />
                    <div className={styles.insightText}>
                      <span className={styles.insightTitle}>Analytics Contribution</span>
                      <span className={styles.insightDesc}>
                        This CV contributes to your live dashboard career analytics score.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.insightItem}>
                    <AlertCircle className={styles.insightInfoIcon} size={18} />
                    <div className={styles.insightText}>
                      <span className={styles.insightTitle}>Inactive Copy</span>
                      <span className={styles.insightDesc}>
                        Set this copy as active to calculate target job fit matches.
                      </span>
                    </div>
                  </div>
                )}
                <div className={styles.insightItem}>
                  <AlertCircle className={styles.insightInfoIcon} size={18} />
                  <div className={styles.insightText}>
                    <span className={styles.insightTitle}>File Specifications</span>
                    <span className={styles.insightDesc}>
                      Size: {formatBytes(resume.fileSize)} | Uploaded: {formatDate(resume.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={deleteOpen}
          title="Delete Resume Copy"
          description="Are you sure you want to permanently delete this resume version? All parsed metadata, skills count, and parsing structures for this copy will be permanently deleted."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDestructive={true}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteOpen(false)}
        />
      </PageContent>
    </PageContainer>
  )
}
