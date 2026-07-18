import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import AppBrand from '@/components/navigation/AppBrand'
import { Button } from '@/components/common'
import { OAUTH2_GOOGLE_URL } from '@/config/constants'
import { InlineLoader } from '@/components/feedback/Loader'
import { useUserProfile } from '@/hooks'
import { Lock } from 'lucide-react'
import styles from './AuthPage.module.css'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function AuthPage() {
  const { data: user, isLoading } = useUserProfile()
  const [searchParams] = useSearchParams()
  const [isRedirecting, setIsRedirecting] = useState(false)

  const isSignUp = searchParams.get('mode') === 'signup'

  if (isLoading) {
    return (
      <div className={styles.root} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <InlineLoader />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGoogleLogin = () => {
    setIsRedirecting(true)
    window.location.href = OAUTH2_GOOGLE_URL
  }

  return (
    <div className={styles.root}>
      {/* Subtle ambient background effect */}
      <div className={styles.ambientGrid} aria-hidden="true" />
      <div className={styles.ambientGlow} aria-hidden="true" />
      <div className={styles.ambientGlowSecondary} aria-hidden="true" />
      
      <div className={`${styles.authContainer} ${styles.fadeEnter}`}>
        
        <div className={styles.authCard}>
          <div className={styles.header}>
            <div className={styles.logoWrapper}>
              <div className={styles.logoGlow} aria-hidden="true" />
              <AppBrand />
            </div>
            <h1 className={styles.title}>
              {isSignUp ? 'Welcome to SkillMatch' : 'Welcome back'}
            </h1>
            <p className={styles.subtitle}>
              {isSignUp 
                ? 'Create your Career Intelligence profile and discover your best opportunities.'
                : 'Sign in to your Career Intelligence Dashboard.'}
            </p>
          </div>

          <Button 
            variant="secondary" 
            fullWidth 
            size="lg"
            className={styles.googleBtn}
            onClick={handleGoogleLogin}
            disabled={isRedirecting}
          >
            {isRedirecting ? <InlineLoader /> : <GoogleIcon />}
            {isRedirecting ? 'Redirecting...' : 'Continue with Google'}
          </Button>
        </div>

        <div className={styles.footer}>
          <Lock size={12} className={styles.lockIcon} />
          <p className={styles.footerText}>
            Secure authentication powered by Google
          </p>
        </div>
        
      </div>
    </div>
  )
}
