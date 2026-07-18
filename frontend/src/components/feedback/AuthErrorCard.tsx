import { AlertTriangle } from 'lucide-react'
import { Card, Button } from '@/components/common'
import styles from './AuthErrorCard.module.css'

interface AuthErrorCardProps {
  title?: string
  message: string
  onRetry: () => void
}

export default function AuthErrorCard({ 
  title = 'Authentication Error', 
  message, 
  onRetry 
}: AuthErrorCardProps) {
  return (
    <div className={styles.root}>
      <Card className={styles.card}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={32} />
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actionContainer}>
          <Button onClick={onRetry} variant="primary" size="lg" fullWidth>
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  )
}
