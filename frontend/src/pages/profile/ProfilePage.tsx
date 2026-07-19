import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PageContainer, PageContent } from '@/components/layout'
import { SubmitButton } from '@/components/common/Form'
import { toastSuccess, toastError } from '@/utils/toast'
import {
  ProfileHeader,
  CompletionCard,
  ProfessionalSection,
  EducationSection,
  ExperienceSection,
  ContactSection,
  ProfessionalLinksSection,
  useProfileDetail,
  useUpdateProfileDetail,
  profileSchema,
  type ProfileFormValues,
  type ProfileFormOutput,
} from '@/features/profile'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfileDetail()
  const { mutateAsync: updateProfile, isPending } = useUpdateProfileDetail()

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues, any, ProfileFormOutput>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
  })

  // Populate form when data loads
  useEffect(() => {
    if (profile) {
      reset({
        headline: profile.headline || '',
        about: profile.about || '',
        institutionName: profile.institutionName || '',
        degreeName: profile.degreeName || '',
        fieldOfStudy: profile.fieldOfStudy || '',
        graduationYear: profile.graduationYear || '',
        cgpa: profile.cgpa || '',
        experienceLevel: profile.experienceLevel || '',
        currentOrganization: profile.currentOrganization || '',
        preferredWorkMode: profile.preferredWorkMode || '',
        openToWork: profile.openToWork || false,
        phoneNumber: profile.phoneNumber || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || '',
        linkedinUrl: profile.linkedinUrl || '',
        githubUrl: profile.githubUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        leetcodeUrl: profile.leetcodeUrl || '',
        codeforcesUrl: profile.codeforcesUrl || '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormOutput) => {
    try {
      await updateProfile(data)
      toastSuccess('Profile updated', 'Your profile changes have been saved successfully.')
      // Reset form with new data to clear the dirty state
      reset(data)
    } catch (err) {
      console.error('Failed to update profile', err)
      toastError('Update failed', 'There was a problem saving your changes. Please try again.')
    }
  }

  // Prevent rendering the form until initial data is loaded to avoid
  // flashing empty fields and disrupting the initial animation states.
  if (isLoading) {
    return (
      <PageContainer>
        <PageContent>
          <div className={styles.pageContainer}>
            <ProfileHeader />
            <div className={styles.contentLayout}>
              <div className={styles.sideColumn}>
                <CompletionCard />
              </div>
              <div className={styles.mainColumn}>
                <div>Loading form...</div>
              </div>
            </div>
          </div>
        </PageContent>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageContent>
        <div className={styles.pageContainer}>
          <ProfileHeader />

          <div className={styles.contentLayout}>
            {/* Right column on desktop, top on mobile */}
            <div className={styles.sideColumn}>
              <CompletionCard />
            </div>

            {/* Left column on desktop, bottom on mobile */}
            <div className={styles.mainColumn}>
              <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <ProfessionalSection 
                  profile={profile}
                  register={register} 
                  errors={errors} 
                  resetField={resetField} 
                />
                <EducationSection 
                  profile={profile}
                  register={register} 
                  errors={errors} 
                  resetField={resetField} 
                />
                <ExperienceSection 
                  profile={profile}
                  register={register} 
                  resetField={resetField} 
                />
                <ContactSection 
                  profile={profile}
                  register={register} 
                  errors={errors} 
                  resetField={resetField} 
                />
                <ProfessionalLinksSection 
                  profile={profile}
                  register={register} 
                  errors={errors} 
                  resetField={resetField} 
                />

                <div className={styles.actions}>
                  <SubmitButton 
                    isLoading={isPending} 
                    loadingLabel="Saving..."
                    disabled={!isDirty || isPending}
                  >
                    Save Changes
                  </SubmitButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}
