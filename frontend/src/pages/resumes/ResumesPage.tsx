import { useState, useRef } from 'react'
import type { DragEvent, ChangeEvent, MouseEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  UploadCloud,
  Trash2,
  Calendar,
  Check,
  File,
  X,
  FileSpreadsheet,
} from 'lucide-react'
import {
  PageContainer,
  PageContent,
  PageHeader,
  SectionCard,
} from '@/components/layout'
import {
  Card,
  Button,
  SecondaryButton,
  StatusBadge,
  ConfirmationDialog,
  FormField,
  SubmitButton,
} from '@/components/common'
import {
  CardSkeleton,
  EmptyState,
  ErrorState,
} from '@/components/feedback'
import {
  useResumes,
  useActivateResume,
  useDeleteResume,
  useUploadResume,
} from '@/hooks/useResumes'
import { useUserProfile } from '@/hooks/useUserProfile'
import styles from './ResumesPage.module.css'

export default function ResumesPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Resumes list and profile queries
  const { data: resumes, isLoading, error, refetch } = useResumes()
  const { data: user } = useUserProfile()

  // Mutations
  const activateMutation = useActivateResume()
  const deleteMutation = useDeleteResume()
  const uploadMutation = useUploadResume()

  // Local Form state
  const [title, setTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateAndSetFile = (file: File) => {
    setValidationError(null)
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const allowedExtensions = ['.pdf', '.docx']
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
      setValidationError('Only PDF and DOCX file formats are accepted.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('File size exceeds the 10MB limit.')
      return
    }

    setSelectedFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleUploadSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedFile) return

    uploadMutation.mutate(
      { file: selectedFile, title: title.trim() || undefined },
      {
        onSuccess: () => {
          setSelectedFile(null)
          setTitle('')
          setValidationError(null)
        },
      }
    )
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null)
      },
    })
  }

  const handleCardClick = (id: string) => {
    navigate(`/resumes/${id}`)
  }

  const handleActionClick = (e: MouseEvent | KeyboardEvent) => {
    e.stopPropagation()
  }

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick(id)
    }
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
      })
    } catch {
      return dateString
    }
  }

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        <PageHeader
          title="Resume Management"
          description="You can manage multiple resumes. Upload new copies, parse extracted skills, and select your primary active resume for matches."
        />

        {error ? (
          <div className={styles.errorWrapper}>
            <ErrorState
              title="Failed to load resumes"
              message={error.message || 'An unexpected API error occurred.'}
              onRetry={refetch}
            />
          </div>
        ) : (
          <div className={styles.mainGrid}>
            {/* Left Column: Resumes list */}
            <div className={styles.leftColumn}>
              {isLoading ? (
                <div className={styles.skeletonList}>
                  <CardSkeleton />
                  <CardSkeleton />
                  <CardSkeleton />
                </div>
              ) : !resumes || resumes.length === 0 ? (
                <EmptyState
                  icon={<UploadCloud size={40} />}
                  title="No Resumes Found"
                  description="Upload your first resume version using the form panel to get started with job matching."
                />
              ) : (
                <div className={styles.resumesList}>
                  {resumes.map((resume) => (
                    <Card
                      key={resume.id}
                      variant="interactive"
                      className={[
                        styles.resumeCard,
                        resume.active ? styles.activeResumeCard : '',
                      ].filter(Boolean).join(' ')}
                      tabIndex={0}
                      role="button"
                      aria-label={`Resume: ${resume.title}, Status: ${resume.status}`}
                      onClick={() => handleCardClick(resume.id)}
                      onKeyDown={(e) => handleCardKeyDown(e, resume.id)}
                    >
                      <div className={styles.cardHeader}>
                        <div className={styles.cardTitleBlock}>
                          <FileText className={styles.docIcon} size={22} />
                          <div className={styles.titleInfo}>
                            <h3 className={styles.resumeTitle}>{resume.title || 'Untitled Resume'}</h3>
                            <span className={styles.resumeFileName}>{resume.fileName}</span>
                          </div>
                        </div>
                        <div className={styles.badgeRow}>
                          <StatusBadge status={resume.status.toLowerCase()} />
                          {resume.active && (
                            <span className={styles.activeBadge}>
                              <Check size={12} /> Active
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.cardMeta}>
                        <div className={styles.metaItem}>
                          <Calendar size={14} />
                          <span>Uploaded: {formatDate(resume.uploadedAt)}</span>
                        </div>
                        {/* Render size/skills if available on model */}
                        {typeof (resume as unknown as Record<string, unknown>).fileSize === 'number' && (
                          <div className={styles.metaItem}>
                            <span>Size: {formatBytes((resume as unknown as Record<string, unknown>).fileSize as number)}</span>
                          </div>
                        )}
                        {resume.active && user && (
                          <div className={styles.metaItem}>
                            <FileSpreadsheet size={14} />
                            <span>Parsed: {user.skillsCount} skills</span>
                          </div>
                        )}
                      </div>

                      <div className={styles.cardActions} onClick={handleActionClick} onKeyDown={handleActionClick}>
                        {!resume.active && (
                          <SecondaryButton
                            size="sm"
                            onClick={() => activateMutation.mutate(resume.id)}
                            disabled={activateMutation.isPending || resume.status === 'FAILED'}
                          >
                            Set Active
                          </SecondaryButton>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          className={styles.deleteBtn}
                          onClick={() => setDeleteId(resume.id)}
                          disabled={deleteMutation.isPending || resume.active}
                          aria-label={`Delete resume ${resume.title}`}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Upload Resume form */}
            <div className={styles.rightColumn}>
              <SectionCard title="Upload Resume">
                <form onSubmit={handleUploadSubmit} className={styles.uploadForm}>
                  <FormField label="Resume Title (Optional)" error={undefined}>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer CV"
                      className={styles.textInput}
                      disabled={uploadMutation.isPending}
                    />
                  </FormField>

                  <FormField label="File Upload" error={validationError || undefined} required>
                    <div
                      className={[
                        styles.dropzone,
                        dragActive ? styles.dropzoneActive : '',
                        selectedFile ? styles.dropzoneFilled : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !uploadMutation.isPending && fileInputRef.current?.click()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          fileInputRef.current?.click()
                        }
                      }}
                      tabIndex={uploadMutation.isPending ? -1 : 0}
                      role="button"
                      aria-label="Drag and drop file upload, accepts PDF or DOCX"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className={styles.fileInput}
                        disabled={uploadMutation.isPending}
                      />

                      {selectedFile ? (
                        <div className={styles.selectedFileBlock}>
                          <File className={styles.fileIcon} size={28} />
                          <div className={styles.fileDetails}>
                            <span className={styles.fileNameText}>{selectedFile.name}</span>
                            <span className={styles.fileSizeText}>{formatBytes(selectedFile.size)}</span>
                          </div>
                          <button
                            type="button"
                            className={styles.removeFileBtn}
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedFile(null)
                              setValidationError(null)
                            }}
                            disabled={uploadMutation.isPending}
                            aria-label="Remove selected file"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className={styles.dropzoneContent}>
                          <UploadCloud size={32} className={styles.uploadIcon} />
                          <span className={styles.dropText}>
                            Drag & drop your resume here, or <span className={styles.browseText}>browse</span>
                          </span>
                          <span className={styles.dropSubText}>Supports PDF, DOCX (Max 10MB)</span>
                        </div>
                      )}
                    </div>
                  </FormField>

                  <SubmitButton
                    isLoading={uploadMutation.isPending}
                    loadingLabel="Uploading..."
                    disabled={!selectedFile}
                    className={styles.uploadSubmitBtn}
                  >
                    Upload CV
                  </SubmitButton>
                </form>
              </SectionCard>
            </div>
          </div>
        )}

        <ConfirmationDialog
          isOpen={deleteId !== null}
          title="Delete Resume"
          description="Are you sure you want to delete this resume? This action cannot be undone and will remove all parsed skills associated with this document copy."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          isDestructive={true}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteId(null)}
        />
      </PageContent>
    </PageContainer>
  )
}
