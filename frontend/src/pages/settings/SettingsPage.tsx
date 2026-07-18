import { useState } from 'react'
import { PageContainer, PageContent, PageHeader } from '@/components/layout'
import { Button, Divider } from '@/components/common'
import { useUserProfile, useUpdateUserProfile } from '@/hooks'
import { useTheme } from '@/app/providers/ThemeContext'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LogOut, Sun, Monitor, User, Server, Code, Layers } from 'lucide-react'
import styles from './SettingsPage.module.css'

export default function SettingsPage() {
  const { data: profile } = useUserProfile()
  const { mutateAsync: updateProfileAsync } = useUpdateUserProfile()

  const [isEditingName, setIsEditingName] = useState(false)
  const [localName, setLocalName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const { logout, isLoggingOut } = useAuth()

  const handleEditName = () => {
    if (profile) {
      setLocalName(profile.name)
      setIsEditingName(true)
    }
  }

  const handleSaveName = async () => {
    if (!localName.trim() || !profile) return
    setIsSaving(true)
    try {
      await updateProfileAsync({ name: localName.trim() })
      setIsEditingName(false)
    } catch (error) {
      console.error('Failed to update name', error)
      alert('Failed to update name. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
  }

  const { toggleTheme } = useTheme()

  return (
    <PageContainer>
      <PageContent className={styles.root}>
        <div className={styles.container}>
          <PageHeader
            title="Settings"
            description="Manage your account preferences and application settings."
          />

          <div className={styles.sections}>
            {/* Account Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Account</h2>
                <p className={styles.sectionDesc}>Personal information and account details.</p>
              </div>
              
              <div className={styles.accountGrid}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatar}>
                    <User size={32} className={styles.avatarIcon} />
                  </div>
                </div>
                <div className={styles.detailsSection}>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>Name</div>
                    <div className={styles.fieldContent}>
                      {isEditingName ? (
                        <div className={styles.editActions}>
                          <input
                            type="text"
                            value={localName}
                            onChange={(e) => setLocalName(e.target.value)}
                            className={styles.input}
                            autoFocus
                          />
                          <Button size="sm" onClick={handleSaveName} disabled={isSaving || !localName.trim()}>
                            {isSaving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setIsEditingName(false)} disabled={isSaving}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className={styles.readActions}>
                          <span className={styles.fieldValue}>{profile?.name || 'Loading...'}</span>
                          <Button variant="secondary" size="sm" onClick={handleEditName}>
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.fieldLabel}>Email</div>
                    <div className={styles.fieldContent}>
                      <span className={styles.fieldValue}>{profile?.email || 'Loading...'}</span>
                      <span className={styles.readOnlyTag}>Read-only</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* Appearance Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Appearance</h2>
                <p className={styles.sectionDesc}>Customize how SkillMatch looks on your device.</p>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingTitle}>Theme</div>
                  <div className={styles.settingDesc}>Toggle between light and dark mode.</div>
                </div>
                <div className={styles.settingAction}>
                  <Button variant="secondary" onClick={toggleTheme}>
                    <Sun size={16} style={{ marginRight: '8px' }} />
                    Toggle Theme
                  </Button>
                </div>
              </div>
            </section>

            <Divider />

            {/* Session Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Session</h2>
                <p className={styles.sectionDesc}>Manage your active session.</p>
              </div>
              <div className={styles.settingRow}>
                <div className={styles.settingInfo}>
                  <div className={styles.settingTitle}>Sign out</div>
                  <div className={styles.settingDesc}>Sign out of your SkillMatch account on this device.</div>
                </div>
                <div className={styles.settingAction}>
                  <Button variant="secondary" onClick={handleLogout} disabled={isLoggingOut}>
                    <LogOut size={16} style={{ marginRight: '8px' }} />
                    {isLoggingOut ? 'Logging out...' : 'Sign Out'}
                  </Button>
                </div>
              </div>
            </section>

            <Divider />

            {/* About Section */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.sectionDesc}>Application and environment details.</p>
              </div>
              <div className={styles.aboutGrid}>
                <div className={styles.aboutItem}>
                  <Layers size={16} className={styles.aboutIcon} />
                  <span className={styles.aboutLabel}>Version</span>
                  <span className={styles.aboutValue}>v1.0.0</span>
                </div>
                <div className={styles.aboutItem}>
                  <Monitor size={16} className={styles.aboutIcon} />
                  <span className={styles.aboutLabel}>Frontend</span>
                  <span className={styles.aboutValue}>React + Vite</span>
                </div>
                <div className={styles.aboutItem}>
                  <Server size={16} className={styles.aboutIcon} />
                  <span className={styles.aboutLabel}>Backend</span>
                  <span className={styles.aboutValue}>Spring Boot</span>
                </div>
                <div className={styles.aboutItem}>
                  <Code size={16} className={styles.aboutIcon} />
                  <span className={styles.aboutLabel}>API</span>
                  <span className={styles.aboutValue}>v1</span>
                </div>
                <div className={styles.aboutItem}>
                  <Layers size={16} className={styles.aboutIcon} />
                  <span className={styles.aboutLabel}>Environment</span>
                  <span className={styles.aboutValue}>Production</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </PageContent>
    </PageContainer>
  )
}
