import { PageContainer, PageContent, PageHeader, Section } from '@/components/layout'
import { ProfileSummary, TargetRolesSection, ManualSkillsSection } from '@/features/profile'
import {
  useUserProfile,
  useAllTargetRoles,
  useUserSkills,
  useResumes,
  useResumeDetail,
} from '@/hooks'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: profile } = useUserProfile()
  const { data: allRoles = [] } = useAllTargetRoles()
  const { data: userSkills = [] } = useUserSkills()
  const { data: resumes = [] } = useResumes()
  
  const activeResume = resumes.find(r => r.active)
  const { data: activeResumeDetail } = useResumeDetail(activeResume?.id ?? '')

  return (
    <PageContainer>
      <PageContent>
        <PageHeader
          title="Profile"
          description="Manage your professional profile to optimize opportunity matching."
        />

        <div className={styles.sections}>
          <div className={styles.topGrid}>
            <Section>
              <ProfileSummary />
            </Section>
          </div>

          <Section>
            <TargetRolesSection
              allRoles={allRoles}
              currentRoleNames={profile?.targetRoles || []}
            />
          </Section>

          <Section>
            <ManualSkillsSection
              skills={userSkills}
              resumeSkills={activeResumeDetail?.skills ?? []}
              hasActiveResume={!!activeResume}
              resumeCount={profile?.skillsCount ?? 0}
            />
          </Section>
        </div>
      </PageContent>
    </PageContainer>
  )
}
