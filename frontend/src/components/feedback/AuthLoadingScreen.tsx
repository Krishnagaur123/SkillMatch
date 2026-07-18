import AppBrand from '@/components/navigation/AppBrand'
import { InlineLoader } from '@/components/feedback/Loader'
import styles from './AuthLoadingScreen.module.css'

interface AuthLoadingScreenProps {
  message?: string
}

export default function AuthLoadingScreen({ message = 'Signing you in...' }: AuthLoadingScreenProps) {
  return (
    <div className={styles.root}>
      <div className={styles.logoContainer}>
        <AppBrand />
      </div>
      <div className={styles.spinnerContainer}>
        <InlineLoader />
      </div>
      <p className={styles.text}>{message}</p>
    </div>
  )
}
