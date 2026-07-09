import { useState, useMemo } from 'react'
import { PageContainer, PageContent, PageHeader, Section, SectionHeader } from '@/components/layout'
import { Button, ConfirmationDialog } from '@/components/common'
import { ProfileSummary, TargetRolesSection, ManualSkillsSection } from '@/features/profile'
import {
  useUserProfile,
  useAllTargetRoles,
  useUpdateUserProfile,
  useUserSkills,
  useAddUserSkill,
  useRemoveUserSkill,
  useResumes,
  useResumeDetail,
} from '@/hooks'
import { Pencil, X, Check, Loader2 } from 'lucide-react'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: profile } = useUserProfile()
  const { data: allRoles = [] } = useAllTargetRoles()
  const { data: userSkills = [] } = useUserSkills()
  const { data: resumes = [] } = useResumes()
  const activeResume = resumes.find(r => r.active)
  const { data: activeResumeDetail } = useResumeDetail(activeResume?.id ?? '')

  const { mutateAsync: updateProfileAsync } = useUpdateUserProfile()
  const { mutateAsync: addSkillAsync } = useAddUserSkill()
  const { mutateAsync: removeSkillAsync } = useRemoveUserSkill()

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  
  const [localName, setLocalName] = useState('')
  const [localRoleIds, setLocalRoleIds] = useState<string[]>([])
  const [localSkills, setLocalSkills] = useState<{ skillId: string; skillName: string }[]>([])

  const initialRoleIds = useMemo(
    () =>
      allRoles
        .filter(role => (profile?.targetRoles ?? []).includes(role.name))
        .map(r => r.id),
    [allRoles, profile?.targetRoles]
  )

  const initialName = profile?.name ?? ''

  const hasDirtyChanges = useMemo(() => {
    if (!isEditing) return false
    
    if (initialName !== localName.trim() && localName.trim() !== '') return true

    const initialRoleSet = new Set(initialRoleIds)
    const localRoleSet = new Set(localRoleIds)
    const rolesDirty =
      initialRoleSet.size !== localRoleSet.size ||
      [...initialRoleSet].some(id => !localRoleSet.has(id))
    
    if (rolesDirty) return true

    const initialSkillSet = new Set(userSkills.map(s => s.skillId))
    const localSkillSet = new Set(localSkills.map(s => s.skillId))
    const skillsDirty =
      initialSkillSet.size !== localSkillSet.size ||
      [...initialSkillSet].some(id => !localSkillSet.has(id))
      
    return skillsDirty
  }, [isEditing, initialName, localName, initialRoleIds, localRoleIds, userSkills, localSkills])

  const handleEdit = () => {
    setLocalName(initialName)
    setLocalRoleIds([...initialRoleIds])
    setLocalSkills([...userSkills])
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (hasDirtyChanges) {
      setShowUnsavedDialog(true)
    } else {
      setIsEditing(false)
    }
  }

  const handleConfirmDiscard = () => {
    setShowUnsavedDialog(false)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!localName.trim()) return // Don't save empty name
    
    setIsSaving(true)
    try {
      const promises: Promise<unknown>[] = []

      // Always send name and roles if there are dirty changes, or even just to be safe
      promises.push(updateProfileAsync({ 
        name: localName.trim(), 
        targetRoleIds: localRoleIds 
      }))

      const originalSkillIds = new Set(userSkills.map(s => s.skillId))
      const localSkillIds = new Set(localSkills.map(s => s.skillId))
      const toAdd = [...localSkillIds].filter(id => !originalSkillIds.has(id))
      const toRemove = [...originalSkillIds].filter(id => !localSkillIds.has(id))
      
      toAdd.forEach(id => promises.push(addSkillAsync({ skillId: id })))
      toRemove.forEach(id => promises.push(removeSkillAsync(id)))

      const results = await Promise.allSettled(promises)
      const failed = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      
      if (failed.length > 0) {
        console.error('Failed to save some profile changes:', failed)
        alert('Some changes could not be saved. Please check the console and try again.')
      } else {
        setIsEditing(false)
      }
    } finally {
      setIsSaving(false)
    }
  }

  const displayRoleIds = isEditing ? localRoleIds : initialRoleIds
  const displaySkills = isEditing ? localSkills : userSkills

  const headerActions = isEditing ? (
    <div className={styles.headerActions}>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleCancel}
        disabled={isSaving}
        leftIcon={<X size={14} />}
      >
        Cancel
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={handleSave}
        disabled={isSaving || !hasDirtyChanges || !localName.trim()}
        leftIcon={
          isSaving ? (
            <Loader2 size={14} className={styles.spinning} />
          ) : (
            <Check size={14} />
          )
        }
      >
        {isSaving ? 'Saving…' : 'Save Changes'}
      </Button>
    </div>
  ) : (
    <Button variant="secondary" size="sm" onClick={handleEdit} leftIcon={<Pencil size={14} />}>
      Edit Profile
    </Button>
  )

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title="Profile"
          description="Manage your personal information and career settings."
          actions={headerActions}
        />

        {isEditing && (
          <div className={styles.editBanner}>
            <span className={styles.editBannerDot} />
            <span>
              {hasDirtyChanges
                ? 'You have unsaved changes — save or discard before leaving.'
                : 'Editing profile — make changes and click Save Changes.'}
            </span>
          </div>
        )}

        <div className={styles.sections}>
          <Section>
            <SectionHeader
              title="Profile Information"
              description="Your contact details, active resume, and profile completeness."
            />
            <div className={styles.sectionContent}>
              <ProfileSummary 
                isEditing={isEditing}
                localName={localName}
                onNameChange={setLocalName}
              />
            </div>
          </Section>

          <Section>
            <SectionHeader
              title="Career Preferences"
              description="Target roles optimize opportunity matching and vacancy alerts."
            />
            <div className={styles.sectionContent}>
              <TargetRolesSection
                isEditing={isEditing}
                roleIds={displayRoleIds}
                onRoleIdsChange={setLocalRoleIds}
                allRoles={allRoles}
              />
            </div>
          </Section>

          <Section>
            <SectionHeader
              title="Effective Skills"
              description="Your complete skill profile combining resume extraction and manual additions."
            />
            <div className={styles.sectionContent}>
              <ManualSkillsSection
                isEditing={isEditing}
                skills={displaySkills}
                onSkillsChange={setLocalSkills}
                resumeSkills={activeResumeDetail?.skills ?? []}
                hasActiveResume={!!activeResume}
                resumeCount={profile?.skillsCount ?? 0}
                manualCount={displaySkills.length}
                onEditClick={handleEdit}
              />
            </div>
          </Section>
        </div>
      </PageContent>

      <ConfirmationDialog
        isOpen={showUnsavedDialog}
        title="Discard unsaved changes?"
        description="You have unsaved changes to your profile. Discarding will revert all edits made in this session."
        confirmLabel="Discard Changes"
        isDestructive={true}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowUnsavedDialog(false)}
      />
    </PageContainer>
  )
}
