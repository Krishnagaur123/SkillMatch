import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserProfile } from '@/hooks/useUserProfile'
import AuthLoadingScreen from '@/components/feedback/AuthLoadingScreen'
import AuthErrorCard from '@/components/feedback/AuthErrorCard'
import { ROUTES } from '@/constants/routes'
import { OAUTH2_GOOGLE_URL } from '@/config/constants'

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { data: user, error, isError } = useUserProfile()

  useEffect(() => {
    if (user) {
      navigate(ROUTES.DASHBOARD, { replace: true })
    }
  }, [user, navigate])

  const handleRetry = () => {
    window.location.href = OAUTH2_GOOGLE_URL
  }

  if (isError || error) {
    return (
      <AuthErrorCard 
        title="Authentication Failed"
        message="We couldn't sign you in. The session might have expired or there was a network issue."
        onRetry={handleRetry}
      />
    )
  }

  return <AuthLoadingScreen message="Completing sign in..." />
}
